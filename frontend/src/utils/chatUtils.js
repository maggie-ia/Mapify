import { toast } from 'react-hot-toast';
import api from '../services/api';

export const handleFeedback = async (messageId, isPositive, setFeedback) => {
    try {
        const response = await api.post('/api/chat/feedback', {
            messageId,
            isPositive
        });

        if (response.status === 200) {
            setFeedback({ messageId, isPositive });
            toast.success('Feedback enviado con éxito');
        } else {
            throw new Error('Error al enviar el feedback');
        }
    } catch (error) {
        console.error('Error al enviar feedback:', error);
        toast.error('No se pudo enviar el feedback. Por favor, intenta de nuevo.');
    }
};

export const addTag = async (documentId, newTag) => {
    try {
        const response = await api.post(`/api/chat/${documentId}/tag`, {
            tag: newTag
        });

        if (response.status === 200) {
            toast.success('Etiqueta añadida con éxito');
            return response.data;
        } else {
            throw new Error('Error al añadir la etiqueta');
        }
    } catch (error) {
        console.error('Error al añadir etiqueta:', error);
        toast.error('No se pudo añadir la etiqueta. Por favor, intenta de nuevo.');
        throw error;
    }
};

export const checkGrammar = async (text) => {
    try {
        const response = await api.post('/api/check-grammar', { text });
        return response.data;
    } catch (error) {
        console.error('Error al verificar la gramática:', error);
        toast.error('No se pudo verificar la gramática. Por favor, intenta de nuevo.');
        throw error;
    }
};