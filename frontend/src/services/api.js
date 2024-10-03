import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    toast.error('Invalid input. Please check your data and try again.');
                    break;
                case 401:
                    toast.error('Authentication failed. Please log in again.');
                    // Redirect to login page or refresh token
                    break;
                case 403:
                    toast.error('You do not have permission to perform this action.');
                    break;
                case 404:
                    toast.error('The requested resource was not found.');
                    break;
                case 500:
                    toast.error('An unexpected error occurred. Please try again later.');
                    break;
                default:
                    toast.error('An error occurred. Please try again.');
            }
        } else if (error.request) {
            toast.error('No response received from the server. Please check your internet connection.');
        } else {
            toast.error('An unexpected error occurred. Please try again.');
        }
        return Promise.reject(error);
    }
);

export const processText = async (operation, text, targetLanguage = null) => {
    try {
        const response = await api.post('/process', { operation, text, targetLanguage });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkMembershipLimits = async (userId, operation) => {
    try {
        const response = await api.get(`/membership-limits/${userId}/${operation}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;