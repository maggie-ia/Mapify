import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ConceptMap = ({ conceptMapImage }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Mapa Conceptual',
            loading: 'Cargando mapa conceptual...',
            error: 'Error al cargar el mapa conceptual.'
        },
        en: {
            title: 'Concept Map',
            loading: 'Loading concept map...',
            error: 'Error loading concept map.'
        },
        fr: {
            title: 'Carte Conceptuelle',
            loading: 'Chargement de la carte conceptuelle...',
            error: 'Erreur lors du chargement de la carte conceptuelle.'
        }
    };

    if (!conceptMapImage) {
        return <div className="text-center text-quaternary">{translations[language].loading}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title}</h2>
            <img 
                src={`data:image/png;base64,${conceptMapImage}`} 
                alt="Concept Map" 
                className="mx-auto object-cover max-w-full h-auto"
            />
        </div>
    );
};

export default ConceptMap;