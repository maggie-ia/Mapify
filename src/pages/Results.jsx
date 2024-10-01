import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ResultDisplay from '../components/ResultDisplay';
import ExportOptions from '../components/ExportOptions';

const Results = () => {
    const location = useLocation();
    const { language } = useLanguage();
    const { selectedOperation } = location.state || {};

    const translations = {
        es: {
            title: 'Resultados',
            noResult: 'No hay resultados disponibles.',
        },
        en: {
            title: 'Results',
            noResult: 'No results available.',
        },
        fr: {
            title: 'Résultats',
            noResult: 'Aucun résultat disponible.',
        },
    };

    // Simulación de resultado para pruebas
    const mockResult = "Este es un resultado de prueba para la operación seleccionada.";

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
            {selectedOperation ? (
                <>
                    <ResultDisplay result={mockResult} operationType={selectedOperation} />
                    <ExportOptions result={mockResult} operationType={selectedOperation} />
                </>
            ) : (
                <p className="text-center text-quaternary">{translations[language].noResult}</p>
            )}
        </div>
    );
};

export default Results;