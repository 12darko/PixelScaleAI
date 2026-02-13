// History Service for PixelScaleAI
// Stores upscale history in Supabase (Premium feature)

import { supabase } from './supabase';

export interface UpscaleRecord {
    id?: number;
    user_id: string;
    file_name: string;
    original_size: number;
    upscaled_size: number;
    scale_factor: number;
    processing_time_ms: number;
    created_at?: string;
}

/**
 * Save upscale record to history
 */
export async function saveToHistory(record: Omit<UpscaleRecord, 'id' | 'created_at'>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('upscale_history')
            .insert([{
                user_id: record.user_id,
                original_filename: record.file_name,
                output_filename: `${record.file_name}_${record.scale_factor}x`,
                scale_factor: record.scale_factor,
                processing_time_ms: record.processing_time_ms,
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.error('History save error:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('History save exception:', err);
        return false;
    }
}

/**
 * Get user's upscale history
 */
export async function getHistory(userId: string): Promise<UpscaleRecord[]> {
    try {
        const { data, error } = await supabase
            .from('upscale_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('History fetch error:', error);
            return [];
        }

        return (data || []).map(item => ({
            id: item.id,
            user_id: item.user_id,
            file_name: item.original_filename,
            original_size: 0, // Not stored in DB
            upscaled_size: 0, // Not stored in DB
            scale_factor: item.scale_factor,
            processing_time_ms: item.processing_time_ms,
            created_at: item.created_at
        }));
    } catch (err) {
        console.error('History fetch exception:', err);
        return [];
    }
}

/**
 * Clear user's history
 */
export async function clearHistory(userId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('upscale_history')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('History clear error:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('History clear exception:', err);
        return false;
    }
}

