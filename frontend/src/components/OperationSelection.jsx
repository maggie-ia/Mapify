import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useAuth } from '../hooks/useAuth';

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
      upgradeMessage: 'Actualiza tu membresía para acceder a esta función'
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
      upgradeMessage: 'Upgrade your membership to access this feature'
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
      upgradeMessage: 'Mettez à niveau votre adhésion pour accéder à cette fonctionnalité'
    },
  };

  const isOperationAllowed = (operation) => {
    if (user.membership === 'premium') return true;
    if (user.membership === 'basic') {
      return ['summarize', 'paraphrase', 'translate', 'conceptMap', 'relevantPhrases'].includes(operation);
    }
    if (user.membership === 'free') {
      return ['summarize', 'paraphrase', 'translate'].includes(operation);
    }
    return false;
  };

  const handleOperationSelect = (operation) => {
    if (isOperationAllowed(operation)) {
      navigate('/results', { state: { selectedOperation: operation } });
    } else {
      alert(translations[language].upgradeMessage);
    }
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
            className={`bg-tertiary text-white hover:bg-quaternary transition-colors ${!isOperationAllowed(key) && 'opacity-50 cursor-not-allowed'}`}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OperationSelection;