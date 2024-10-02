import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ProgressiveLoading = ({ progress }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            loading: 'Cargando',
            complete: 'Completo'
        },
        en: {
            loading: 'Loading',
            complete: 'Complete'
        },
        fr: {
            loading: 'Chargement',
            complete: 'Terminé'
        }
    };

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
            <div 
                className="bg-tertiary h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
            ></div>
            <p className="mt-2 text-sm text-quaternary">
                {progress < 100 
                    ? `${translations[language].loading}: ${progress}%`
                    : translations[language].complete
                }
            </p>
        </div>
    );
};

export default ProgressiveLoading;