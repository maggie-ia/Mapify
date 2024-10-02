import React from 'react';
import { useLocation } from 'react-router-dom';
import Summary from './Summary';
import Paraphrase from './Paraphrase';
import Synthesis from './Synthesis';
import ConceptMap from './ConceptMap';
import RelevantPhrases from './RelevantPhrases';
import TranslatedText from './TranslatedText';
import ExportOptions from './ExportOptions';

const Results = () => {
  const location = useLocation();
  const { result, operationType } = location.state;

  const renderResult = () => {
    switch (operationType) {
      case 'summarize':
        return <Summary summary={result.summary} />;
      case 'paraphrase':
        return <Paraphrase paraphrasedText={result.paraphrasedText} />;
      case 'synthesize':
        return <Synthesis synthesizedText={result.synthesizedText} />;
      case 'conceptMap':
        return <ConceptMap conceptMapImage={result.conceptMapImage} />;
      case 'relevantPhrases':
        return <RelevantPhrases phrases={result.relevantPhrases} />;
      case 'translate':
        return <TranslatedText translatedText={result.translatedText} targetLanguage={result.targetLanguage} />;
      default:
        return <p>Resultado no disponible</p>;
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
      {renderResult()}
      <ExportOptions result={result} operationType={operationType} />
    </div>
  );
};

export default Results;