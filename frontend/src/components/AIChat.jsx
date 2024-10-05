import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import OperationSelector from './OperationSelector';
import SuggestedQuestions from './SuggestedQuestions';
import TagManager from './TagManager';
import ProblemSolvingResults from './ProblemSolvingResults';
import { handleFeedback, checkGrammar, addTag } from '../utils/chatUtils';
import { toast } from 'react-hot-toast';

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

    useEffect(() => {
        if (chatData) {
            setMessages(chatData.messages);
            setTags(chatData.tags || []);
        }
    }, [chatData]);

    if (user.membership_type !== 'premium') {
        return <p>El chat de IA solo está disponible para usuarios premium.</p>;
    }

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar el chat</p>;

    return (
        <div className="w-full max-w-md mx-auto mt-8 p-4 bg-quinary rounded-lg shadow-lg">
            <OperationSelector operation={operation} setOperation={setOperation} />
            <ChatMessages 
                messages={messages} 
                handleFeedback={(messageId, isPositive) => handleFeedback(messageId, isPositive, setFeedback)}
                grammarMode={grammarMode}
            />
            <SuggestedQuestions questions={suggestedQuestions} setInputMessage={setInputMessage} />
            <ChatInput 
                inputMessage={inputMessage} 
                setInputMessage={setInputMessage} 
                handleSendMessage={handleSendMessage} 
                isLoading={sendMessageMutation.isLoading}
                grammarMode={grammarMode}
                toggleGrammarMode={() => setGrammarMode(!grammarMode)}
            />
            {operation === 'problemSolving' && (
                <ProblemSolvingResults results={messages[messages.length - 1]?.content} />
            )}
            <TagManager tags={tags} onAddTag={handleAddTag} />
        </div>
    );
};

export default AIChat;