import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { generateConceptMap } from '../utils/conceptMapGenerator';

const Results = () => {
  const location = useLocation();
  const { selectedOption, processedContent } = location.state || {};
  const { language } = useLanguage();
  const [conceptMap, setConceptMap] = useState(null);

  const translations = {
    es: {
      title: 'Resultados',
      options: {
        summarize: 'Resumen',
        paraphrase: 'Paráfrasis',
        synthesize: 'Síntesis',
        conceptMap: 'Mapa Conceptual',
        relevantPhrases: 'Frases Relevantes',
        translate: 'Traducción',
      },
      generateMap: 'Generar Mapa Conceptual',
      downloadMap: 'Descargar Mapa Conceptual',
    },
    en: {
      title: 'Results',
      options: {
        summarize: 'Summary',
        paraphrase: 'Paraphrase',
        synthesize: 'Synthesis',
        conceptMap: 'Concept Map',
        relevantPhrases: 'Relevant Phrases',
        translate: 'Translation',
      },
      generateMap: 'Generate Concept Map',
      downloadMap: 'Download Concept Map',
    },
    fr: {
      title: 'Résultats',
      options: {
        summarize: 'Résumé',
        paraphrase: 'Paraphrase',
        synthesize: 'Synthèse',
        conceptMap: 'Carte Conceptuelle',
        relevantPhrases: 'Phrases Pertinentes',
        translate: 'Traduction',
      },
      generateMap: 'Générer une Carte Conceptuelle',
      downloadMap: 'Télécharger la Carte Conceptuelle',
    },
  };

  useEffect(() => {
    if (selectedOption === 'conceptMap' && processedContent) {
      const map = generateConceptMap(processedContent);
      setConceptMap(map);
    }
  }, [selectedOption, processedContent]);

  const handleDownloadMap = () => {
    if (conceptMap) {
      const blob = new Blob([conceptMap], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'concept_map.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-[#a7e3f4] rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#545454]">{translations[language].title}</h1>
      <h2 className="text-2xl font-semibold mb-4 text-[#3a7ca5]">
        {selectedOption ? translations[language].options[selectedOption] : 'No option selected'}
      </h2>
      <div className="bg-white p-6 rounded-lg shadow">
        {selectedOption === 'conceptMap' ? (
          <>
            {conceptMap ? (
              <img src={URL.createObjectURL(new Blob([conceptMap], { type: 'image/png' }))} alt="Concept Map" className="mx-auto" />
            ) : (
              <button 
                onClick={() => setConceptMap(generateConceptMap(processedContent))}
                className="bg-[#11ccf5] text-white px-4 py-2 rounded hover:bg-[#3a7ca5] transition-colors"
              >
                {translations[language].generateMap}
              </button>
            )}
            {conceptMap && (
              <button 
                onClick={handleDownloadMap}
                className="mt-4 bg-[#11ccf5] text-white px-4 py-2 rounded hover:bg-[#3a7ca5] transition-colors"
              >
                {translations[language].downloadMap}
              </button>
            )}
          </>
        ) : (
          <p className="text-[#545454]">{processedContent}</p>
        )}
      </div>
    </div>
  );
};

export default Results;