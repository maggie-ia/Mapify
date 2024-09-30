import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Results = () => {
  const location = useLocation();
  const { selectedOption } = location.state || {};
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Resultados',
      options: {
        summarize: 'Resumen',
        paraphrase: 'Paráfrasis',
        synthesize: 'Síntesis',
        conceptMap: 'Mapa Conceptual',
        relevantPhrases: 'Frases Relevantes',
        translate: 'Traducción',
      },
    },
    en: {
      title: 'Results',
      options: {
        summarize: 'Summary',
        paraphrase: 'Paraphrase',
        synthesize: 'Synthesis',
        conceptMap: 'Concept Map',
        relevantPhrases: 'Relevant Phrases',
        translate: 'Translation',
      },
    },
    fr: {
      title: 'Résultats',
      options: {
        summarize: 'Résumé',
        paraphrase: 'Paraphrase',
        synthesize: 'Synthèse',
        conceptMap: 'Carte Conceptuelle',
        relevantPhrases: 'Phrases Pertinentes',
        translate: 'Traduction',
      },
    },
  };

  // This is a placeholder for the actual result
  const placeholderResult = "Here's where the processed content would appear. For a real implementation, you'd need to integrate with backend services to handle file processing and apply the selected operation.";

  return (
    <div className="container mx-auto mt-10 p-6 bg-[#a7e3f4] rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#545454]">{translations[language].title}</h1>
      <h2 className="text-2xl font-semibold mb-4 text-[#3a7ca5]">
        {selectedOption ? translations[language].options[selectedOption] : 'No option selected'}
      </h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-[#545454]">{placeholderResult}</p>
      </div>
    </div>
  );
};

export default Results;