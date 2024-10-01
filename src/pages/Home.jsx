import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { language } = useLanguage();

  const translations = {
    es: {
      welcome: 'Bienvenido a Mapify',
      description: 'Procesa tus documentos de manera inteligente',
      startButton: 'Comenzar'
    },
    en: {
      welcome: 'Welcome to Mapify',
      description: 'Process your documents intelligently',
      startButton: 'Get Started'
    },
    fr: {
      welcome: 'Bienvenue sur Mapify',
      description: 'Traitez vos documents intelligemment',
      startButton: 'Commencer'
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">{translations[language].welcome}</h1>
      <p className="text-xl mb-8">{translations[language].description}</p>
      <Link to="/upload" className="bg-tertiary text-white px-6 py-2 rounded-lg hover:bg-quaternary transition-colors">
        {translations[language].startButton}
      </Link>
    </div>
  );
};

export default Home;