import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import RelevantPhrases from './RelevantPhrases';
import ConceptMap from './ConceptMap';
import SaveShareConversation from './SaveShareConversation';
import ConversationCategories from './ConversationCategories';
import { toast } from 'react-hot-toast';

const AIChat = ({ documentId }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [operation, setOperation] = useState('chat');
    const [feedback, setFeedback] = useState(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const { user } = useAuth();
    const { language } = useLanguage();

    const translations = {
        es: {
            placeholder: "Escribe tu pregunta aquí...",
            send: "Enviar",
            loading: "Cargando...",
            error: "Error al cargar el chat",
            notAvailable: "El chat con IA solo está disponible para usuarios premium.",
            selectOperation: "Selecciona una operación",
            chat: "Chat",
            relevantPhrases: "Frases Relevantes",
            conceptMap: "Mapa Conceptual",
            askDocument: "Preguntar sobre el documento",
            errorSending: "Error al enviar el mensaje",
            errorOperation: "Error al realizar la operación",
            feedbackPositive: "¿Fue útil esta respuesta?",
            feedbackNegative: "¿No fue útil esta respuesta?",
            suggestedQuestions: "Preguntas sugeridas:"
        },
        en: {
            placeholder: "Type your question here...",
            send: "Send",
            loading: "Loading...",
            error: "Error loading chat",
            notAvailable: "AI chat is only available for premium users.",
            selectOperation: "Select an operation",
            chat: "Chat",
            relevantPhrases: "Relevant Phrases",
            conceptMap: "Concept Map",
            askDocument: "Ask about the document",
            errorSending: "Error sending message",
            errorOperation: "Error performing operation",
            feedbackPositive: "Was this response helpful?",
            feedbackNegative: "Was this response not helpful?",
            suggestedQuestions: "Suggested questions:"
        },
        fr: {
            placeholder: "Écrivez votre question ici...",
            send: "Envoyer",
            loading: "Chargement...",
            error: "Erreur lors du chargement du chat",
            notAvailable: "Le chat IA n'est disponible que pour les utilisateurs premium.",
            selectOperation: "Sélectionnez une opération",
            chat: "Chat",
            relevantPhrases: "Phrases Pertinentes",
            conceptMap: "Carte Conceptuelle",
            askDocument: "Poser une question sur le document",
            errorSending: "Erreur lors de l'envoi du message",
            errorOperation: "Erreur lors de l'exécution de l'opération",
            feedbackPositive: "Cette réponse était-elle utile ?",
            feedbackNegative: "Cette réponse n'était-elle pas utile ?",
            suggestedQuestions: "Questions suggérées :"
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
        mutationFn: (data) => axios.post(`/api/chat/${documentId}`, data),
        onSuccess: (data) => {
            setMessages(prevMessages => [...prevMessages, data.data.userMessage, data.data.aiResponse]);
            setInputMessage('');
            setSuggestedQuestions(data.data.suggestedQuestions || []);
        },
        onError: (error) => {
            toast.error(translations[language].errorSending);
            console.error('Error sending message:', error);
        }
    });

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            sendMessageMutation.mutate({ message: inputMessage, operation });
        }
    };

    const handleFeedback = (messageId, isPositive) => {
        // Implement feedback logic here
        setFeedback({ messageId, isPositive });
        // You might want to send this feedback to the server
    };

    if (user.membership_type !== 'premium') {
        return <p className="text-quaternary">{translations[language].notAvailable}</p>;
    }

    if (isLoading) return <p>{translations[language].loading}</p>;
    if (error) {
        console.error('Error loading chat:', error);
        return <p>{translations[language].error}</p>;
    }

    return (
        <div className="w-full max-w-md mx-auto mt-8 p-4 bg-quinary rounded-lg shadow-lg">
            <Select onValueChange={setOperation} defaultValue={operation}>
                <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder={translations[language].selectOperation} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="chat">{translations[language].chat}</SelectItem>
                    <SelectItem value="relevantPhrases">{translations[language].relevantPhrases}</SelectItem>
                    <SelectItem value="conceptMap">{translations[language].conceptMap}</SelectItem>
                    <SelectItem value="askDocument">{translations[language].askDocument}</SelectItem>
                </SelectContent>
            </Select>
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
                    </div>
                ))}
                {messages.length > 0 && messages[messages.length - 1].operation === 'relevantPhrases' && (
                    <RelevantPhrases phrases={messages[messages.length - 1].content} />
                )}
                {messages.length > 0 && messages[messages.length - 1].operation === 'conceptMap' && (
                    <ConceptMap conceptMapImage={messages[messages.length - 1].content} />
                )}
            </ScrollArea>
            {suggestedQuestions.length > 0 && (
                <div className="mb-4">
                    <p className="font-bold">{translations[language].suggestedQuestions}</p>
                    {suggestedQuestions.map((question, index) => (
                        <Button key={index} onClick={() => setInputMessage(question)} className="mr-2 mb-2">
                            {question}
                        </Button>
                    ))}
                </div>
            )}
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
            <SaveShareConversation messages={messages} />
            <ConversationCategories />
        </div>
    );
};

export default AIChat;