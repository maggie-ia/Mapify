import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Settings = () => {
  const { language, changeLanguage } = useLanguage();

  const translations = {
    es: {
      title: 'Configuración',
      language: 'Idioma',
      spanish: 'Español',
      english: 'Inglés',
      french: 'Francés'
    },
    en: {
      title: 'Settings',
      language: 'Language',
      spanish: 'Spanish',
      english: 'English',
      french: 'French'
    },
    fr: {
      title: 'Paramètres',
      language: 'Langue',
      spanish: 'Espagnol',
      english: 'Anglais',
      french: 'Français'
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{translations[language].title}</h1>
      <div className="bg-quinary p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{translations[language].language}</h2>
        <div className="space-y-2">
          {['es', 'en', 'fr'].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                language === lang ? 'bg-tertiary text-white' : 'bg-white text-primary hover:bg-tertiary hover:text-white'
              } transition-colors`}
            >
              {translations[language][lang === 'es' ? 'spanish' : lang === 'en' ? 'english' : 'french']}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;