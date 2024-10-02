import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const RenewalReminder = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Recordatorio de Renovación',
            loading: 'Cargando...',
            error: 'Error al cargar el recordatorio de renovación',
            noReminder: 'No hay recordatorios de renovación en este momento.'
        },
        en: {
            title: 'Renewal Reminder',
            loading: 'Loading...',
            error: 'Error loading renewal reminder',
            noReminder: 'No renewal reminders at this time.'
        },
        fr: {
            title: 'Rappel de Renouvellement',
            loading: 'Chargement...',
            error: 'Erreur lors du chargement du rappel de renouvellement',
            noReminder: 'Aucun rappel de renouvellement pour le moment.'
        }
    };

    const { data: reminder, isLoading, error } = useQuery({
        queryKey: ['renewalReminder'],
        queryFn: async () => {
            const response = await axios.get('/api/renewal-reminder');
            return response.data;
        },
    });

    if (isLoading) return <div>{translations[language].loading}</div>;
    if (error) return <div>{translations[language].error}: {error.message}</div>;

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>{translations[language].title}</CardTitle>
            </CardHeader>
            <CardContent>
                {reminder ? (
                    <p>{reminder}</p>
                ) : (
                    <p>{translations[language].noReminder}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default RenewalReminder;