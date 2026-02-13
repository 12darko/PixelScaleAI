# PixelScaleAI Production Guide (Client-Side AI Edition)

## 🚀 Genel Bakış
Bu versiyon **Client-Side AI** teknolojisi kullanır. Yani arka plan sunucusu (Python/Backend) **GEREKTİRMEZ**.
Hostinger gibi sadece statik dosya (HTML/JS) sunan hostinglerde sorunsuz çalışır.

---

## 🛠️ Kurulum

### 1. Build Alın
```bash
npm install
npm run build
```
Bu komut `dist/` klasörü oluşturur.

### 2. Hostinger'a Yükleme (Public_html)
Hostinger panelinize gidin:
1. **Dosya Yöneticisi**'ni açın.
2. `public_html` klasörüne girin.
3. `dist` klasörünün **İÇİNDEKİ** tüm dosyaları `public_html` içine sürükleyip bırakın.
   - `index.html` en dışta olmalı.
   - `assets/` klasörü ve diğerleri yanında olmalı.

---

## ⚙️ Yapılandırma

`.env` dosyasını production için düzenleyin ve build almadan önce kaydedin:

```env
# Supabase (Auth & Database)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Lemon Squeezy (Ödeme)
VITE_LEMONSQUEEZY_STORE_ID=12345
VITE_LEMONSQUEEZY_STARTER_VARIANT_ID=...
VITE_LEMONSQUEEZY_PRO_VARIANT_ID=...
VITE_LEMONSQUEEZY_BUSINESS_VARIANT_ID=...

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXX
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXX
```

---

## ⚠️ Dikkat
- İlk açılışta AI modelleri (yaklaşık 10-20MB) kullanıcının tarayıcısına indirilir ve önbelleğe alınır. İlk işlem yavaş olabilir.
- Mobil cihazlarda "Yüksek Kalite" (High Quality) modu bellek hatası verebilir, bu yüzden otomatik olarak daha küçük parça boyutu (patchSize) kullanılır.

---
**Sunucu Maliyeti: 0 TL** 🚀

