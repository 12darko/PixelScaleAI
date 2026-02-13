# Lemon Squeezy Ödeme Entegrasyonu

Bu doküman, PixelScaleAI için Lemon Squeezy ödeme entegrasyonunu açıklar.

## 1. Lemon Squeezy Hesap Kurulumu

1. [lemonsqueezy.com](https://www.lemonsqueezy.com/) adresine gidin
2. Store oluşturun: "PixelScaleAI"
3. Products oluşturun (Subscriptions):
   - **Starter** - $2.99/ay
   - **Pro** - $5.99/ay  
   - **Business** - $14.99/ay

## 2. Environment Variables

`.env` dosyasına ekleyin:

```env
VITE_LEMONSQUEEZY_STORE_ID=your_store_id
VITE_LEMONSQUEEZY_STARTER_VARIANT_ID=variant_123
VITE_LEMONSQUEEZY_PRO_VARIANT_ID=variant_456
VITE_LEMONSQUEEZY_BUSINESS_VARIANT_ID=variant_789
```

## 3. Webhook Kurulumu

Lemon Squeezy Dashboard → Settings → Webhooks

- **URL:** `https://your-domain.com/api/webhooks/lemonsqueezy`
- **Events:** 
  - `subscription_created`
  - `subscription_updated`
  - `subscription_cancelled`
  - `subscription_payment_success`

## 4. Supabase Edge Function

`supabase/functions/lemonsqueezy-webhook/index.ts` oluşturun:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const signature = req.headers.get('x-signature')
  const body = await req.json()

  // TODO: Verify signature with LEMONSQUEEZY_WEBHOOK_SECRET

  const { meta, data } = body
  const eventName = meta.event_name
  const userId = data.attributes.custom_data?.user_id

  if (!userId) {
    return new Response('No user_id', { status: 400 })
  }

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_updated':
      const variantId = data.attributes.variant_id
      let tier = 'starter'
      if (variantId === 'PRO_VARIANT_ID') tier = 'pro'
      if (variantId === 'BUSINESS_VARIANT_ID') tier = 'business'

      await supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_tier: tier,
          premium_expiry_date: data.attributes.renews_at
        })
        .eq('id', userId)
      break

    case 'subscription_cancelled':
      await supabase
        .from('profiles')
        .update({ is_premium: false, premium_tier: null })
        .eq('id', userId)
      break
  }

  return new Response('OK', { status: 200 })
})
```

## 5. Frontend Checkout

`services/lemonsqueezy.ts`:

```typescript
export function openCheckout(variantId: string, userId: string, email: string) {
  const checkoutUrl = `https://PixelScaleAI.lemonsqueezy.com/checkout/buy/${variantId}`;
  const params = new URLSearchParams({
    'checkout[custom][user_id]': userId,
    'checkout[email]': email,
    'checkout[success_url]': `${window.location.origin}?payment=success`,
  });
  
  window.open(`${checkoutUrl}?${params}`, '_blank');
}
```

## 6. Test Etme

1. Test mode'da ürün oluşturun
2. Test kartı: `4242 4242 4242 4242`
3. Webhook'ların çalıştığını kontrol edin
4. Production'a geçmeden önce live keys kullanın

---

**Notlar:**
- Lemon Squeezy, Stripe alternatifi olarak EU-based
- MoR (Merchant of Record) olarak vergi işlemlerini halleder
- Türkiye dahil 100+ ülkede çalışır

