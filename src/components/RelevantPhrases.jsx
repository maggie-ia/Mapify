import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const RelevantPhrases = ({ phrases }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Frases Relevantes',
            noPhrases: 'No se encontraron frases relevantes.'
        },
        en: {
            title: 'Relevant Phrases',
            noPhrases: 'No relevant phrases found.'
        },
        fr: {
            title: 'Phrases Pertinentes',
            noPhrases: 'Aucune phrase pertinente trouvée.'
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">
                {translations[language].title}
            </h2>
            {phrases && phrases.length > 0 ? (
                <ul className="list-disc list-inside">
                    {phrases.map((phrase, index) => (
                        <li key={index} className="mb-2 text-quaternary">{phrase}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-quaternary">{translations[language].noPhrases}</p>
            )}
        </div>
    );
};

export default RelevantPhrases;