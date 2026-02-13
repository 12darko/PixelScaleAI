import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button
                onClick={() => setLanguage('tr')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${language === 'tr'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                TR
            </button>
            <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${language === 'en'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
