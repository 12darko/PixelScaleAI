import { createClient } from '@supabase/supabase-js';
import { UserStats, MAX_FREE_CREDITS } from '../types';

// Using VormPixyze Shared Credentials for Unified Login
// NOTE: Ideally these should be in .env.local, but for the 'copy-paste' migration phase
// we will read them from environment variables if present, or you can hardcode them temporarily for testing.
// In a real scenario, we'd ensure VITE_SUPABASE_URL is set in PixelScaleAI's .env.local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase credentials missing! Check .env.local");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Kullanıcının profil bilgilerini (kredi, premium durumu) çeker.
 * Eğer günü geçmişse kredileri sıfırlar.
 */
export const getUserProfile = async (userId: string): Promise<UserStats | null> => {
    console.log('[getUserProfile] START, userId:', userId);
    try {
        // Wait for auth token to propagate
        await new Promise(resolve => setTimeout(resolve, 200));

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            // If profile not found (PGRST116), create a default one
            if (error.code === 'PGRST116') {
                console.log('Profile not found, creating default...');
                const today = new Date().toISOString().split('T')[0];
                const { data: { user } } = await supabase.auth.getUser();

                const newProfile = {
                    id: userId,
                    email: user?.email || '',
                    credits: MAX_FREE_CREDITS,
                    is_premium: false,
                    daily_limit: MAX_FREE_CREDITS,
                    last_reset_date: today
                };

                const { error: insertError } = await supabase.from('profiles').insert([newProfile]);
                if (insertError) {
                    console.error('Failed to create default profile:', insertError);
                    return null;
                }

                return {
                    credits: MAX_FREE_CREDITS,
                    isPremium: false,
                    lastResetDate: today,
                    premiumExpiryDate: undefined,
                    dailyLimit: MAX_FREE_CREDITS,
                    premiumTier: undefined
                };
            }
            throw error;
        }

        if (profile) {
            // Daily Reset Logic
            const today = new Date().toISOString().split('T')[0];
            const dbLastResetDate = (profile.last_reset_date || '').toString().split('T')[0];

            // Check Premium Expiry
            if (profile.is_premium && profile.premium_expiry_date && profile.premium_expiry_date.toString().split('T')[0] < today) {
                await supabase.from('profiles').update({ is_premium: false, daily_limit: MAX_FREE_CREDITS }).eq('id', userId);
                profile.is_premium = false;
                profile.daily_limit = MAX_FREE_CREDITS;
            }

            if (dbLastResetDate !== today) {
                const limit = profile.daily_limit || MAX_FREE_CREDITS;
                await resetDailyCredits(userId, limit);
                return {
                    credits: limit,
                    isPremium: profile.is_premium,
                    lastResetDate: today,
                    premiumExpiryDate: profile.premium_expiry_date,
                    dailyLimit: limit,
                    premiumTier: profile.premium_tier
                };
            }

            return {
                credits: profile.credits,
                isPremium: profile.is_premium,
                lastResetDate: profile.last_reset_date,
                premiumExpiryDate: profile.premium_expiry_date,
                dailyLimit: profile.daily_limit,
                premiumTier: profile.premium_tier
            };
        }
        return null;
    } catch (err) {
        console.error('Error fetching profile:', err);
        return null;
    }
};

export const updateUserCredits = async (userId: string, newAmount: number) => {
    const { error } = await supabase.from('profiles').update({ credits: newAmount }).eq('id', userId);
    if (error) console.error('Error updating credits:', error);
};

export const processReferral = async (newUserId: string, referrerId: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('process_referral', { new_user_id: newUserId, referrer_id: referrerId });
    if (error) { console.error('Referral processing failed:', error); return false; }
    return data === true;
};

export const resetDailyCredits = async (userId: string, limit: number = MAX_FREE_CREDITS) => {
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('profiles').update({ credits: limit, last_reset_date: today }).eq('id', userId);
};

export const upgradeToPremium = async (userId: string) => {
    const { error } = await supabase.from('profiles').update({ is_premium: true }).eq('id', userId);
    if (error) console.error('Error upgrading to premium:', error);
};

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
    });
    if (error) throw error;
    return data;
};

export const signOut = async () => {
    await supabase.auth.signOut();
};

