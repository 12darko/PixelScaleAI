import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<Props> = ({ onBack }) => {
    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4 animate-fade-in text-gray-300">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Geri Dön
            </button>

            <h1 className="text-3xl font-bold text-white mb-8">Gizlilik Politikası</h1>

            <div className="space-y-8">
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg text-sm text-purple-200">
                    <strong>Özet:</strong> Görselleriniz işlendikten hemen sonra (maksimum 1 saat içinde) sunucularımızdan otomatik olarak silinir. Verilerinizi asla reklam amaçlı satmayız.
                </div>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">1. Toplanan Veriler ve Kullanım Amacı</h2>
                    <p>Web sitemizi ziyaret ettiğinizde ve hizmetlerimizi kullandığınızda aşağıdaki bilgileri toplayabiliriz:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Yüklenen Görseller:</strong> Sadece iyileştirme işlemi (upscaling) amacıyla geçici olarak işlenir.</li>
                        <li><strong>Kullanım Verileri:</strong> IP adresi, tarayıcı türü ve ziyaret süresi gibi anonim istatistiksel veriler (Google Analytics aracılığıyla).</li>
                        <li><strong>Hesap Bilgileri:</strong> Kayıt olmanız durumunda e-posta adresiniz ve profil bilgileriniz (Supabase altyapısında güvenle saklanır).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">2. Görsel Güvenliği ve Saklama Politikası</h2>
                    <p>
                        Kullanıcı gizliliği en büyük önceliğimizdir. Yüklediğiniz dosyalar:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Şifrelenmiş bağlantılar (SSL/TLS) üzerinden sunucularımıza iletilir.</li>
                        <li>AI motoru tarafından işlendikten sonra sonuç size sunulur.</li>
                        <li><strong>Geçici Depolama:</strong> İşlem tamamlandıktan veya başarısız olduktan sonra orijinal ve işlenmiş görseller sunucularımızdan otomatik olarak silinir.</li>
                        <li>Görselleriniz asla 3. taraflarla paylaşılmaz veya AI modellerini eğitmek için kullanılmaz.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">3. Çerezler (Cookies)</h2>
                    <p>
                        Hizmetin sürekliliği için zorunlu çerezler ve analitik çerezler kullanırız:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Oturum Çerezleri:</strong> Giriş yaptığınızda sizi hatırlamak ve güvenlik için.</li>
                        <li><strong>Tercih Çerezleri:</strong> Dil veya tema seçimlerinizi hatırlamak için.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">4. Üçüncü Taraf Hizmetler</h2>
                    <p>
                        Altyapımızı sağlamak için güvenilir global servis sağlayıcılarla çalışıyoruz:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Supabase:</strong> Kimlik doğrulama ve veritabanı yönetimi için.</li>
                        <li><strong>Vercel / Railway:</strong> Web sitesi barındırma ve sunucu altyapısı için.</li>
                        <li><strong>Google Analytics:</strong> Site trafiğini analiz etmek için.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">5. İletişim</h2>
                    <p>Bu politika veya verilerinizle ilgili her türlü soru için bizimle iletişime geçebilirsiniz:<br />
                        <a href="mailto:support@PixelScaleAI.com" className="text-purple-400 hover:text-purple-300">support@PixelScaleAI.com</a></p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

