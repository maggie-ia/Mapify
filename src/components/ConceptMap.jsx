import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ConceptMap = ({ conceptMapImage }) => {
  const { language } = useLanguage();

  const translations = {
    es: { title: 'Mapa Conceptual' },
    en: { title: 'Concept Map' },
    fr: { title: 'Carte Conceptuelle' }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title}</h2>
      <img src={`data:image/png;base64,${conceptMapImage}`} alt="Concept Map" className="max-w-full h-auto mx-auto" />
    </div>
  );
};

export default ConceptMap;