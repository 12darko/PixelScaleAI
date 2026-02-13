/// <reference types="vite/client" />

// Lemon Squeezy Payment Service
// Documentation: https://docs.lemonsqueezy.com/

const STORE_ID = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID || 'your_store_id';

// Variant IDs for each plan (get these from Lemon Squeezy dashboard)
export const PLAN_VARIANTS = {
    starter: import.meta.env.VITE_LEMONSQUEEZY_STARTER_VARIANT_ID || 'starter_variant',
    pro: import.meta.env.VITE_LEMONSQUEEZY_PRO_VARIANT_ID || 'pro_variant',
    business: import.meta.env.VITE_LEMONSQUEEZY_BUSINESS_VARIANT_ID || 'business_variant'
};

export interface CheckoutOptions {
    variantId: string;
    userId: string;
    email: string;
    successUrl?: string;
    cancelUrl?: string;
}

/**
 * Opens Lemon Squeezy checkout in a new window
 */
export function openCheckout(options: CheckoutOptions): void {
    const { variantId, userId, email, successUrl, cancelUrl } = options;

    // Build checkout URL
    const baseUrl = `https://${STORE_ID}.lemonsqueezy.com/checkout/buy/${variantId}`;

    const params = new URLSearchParams();

    // Custom data to identify user (passed to webhook)
    params.set('checkout[custom][user_id]', userId);

    // Pre-fill email
    params.set('checkout[email]', email);

    // Redirect URLs
    if (successUrl) {
        params.set('checkout[success_url]', successUrl);
    } else {
        params.set('checkout[success_url]', `${window.location.origin}?payment=success`);
    }

    if (cancelUrl) {
        params.set('checkout[cancel_url]', cancelUrl);
    }

    // Open checkout in new window
    const checkoutUrl = `${baseUrl}?${params.toString()}`;
    window.open(checkoutUrl, '_blank');
}

/**
 * Opens checkout for a specific plan
 */
export function purchasePlan(
    planId: 'starter' | 'pro' | 'business',
    userId: string,
    email: string
): void {
    const variantId = PLAN_VARIANTS[planId];

    if (!variantId) {
        console.error(`Invalid plan ID: ${planId}`);
        alert('Geçersiz plan. Lütfen tekrar deneyin.');
        return;
    }

    openCheckout({
        variantId,
        userId,
        email
    });
}

/**
 * Check if payment was successful (from URL params)
 */
export function checkPaymentSuccess(): boolean {
    const params = new URLSearchParams(window.location.search);
    return params.get('payment') === 'success';
}

/**
 * Clear payment success param from URL
 */
export function clearPaymentParam(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('payment');
    window.history.replaceState({}, '', url.toString());
}
