import axios from 'axios';

const API_URL = '/api/analytics';

export const logChatInteraction = async (userId, action, details) => {
    try {
        await axios.post(`${API_URL}/log`, { userId, action, details });
    } catch (error) {
        console.error('Error logging chat interaction:', error);
    }
};

export const getChatMetrics = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/metrics/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat metrics:', error);
        throw error;
    }
};