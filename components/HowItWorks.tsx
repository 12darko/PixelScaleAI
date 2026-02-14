import React from 'react';
import { Scan, Sparkles, Download, Layers } from 'lucide-react';

const steps = [
    {
        icon: <Scan className="w-8 h-8 text-purple-400" />,
        title: "1. Akıllı Analiz",
        description: "Yapay zeka motorumuz, yüklediğiniz fotoğrafı piksel piksel tarar. Gürültü (noise), bulanıklık ve düşük çözünürlüklü alanları tespit ederek bir iyileştirme haritası çıkarır."
    },
    {
        icon: <Layers className="w-8 h-8 text-blue-400" />,
        title: "2. Nöral Ağ İşleme (AI)",
        description: "Gelişmiş Generative AI modelleri kullanılarak, eksik pikseller akıllıca tahmin edilir. Bu süreçte sadece boyut değil, doku ve detaylar da sıfırdan hayal edilerek zenginleştirilir."
    },
    {
        icon: <Sparkles className="w-8 h-8 text-pink-400" />,
        title: "3. Netleştirme ve İyileştirme",
        description: "Yeniden oluşturulan görsel üzerinde son bir keskinleştirme işlemi uygulanır. Renk dengesi optimize edilir ve yüz hatları gibi kritik detaylar belirginleştirilir."
    },
    {
        icon: <Download className="w-8 h-8 text-green-400" />,
        title: "4. Kristal Netliğinde Çıktı",
        description: "İşlem tamamlandığında 4K veya 8K çözünürlüğünde, baskıya uygun ve kristal netliğinde sonucunuz hazır olur. İster indirin, ister sosyal medyada paylaşın."
    }
];

const HowItWorks: React.FC = () => {
    return (
        <section className="w-full max-w-6xl mx-auto py-20 px-4" aria-labelledby="how-it-works-title">
            <div className="text-center mb-16">
                <h2 id="how-it-works-title" className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Teknoloji Nasıl Çalışır?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    PixelScaleAI, sıradan bir yeniden boyutlandırma aracı değildir. Milyonlarca yüksek kaliteli fotoğraf ile eğitilmiş yapay zeka modelleri kullanır.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="relative group animate-fade-in-up"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        {/* Card Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        {/* Glass Card */}
                        <div className="relative bg-[#0f0e1a]/60 border border-white/5 p-8 rounded-3xl h-full backdrop-blur-md hover:bg-[#1a1825]/80 hover:border-purple-500/30 transition-all duration-500 flex flex-col items-start text-left hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">

                            {/* Step Number Badge */}
                            <div className="absolute top-6 right-6 text-5xl font-black text-white/5 group-hover:text-purple-500/20 transition-colors select-none font-serif">
                                0{index + 1}
                            </div>

                            {/* Icon Container */}
                            <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 border border-white/10 group-hover:border-purple-500/50">
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">{step.title.split('. ')[1]}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-light opacity-80 group-hover:opacity-100 transition-opacity">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
