<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useAuth } from '../hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
<<<<<<< HEAD
import { processText } from '../services/textProcessingService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { isOperationAllowed, canTranslateToLanguage } from '../utils/membershipUtils';
import ProgressiveLoading from './ProgressiveLoading';
import { toast } from 'react-hot-toast';
=======
import axios from 'axios';
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534

const OperationSelection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
<<<<<<< HEAD
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
=======
  const [membershipInfo, setMembershipInfo] = useState(null);

  const { data: membershipData, isLoading: membershipLoading } = useQuery({
    queryKey: ['membershipInfo'],
    queryFn: async () => {
      const response = await axios.get('/api/membership-info');
      return response.data;
    },
  });

  useEffect(() => {
    if (membershipData) {
      setMembershipInfo(membershipData);
    }
  }, [membershipData]);
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534

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
      upgradeMessage: 'Actualiza tu membresía para acceder a esta función',
      operationsLeft: 'Operaciones restantes: ',
<<<<<<< HEAD
      selectLanguage: 'Seleccionar idioma para traducción',
=======
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534
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
      upgradeMessage: 'Upgrade your membership to access this feature',
      operationsLeft: 'Operations left: ',
<<<<<<< HEAD
      selectLanguage: 'Select language for translation',
=======
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534
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
      upgradeMessage: 'Mettez à niveau votre adhésion pour accéder à cette fonctionnalité',
      operationsLeft: 'Opérations restantes : ',
<<<<<<< HEAD
      selectLanguage: 'Sélectionner la langue pour la traduction',
=======
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534
    },
  };

  const processTextMutation = useMutation({
<<<<<<< HEAD
    mutationFn: processText,
    onSuccess: (result) => {
      setIsProcessing(false);
      navigate('/results', { state: { result, operationType: result.operationType } });
    },
    onError: (error) => {
      setIsProcessing(false);
      console.error('Error processing text:', error);
      toast.error(`Error: ${error.message || 'An unexpected error occurred'}`);
    },
  });

  const handleOperationSelect = (operation) => {
    const text = localStorage.getItem('uploadedText');
    if (!text) {
      toast.error('No text uploaded. Please upload a document first.');
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
=======
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

  if (membershipLoading) {
    return <div>Loading...</div>;
  }
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534

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
<<<<<<< HEAD
           membershipInfo.weekly_operations_remaining}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4">
=======
           (membershipInfo.membership_type === 'basic' ? 10 - membershipInfo.weekly_operations :
            3 - membershipInfo.weekly_operations)}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4">
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534
        {Object.entries(translations[language].options).map(([key, value]) => (
          <Button
            key={key}
            onClick={() => handleOperationSelect(key)}
<<<<<<< HEAD
            disabled={!isOperationAllowed(key, membershipInfo?.membership_type) || isProcessing}
            className={`bg-tertiary text-white p-4 rounded-lg hover:bg-quaternary transition-colors duration-300 ${
              (!isOperationAllowed(key, membershipInfo?.membership_type) || isProcessing) && 'opacity-50 cursor-not-allowed'
=======
            disabled={!isOperationAllowed(key)}
            className={`bg-tertiary text-white p-4 rounded-lg hover:bg-quaternary transition-colors duration-300 ${
              !isOperationAllowed(key) && 'opacity-50 cursor-not-allowed'
>>>>>>> adf59d23f1dd0e393d73e1f67feca23401ede534
            }`}
          >
            {value}
          </Button>
        ))}
      </div>
      {isOperationAllowed('translate', membershipInfo?.membership_type) && (
        <div className="mt-4">
          <label htmlFor="language-select" className="block mb-2 text-sm font-medium text-quaternary">
            {translations[language].selectLanguage}
          </label>
          <Select onValueChange={setSelectedLanguage} defaultValue={selectedLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en" disabled={!canTranslateToLanguage('en', membershipInfo?.membership_type)}>English</SelectItem>
              <SelectItem value="es" disabled={!canTranslateToLanguage('es', membershipInfo?.membership_type)}>Español</SelectItem>
              <SelectItem value="fr" disabled={!canTranslateToLanguage('fr', membershipInfo?.membership_type)}>Français</SelectItem>
              <SelectItem value="de" disabled={!canTranslateToLanguage('de', membershipInfo?.membership_type)}>Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {isProcessing && <ProgressiveLoading progress={progress} />}
    </div>
  );
};

export default OperationSelection;