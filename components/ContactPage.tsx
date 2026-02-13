import React from 'react';
import { Mail, MapPin, Clock, Shield, Scale } from 'lucide-react';

const ContactPage: React.FC = () => {
    return (
        <div className="bg-gray-900 min-h-[60vh] text-gray-300">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">İletişim ve Destek</h1>

                <p className="text-gray-400 mb-8">
                    Her türlü soru ve öneriniz için bize ulaşabilirsiniz.
                </p>

                {/* Contact Info */}
                <div className="space-y-6 mb-8">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm mb-1">E-posta:</h3>
                            <p className="text-white">support@PixelScaleAI.com</p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm mb-1">Adres:</h3>
                            <p className="text-white">İstanbul / TÜRKİYE</p>
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm mb-1">Çalışma Saatleri:</h3>
                            <p className="text-white">Pazartesi - Cuma: 09:00 - 18:00 (TSİ)</p>
                        </div>
                    </div>
                </div>

                {/* Email Button */}
                <a
                    href="mailto:support@PixelScaleAI.com"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors mb-12"
                >
                    <Mail className="w-5 h-5" />
                    Bize E-posta Gönderin
                </a>

                {/* Trust Badges */}
                <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">SSL Secure</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                        <Scale className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">DMCA Protected</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

