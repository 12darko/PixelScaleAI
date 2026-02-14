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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <div key={index} className="relative group">
                        {/* Card Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Glass Card */}
                        <div className="relative bg-white/5 border border-white/10 p-8 rounded-2xl h-full backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 flex flex-col items-center text-center">

                            {/* Step Number Badge */}
                            <div className="absolute -top-4 -left-4 w-10 h-10 bg-black/80 border border-purple-500/30 rounded-full flex items-center justify-center font-bold text-gray-400 text-sm shadow-xl group-hover:text-white group-hover:border-purple-500 transition-all">
                                {index + 1}
                            </div>

                            {/* Icon Container */}
                            <div className="mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 border border-white/5">
                                <div className="absolute inset-0 bg-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
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
