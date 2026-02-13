import React, { useState } from 'react';
import { MessageCircleQuestion, X, Mail, Twitter, MessageSquare, Send } from 'lucide-react';

interface SupportButtonProps {
    onOpenSupportModal?: () => void;
}

const SupportButton: React.FC<SupportButtonProps> = ({ onOpenSupportModal }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Contact Info Popup */}
            {isOpen && (
                <div className="fixed bottom-20 left-6 z-50 w-72 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">Bize Ulaşın</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/70 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-white/80 text-sm mt-1">Her zaman yardıma hazırız</p>
                    </div>

                    <div className="p-4 space-y-3">
                        {/* Email */}
                        <a
                            href="mailto:support@PixelScaleAI.com"
                            className="flex items-center gap-3 p-3 bg-gray-900/50 hover:bg-gray-700/50 rounded-xl transition-colors group"
                        >
                            <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center group-hover:bg-purple-600/30">
                                <Mail className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-white text-sm font-medium">E-posta</div>
                                <div className="text-gray-400 text-xs">support@PixelScaleAI.com</div>
                            </div>
                        </a>

                        {/* Twitter */}
                        <a
                            href="https://twitter.com/PixelScaleAI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-gray-900/50 hover:bg-gray-700/50 rounded-xl transition-colors group"
                        >
                            <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30">
                                <Twitter className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-white text-sm font-medium">Twitter</div>
                                <div className="text-gray-400 text-xs">@PixelScaleAI</div>
                            </div>
                        </a>

                        {/* Direct Message Button */}
                        {onOpenSupportModal && (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onOpenSupportModal();
                                }}
                                className="w-full flex items-center gap-3 p-3 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors group"
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Send className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <div className="text-white text-sm font-bold">Mesaj Gönder</div>
                                    <div className="text-white/70 text-xs">Doğrudan bize yazın</div>
                                </div>
                            </button>
                        )}
                    </div>

                    <div className="px-4 pb-4">
                        <p className="text-gray-500 text-xs text-center">
                            Genellikle 24 saat içinde yanıtlıyoruz
                        </p>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl hover:scale-105 transition-all hover:shadow-2xl font-medium border group ${isOpen
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-gray-900 border-gray-200'
                    }`}
                aria-label="Destek ile iletişime geçin"
            >
                <div className={`rounded-full p-1 transition-transform ${isOpen ? 'rotate-45' : 'group-hover:rotate-12'} ${isOpen ? 'bg-gray-700 text-purple-400' : 'bg-purple-600 text-white'
                    }`}>
                    {isOpen ? <X className="w-5 h-5" /> : <MessageCircleQuestion className="w-5 h-5" />}
                </div>
                <span className="hidden sm:inline text-sm">{isOpen ? 'Kapat' : 'Destek'}</span>
            </button>
        </>
    );
};

export default SupportButton;

