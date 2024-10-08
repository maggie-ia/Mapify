import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useAuth } from '../hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { processText } from '../services/textProcessingService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { isOperationAllowed, canTranslateToLanguage } from '../utils/membershipUtils';
import ProgressiveLoading from './ProgressiveLoading';
import { toast } from 'react-hot-toast';

const OperationSelection = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { user } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const { data: membershipInfo, isLoading } = useQuery({
        queryKey: ['membershipInfo'],
        queryFn: async () => {
            const response = await fetch('/api/membership-info');
            if (!response.ok) {
                throw new Error('Failed to fetch membership info');
            }
            return response.json();
        },
    });

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
                problemSolving: 'Resolver Problemas',
                writingAssistant: 'Asistente de Escritura'
            },
            upgradeMessage: 'Actualiza tu membresía para acceder a esta función',
            operationsLeft: 'Operaciones restantes: ',
            selectLanguage: 'Seleccionar idioma para traducción',
            noTextUploaded: 'No se ha subido ningún texto. Por favor, sube un documento primero.',
            unexpectedError: 'Ha ocurrido un error inesperado'
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
                problemSolving: 'Solve Problems',
                writingAssistant: 'Writing Assistant'
            },
            upgradeMessage: 'Upgrade your membership to access this feature',
            operationsLeft: 'Operations left: ',
            selectLanguage: 'Select language for translation',
            noTextUploaded: 'No text uploaded. Please upload a document first.',
            unexpectedError: 'An unexpected error occurred'
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
                problemSolving: 'Résoudre des Problèmes',
                writingAssistant: 'Assistant d\'écriture'
            },
            upgradeMessage: 'Mettez à niveau votre adhésion pour accéder à cette fonctionnalité',
            operationsLeft: 'Opérations restantes : ',
            selectLanguage: 'Sélectionner la langue pour la traduction',
            noTextUploaded: 'Aucun texte n\'a été téléchargé. Veuillez d\'abord télécharger un document.',
            unexpectedError: 'Une erreur inattendue s\'est produite'
        },
    };

    const processTextMutation = useMutation({
        mutationFn: processText,
        onSuccess: (result) => {
            setIsProcessing(false);
            navigate('/results', { state: { result, operationType: result.operationType } });
        },
        onError: (error) => {
            setIsProcessing(false);
            console.error('Error processing text:', error);
            toast.error(`Error: ${error.message || translations[language].unexpectedError}`);
        },
    });

    const handleOperationSelect = (operation) => {
        if (operation === 'writingAssistant') {
            navigate('/writing-assistant');
            return;
        }

        const text = localStorage.getItem('uploadedText');
        if (!text) {
            toast.error(translations[language].noTextUploaded);
            return;
        }

        const pageCount = text.split(/\r\n|\r|\n/).length / 25; // Estimación aproximada de páginas
        setIsProcessing(true);
        processTextMutation.mutate(
            { operation, text, targetLanguage: selectedLanguage, pageCount },
            {
                onProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            }
        );
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
            {membershipInfo && (
                <p className="text-center mb-4 text-quaternary">
                    {translations[language].operationsLeft}
                    {membershipInfo.membership_type === 'premium' ? 'Unlimited' : 
                    membershipInfo.weekly_operations_remaining}
                </p>
            )}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {Object.entries(translations[language].options).map(([key, value]) => (
                    <Button
                        key={key}
                        onClick={() => handleOperationSelect(key)}
                        disabled={!isOperationAllowed(key, membershipInfo?.membership_type) || isProcessing}
                        className={`bg-tertiary text-white p-4 rounded-lg hover:bg-quaternary transition-colors duration-300 ${
                        (!isOperationAllowed(key, membershipInfo?.membership_type) || isProcessing) && 'opacity-50 cursor-not-allowed'
                        }`}
                    >
                        {value}
                    </Button>
                ))}
            </div>
            {isProcessing && <ProgressiveLoading progress={progress} />}
        </div>
    );
};

export default OperationSelection;