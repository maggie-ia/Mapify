import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import OperationSelector from './OperationSelector';
import SuggestedQuestions from './SuggestedQuestions';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';
import { logChatInteraction } from '../services/analyticsService';
import { validateInput, encryptSensitiveData, reportSuspiciousActivity } from '../services/securityService';

const AIChat = ({ documentId }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [operation, setOperation] = useState('chat');
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const { user } = useAuth();
    const { language } = useLanguage();

    const { data: chatData, isLoading, error, refetch } = useQuery({
        queryKey: ['chatConversation', documentId],
        queryFn: () => axios.get(`/api/chat/${documentId}`).then(res => res.data),
        enabled: user.membership_type === 'premium',
        retry: 3,
        onError: (error) => {
            console.error('Error fetching chat data:', error);
            toast.error('Error al cargar la conversación');
        }
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
            logChatInteraction(user.id, 'message_sent', { documentId, operation });
        },
        onError: (error) => {
            if (error.response && error.response.status === 403) {
                toast.error('Has alcanzado el límite de uso para tu membresía');
            } else {
                toast.error('Error al enviar el mensaje');
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
            toast.error('Entrada inválida detectada. Por favor, intenta de nuevo.');
        }
    }, 300), [inputMessage, operation, chatData, user.id]);

    if (user.membership_type !== 'premium') {
        return <p className="text-quaternary">El chat de IA solo está disponible para usuarios premium.</p>;
    }

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar el chat</p>;

    return (
        <div className="w-full max-w-md mx-auto mt-8 p-4 bg-quinary rounded-lg shadow-lg">
            <OperationSelector operation={operation} setOperation={setOperation} />
            <ChatMessages messages={messages} handleProblemSolving={handleProblemSolving} handleExplainProblem={handleExplainProblem} />
            <SuggestedQuestions questions={suggestedQuestions} setInputMessage={setInputMessage} />
            <ChatInput 
                inputMessage={inputMessage} 
                setInputMessage={setInputMessage} 
                handleSendMessage={handleSendMessage} 
                isLoading={sendMessageMutation.isLoading}
            />
        </div>
    );
};

export default AIChat;