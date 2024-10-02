import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useAuth } from '../hooks/useAuth';
import { exportResult } from '../services/textProcessingService';
import { canExport, incrementExportCount } from '../utils/membershipUtils';
import { toast } from 'react-hot-toast';

const ExportOptions = ({ result, operationType }) => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const translations = {
    es: {
      export: 'Exportar',
      pdf: 'PDF',
      txt: 'TXT',
      docx: 'DOCX',
      notAvailable: 'No disponible en tu plan actual',
      exportLimitReached: 'Has alcanzado el límite de exportaciones para tu plan'
    },
    en: {
      export: 'Export',
      pdf: 'PDF',
      txt: 'TXT',
      docx: 'DOCX',
      notAvailable: 'Not available in your current plan',
      exportLimitReached: 'You have reached the export limit for your plan'
    },
    fr: {
      export: 'Exporter',
      pdf: 'PDF',
      txt: 'TXT',
      docx: 'DOCX',
      notAvailable: 'Non disponible dans votre forfait actuel',
      exportLimitReached: 'Vous avez atteint la limite d\'exportation pour votre forfait'
    }
  };

  const handleExport = async (format) => {
    if (!canExport(format)) {
      toast.error(translations[language].exportLimitReached);
      return;
    }

    try {
      const exportedResult = await exportResult(result, format);
      incrementExportCount();
      // Handle the exported result (e.g., trigger download)
      console.log('Exported result:', exportedResult);
      toast.success(translations[language].exportSuccess);
    } catch (error) {
      console.error('Error exporting result:', error);
      toast.error(translations[language].exportError);
    }
  };

  const isExportAllowed = (format) => {
    if (format === 'txt' && operationType === 'conceptMap') {
      return false;
    }
    return canExport(format);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">{translations[language].export}</h3>
      <div className="flex space-x-2">
        {['pdf', 'txt', 'docx'].map((format) => (
          <Button
            key={format}
            onClick={() => handleExport(format)}
            disabled={!isExportAllowed(format)}
            className="bg-tertiary text-white hover:bg-quaternary"
          >
            {translations[language][format]}
          </Button>
        ))}
      </div>
      {!isExportAllowed('pdf') && (
        <p className="text-sm text-red-500 mt-2">{translations[language].notAvailable}</p>
      )}
    </div>
  );
};

export default ExportOptions;