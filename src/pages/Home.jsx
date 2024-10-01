import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import FileUpload from '../components/FileUpload';

const Home = () => {
  const { language } = useLanguage();

  const translations = {
    es: {
      welcome: 'Bienvenido a Mapify',
      description: 'Procesa tus documentos de manera inteligente'
    },
    en: {
      welcome: 'Welcome to Mapify',
      description: 'Process your documents intelligently'
    },
    fr: {
      welcome: 'Bienvenue sur Mapify',
      description: 'Traitez vos documents intelligemment'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center text-primary">{translations[language].welcome}</h1>
      <p className="text-xl mb-8 text-center text-quaternary">{translations[language].description}</p>
      <FileUpload />
    </div>
  );
};

export default Home;