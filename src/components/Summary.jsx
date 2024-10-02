import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Summary = ({ summary }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Resumen',
            noSummary: 'No hay resumen disponible.',
        },
        en: {
            title: 'Summary',
            noSummary: 'No summary available.',
        },
        fr: {
            title: 'Résumé',
            noSummary: 'Aucun résumé disponible.',
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title}</h2>
            {summary ? (
                <p className="text-quaternary">{summary}</p>
            ) : (
                <p className="text-quaternary">{translations[language].noSummary}</p>
            )}
        </div>
    );
};

export default Summary;