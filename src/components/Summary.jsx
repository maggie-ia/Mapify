import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Summary = ({ summary }) => {
  const { language } = useLanguage();

  const translations = {
    es: { title: 'Resumen' },
    en: { title: 'Summary' },
    fr: { title: 'Résumé' }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title}</h2>
      <p className="text-quaternary">{summary}</p>
    </div>
  );
};

export default Summary;