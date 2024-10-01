import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";

const OperationSelection = ({ onSelect }) => {
    const { language } = useLanguage();

    const operations = {
        summarize: {
            es: 'Resumir',
            en: 'Summarize',
            fr: 'Résumer'
        },
        paraphrase: {
            es: 'Parafrasear',
            en: 'Paraphrase',
            fr: 'Paraphraser'
        },
        synthesize: {
            es: 'Sintetizar',
            en: 'Synthesize',
            fr: 'Synthétiser'
        },
        conceptMap: {
            es: 'Mapa Conceptual',
            en: 'Concept Map',
            fr: 'Carte Conceptuelle'
        },
        relevantPhrases: {
            es: 'Frases Relevantes',
            en: 'Relevant Phrases',
            fr: 'Phrases Pertinentes'
        },
        translate: {
            es: 'Traducir',
            en: 'Translate',
            fr: 'Traduire'
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">
                {language === 'es' ? 'Selecciona una operación' :
                 language === 'en' ? 'Select an operation' :
                 'Sélectionnez une opération'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(operations).map(([key, value]) => (
                    <Button
                        key={key}
                        onClick={() => onSelect(key)}
                        className="bg-tertiary hover:bg-quaternary text-white"
                    >
                        {value[language]}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default OperationSelection;