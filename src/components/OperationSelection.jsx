import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useAuth } from '../hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { processText, checkMembershipLimits } from '../services/api';
import { toast } from 'react-hot-toast';

const OperationSelection = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { user } = useAuth();
    const [selectedOperation, setSelectedOperation] = useState(null);

    const { data: membershipLimits, isLoading: limitsLoading } = useQuery({
        queryKey: ['membershipLimits', user.id],
        queryFn: () => checkMembershipLimits(user.id, selectedOperation),
        enabled: !!selectedOperation,
    });

    const processTextMutation = useMutation({
        mutationFn: ({ operation, text }) => processText(operation, text),
        onSuccess: (result) => {
            navigate('/results', { state: { result, operationType: selectedOperation } });
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        },
    });

    const handleOperationSelect = async (operation) => {
        setSelectedOperation(operation);
        const text = localStorage.getItem('uploadedText');
        
        try {
            await checkMembershipLimits(user.id, operation);
            processTextMutation.mutate({ operation, text });
        } catch (error) {
            toast.error(`Límite de membresía alcanzado: ${error.message}`);
        }
    };

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

    if (limitsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(translations[language].options).map(([key, value]) => (
                    <Button
                        key={key}
                        onClick={() => handleOperationSelect(key)}
                        disabled={processTextMutation.isLoading}
                        className="bg-tertiary text-white p-4 rounded-lg hover:bg-quaternary transition-colors duration-300"
                    >
                        {value}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default OperationSelection;
