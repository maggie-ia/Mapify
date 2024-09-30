import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const OptionsSelection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

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

  const handleOptionSelect = (option) => {
    // Here you would typically process the file based on the selected option
    // For now, we'll just navigate to the results page
    navigate('/results', { state: { selectedOption: option } });
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-[#a7e3f4] rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#545454]">{translations[language].title}</h1>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(translations[language].options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleOptionSelect(key)}
            className="bg-[#11ccf5] text-white p-4 rounded-lg hover:bg-[#3a7ca5] transition-colors duration-300"
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionsSelection;