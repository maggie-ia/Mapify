import React from 'react';
import { Button } from "./ui/button";
import { useLanguage } from '../contexts/LanguageContext';

const SuggestedQuestions = ({ questions, setInputMessage }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            suggestedQuestions: "Preguntas sugeridas"
        },
        en: {
            suggestedQuestions: "Suggested questions"
        },
        fr: {
            suggestedQuestions: "Questions suggérées"
        }
    };

    if (questions.length === 0) return null;

    return (
        <div className="mb-4">
            <p className="font-bold">{translations[language].suggestedQuestions}</p>
            {questions.map((question, index) => (
                <Button key={index} onClick={() => setInputMessage(question)} className="mr-2 mb-2">
                    {question}
                </Button>
            ))}
        </div>
    );
};

export default SuggestedQuestions;