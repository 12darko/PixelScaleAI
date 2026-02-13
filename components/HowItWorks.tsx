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
        title: "2. Derin Öğrenme (AI)",
        description: "Real-ESRGAN ve GAN (Generative Adversarial Networks) mimarisi kullanılarak, eksik pikseller akıllıca tahmin edilir. Bu süreçte sadece boyut değil, doku ve detaylar da zenginleştirilir."
    },
    {
        icon: <Sparkles className="w-8 h-8 text-pink-400" />,
        title: "3. Netleştirme ve İyileştirme",
        description: "Yeniden oluşturulan görsel üzerinde son bir keskinleştirme işlemi uygulanır. Renk dengesi optimize edilir ve yüz hatları gibi kritik detaylar belirginleştirilir."
    },
    {
        icon: <Download className="w-8 h-8 text-green-400" />,
        title: "4. Yüksek Kalite Çıktı",
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
                    <div key={index} className="bg-gray-800/30 border border-gray-700 p-6 rounded-2xl hover:bg-gray-800/50 transition-colors relative group">
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center font-bold text-gray-500 group-hover:text-white group-hover:border-purple-500 transition-all">
                            {index + 1}
                        </div>
                        <div className="mb-4 bg-gray-900/50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3 text-center">{step.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed text-center">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
