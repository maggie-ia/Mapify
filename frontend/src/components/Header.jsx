import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { language } = useLanguage();

  const translations = {
    es: {
      home: 'Inicio',
      upload: 'Subir',
      results: 'Resultados',
      settings: 'Configuración'
    },
    en: {
      home: 'Home',
      upload: 'Upload',
      results: 'Results',
      settings: 'Settings'
    },
    fr: {
      home: 'Accueil',
      upload: 'Télécharger',
      results: 'Résultats',
      settings: 'Paramètres'
    }
  };

  return (
    <header className="bg-primary text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Mapify</Link>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-tertiary transition-colors">{translations[language].home}</Link></li>
          <li><Link to="/upload" className="hover:text-tertiary transition-colors">{translations[language].upload}</Link></li>
          <li><Link to="/results" className="hover:text-tertiary transition-colors">{translations[language].results}</Link></li>
          <li><Link to="/settings" className="hover:text-tertiary transition-colors">{translations[language].settings}</Link></li>
        </ul>
        <LanguageSelector />
      </nav>
    </header>
  );
};

export default Header;