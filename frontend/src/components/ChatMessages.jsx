import React from 'react';
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useLanguage } from '../contexts/LanguageContext';

const ChatMessages = ({ messages, handleProblemSolving, handleExplainProblem }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            problemSolving: "Resolver problema",
            explainProblem: "Explicar problema",
        },
        en: {
            problemSolving: "Solve problem",
            explainProblem: "Explain problem",
        },
        fr: {
            problemSolving: "Résoudre le problème",
            explainProblem: "Expliquer le problème",
        }
    };

    return (
        <ScrollArea className="h-80 mb-4">
            {messages.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded ${msg.sender === 'user' ? 'bg-tertiary text-white' : 'bg-secondary'}`}>
                    {msg.content}
                    {msg.sender === 'ai' && msg.problems && (
                        <div className="mt-2">
                            {msg.problems.map((problem, problemIndex) => (
                                <div key={problemIndex} className="mt-1">
                                    <Button onClick={() => handleProblemSolving(problem)} className="mr-2">
                                        {translations[language].problemSolving}
                                    </Button>
                                    <Button onClick={() => handleExplainProblem(problem)}>
                                        {translations[language].explainProblem}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </ScrollArea>
    );
};

export default ChatMessages;