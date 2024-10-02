import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const processText = async (operation, text, additionalParams = {}) => {
    try {
        const response = await axios.post(`${API_URL}/process`, { operation, text, ...additionalParams });
        return response.data;
    } catch (error) {
        console.error(`Error processing text (${operation}):`, error);
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
    return processText('translate', text, { targetLanguage });
};

// Mantenemos la función original por compatibilidad
export const processTextOld = async (operation, text) => {
    console.warn('processTextOld is deprecated. Please use the specific functions instead.');
    return processText(operation, text);
};