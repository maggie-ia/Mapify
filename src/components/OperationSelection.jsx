import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useAuth } from '../hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { summarizeText, paraphraseText, synthesizeText, createConceptMap, translateText } from '../services/textProcessingService';

const OperationSelection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();

  const translations = {
    es: {
      title: 'Selecciona una operación',
      options: {
        summarize: 'Resumir',
        paraphrase: 'Parafrasear',
        synthesize: 'Sintetizar',
        conceptMap: 'Mapa Conceptual',
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
        translate: 'Traduire',
      },
    },
  };

  const processTextMutation = useMutation({
    mutationFn: async ({ operation, text }) => {
      switch (operation) {
        case 'summarize':
          return await summarizeText(text);
        case 'paraphrase':
          return await paraphraseText(text);
        case 'synthesize':
          return await synthesizeText(text);
        case 'conceptMap':
          return await createConceptMap(text);
        case 'translate':
          // For translation, we'll need to prompt the user for the target language
          const targetLanguage = prompt('Enter target language code (e.g., "es" for Spanish):');
          return await translateText(text, targetLanguage);
        default:
          throw new Error('Invalid operation');
      }
    },
    onSuccess: (result) => {
      navigate('/results', { state: { result } });
    },
    onError: (error) => {
      console.error('Error processing text:', error);
      // Handle error (e.g., show error message to user)
    },
  });

  const handleOperationSelect = (operation) => {
    const text = localStorage.getItem('uploadedText'); // Assume text is stored after file upload
    processTextMutation.mutate({ operation, text });
  };

  const isOperationAllowed = (operation) => {
    if (user.membership === 'premium') return true;
    if (user.membership === 'basic') {
      return ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'translate'].includes(operation);
    }
    if (user.membership === 'free') {
      return ['summarize', 'paraphrase', 'translate'].includes(operation);
    }
    return false;
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(translations[language].options).map(([key, value]) => (
          <Button
            key={key}
            onClick={() => handleOperationSelect(key)}
            disabled={!isOperationAllowed(key)}
            className={`bg-tertiary text-white p-4 rounded-lg hover:bg-quaternary transition-colors duration-300 ${
              !isOperationAllowed(key) && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OperationSelection;