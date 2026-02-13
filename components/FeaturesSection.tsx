import React from 'react';
import { ShoppingBag, Image as ImageIcon, Printer, Zap } from 'lucide-react';

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
        <section className="w-full max-w-6xl mx-auto py-20 px-4 border-t border-gray-800/50" aria-labelledby="features-title">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                {/* Left Content */}
                <div className="flex-1 text-left">
                    <h2 id="features-title" className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                        Neden <span className="text-purple-500">PixelScaleAI</span> Tercih Etmelisiniz?
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Sadece bir büyültme aracı değil; iş akışınızı hızlandıran, anılarınızı canlandıran ve satışlarınızı artıran bir çözüm ortağı.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Visual (Interactive/Static) */}
                <div className="flex-1 w-full relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-2 overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=800&auto=format&fit=crop"
                            alt="High Quality Example"
                            className="rounded-xl w-full h-auto object-cover"
                            loading="lazy"
                        />
                        <div className="absolute bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur border border-white/10 p-4 rounded-xl">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Önce: <span className="text-red-400">480p</span></span>
                                <span className="text-gray-400">Sonra: <span className="text-green-400 font-bold">4K Ultra HD</span></span>
                            </div>
                            <div className="w-full h-1 bg-gray-700 mt-3 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;
