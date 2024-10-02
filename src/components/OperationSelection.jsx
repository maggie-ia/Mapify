import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useAuth } from '../hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { processText } from '../services/textProcessingService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { isOperationAllowed, canTranslateToLanguage } from '../utils/membershipUtils';

const OperationSelection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

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
      selectLanguage: 'Seleccionar idioma para traducción',
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
      selectLanguage: 'Select language for translation',
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
      selectLanguage: 'Sélectionner la langue pour la traduction',
    },
  };

  const processTextMutation = useMutation({
    mutationFn: processText,
    onSuccess: (result) => {
      navigate('/results', { state: { result, operationType: result.operationType } });
    },
    onError: (error) => {
      console.error('Error processing text:', error);
      // Handle error (e.g., show error message to user)
    },
  });

  const handleOperationSelect = (operation) => {
    const text = localStorage.getItem('uploadedText');
    const pageCount = text.split(/\r\n|\r|\n/).length / 25; // Estimación aproximada de páginas
    processTextMutation.mutate({ operation, text, targetLanguage: selectedLanguage, pageCount });
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
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
      {isOperationAllowed('translate') && (
        <div className="mt-4">
          <label htmlFor="language-select" className="block mb-2 text-sm font-medium text-quaternary">
            {translations[language].selectLanguage}
          </label>
          <Select onValueChange={setSelectedLanguage} defaultValue={selectedLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en" disabled={!canTranslateToLanguage('en')}>English</SelectItem>
              <SelectItem value="es" disabled={!canTranslateToLanguage('es')}>Español</SelectItem>
              <SelectItem value="fr" disabled={!canTranslateToLanguage('fr')}>Français</SelectItem>
              <SelectItem value="de" disabled={!canTranslateToLanguage('de')}>Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default OperationSelection;