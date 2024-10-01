import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";

const MembershipOptions = ({ onSelect }) => {
  const { language } = useLanguage();

  const memberships = {
    free: {
      name: {
        es: 'Versión Gratuita',
        en: 'Free Version',
        fr: 'Version Gratuite'
      },
      features: {
        es: [
          'Hasta 3 resúmenes, paráfrasis o traducciones por semana',
          'Máximo de 1 exportación por semana en formato PDF, TXT o DOCX',
          'Acceso limitado a documentos de hasta 5 páginas'
        ],
        en: [
          'Up to 3 summaries, paraphrases or translations per week',
          'Maximum of 1 export per week in PDF, TXT or DOCX format',
          'Limited access to documents up to 5 pages'
        ],
        fr: [
          'Jusqu'à 3 résumés, paraphrases ou traductions par semaine',
          'Maximum d'1 exportation par semaine au format PDF, TXT ou DOCX',
          'Accès limité aux documents jusqu'à 5 pages'
        ]
      },
      price: '0'
    },
    basic: {
      name: {
        es: 'Membresía Básica',
        en: 'Basic Membership',
        fr: 'Adhésion de Base'
      },
      features: {
        es: [
          'Hasta 10 resúmenes, paráfrasis y traducciones por mes',
          'Acceso a traducciones en 4 idiomas',
          'Síntesis de documentos de hasta 10 páginas',
          'Creación de mapas conceptuales con hasta 6 nodos',
          'Hasta 10 exportaciones de contenido en cualquier formato'
        ],
        en: [
          'Up to 10 summaries, paraphrases and translations per month',
          'Access to translations in 4 languages',
          'Synthesis of documents up to 10 pages',
          'Creation of concept maps with up to 6 nodes',
          'Up to 10 content exports in any format'
        ],
        fr: [
          'Jusqu'à 10 résumés, paraphrases et traductions par mois',
          'Accès aux traductions dans 4 langues',
          'Synthèse de documents jusqu'à 10 pages',
          'Création de cartes conceptuelles avec jusqu'à 6 nœuds',
          'Jusqu'à 10 exportations de contenu dans n'importe quel format'
        ]
      },
      price: '9.99'
    },
    premium: {
      name: {
        es: 'Membresía Premium',
        en: 'Premium Membership',
        fr: 'Adhésion Premium'
      },
      features: {
        es: [
          'Acceso ilimitado a todas las funciones sin restricciones',
          'Traducción a todos los idiomas disponibles',
          'Generación avanzada de mapas conceptuales sin límite de nodos',
          'Exportación de contenido en diferentes formatos (PDF, TXT, DOCX)'
        ],
        en: [
          'Unlimited access to all features without restrictions',
          'Translation to all available languages',
          'Advanced concept map generation without node limit',
          'Content export in different formats (PDF, TXT, DOCX)'
        ],
        fr: [
          'Accès illimité à toutes les fonctionnalités sans restrictions',
          'Traduction dans toutes les langues disponibles',
          'Génération avancée de cartes conceptuelles sans limite de nœuds',
          'Exportation de contenu dans différents formats (PDF, TXT, DOCX)'
        ]
      },
      price: '19.99'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(memberships).map(([key, membership]) => (
        <div key={key} className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-primary">{membership.name[language]}</h3>
          <ul className="mb-4">
            {membership.features[language].map((feature, index) => (
              <li key={index} className="mb-2 text-quaternary">• {feature}</li>
            ))}
          </ul>
          <p className="text-3xl font-bold mb-4 text-tertiary">
            {membership.price === '0' ? 
              (language === 'es' ? 'Gratis' : language === 'en' ? 'Free' : 'Gratuit') : 
              `$${membership.price}/` + (language === 'es' ? 'mes' : language === 'en' ? 'month' : 'mois')}
          </p>
          <Button 
            onClick={() => onSelect(key)} 
            className="w-full bg-tertiary hover:bg-quaternary text-white"
          >
            {language === 'es' ? 'Seleccionar' : language === 'en' ? 'Select' : 'Sélectionner'}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MembershipOptions;