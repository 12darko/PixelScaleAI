import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
    {
        question: "PixelScaleAI ücretsiz mi?",
        answer: "PixelScaleAI, yeni kullanıcılara günlük ücretsiz kredi tanımlar. Daha yüksek çözünürlük (4K/8K), toplu işlem ve hız için uygun fiyatlı premium paketler sunuyoruz."
    },
    {
        question: "Fotoğraflarım sunucuda saklanıyor mu?",
        answer: "Gizliliğiniz önceliğimizdir. Yüklediğiniz fotoğraflar işlem bittikten sonra kısa süre içinde otomatik olarak sunucularımızdan silinir (Premium geçmiş özelliği hariç)."
    },
    {
        question: "Hangi dosya formatlarını destekliyorsunuz?",
        answer: "JPG, PNG, WEBP ve HEIC formatlarını destekliyoruz. Çıktı olarak PNG formatında en yüksek kalitede sonuç alırsınız."
    },
    {
        question: "API desteğiniz var mı?",
        answer: "Evet, Business paket kullanıcıları için REST API desteğimiz mevcuttur. Kendi uygulamalarınıza PixelScaleAI gücünü entegre edebilirsiniz."
    },
    {
        question: "Mobil cihazlarda kullanabilir miyim?",
        answer: "Kesinlikle! PixelScaleAI tüm modern mobil tarayıcılarla tam uyumludur. Uygulama indirmeden dilediğiniz yerden kullanabilirsiniz."
    }
];

export const getFaqData = () => FAQ_DATA;

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="w-full max-w-4xl mx-auto py-16 px-4" aria-labelledby="faq-title">
            <h2 id="faq-title" className="text-3xl font-bold text-center mb-2 text-white">Sıkça Sorulan Sorular</h2>
            <p className="text-center text-gray-400 mb-10">Aklınıza takılan soruların yanıtları burada.</p>

            <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
                {FAQ_DATA.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/50"
                        itemScope
                        itemProp="mainEntity"
                        itemType="https://schema.org/Question"
                    >
                        <button
                            onClick={() => setOpenIndex(index === openIndex ? null : index)}
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
