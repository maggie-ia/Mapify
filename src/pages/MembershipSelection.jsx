import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import MembershipOptions from '../components/MembershipOptions';

const MembershipSelection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleMembershipSelect = (membershipType) => {
    // Aquí iría la lógica para actualizar la membresía del usuario
    console.log(`Selected membership: ${membershipType}`);
    // Después de actualizar, redirigimos al usuario a la página principal
    navigate('/');
  };

  const translations = {
    es: {
      title: 'Selecciona tu plan de membresía',
      subtitle: 'Elige el plan que mejor se adapte a tus necesidades'
    },
    en: {
      title: 'Select your membership plan',
      subtitle: 'Choose the plan that best suits your needs'
    },
    fr: {
      title: 'Sélectionnez votre plan d\'adhésion',
      subtitle: 'Choisissez le plan qui convient le mieux à vos besoins'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center text-primary">{translations[language].title}</h1>
      <p className="text-xl mb-8 text-center text-quaternary">{translations[language].subtitle}</p>
      <MembershipOptions onSelect={handleMembershipSelect} />
    </div>
  );
};

export default MembershipSelection;