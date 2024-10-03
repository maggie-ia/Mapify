import { useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

const useErrorHandler = () => {
    const { addNotification } = useNotification();
    const { language } = useLanguage();

    const translations = {
        es: {
            networkError: 'Error de red. Por favor, comprueba tu conexión.',
            serverError: 'Error del servidor. Por favor, inténtalo de nuevo más tarde.',
            unknownError: 'Ha ocurrido un error desconocido.'
        },
        en: {
            networkError: 'Network error. Please check your connection.',
            serverError: 'Server error. Please try again later.',
            unknownError: 'An unknown error has occurred.'
        },
        fr: {
            networkError: 'Erreur réseau. Veuillez vérifier votre connexion.',
            serverError: 'Erreur du serveur. Veuillez réessayer plus tard.',
            unknownError: 'Une erreur inconnue s\'est produite.'
        }
    };

    const handleError = useCallback((error) => {
        if (error.message === 'Network Error') {
            addNotification('error', translations[language].networkError);
        } else if (error.response && error.response.status >= 500) {
            addNotification('error', translations[language].serverError);
        } else {
            addNotification('error', error.message || translations[language].unknownError);
        }
    }, [language, addNotification]);

    return { handleError };
};

export default useErrorHandler;