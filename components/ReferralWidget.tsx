import React, { useState } from 'react';
import { Copy, Check, Users } from 'lucide-react';

interface ReferralWidgetProps {
    userId?: string;
}

export const ReferralWidget: React.FC<ReferralWidgetProps> = ({ userId }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        // Generate link based on current domain to work in Dev and Prod
        const code = userId || 'guest';
        const referralLink = `${window.location.origin}/?ref=${code}`;
        navigator.clipboard.writeText(referralLink);

        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="relative group overflow-hidden bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-indigo-500/30 rounded-xl p-6 text-center shadow-lg hover:border-indigo-500/50 transition-colors">

            {/* Background FX */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/30">
                    <Users className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-white font-bold text-lg mb-1">Arkadaşını Davet Et</h3>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed max-w-[200px]">
                    Her davet ettiğin arkadaşın için <strong>+5 Kredi</strong> kazan! Onlar da +20 Kredi ile başlasın.
                </p>

                <button
                    onClick={handleCopyLink}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${copied
                        ? 'bg-green-500 text-white shadow-green-500/20'
                        : 'bg-white text-indigo-900 hover:bg-slate-200 shadow-white/10'
                        } shadow-lg`}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            Link Kopyalandı!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Davet Linkini Kopyala
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
