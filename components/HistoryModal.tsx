import React, { useEffect, useState } from 'react';
import { X, RefreshCw, Trash2, Clock, Zap } from 'lucide-react';
import { getHistory, clearHistory, UpscaleRecord } from '../services/historyService';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, userId }) => {
    const [history, setHistory] = useState<UpscaleRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            document.body.style.overflow = 'hidden';
            fetchHistory();
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, userId]);

    const fetchHistory = async () => {
        if (!userId) return;
        setLoading(true);
        const data = await getHistory(userId);
        setHistory(data);
        setLoading(false);
    };

    const handleClear = async () => {
        if (!userId) return;
        if (confirm("Geçmişi temizlemek istediğinize emin misiniz?")) {
            setLoading(true);
            const success = await clearHistory(userId);
            if (success) {
                setHistory([]);
            }
            setLoading(false);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    const formatTime = (ms: number) => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col max-h-[85vh] animate-fade-in">

                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-400" />
                            İşlem Geçmişi
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Veriler gizlilik politikası gereği 7 gün sonra otomatik silinir.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex justify-center p-10">
                            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <p className="text-4xl mb-2">🕵️‍♂️</p>
                            <p>Henüz işlem geçmişi bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
                                >
                                    <div className="flex-1">
                                        <p className="text-white font-medium truncate max-w-[300px]" title={item.file_name}>
                                            {item.file_name}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                            <span>{formatDate(item.created_at)}</span>
                                            <span className="flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                {item.scale_factor}x
                                            </span>
                                            <span>{formatTime(item.processing_time_ms)}</span>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm font-bold">
                                        {item.scale_factor}x
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 flex justify-between bg-gray-900/50 rounded-b-2xl">
                    <button
                        onClick={fetchHistory}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Yenile
                    </button>

                    {history.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="text-xs px-4 py-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            Geçmişi Temizle
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
