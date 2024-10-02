import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';

const FileSizeLimitInfo = () => {
    const { language } = useLanguage();
    const { user } = useAuth();

    const translations = {
        es: {
            fileSizeLimit: 'Límite de tamaño de archivo:',
            free: 'Gratuito',
            basic: 'Básico',
            premium: 'Premium',
        },
        en: {
            fileSizeLimit: 'File size limit:',
            free: 'Free',
            basic: 'Basic',
            premium: 'Premium',
        },
        fr: {
            fileSizeLimit: 'Limite de taille de fichier :',
            free: 'Gratuit',
            basic: 'Basique',
            premium: 'Premium',
        }
    };

    const getFileSizeLimit = (membershipType) => {
        switch (membershipType) {
            case 'premium':
                return '50 MB';
            case 'basic':
            case 'free':
            default:
                return '16 MB';
        }
    };

    return (
        <div className="mt-4 text-sm text-quaternary">
            <p>{translations[language].fileSizeLimit} {getFileSizeLimit(user.membership_type)}</p>
            <p>({translations[language][user.membership_type]} {translations[language].membership})</p>
        </div>
    );
};

export default FileSizeLimitInfo;