import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const TrialExpirationManager = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Gestión del Período de Prueba',
            daysLeft: 'Días restantes',
            upgrade: 'Actualizar a membresía paga',
            expired: 'Su período de prueba ha expirado',
            loading: 'Cargando...',
            error: 'Error al cargar la información del período de prueba'
        },
        en: {
            title: 'Trial Period Management',
            daysLeft: 'Days left',
            upgrade: 'Upgrade to paid membership',
            expired: 'Your trial period has expired',
            loading: 'Loading...',
            error: 'Error loading trial information'
        },
        fr: {
            title: 'Gestion de la Période d\'Essai',
            daysLeft: 'Jours restants',
            upgrade: 'Passer à l\'adhésion payante',
            expired: 'Votre période d\'essai a expiré',
            loading: 'Chargement...',
            error: 'Erreur lors du chargement des informations d\'essai'
        }
    };

    const { data: trialInfo, isLoading, error } = useQuery({
        queryKey: ['trialInfo'],
        queryFn: async () => {
            const response = await axios.get('/api/membership-info');
            return response.data;
        },
    });

    if (isLoading) return <div>{translations[language].loading}</div>;
    if (error) return <div>{translations[language].error}: {error.message}</div>;

    const daysLeft = trialInfo.is_trial ? 
        Math.max(0, Math.ceil((new Date(trialInfo.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24))) : 
        0;

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>{translations[language].title}</CardTitle>
            </CardHeader>
            <CardContent>
                {trialInfo.is_trial ? (
                    <>
                        <p>{translations[language].daysLeft}: {daysLeft}</p>
                        <Button className="mt-4">
                            {translations[language].upgrade}
                        </Button>
                    </>
                ) : (
                    <p>{translations[language].expired}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default TrialExpirationManager;