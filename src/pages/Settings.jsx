import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import PlanUpgrade from '../components/PlanUpgrade';

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
    <View className="flex-1 p-6 bg-[#a7e3f4]">
      <Text className="text-4xl font-bold mb-6 text-center text-[#545454]">{translations[language].title}</Text>
      
      <View className="mb-6">
        <Text className="text-2xl font-semibold mb-2 text-[#3a7ca5]">{translations[language].language}</Text>
        <TouchableOpacity 
          className="bg-[#11ccf5] p-2 rounded mb-2"
          onPress={() => changeLanguage('es')}
        >
          <Text className="text-white text-center">Español</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-[#11ccf5] p-2 rounded mb-2"
          onPress={() => changeLanguage('en')}
        >
          <Text className="text-white text-center">English</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-[#11ccf5] p-2 rounded"
          onPress={() => changeLanguage('fr')}
        >
          <Text className="text-white text-center">Français</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text className="text-2xl font-semibold mb-2 text-[#3a7ca5]">{translations[language].membership}</Text>
        <PlanUpgrade />
      </View>
    </View>
  );
};

export default Settings;