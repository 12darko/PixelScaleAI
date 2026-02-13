import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

// Error Boundary must be a class component - using React.Component directly
export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = {
        hasError: false,
        error: null
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">
                            Bir Şeyler Ters Gitti
                        </h1>

                        <p className="text-gray-400 mb-6">
                            Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
                        </p>

                        {this.state.error && (
                            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 mb-6 text-left">
                                <p className="text-xs text-gray-500 font-mono break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Sayfayı Yenile
                        </button>

                        <p className="text-xs text-gray-500 mt-6">
                            Sorun devam ederse{' '}
                            <a href="mailto:support@PixelScaleAI.com" className="text-purple-400 hover:text-purple-300">
                                destek ekibimizle
                            </a>{' '}
                            iletişime geçin.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

