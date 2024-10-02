import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useMutation } from '@tanstack/react-query';
import { getWritingAssistance } from '../services/textProcessingService';
import { toast } from 'react-hot-toast';

const WritingAssistant = () => {
    const [text, setText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const { language } = useLanguage();
    const { user } = useAuth();

    const translations = {
        es: {
            title: 'Asistente de Escritura',
            placeholder: 'Escribe o pega tu texto aquí...',
            analyze: 'Analizar',
            applySuggestion: 'Aplicar',
            noSuggestions: 'No hay sugerencias para este texto.',
            premiumFeature: 'Características avanzadas disponibles en la versión Premium.',
        },
        en: {
            title: 'Writing Assistant',
            placeholder: 'Write or paste your text here...',
            analyze: 'Analyze',
            applySuggestion: 'Apply',
            noSuggestions: 'No suggestions for this text.',
            premiumFeature: 'Advanced features available in Premium version.',
        },
        fr: {
            title: 'Assistant d\'écriture',
            placeholder: 'Écrivez ou collez votre texte ici...',
            analyze: 'Analyser',
            applySuggestion: 'Appliquer',
            noSuggestions: 'Aucune suggestion pour ce texte.',
            premiumFeature: 'Fonctionnalités avancées disponibles dans la version Premium.',
        }
    };

    const assistanceMutation = useMutation({
        mutationFn: getWritingAssistance,
        onSuccess: (data) => {
            setSuggestions(data.suggestions);
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const handleAnalyze = () => {
        assistanceMutation.mutate({ text, membershipType: user.membership_type });
    };

    const applySuggestion = (suggestion) => {
        setText(text.replace(suggestion.original, suggestion.suggested));
        setSuggestions(suggestions.filter(s => s !== suggestion));
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title}</h2>
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={translations[language].placeholder}
                className="w-full h-40 mb-4"
            />
            <Button 
                onClick={handleAnalyze} 
                className="bg-tertiary text-white hover:bg-quaternary mb-4"
            >
                {translations[language].analyze}
            </Button>
            {suggestions.length > 0 ? (
                <div>
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="mb-2 p-2 bg-white rounded">
                            <p className="text-quaternary">{suggestion.original} → {suggestion.suggested}</p>
                            <Button 
                                onClick={() => applySuggestion(suggestion)}
                                className="mt-2 bg-tertiary text-white hover:bg-quaternary"
                            >
                                {translations[language].applySuggestion}
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-quaternary">{translations[language].noSuggestions}</p>
            )}
            {user.membership_type !== 'premium' && (
                <p className="mt-4 text-quaternary">{translations[language].premiumFeature}</p>
            )}
        </div>
    );
};

export default WritingAssistant;