import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "../components/ui/button";
import { useAuth } from '../hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

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

  const processTextMutation = useMutation({
    mutationFn: (data) => axios.post('/api/process', data),
    onSuccess: (response) => {
      navigate('/results', { state: { result: response.data.result } });
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
      return ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'relevantPhrases', 'translate'].includes(operation);
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