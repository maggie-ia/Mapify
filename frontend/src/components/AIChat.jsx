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

    const handleProblemSolving = useCallback((problem) => {
        setOperation('problemSolving');
        setInputMessage(`Resuelve el siguiente problema: ${problem}`);
    }, []);

    const handleExplainProblem = useCallback((problem) => {
        setOperation('explainProblem');
        setInputMessage(`Explica el siguiente problema: ${problem}`);
    }, []);

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
                    <SelectItem value="problemSolving">{translations[language].problemSolving}</SelectItem>
                    <SelectItem value="explainProblem">{translations[language].explainProblem}</SelectItem>
                </SelectContent>
            </Select>
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
