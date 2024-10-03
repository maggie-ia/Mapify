import { toast } from 'react-hot-toast';

export const handleFeedback = (messageId, isPositive, setFeedback) => {
    setFeedback({ messageId, isPositive });
    // Aquí iría la lógica para enviar el feedback al backend
    toast.success('Feedback enviado con éxito');
};

export const checkGrammar = async (text) => {
    // Simulación de una llamada a la API para verificar la gramática
    const response = await fetch('/api/check-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    return await response.json();
};

export const addTag = async (documentId, newTag) => {
    // Simulación de una llamada a la API para añadir una etiqueta
    const response = await fetch(`/api/chat/${documentId}/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: newTag })
    });
    return await response.json();
};