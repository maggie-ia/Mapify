import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "../components/ui/button";

const Settings = () => {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  // Esto debería venir de un contexto de usuario o de una llamada a la API
  const currentMembership = 'free';

  const translations = {
    es: {
      title: 'Configuración',
      language: 'Idioma',
      membership: 'Membresía',
      currentPlan: 'Plan actual',
      upgradePlan: 'Actualizar plan',
      free: 'Gratuito',
      basic: 'Básico',
      premium: 'Premium'
    },
    en: {
      title: 'Settings',
      language: 'Language',
      membership: 'Membership',
      currentPlan: 'Current plan',
      upgradePlan: 'Upgrade plan',
      free: 'Free',
      basic: 'Basic',
      premium: 'Premium'
    },
    fr: {
      title: 'Paramètres',
      language: 'Langue',
      membership: 'Adhésion',
      currentPlan: 'Plan actuel',
      upgradePlan: 'Mettre à niveau',
      free: 'Gratuit',
      basic: 'De base',
      premium: 'Premium'
    }
  };

  const handleUpgrade = () => {
    navigate('/membership');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">{translations[language].title}</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-quaternary">{translations[language].language}</h2>
        <div className="flex space-x-4">
          <Button onClick={() => changeLanguage('es')} className="bg-tertiary text-white">Español</Button>
          <Button onClick={() => changeLanguage('en')} className="bg-tertiary text-white">English</Button>
          <Button onClick={() => changeLanguage('fr')} className="bg-tertiary text-white">Français</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-quaternary">{translations[language].membership}</h2>
        <p className="mb-4 text-primary">
          {translations[language].currentPlan}: {translations[language][currentMembership]}
        </p>
        <Button onClick={handleUpgrade} className="bg-tertiary text-white">
          {translations[language].upgradePlan}
        </Button>
      </div>
    </div>
  );
};

export default Settings;