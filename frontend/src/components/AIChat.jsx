import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { handleFeedback, checkGrammar, addTag } from '../utils/chatUtils';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import OperationSelector from './OperationSelector';
import SuggestedQuestions from './SuggestedQuestions';
import TagManager from './TagManager';

const AIChat = ({ documentId }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [operation, setOperation] = useState('chat');
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [grammarMode, setGrammarMode] = useState(false);
    const { user } = useAuth();
    const { language } = useLanguage();

    const { data: chatData, isLoading, error, refetch } = useQuery({
        queryKey: ['chatConversation', documentId],
        queryFn: () => fetch(`/api/chat/${documentId}`).then(res => res.json()),
        enabled: user.membership_type === 'premium',
    });

    const sendMessageMutation = useMutation({
        mutationFn: (data) => fetch(`/api/chat/${documentId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        onSuccess: (data) => {
            setMessages(prevMessages => [...prevMessages, data.userMessage, data.aiResponse]);
            setInputMessage('');
            setSuggestedQuestions(data.suggestedQuestions || []);
        },
    });

    const handleSendMessage = async () => {
        if (inputMessage.trim()) {
            let messageToSend = inputMessage;
            if (grammarMode) {
                const grammarCheck = await checkGrammar(inputMessage);
                if (grammarCheck.corrections.length > 0) {
                    messageToSend = grammarCheck.correctedText;
                }
            }
            sendMessageMutation.mutate({ message: messageToSend, operation });
        }
    };

    const handleAddTag = async (newTag) => {
        try {
            const result = await addTag(documentId, newTag);
            setTags(prevTags => [...prevTags, newTag]);
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

<<<<<<< HEAD
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
                documentContext: chatData?.summary,
                grammarMode
            });
        } else {
            reportSuspiciousActivity(user.id, { action: 'invalid_input', input: inputMessage });
            toast.error('Entrada inválida detectada. Por favor, intenta de nuevo.');
        }
    }, 300), [inputMessage, operation, chatData, user.id, grammarMode]);

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

=======
>>>>>>> 2423003869e18c5a13aa22752dad3363e3b007bb
    useEffect(() => {
        if (chatData) {
            setMessages(chatData.messages);
            setTags(chatData.tags || []);
        }
    }, [chatData]);

<<<<<<< HEAD
    const toggleGrammarMode = () => {
        setGrammarMode(!grammarMode);
        toast.success(`Grammar mode ${grammarMode ? 'disabled' : 'enabled'}`);
    };

=======
>>>>>>> 2423003869e18c5a13aa22752dad3363e3b007bb
    if (user.membership_type !== 'premium') {
        return <p>El chat de IA solo está disponible para usuarios premium.</p>;
    }

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar el chat</p>;

    return (
        <div className="w-full max-w-md mx-auto mt-8 p-4 bg-quinary rounded-lg shadow-lg">
<<<<<<< HEAD
             <OperationSelector operation={operation} setOperation={setOperation} />
            <ChatMessages 
                messages={messages} 
                handleFeedback={handleFeedback}
=======
            <OperationSelector operation={operation} setOperation={setOperation} />
            <ChatMessages 
                messages={messages} 
                handleFeedback={(messageId, isPositive) => handleFeedback(messageId, isPositive, setFeedback)}
>>>>>>> 2423003869e18c5a13aa22752dad3363e3b007bb
                grammarMode={grammarMode}
            />
            <SuggestedQuestions questions={suggestedQuestions} setInputMessage={setInputMessage} />
            <ChatInput 
                inputMessage={inputMessage} 
                setInputMessage={setInputMessage} 
                handleSendMessage={handleSendMessage} 
                isLoading={sendMessageMutation.isLoading}
                grammarMode={grammarMode}
<<<<<<< HEAD
                toggleGrammarMode={toggleGrammarMode}
            />
            {operation === 'problemSolving' && (
                <ProblemSolvingResults results={messages[messages.length - 1]?.content} />
            )}
            <ChatPersonalization />
            <TagManager tags={tags} onAddTag={handleAddTag} />
            <div className="flex justify-between mt-4">
                <Button onClick={handleSaveConversation}>
                    {translations[language].saveConversation}
                </Button>
                <Button onClick={handleLoadConversation}>
                    {translations[language].loadConversation}
                </Button>
            </div>
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
=======
                toggleGrammarMode={() => setGrammarMode(!grammarMode)}
            />
>>>>>>> 2423003869e18c5a13aa22752dad3363e3b007bb
            <TagManager tags={tags} onAddTag={handleAddTag} />
        </div>
    );
};

export default AIChat;