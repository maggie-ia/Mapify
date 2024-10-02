import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useAuth } from '../hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { processText } from '../services/textProcessingService';

const OperationSelection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();

  const { data: membershipInfo, isLoading } = useQuery({
    queryKey: ['membershipInfo'],
    queryFn: async () => {
      const response = await axios.get('/api/membership-info');
      return response.data;
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
      },
      operationsLeft: 'Operaciones restantes: ',
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
      operationsLeft: 'Operations left: ',
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
      operationsLeft: 'Opérations restantes : ',
    },
  };

  const processTextMutation = useMutation({
    mutationFn: ({ operation, text }) => processText(operation, text),
    onSuccess: (result) => {
      navigate('/results', { state: { result } });
    },
    onError: (error) => {
      console.error('Error processing text:', error);
      // Handle error (e.g., show error message to user)
    },
  });

  const handleOperationSelect = (operation) => {
    const text = localStorage.getItem('uploadedText');
    processTextMutation.mutate({ operation, text });
  };

  const isOperationAllowed = (operation) => {
    if (!membershipInfo) return false;
    if (membershipInfo.membership_type === 'premium') return true;
    if (membershipInfo.membership_type === 'basic') {
      return ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'relevantPhrases', 'translate'].includes(operation);
    }
    if (membershipInfo.membership_type === 'free') {
      return ['summarize', 'paraphrase', 'translate'].includes(operation);
    }
    return false;
  };

  if (isLoading) return <div>Loading...</div>;

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