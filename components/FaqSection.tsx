import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

{
    question: "PixelScaleAI ücretsiz mi?",
        answer: "PixelScaleAI, yeni kullanıcılara günlük ücretsiz kredi tanımlar. Daha yüksek çözünürlük (4K/8K), toplu işlem ve hız için uygun fiyatlı premium paketler sunuyoruz.",
            slug: "ucretsiz-mi"
},
{
    question: "Fotoğraflarım sunucuda saklanıyor mu?",
        answer: "Gizliliğiniz önceliğimizdir. Yüklediğiniz fotoğraflar işlem bittikten sonra kısa süre içinde otomatik olarak sunucularımızdan silinir (Premium geçmiş özelliği hariç).",
            slug: "gizlilik-ve-guvenlik"
},
{
    question: "Hangi dosya formatlarını destekliyorsunuz?",
        answer: "JPG, PNG, WEBP ve HEIC formatlarını destekliyoruz. Çıktı olarak PNG formatında en yüksek kalitede sonuç alırsınız.",
            slug: "dosya-formatlari"
},
{
    question: "API desteğiniz var mı?",
        answer: "Evet, Business paket kullanıcıları için REST API desteğimiz mevcuttur. Kendi uygulamalarınıza PixelScaleAI gücünü entegre edebilirsiniz.",
            slug: "api-destegi"
},
{
    question: "Mobil cihazlarda kullanabilir miyim?",
        answer: "Kesinlikle! PixelScaleAI tüm modern mobil tarayıcılarla tam uyumludur. Uygulama indirmeden dilediğiniz yerden kullanabilirsiniz.",
            slug: "mobil-uyumluluk"
}
];

export const getFaqData = () => FAQ_DATA;

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // Handle Deep Linking (Hash Navigation)
    React.useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const index = FAQ_DATA.findIndex(item => item.slug === hash);
                if (index !== -1) {
                    setOpenIndex(index);
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        };

        // Check on mount
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const toggleAccordion = (index: number, slug: string) => {
        const newState = index === openIndex ? null : index;
        setOpenIndex(newState);

        // Update URL without scrolling
        if (newState !== null) {
            window.history.replaceState(null, '', `#${slug}`);
        } else {
            window.history.replaceState(null, '', ' ');
        }
    };

    return (
        <section className="w-full max-w-4xl mx-auto py-16 px-4" aria-labelledby="faq-title">
            <h2 id="faq-title" className="text-3xl font-bold text-center mb-2 text-white">Sıkça Sorulan Sorular</h2>
            <p className="text-center text-gray-400 mb-10">Aklınıza takılan soruların yanıtları burada.</p>

            <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
                {FAQ_DATA.map((item, index) => (
                    <div
                        key={index}
                        id={item.slug}
                        className={`bg-gray-800/50 border rounded-lg overflow-hidden transition-all duration-300 ${index === openIndex ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'border-gray-700 hover:border-purple-500/30'}`}
                        itemScope
                        itemProp="mainEntity"
                        itemType="https://schema.org/Question"
                    >
                        <button
                            onClick={() => toggleAccordion(index, item.slug)}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                            aria-expanded={index === openIndex}
                        >
                            <span className="font-medium text-lg text-gray-200" itemProp="name">{item.question}</span>
                            {index === openIndex ? (
                                <ChevronUp className="w-5 h-5 text-purple-500" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        <div
                            className={`px-5 text-gray-400 overflow-hidden transition-all duration-300 ease-in-out ${index === openIndex ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                            itemScope
                            itemProp="acceptedAnswer"
                            itemType="https://schema.org/Answer"
                        >
                            <p itemProp="text">{item.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FaqSection;
