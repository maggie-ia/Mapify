import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const MembershipOptions = ({ onSelect }) => {
  const { language } = useLanguage();
  const [membershipPrices, setMembershipPrices] = useState({});

  const { data: membershipData, isLoading } = useQuery({
    queryKey: ['membershipPrices'],
    queryFn: async () => {
      const response = await axios.get('/api/membership-prices');
      return response.data;
    },
  });

  useEffect(() => {
    if (membershipData) {
      setMembershipPrices(membershipData);
    }
  }, [membershipData]);

  const translations = {
    es: {
      title: 'Selecciona tu plan',
      free: {
        name: 'Versión Gratuita',
        features: [
          'Hasta 3 resúmenes, paráfrasis o traducciones por semana',
          'Máximo de 1 exportación por semana en formato PDF, TXT o DOCX',
          'Acceso limitado a documentos de hasta 5 páginas'
        ]
      },
      basic: {
        name: 'Membresía Básica',
        features: [
          'Hasta 10 resúmenes, paráfrasis y traducciones por mes',
          'Acceso a traducciones en 4 idiomas',
          'Síntesis de documentos de hasta 10 páginas',
          'Creación de mapas conceptuales con hasta 6 nodos',
          'Hasta 10 exportaciones de contenido en cualquier formato'
        ]
      },
      premium: {
        name: 'Membresía Premium',
        features: [
          'Acceso ilimitado a todas las funciones sin restricciones',
          'Traducción a todos los idiomas disponibles',
          'Generación avanzada de mapas conceptuales sin límite de nodos',
          'Exportación de contenido en diferentes formatos (PDF, TXT, DOCX)'
        ]
      },
      selectButton: 'Seleccionar',
      freeLabel: 'Gratis',
      perMonth: '/mes'
    },
    en: {
      title: 'Select your plan',
      free: {
        name: 'Free Version',
        features: [
          'Up to 3 summaries, paraphrases or translations per week',
          'Maximum of 1 export per week in PDF, TXT or DOCX format',
          'Limited access to documents up to 5 pages'
        ]
      },
      basic: {
        name: 'Basic Membership',
        features: [
          'Up to 10 summaries, paraphrases and translations per month',
          'Access to translations in 4 languages',
          'Synthesis of documents up to 10 pages',
          'Creation of concept maps with up to 6 nodes',
          'Up to 10 content exports in any format'
        ]
      },
      premium: {
        name: 'Premium Membership',
        features: [
          'Unlimited access to all features without restrictions',
          'Translation to all available languages',
          'Advanced concept map generation without node limit',
          'Content export in different formats (PDF, TXT, DOCX)'
        ]
      },
      selectButton: 'Select',
      freeLabel: 'Free',
      perMonth: '/month'
    },
    fr: {
      title: 'Choisissez votre plan',
      free: {
        name: 'Version Gratuite',
        features: [
          'Jusque à 3 résumés, paraphrases ou traductions par semaine',
          'Maximum de 1 exportation par semaine au format PDF, TXT ou DOCX',
          'Accès limité aux documents jusque à 5 pages'
        ]
      },
      basic: {
        name: 'Adhésion de Base',
        features: [
          'Jusque à 10 résumés, paraphrases et traductions par mois',
          'Accès aux traductions dans 4 langues',
          'Synthèse de documents jusque à 10 pages',
          'Création de cartes conceptuelles avec jusque à 6 nœuds',
          'Jusque à 10 exportations de contenu dans n importe quel format'
        ]
      },
      premium: {
        name: 'Adhésion Premium',
        features: [
          'Accès illimité à toutes les fonctionnalités sans restrictions',
          'Traduction dans toutes les langues disponibles',
          'Génération avancée de cartes conceptuelles sans limite de nœuds',
          'Exportation de contenu dans différents formats (PDF, TXT, DOCX)'
        ]
      },
      selectButton: 'Sélectionner',
      freeLabel: 'Gratuit',
      perMonth: '/mois'
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(translations[language]).map(([key, membership]) => {
        if (key !== 'title' && key !== 'selectButton' && key !== 'freeLabel' && key !== 'perMonth') {
          return (
            <div key={key} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">{membership.name}</h3>
              <ul className="mb-4">
                {membership.features.map((feature, index) => (
                  <li key={index} className="mb-2 text-quaternary">• {feature}</li>
                ))}
              </ul>
              <p className="text-3xl font-bold mb-4 text-tertiary">
                {key === 'free' ? 
                  translations[language].freeLabel : 
                  `${formatPrice(membershipPrices[key] || 0)}${translations[language].perMonth}`}
              </p>
              <Button 
                onClick={() => onSelect(key)} 
                className="w-full bg-tertiary hover:bg-quaternary text-white"
              >
                {translations[language].selectButton}
              </Button>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default MembershipOptions;