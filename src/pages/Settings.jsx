import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Settings = () => {
  const { language, changeLanguage } = useLanguage();

  const translations = {
    es: {
      title: 'Configuración',
      language: 'Idioma',
      membership: 'Membresía',
      currentPlan: 'Plan actual',
      upgradePlan: 'Actualizar plan',
    },
    en: {
      title: 'Settings',
      language: 'Language',
      membership: 'Membership',
      currentPlan: 'Current plan',
      upgradePlan: 'Upgrade plan',
    },
    fr: {
      title: 'Paramètres',
      language: 'Langue',
      membership: 'Adhésion',
      currentPlan: 'Plan actuel',
      upgradePlan: 'Mettre à niveau',
    },
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-[#a7e3f4] rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#545454]">{translations[language].title}</h1>
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-[#3a7ca5]">{translations[language].language}</h2>
        <select 
          value={language} 
          onChange={(e) => changeLanguage(e.target.value)}
          className="w-full p-2 rounded border border-[#3a7ca5]"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2 text-[#3a7ca5]">{translations[language].membership}</h2>
        <p className="mb-2">{translations[language].currentPlan}: Free</p>
        <button className="bg-[#11ccf5] text-white px-4 py-2 rounded hover:bg-[#3a7ca5] transition-colors duration-300">
          {translations[language].upgradePlan}
        </button>
      </div>
    </div>
  );
};

export default Settings;