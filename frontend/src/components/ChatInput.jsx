import React from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLanguage } from '../contexts/LanguageContext';

const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage, isLoading, grammarMode, toggleGrammarMode }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            placeholder: "Escribe tu mensaje aquí...",
            send: "Enviar",
            grammarMode: "Modo Gramática"
        },
        en: {
            placeholder: "Type your message here...",
            send: "Send",
            grammarMode: "Grammar Mode"
        },
        fr: {
            placeholder: "Écrivez votre message ici...",
            send: "Envoyer",
            grammarMode: "Mode Grammaire"
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={translations[language].placeholder}
                className="flex-grow"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
                {translations[language].send}
            </Button>
            <Button onClick={toggleGrammarMode} variant={grammarMode ? "secondary" : "outline"}>
                {translations[language].grammarMode}
            </Button>
        </div>
    );
};

export default ChatInput;