import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    onBack: () => void;
}

const TermsOfService: React.FC<Props> = ({ onBack }) => {
    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4 animate-fade-in text-gray-300">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Geri Dön
            </button>

            <h1 className="text-3xl font-bold text-white mb-8">Kullanım Şartları</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">1. Hizmetin Tanımı ve Kabulü</h2>
                    <p>
                        PixelScaleAI AI ("Hizmet"), yapay zeka teknolojileri kullanarak görsellerin çözünürlüğünü ve kalitesini artıran bir web uygulamasıdır.
                        Bu siteyi kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">2. Kullanım Kuralları</h2>
                    <p>Aşağıdaki eylemler kesinlikle yasaktır:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Yasa dışı, pornografik, şiddet içeren veya nefret söylemi barındıran görsellerin işlenmesi.</li>
                        <li>Sisteme zarar verecek bot, script veya otomatik araçların kullanılması.</li>
                        <li>Telif hakkı size ait olmayan veya izniniz olmayan materyallerin yüklenmesi.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">3. Telif Hakları ve Mülkiyet</h2>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Girdiler:</strong> Yüklediğiniz görsellerin mülkiyeti tamamen size aittir.</li>
                        <li><strong>Çıktılar:</strong> PixelScaleAI AI tarafından üretilen işlenmiş görsellerin ticari kullanım hakları dahil tüm hakları kullanıcıya (size) aittir. Biz bu görseller üzerinde hak iddia etmeyiz.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">4. Krediler ve İadeler</h2>
                    <p>
                        PixelScaleAI AI, kredi bazlı bir sistemle çalışır.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Misafir Kredileri:</strong> Tanıtım amaçlıdır ve tarayıcı verileri temizlendiğinde kaybolabilir.</li>
                        <li><strong>Satın Alımlar:</strong> Dijital hizmet niteliği taşıdığından, satın alınan krediler ve abonelikler kural olarak iade edilemez. Ancak teknik bir hata durumunda destek ekibimiz yardımcı olacaktır.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">5. Sorumluluk Reddi (Disclaimer)</h2>
                    <p>
                        Hizmet "olduğu gibi" sunulur. Yapay zeka teknolojisinin doğası gereği, sonuçların her zaman %100 mükemmel veya hatasız olacağını garanti edemeyiz.
                        Oluşabilecek veri kayıpları veya hizmet kesintilerinden sorumlu değiliz, ancak en iyi deneyimi sunmak için çaba gösteriyoruz.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-3">6. Değişiklikler</h2>
                    <p>Bu şartları zaman zaman güncelleme hakkımız saklıdır. Önemli değişikliklerde kullanıcılarımıza bildirim yapılır.</p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;

