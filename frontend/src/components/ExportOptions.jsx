import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useAuth } from '../hooks/useAuth';
import { exportResult } from '../services/textProcessingService';

const ExportOptions = ({ result, operationType }) => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const translations = {
    es: {
      export: 'Exportar',
      pdf: 'PDF',
      txt: 'TXT',
      docx: 'DOCX',
      notAvailable: 'No disponible en tu plan actual'
    },
    en: {
      export: 'Export',
      pdf: 'PDF',
      txt: 'TXT',
      docx: 'DOCX',
      notAvailable: 'Not available in your current plan'
    },
    fr: {
      export: 'Exporter',
      pdf: 'PDF',
      txt: 'TXT',
      docx: 'DOCX',
      notAvailable: 'Non disponible dans votre forfait actuel'
    }
  };

  const handleExport = async (format) => {
    try {
      const exportedResult = await exportResult(result, format);
      // Handle the exported result (e.g., trigger download)
      console.log('Exported result:', exportedResult);
    } catch (error) {
      console.error('Error exporting result:', error);
    }
  };

  const isExportAllowed = (format) => {
    if (user.membership === 'premium') return true;
    if (user.membership === 'basic') return true;
    if (user.membership === 'free') {
      // Verificar si el usuario aún tiene exportaciones disponibles
      return user.exportsRemaining > 0;
    }
    return false;
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">{translations[language].export}</h3>
      <div className="flex space-x-2">
        {['pdf', 'txt', 'docx'].map((format) => (
          <Button
            key={format}
            onClick={() => handleExport(format)}
            disabled={!isExportAllowed(format) || (format === 'txt' && operationType === 'conceptMap')}
            className="bg-tertiary text-white hover:bg-quaternary"
          >
            {translations[language][format]}
          </Button>
        ))}
      </div>
      {user.membership === 'free' && user.exportsRemaining === 0 && (
        <p className="text-sm text-red-500 mt-2">{translations[language].notAvailable}</p>
      )}
    </div>
  );
};

export default ExportOptions;