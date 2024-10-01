import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { processText } from '../services/textProcessingService';

const Results = () => {
  const location = useLocation();
  const { file, operation } = location.state || {};
  const { language } = useLanguage();
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const translations = {
    es: {
      title: 'Resultados',
      loading: 'Procesando...',
      error: 'Ocurrió un error al procesar el texto.',
      options: {
        summarize: 'Resumen',
        paraphrase: 'Paráfrasis',
        synthesize: 'Síntesis',
        conceptMap: 'Mapa Conceptual',
        relevantPhrases: 'Frases Relevantes',
        translate: 'Traducción',
      },
    },
    en: {
      title: 'Results',
      loading: 'Processing...',
      error: 'An error occurred while processing the text.',
      options: {
        summarize: 'Summary',
        paraphrase: 'Paraphrase',
        synthesize: 'Synthesis',
        conceptMap: 'Concept Map',
        relevantPhrases: 'Relevant Phrases',
        translate: 'Translation',
      },
    },
    fr: {
      title: 'Résultats',
      loading: 'Traitement en cours...',
      error: 'Une erreur s\'est produite lors du traitement du texte.',
      options: {
        summarize: 'Résumé',
        paraphrase: 'Paraphrase',
        synthesize: 'Synthèse',
        conceptMap: 'Carte Conceptuelle',
        relevantPhrases: 'Phrases Pertinentes',
        translate: 'Traduction',
      },
    },
  };

  useEffect(() => {
    const processFile = async () => {
      if (file && operation) {
        setIsLoading(true);
        setError(null);
        try {
          const processedText = await processText(operation, file.content);
          setResult(processedText);
        } catch (err) {
          setError(translations[language].error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    processFile();
  }, [file, operation, language]);

  if (isLoading) {
    return <div className="text-center mt-10">{translations[language].loading}</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
      <h2 className="text-2xl font-semibold mb-4 text-quaternary">
        {operation ? translations[language].options[operation] : 'No operation selected'}
      </h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-primary whitespace-pre-wrap">{result}</p>
      </div>
    </div>
  );
};

export default Results;