import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Results = () => {
  const { state } = useLocation();
  const { language } = useLanguage();
  const { selectedOperation } = state || {};

  const translations = {
    es: {
      title: 'Resultados',
      operationSelected: 'Operación seleccionada:',
      placeholder: 'Aquí se mostrarán los resultados del procesamiento',
    },
    en: {
      title: 'Results',
      operationSelected: 'Selected operation:',
      placeholder: 'Processing results will be shown here',
    },
    fr: {
      title: 'Résultats',
      operationSelected: 'Opération sélectionnée :',
      placeholder: 'Les résultats du traitement seront affichés ici',
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        {translations[language].title}
      </h1>
      <div className="bg-quinary p-6 rounded-lg shadow-lg">
        <p className="text-lg mb-4 text-quaternary">
          {translations[language].operationSelected} <span className="font-semibold">{selectedOperation}</span>
        </p>
        <p className="text-center text-quaternary">
          {translations[language].placeholder}
        </p>
      </div>
    </div>
  );
};

export default Results;