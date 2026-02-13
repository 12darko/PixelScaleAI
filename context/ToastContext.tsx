import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => removeToast(id), 4000);
    }, [removeToast]);

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in-right min-w-[280px] max-w-[400px] ${toast.type === 'success' ? 'bg-green-600 text-white' :
                                toast.type === 'error' ? 'bg-red-600 text-white' :
                                    'bg-gray-800 text-white border border-gray-700'
                            }`}
                    >
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}

                        <span className="flex-1 text-sm">{toast.message}</span>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 hover:opacity-70"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
