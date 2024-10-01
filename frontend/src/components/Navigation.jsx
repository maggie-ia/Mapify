import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Navigation = () => {
    const { language, setLanguage } = useLanguage();

    const translations = {
        es: {
            home: 'Inicio',
            membership: 'Membresía',
            settings: 'Configuración',
            language: 'Idioma'
        },
        en: {
            home: 'Home',
            membership: 'Membership',
            settings: 'Settings',
            language: 'Language'
        },
        fr: {
            home: 'Accueil',
            membership: 'Adhésion',
            settings: 'Paramètres',
            language: 'Langue'
        }
    };

    return (
        <nav className="bg-primary p-4">
            <ul className="flex justify-between items-center">
                <li>
                    <Link to="/" className="text-secondary hover:text-tertiary">
                        {translations[language].home}
                    </Link>
                </li>
                <li>
                    <Link to="/membership" className="text-secondary hover:text-tertiary">
                        {translations[language].membership}
                    </Link>
                </li>
                <li>
                    <Link to="/settings" className="text-secondary hover:text-tertiary">
                        {translations[language].settings}
                    </Link>
                </li>
                <li>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-primary text-secondary"
                    >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                    </select>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;