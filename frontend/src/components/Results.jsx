import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ExportOptions from './ExportOptions';
import { Button } from "./ui/button";

const Results = () => {
    const location = useLocation();
    const { language } = useLanguage();
    const result = location.state?.result;
    const operationType = location.state?.operationType;

    const translations = {
        es: {
            title: 'Resultados',
            noResult: 'No hay resultados disponibles.',
            backToHome: 'Volver al inicio'
        },
        en: {
            title: 'Results',
            noResult: 'No results available.',
            backToHome: 'Back to home'
        },
        fr: {
            title: 'Résultats',
            noResult: 'Aucun résultat disponible.',
            backToHome: 'Retour à l\'accueil'
        }
    };

    const renderResult = () => {
        if (!result) return null;

        switch (operationType) {
            case 'conceptMap':
                return <img src={result} alt="Concept Map" className="max-w-full h-auto mx-auto" />;
            case 'relevantPhrases':
                return (
                    <ul className="list-disc list-inside">
                        {result.map((phrase, index) => (
                            <li key={index} className="mb-2 text-quaternary">{phrase}</li>
                        ))}
                    </ul>
                );
            default:
                return <p className="whitespace-pre-wrap text-quaternary">{result}</p>;
        }
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
            {result ? (
                <>
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        {renderResult()}
                    </div>
                    <ExportOptions result={result} operationType={operationType} />
                </>
            ) : (
                <p className="text-center text-quaternary">{translations[language].noResult}</p>
            )}
            <div className="mt-6 text-center">
                <Button onClick={() => window.history.back()} className="bg-tertiary text-white hover:bg-quaternary">
                    {translations[language].backToHome}
                </Button>
            </div>
        </div>
    );
};

export default Results;