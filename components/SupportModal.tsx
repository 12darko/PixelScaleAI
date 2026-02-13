import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
    isPremium?: boolean;
}

// Create support ticket in Supabase
async function createSupportTicket(
    email: string,
    subject: string,
    message: string,
    isPremium: boolean = false
): Promise<{ success: boolean }> {
    try {
        const { error } = await supabase
            .from('support_tickets')
            .insert([{
                email,
                subject,
                message,
                is_premium: isPremium,
                status: 'open',
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.error('Support ticket error:', error);
            return { success: false };
        }
        return { success: true };
    } catch (err) {
        console.error('Support ticket exception:', err);
        return { success: false };
    }
}

export const SupportModal: React.FC<SupportModalProps> = ({
    isOpen,
    onClose,
    userEmail,
    isPremium = false
}) => {
    const [email, setEmail] = useState(userEmail || '');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!subject || !message || (!userEmail && !email)) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        const emailToSubmit = userEmail || email || 'guest@PixelScaleAI.com';
        const result = await createSupportTicket(emailToSubmit, subject, message, isPremium);

        setIsSubmitting(false);

        if (result.success) {
            setSubmitStatus('success');
            setTimeout(() => {
                onClose();
                setSubmitStatus('idle');
                setSubject('');
                setMessage('');
                setEmail('');
            }, 2000);
        } else {
            setSubmitStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        📞 Destek Talebi
                        {isPremium && <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full">Premium</span>}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Email (only if not logged in) */}
                    {!userEmail && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                                E-posta Adresiniz
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@email.com"
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    )}

                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                            Konu
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Sorununuzu kısaca açıklayın..."
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
                            Mesajınız
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Size nasıl yardımcı olabiliriz?"
                            rows={4}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                        />
                    </div>

                    {/* Premium Badge */}
                    {isPremium && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-200 flex items-center gap-2">
                            ⚡ Premium üye olarak talebiniz öncelikli olarak işleme alınacaktır!
                        </div>
                    )}

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-400 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Bir hata oluştu. Lütfen tekrar deneyin veya support@PixelScaleAI.com adresine mail atın.
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 rounded-lg text-gray-300 font-medium hover:bg-gray-700/50 transition-colors border border-gray-700"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!subject || !message || (!userEmail && !email) || isSubmitting}
                            className="flex-1 py-2.5 rounded-lg font-bold shadow-lg transition-all text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Gönder
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;

