import React from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from '../contexts/LanguageContext';

const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage, isLoading }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            placeholder: 'Escribe tu mensaje aquí...',
            send: 'Enviar'
        },
        en: {
            placeholder: 'Type your message here...',
            send: 'Send'
        },
        fr: {
            placeholder: 'Écrivez votre message ici...',
            send: 'Envoyer'
        }
    };

    return (
        <div className="flex mb-4">
            <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={translations[language].placeholder}
                className="flex-grow mr-2"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
                {translations[language].send}
            </Button>
        </div>
    );
};

export default ChatInput;