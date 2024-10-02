import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const RelevantPhrases = ({ phrases }) => {
  const { language } = useLanguage();

  const translations = {
    es: { title: 'Frases Relevantes' },
    en: { title: 'Relevant Phrases' },
    fr: { title: 'Phrases Pertinentes' }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title}</h2>
      <ul className="list-disc list-inside">
        {phrases.map((phrase, index) => (
          <li key={index} className="text-quaternary mb-2">{phrase}</li>
        ))}
      </ul>
    </div>
  );
};

export default RelevantPhrases;