import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "../components/ui/button";

const OperationSelection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Selecciona una operación',
      summarize: 'Resumir',
      paraphrase: 'Parafrasear',
      synthesize: 'Sintetizar',
      conceptMap: 'Mapa Conceptual',
      relevantPhrases: 'Frases Relevantes',
      translate: 'Traducir',
    },
    en: {
      title: 'Select an operation',
      summarize: 'Summarize',
      paraphrase: 'Paraphrase',
      synthesize: 'Synthesize',
      conceptMap: 'Concept Map',
      relevantPhrases: 'Relevant Phrases',
      translate: 'Translate',
    },
    fr: {
      title: 'Sélectionnez une opération',
      summarize: 'Résumer',
      paraphrase: 'Paraphraser',
      synthesize: 'Synthétiser',
      conceptMap: 'Carte Conceptuelle',
      relevantPhrases: 'Phrases Pertinentes',
      translate: 'Traduire',
    },
  };

  const handleOperationSelect = (operation) => {
    // Here we would typically process the file based on the selected operation
    // For now, we'll just navigate to a placeholder results page
    navigate('/results', { state: { selectedOperation: operation } });
  };

  const operations = ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'relevantPhrases', 'translate'];

  return (
    <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
      <div className="grid grid-cols-2 gap-4">
        {operations.map((operation) => (
          <Button
            key={operation}
            onClick={() => handleOperationSelect(operation)}
            className="bg-tertiary text-white p-4 rounded-lg hover:bg-quaternary transition-colors"
          >
            {translations[language][operation]}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OperationSelection;