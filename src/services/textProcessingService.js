import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Asumiendo que este es el endpoint de nuestro backend

export const summarizeText = async (text) => {
    try {
        const response = await axios.post(`${API_URL}/summarize`, { text });
        return response.data.summary;
    } catch (error) {
        console.error('Error summarizing text:', error);
        throw error;
    }
};

export const paraphraseText = async (text) => {
    try {
        const response = await axios.post(`${API_URL}/paraphrase`, { text });
        return response.data.paraphrase;
    } catch (error) {
        console.error('Error paraphrasing text:', error);
        throw error;
    }
};

export const synthesizeText = async (text) => {
    try {
        const response = await axios.post(`${API_URL}/synthesize`, { text });
        return response.data.synthesis;
    } catch (error) {
        console.error('Error synthesizing text:', error);
        throw error;
    }
};

export const createConceptMap = async (text) => {
    try {
        const response = await axios.post(`${API_URL}/concept-map`, { text });
        return response.data.conceptMap;
    } catch (error) {
        console.error('Error creating concept map:', error);
        throw error;
    }
};

export const translateText = async (text, targetLanguage) => {
    try {
        const response = await axios.post(`${API_URL}/translate`, { text, targetLanguage });
        return response.data.translation;
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    }
};