import React, { useState, useEffect, useCallback } from 'react';
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
import ConversationCategories from './ConversationCategories';
import ChatPersonalization from './ChatPersonalization';
import TagManager from './TagManager';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';
import { logChatInteraction } from '../services/analyticsService';
import { validateInput, encryptSensitiveData, reportSuspiciousActivity } from '../services/securityService';

const AIChat = ({ documentId }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [operation, setOperation] = useState('chat');
    const [feedback, setFeedback] = useState(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [tags, setTags] = useState([]);
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
            summarize: "Resumir",
            paraphrase: "Parafrasear",
            synthesize: "Sintetizar",
            relevantPhrases: "Frases Relevantes",
            conceptMap: "Mapa Conceptual",
            translate: "Traducir",
            errorSending: "Error al enviar el mensaje",
            errorOperation: "Error al realizar la operación",
            feedbackPositive: "¿Fue útil esta respuesta?",
            feedbackNegative: "¿No fue útil esta respuesta?",
            suggestedQuestions: "Preguntas sugeridas:",
            usageLimitReached: "Has alcanzado el límite de uso del chat para este período.",
            saveConversation: "Guardar conversación",
            loadConversation: "Cargar conversación",
            addTag: "Añadir etiqueta",
            conversationSaved: "Conversación guardada exitosamente",
            conversationLoaded: "Conversación cargada exitosamente"
        },
        en: {
            placeholder: "Type your question here...",
            send: "Send",
            loading: "Loading...",
            error: "Error loading chat",
            notAvailable: "AI chat is only available for premium users.",
            selectOperation: "Select an operation",
            chat: "Chat",
            summarize: "Summarize",
            paraphrase: "Paraphrase",
            synthesize: "Synthesize",
            relevantPhrases: "Relevant Phrases",
            conceptMap: "Concept Map",
            translate: "Translate",
            errorSending: "Error sending message",
            errorOperation: "Error performing operation",
            feedbackPositive: "Was this response helpful?",
            feedbackNegative: "Was this response not helpful?",
            suggestedQuestions: "Suggested questions:",
            usageLimitReached: "You have reached your chat usage limit for this period.",
            saveConversation: "Save conversation",
            loadConversation: "Load conversation",
            addTag: "Add tag",
            conversationSaved: "Conversation saved successfully",
            conversationLoaded: "Conversation loaded successfully"
        },
        fr: {
            // ... (French translations omitted for brevity, but should be included in the actual implementation)
        }
    };

    const { data: chatData, isLoading, error, refetch } = useQuery({
        queryKey: ['chatConversation', documentId],
        queryFn: () => axios.get(`/api/chat/${documentId}`).then(res => res.data),
        enabled: user.membership_type === 'premium',
        retry: 3,
        onError: (error) => {
            console.error('Error fetching chat data:', error);
            toast.error(translations[language].error);
        }
    });

    useEffect(() => {
        if (chatData) {
            setMessages(chatData.messages);
            setTags(chatData.tags || []);
        }
    }, [chatData]);

    const sendMessageMutation = useMutation({
        mutationFn: (data) => axios.post(`/api/chat/${documentId}`, data),
        onSuccess: (data) => {
            setMessages(prevMessages => [...prevMessages, data.data.userMessage, data.data.aiResponse]);
            setInputMessage('');
            setSuggestedQuestions(data.data.suggestedQuestions || []);
            logChatInteraction(user.id, 'message_sent', { documentId, operation });
        },
        onError: (error) => {
            if (error.response && error.response.status === 403) {
                toast.error(translations[language].usageLimitReached);
            } else {
                toast.error(translations[language].errorSending);
            }
            console.error('Error sending message:', error);
            reportSuspiciousActivity(user.id, { action: 'message_send_error', error: error.message });
        }
    });

    const handleSendMessage = useCallback(debounce(() => {
        const sanitizedInput = validateInput(inputMessage.trim());
        if (sanitizedInput) {
            const encryptedMessage = encryptSensitiveData(sanitizedInput);
            sendMessageMutation.mutate({ 
                message: encryptedMessage, 
                operation,
                documentContext: chatData?.summary
            });
        } else {
            reportSuspiciousActivity(user.id, { action: 'invalid_input', input: inputMessage });
            toast.error('Invalid input detected. Please try again.');
        }
    }, 300), [inputMessage, operation, chatData, user.id]);

    const handleFeedback = useCallback((messageId, isPositive) => {
        setFeedback({ messageId, isPositive });
        axios.post('/api/chat/feedback', { messageId, isPositive })
            .then(() => {
                toast.success('Feedback sent successfully');
                logChatInteraction(user.id, 'feedback_sent', { messageId, isPositive });
            })
            .catch(() => toast.error('Error sending feedback'));
    }, [user.id]);

    const handleSaveConversation = useCallback(() => {
        axios.post('/api/chat/save', { documentId, messages, tags })
            .then(() => {
                toast.success(translations[language].conversationSaved);
                logChatInteraction(user.id, 'conversation_saved', { documentId });
            })
            .catch(() => toast.error('Error saving conversation'));
    }, [documentId, messages, tags, user.id, language]);

    const handleLoadConversation = useCallback(() => {
        axios.get(`/api/chat/load/${documentId}`)
            .then((response) => {
                setMessages(response.data.messages);
                setTags(response.data.tags);
                toast.success(translations[language].conversationLoaded);
                logChatInteraction(user.id, 'conversation_loaded', { documentId });
            })
            .catch(() => toast.error('Error loading conversation'));
    }, [documentId, user.id, language]);

    const handleAddTag = useCallback((newTag) => {
        setTags(prevTags => [...prevTags, newTag]);
        axios.post('/api/chat/tag', { documentId, tag: newTag })
            .then(() => {
                toast.success('Tag added successfully');
                logChatInteraction(user.id, 'tag_added', { documentId, tag: newTag });
            })
            .catch(() => toast.error('Error adding tag'));
    }, [documentId, user.id]);

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
            <ChatPersonalization />
            <Select onValueChange={setOperation} defaultValue={operation}>
                <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder={translations[language].selectOperation} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="chat">{translations[language].chat}</SelectItem>
                    <SelectItem value="summarize">{translations[language].summarize}</SelectItem>
                    <SelectItem value="paraphrase">{translations[language].paraphrase}</SelectItem>
                    <SelectItem value="synthesize">{translations[language].synthesize}</SelectItem>
                    <SelectItem value="relevantPhrases">{translations[language].relevantPhrases}</SelectItem>
                    <SelectItem value="conceptMap">{translations[language].conceptMap}</SelectItem>
                    <SelectItem value="translate">{translations[language].translate}</SelectItem>
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
            <div className="flex mb-4">
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
            <div className="flex justify-between mb-4">
                <Button onClick={handleSaveConversation}>
                    {translations[language].saveConversation}
                </Button>
                <Button onClick={handleLoadConversation}>
                    {translations[language].loadConversation}
                </Button>
            </div>
            <TagManager tags={tags} onAddTag={handleAddTag} />
            <ConversationCategories />
        </div>
    );
};

export default AIChat;