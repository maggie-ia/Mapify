import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ResultDisplay = ({ result, operationType }) => {
  const { language } = useLanguage();

  const translations = {
    es: {
      summary: 'Resumen',
      paraphrase: 'Paráfrasis',
      synthesis: 'Síntesis',
      conceptMap: 'Mapa Conceptual',
      relevantPhrases: 'Frases Relevantes',
      translation: 'Traducción',
    },
    en: {
      summary: 'Summary',
      paraphrase: 'Paraphrase',
      synthesis: 'Synthesis',
      conceptMap: 'Concept Map',
      relevantPhrases: 'Relevant Phrases',
      translation: 'Translation',
    },
    fr: {
      summary: 'Résumé',
      paraphrase: 'Paraphrase',
      synthesis: 'Synthèse',
      conceptMap: 'Carte Conceptuelle',
      relevantPhrases: 'Phrases Pertinentes',
      translation: 'Traduction',
    },
  };

  const renderResult = () => {
    switch (operationType) {
      case 'conceptMap':
        return <img src={`data:image/png;base64,${result}`} alt="Concept Map" className="max-w-full h-auto" />;
      case 'relevantPhrases':
        return (
          <ul className="list-disc list-inside">
            {result.map((phrase, index) => (
              <li key={index} className="mb-2">{phrase}</li>
            ))}
          </ul>
        );
      default:
        return <p className="whitespace-pre-wrap">{result}</p>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        {translations[language][operationType]}
      </h2>
      <div className="mt-4">{renderResult()}</div>
    </div>
  );
};

export default ResultDisplay;