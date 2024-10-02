import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Paraphrase = ({ paraphrasedText }) => {
  const { language } = useLanguage();

  const translations = {
    es: { title: 'Paráfrasis' },
    en: { title: 'Paraphrase' },
    fr: { title: 'Paraphrase' }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title}</h2>
      <p className="text-quaternary">{paraphrasedText}</p>
    </div>
  );
};

export default Paraphrase;