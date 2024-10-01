import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import MembershipOptions from './MembershipOptions';

const MembershipSelection = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Selecciona tu plan',
        },
        en: {
            title: 'Select your plan',
        },
        fr: {
            title: 'Choisissez votre plan',
        }
    };

    const handleMembershipSelect = (membershipType) => {
        // Aquí iría la lógica para manejar la selección de membresía
        console.log(`Selected membership: ${membershipType}`);
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-8 text-center text-primary">{translations[language].title}</h1>
            <MembershipOptions onSelect={handleMembershipSelect} />
        </div>
    );
};

export default MembershipSelection;