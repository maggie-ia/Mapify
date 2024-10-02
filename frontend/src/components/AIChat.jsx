import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

const AIChat = ({ documentId }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const { user } = useAuth();
    const { language } = useLanguage();

    const translations = {
        es: {
            placeholder: "Escribe tu pregunta aquí...",
            send: "Enviar",
            loading: "Cargando...",
            error: "Error al cargar el chat",
            notAvailable: "El chat con IA solo está disponible para usuarios premium."
        },
        en: {
            placeholder: "Type your question here...",
            send: "Send",
            loading: "Loading...",
            error: "Error loading chat",
            notAvailable: "AI chat is only available for premium users."
        },
        fr: {
            placeholder: "Écrivez votre question ici...",
            send: "Envoyer",
            loading: "Chargement...",
            error: "Erreur lors du chargement du chat",
            notAvailable: "Le chat IA n'est disponible que pour les utilisateurs premium."
        }
    };

    const { data: chatData, isLoading, error } = useQuery({
        queryKey: ['chatConversation', documentId],
        queryFn: () => axios.get(`/api/chat/${documentId}`).then(res => res.data),
        enabled: user.membership_type === 'premium'
    });

    useEffect(() => {
        if (chatData) {
            setMessages(chatData.messages);
        }
    }, [chatData]);

    const sendMessageMutation = useMutation({
        mutationFn: (message) => axios.post(`/api/chat/${documentId}`, { message }),
        onSuccess: (data) => {
            setMessages(prevMessages => [...prevMessages, data.userMessage, data.aiResponse]);
            setInputMessage('');
        },
    });

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            sendMessageMutation.mutate(inputMessage);
        }
    };

    if (user.membership_type !== 'premium') {
        return <p className="text-quaternary">{translations[language].notAvailable}</p>;
    }

    if (isLoading) return <p>{translations[language].loading}</p>;
    if (error) return <p>{translations[language].error}</p>;

    return (
        <div className="w-full max-w-md mx-auto mt-8 p-4 bg-quinary rounded-lg shadow-lg">
            <ScrollArea className="h-80 mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 rounded ${msg.sender === 'user' ? 'bg-tertiary text-white' : 'bg-secondary'}`}>
                        {msg.content}
                    </div>
                ))}
            </ScrollArea>
            <div className="flex">
                <Input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={translations[language].placeholder}
                    className="flex-grow mr-2"
                />
                <Button onClick={handleSendMessage} disabled={sendMessageMutation.isLoading}>
                    {translations[language].send}
                </Button>
            </div>
        </div>
    );
};

export default AIChat;