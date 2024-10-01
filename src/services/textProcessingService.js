import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Asumiendo que este es el endpoint de nuestro backend

export const processText = async (operation, text) => {
    try {
        const response = await axios.post(`${API_URL}/process`, { operation, text });
        return response.data;
    } catch (error) {
        console.error('Error processing text:', error);
        throw error;
    }
};

export const summarizeText = async (text) => {
    return processText('summarize', text);
};

export const paraphraseText = async (text) => {
    return processText('paraphrase', text);
};

export const synthesizeText = async (text) => {
    return processText('synthesize', text);
};

export const createConceptMap = async (text) => {
    return processText('conceptMap', text);
};

export const extractRelevantPhrases = async (text) => {
    return processText('relevantPhrases', text);
};

export const translateText = async (text, targetLanguage) => {
    return processText('translate', text, targetLanguage);
};