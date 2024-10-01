import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Results = () => {
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Resultados',
      placeholder: 'Aquí se mostrarán los resultados del procesamiento'
    },
    en: {
      title: 'Results',
      placeholder: 'Processing results will be shown here'
    },
    fr: {
      title: 'Résultats',
      placeholder: 'Les résultats du traitement seront affichés ici'
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">{translations[language].title}</h1>
      <div className="bg-quinary p-6 rounded-lg">
        <p className="text-center text-quaternary">{translations[language].placeholder}</p>
      </div>
    </div>
  );
};

export default Results;