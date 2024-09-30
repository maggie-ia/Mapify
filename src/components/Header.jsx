import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { language } = useLanguage();

  const translations = {
    es: {
      home: 'Inicio',
      settings: 'Configuración',
    },
    en: {
      home: 'Home',
      settings: 'Settings',
    },
    fr: {
      home: 'Accueil',
      settings: 'Paramètres',
    },
  };

  return (
    <header className="bg-[#545454] text-white p-4">
      <nav className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Mapify</Link>
        <div>
          <Link to="/" className="mr-4">{translations[language].home}</Link>
          <Link to="/settings">{translations[language].settings}</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;