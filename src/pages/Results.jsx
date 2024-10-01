import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "../components/ui/button";
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const Results = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const result = location.state?.result;

  const translations = {
    es: {
      title: 'Resultados',
      exportButton: 'Exportar',
      noResult: 'No hay resultados disponibles.',
    },
    en: {
      title: 'Results',
      exportButton: 'Export',
      noResult: 'No results available.',
    },
    fr: {
      title: 'Résultats',
      exportButton: 'Exporter',
      noResult: 'Aucun résultat disponible.',
    },
  };

  const exportMutation = useMutation({
    mutationFn: (data) => axios.post('/api/export', data),
    onSuccess: (response) => {
      // Handle successful export (e.g., download file or show success message)
      console.log('Export successful:', response.data);
    },
    onError: (error) => {
      console.error('Error exporting result:', error);
      // Handle error (e.g., show error message to user)
    },
  });

  const handleExport = (format) => {
    exportMutation.mutate({ document_id: result.id, format });
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
      {result ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-quaternary whitespace-pre-wrap">{result}</p>
          <div className="mt-6 flex justify-center space-x-4">
            <Button onClick={() => handleExport('pdf')} className="bg-tertiary text-white hover:bg-quaternary">
              {translations[language].exportButton} (PDF)
            </Button>
            <Button onClick={() => handleExport('docx')} className="bg-tertiary text-white hover:bg-quaternary">
              {translations[language].exportButton} (DOCX)
            </Button>
            <Button onClick={() => handleExport('txt')} className="bg-tertiary text-white hover:bg-quaternary">
              {translations[language].exportButton} (TXT)
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-quaternary">{translations[language].noResult}</p>
      )}
    </div>
  );
};

export default Results;