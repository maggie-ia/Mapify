import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TranslatedText = ({ translatedText, targetLanguage }) => {
  const { language } = useLanguage();

  const translations = {
    es: { title: 'Texto Traducido' },
    en: { title: 'Translated Text' },
    fr: { title: 'Texte Traduit' }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title} ({targetLanguage})</h2>
      <p className="text-quaternary">{translatedText}</p>
    </div>
  );
};

export default TranslatedText;