import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TranslatedText = ({ originalText, translatedText, targetLanguage }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Texto Traducido',
            original: 'Texto Original',
            translated: 'Texto Traducido',
            targetLanguage: 'Idioma de Destino'
        },
        en: {
            title: 'Translated Text',
            original: 'Original Text',
            translated: 'Translated Text',
            targetLanguage: 'Target Language'
        },
        fr: {
            title: 'Texte Traduit',
            original: 'Texte Original',
            translated: 'Texte Traduit',
            targetLanguage: 'Langue Cible'
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">
                {translations[language].title}
            </h2>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-quaternary">
                    {translations[language].original}
                </h3>
                <p className="mt-2 text-quaternary">{originalText}</p>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-quaternary">
                    {translations[language].translated}
                </h3>
                <p className="mt-2 text-quaternary">{translatedText}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-quaternary">
                    {translations[language].targetLanguage}
                </h3>
                <p className="mt-2 text-quaternary">{targetLanguage}</p>
            </div>
        </div>
    );
};

export default TranslatedText;