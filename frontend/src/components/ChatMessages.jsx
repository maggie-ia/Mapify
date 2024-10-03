import React from 'react';
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useLanguage } from '../contexts/LanguageContext';

const ChatMessages = ({ messages, handleFeedback, grammarMode }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            feedbackPositive: "¿Fue útil esta respuesta?",
            feedbackNegative: "¿No fue útil esta respuesta?",
            grammarCorrection: "Corrección gramatical:"
        },
        en: {
            feedbackPositive: "Was this response helpful?",
            feedbackNegative: "Was this response not helpful?",
            grammarCorrection: "Grammar correction:"
        },
        fr: {
            feedbackPositive: "Cette réponse était-elle utile ?",
            feedbackNegative: "Cette réponse n'était-elle pas utile ?",
            grammarCorrection: "Correction grammaticale :"
        }
    };

    return (
        <ScrollArea className="h-80 mb-4">
            {messages.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded ${msg.sender === 'user' ? 'bg-tertiary text-white' : 'bg-secondary'}`}>
                    {msg.content}
                    {msg.sender === 'ai' && (
                        <div className="mt-2">
                            <Button onClick={() => handleFeedback(index, true)} className="mr-2">
                                {translations[language].feedbackPositive}
                            </Button>
                            <Button onClick={() => handleFeedback(index, false)}>
                                {translations[language].feedbackNegative}
                            </Button>
                        </div>
                    )}
                    {grammarMode && msg.grammarCorrections && (
                        <div className="mt-2 text-sm text-quaternary">
                            <p>{translations[language].grammarCorrection}</p>
                            <ul>
                                {msg.grammarCorrections.map((correction, i) => (
                                    <li key={i}>{correction}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </ScrollArea>
    );
};

export default ChatMessages;