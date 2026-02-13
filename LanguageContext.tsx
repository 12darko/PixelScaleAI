import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('tr');

    useEffect(() => {
        // Load saved language from localStorage
        const saved = localStorage.getItem('PixelScaleAI_language') as Language;
        if (saved && translations[saved]) {
            setLanguageState(saved);
        } else {
            // Auto-detect from browser
            const browserLang = navigator.language.split('-')[0];
            if (browserLang === 'en') {
                setLanguageState('en');
            }
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('PixelScaleAI_language', lang);
    };

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations['tr'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

