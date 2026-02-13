import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('PixelScaleAI_cookie_consent');
        if (!consent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('PixelScaleAI_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('PixelScaleAI_cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slide-up">
            <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <Cookie className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">Çerez Kullanımı</h3>
                        <p className="text-gray-400 text-sm">
                            PixelScaleAI, daha iyi bir deneyim sunmak için çerezler kullanır.
                            Siteyi kullanmaya devam ederek çerez politikamızı kabul etmiş olursunuz.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleDecline}
                            className="flex-1 md:flex-none px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Reddet
                        </button>
                        <button
                            onClick={handleAccept}
                            className="flex-1 md:flex-none px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Kabul Et
                        </button>
                    </div>

                    <button
                        onClick={handleDecline}
                        className="absolute top-2 right-2 md:static text-gray-500 hover:text-white p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;

