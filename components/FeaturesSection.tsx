import React from 'react';
import { ShoppingBag, Image as ImageIcon, Printer, Zap } from 'lucide-react';
import ComparisonView from './ComparisonView';

const features = [
    {
        icon: <ShoppingBag className="w-6 h-6 text-purple-400" />,
        title: "E-Ticaret İçin Mükemmel",
        description: "Ürün fotoğraflarınızın kalitesini artırarak satışlarınızı katlayın. Bulanık görseller müşteri güvenini zedeler, PixelScaleAI ile profesyonel bir vitrin oluşturun."
    },
    {
        icon: <ImageIcon className="w-6 h-6 text-blue-400" />,
        title: "Eski Fotoğrafları Yenileme",
        description: "Yıllar önce çekilmiş düşük çözünürlüklü veya bulanık aile fotoğraflarınızı modern standartlara taşıyın. Anılarınızı en net haliyle saklayın."
    },
    {
        icon: <Printer className="w-6 h-6 text-pink-400" />,
        title: "Baskı ve Matbaa Kalitesi",
        description: "Küçük görselleri dev posterlere dönüştürün. 300 DPI baskı kalitesi için görselinizi bozulmadan 4x veya 8x büyütün."
    },
    {
        icon: <Zap className="w-6 h-6 text-yellow-400" />,
        title: "Hız ve Verimlilik",
        description: "Tasarımcılar ve içerik üreticileri için zaman kazandırır. Photoshop ile saatlerce uğraşmak yerine saniyeler içinde sonucu alın."
    }
];

const FeaturesSection: React.FC = () => {
    return (
        <section className="w-full max-w-7xl mx-auto py-24 px-4 border-t border-gray-800/50 relative overflow-hidden" aria-labelledby="features-title">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">

                {/* Left Content */}
                <div className="flex-1 text-left space-y-8">
                    <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
                            Neden Biz?
                        </div>
                        <h2 id="features-title" className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Görsellerinizi <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Geleceğe Taşıyın</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                            PixelScaleAI sadece pikselleri çoğaltmaz; onları yeniden hayal eder. Bulanık anıları netleştirir, satışları artırır ve baskı kalitesini mükemmelleştirir.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4 group">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gray-800/50 border border-white/5 flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors">{feature.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Visual (Interactive Comparison) */}
                <div className="flex-1 w-full relative">
                    {/* Visual Container with Glass/Glow */}
                    <div className="relative rounded-3xl p-2 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm border border-white/5 shadow-2xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                        <div className="relative rounded-2xl overflow-hidden bg-black/50">
                            <ComparisonView
                                originalUrl="https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=400&auto=format&fit=crop&blur=8"
                                processedUrl="https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=800&auto=format&fit=crop"
                                minimal={true}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;
