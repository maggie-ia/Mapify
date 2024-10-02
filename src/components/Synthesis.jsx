import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Synthesis = ({ synthesizedText }) => {
  const { language } = useLanguage();

  const translations = {
    es: { title: 'Síntesis' },
    en: { title: 'Synthesis' },
    fr: { title: 'Synthèse' }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title}</h2>
      <p className="text-quaternary">{synthesizedText}</p>
    </div>
  );
};

export default Synthesis;