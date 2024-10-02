import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const processText = async (operation, text, targetLanguage = null) => {
    try {
        const response = await api.post('/process', { operation, text, targetLanguage });
        return response.data;
    } catch (error) {
        throw new Error(`Error processing text: ${error.response?.data?.message || error.message}`);
    }
};

export const checkMembershipLimits = async (userId, operation) => {
    try {
        const response = await api.get(`/membership-limits/${userId}/${operation}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error checking membership limits: ${error.response?.data?.message || error.message}`);
    }
};

export default api;