import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getErrorMessage = (error, language) => {
    const translations = {
        es: {
            networkError: 'Error de conexión. Por favor, verifica tu conexión a internet.',
            serverError: 'Error del servidor. Por favor, intenta más tarde.',
            authError: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
            notFound: 'Recurso no encontrado.',
            default: 'Ha ocurrido un error inesperado.'
        },
        en: {
            networkError: 'Network error. Please check your internet connection.',
            serverError: 'Server error. Please try again later.',
            authError: 'Authentication error. Please log in again.',
            notFound: 'Resource not found.',
            default: 'An unexpected error has occurred.'
        },
        fr: {
            networkError: 'Erreur de réseau. Veuillez vérifier votre connexion internet.',
            serverError: 'Erreur du serveur. Veuillez réessayer plus tard.',
            authError: 'Erreur d\'authentification. Veuillez vous reconnecter.',
            notFound: 'Ressource non trouvée.',
            default: 'Une erreur inattendue s\'est produite.'
        }
    };

    if (error.response) {
        switch (error.response.status) {
            case 400:
                return error.response.data.message || translations[language].default;
            case 401:
                return translations[language].authError;
            case 404:
                return translations[language].notFound;
            case 500:
                return translations[language].serverError;
            default:
                return translations[language].default;
        }
    } else if (error.request) {
        return translations[language].networkError;
    }
    return translations[language].default;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { language } = useLanguage();
        const errorMessage = getErrorMessage(error, language);
        toast.error(errorMessage);
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