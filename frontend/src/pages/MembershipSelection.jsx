import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";

const MembershipSelection = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Selecciona tu plan',
            free: {
                title: 'Gratuito',
                description: 'Para usuarios ocasionales',
                features: ['3 operaciones por semana', '1 exportación por semana', 'Documentos de hasta 5 páginas']
            },
            basic: {
                title: 'Básico',
                description: 'Para usuarios regulares',
                features: ['10 operaciones por mes', 'Traducción a 4 idiomas', 'Documentos de hasta 10 páginas', 'Mapas conceptuales de 6 nodos']
            },
            premium: {
                title: 'Premium',
                description: 'Para usuarios avanzados',
                features: ['Operaciones ilimitadas', 'Todos los idiomas disponibles', 'Sin límite de páginas', 'Mapas conceptuales avanzados']
            },
            selectButton: 'Seleccionar'
        },
        en: {
            title: 'Select your plan',
            free: {
                title: 'Free',
                description: 'For occasional users',
                features: ['3 operations per week', '1 export per week', 'Documents up to 5 pages']
            },
            basic: {
                title: 'Basic',
                description: 'For regular users',
                features: ['10 operations per month', 'Translation to 4 languages', 'Documents up to 10 pages', 'Concept maps with 6 nodes']
            },
            premium: {
                title: 'Premium',
                description: 'For advanced users',
                features: ['Unlimited operations', 'All available languages', 'No page limit', 'Advanced concept maps']
            },
            selectButton: 'Select'
        },
        fr: {
            title: 'Choisissez votre plan',
            free: {
                title: 'Gratuit',
                description: 'Pour les utilisateurs occasionnels',
                features: ['3 opérations par semaine', '1 exportation par semaine', 'Documents jusqu\'à 5 pages']
            },
            basic: {
                title: 'Basique',
                description: 'Pour les utilisateurs réguliers',
                features: ['10 opérations par mois', 'Traduction vers 4 langues', 'Documents jusqu\'à 10 pages', 'Cartes conceptuelles de 6 nœuds']
            },
            premium: {
                title: 'Premium',
                description: 'Pour les utilisateurs avancés',
                features: ['Opérations illimitées', 'Toutes les langues disponibles', 'Sans limite de pages', 'Cartes conceptuelles avancées']
            },
            selectButton: 'Sélectionner'
        }
    };

    const renderMembershipCard = (type) => (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{translations[language][type].title}</CardTitle>
                <CardDescription>{translations[language][type].description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside">
                    {translations[language][type].features.map((feature, index) => (
                        <li key={index} className="text-quaternary">{feature}</li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-tertiary text-white hover:bg-quaternary transition-colors">
                    {translations[language].selectButton}
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-8 text-center text-primary">{translations[language].title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {renderMembershipCard('free')}
                {renderMembershipCard('basic')}
                {renderMembershipCard('premium')}
            </div>
        </div>
    );
};

export default MembershipSelection;