import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "../components/ui/button";

const OperationSelection = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Selecciona una operación',
            options: {
                summarize: 'Resumir',
                paraphrase: 'Parafrasear',
                synthesize: 'Sintetizar',
                conceptMap: 'Mapa Conceptual',
                relevantPhrases: 'Frases Relevantes',
                translate: 'Traducir',
            },
        },
        en: {
            title: 'Select an operation',
            options: {
                summarize: 'Summarize',
                paraphrase: 'Paraphrase',
                synthesize: 'Synthesize',
                conceptMap: 'Concept Map',
                relevantPhrases: 'Relevant Phrases',
                translate: 'Translate',
            },
        },
        fr: {
            title: 'Sélectionnez une opération',
            options: {
                summarize: 'Résumer',
                paraphrase: 'Paraphraser',
                synthesize: 'Synthétiser',
                conceptMap: 'Carte Conceptuelle',
                relevantPhrases: 'Phrases Pertinentes',
                translate: 'Traduire',
            },
        },
    };

    const handleOperationSelect = (operation) => {
        navigate('/results', { state: { selectedOperation: operation } });
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(translations[language].options).map(([key, value]) => (
                    <Button
                        key={key}
                        onClick={() => handleOperationSelect(key)}
                        className="bg-tertiary text-white hover:bg-quaternary transition-colors"
                    >
                        {value}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default OperationSelection;