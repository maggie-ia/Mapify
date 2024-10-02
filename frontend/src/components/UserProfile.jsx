import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const UserProfile = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Perfil de Usuario',
            membership: 'Tipo de Membresía',
            operations: 'Operaciones Restantes',
            exports: 'Exportaciones Restantes',
            trial: 'Período de Prueba',
            trialEnd: 'Fin del Período de Prueba',
            pageLimit: 'Límite de Páginas',
            conceptMaps: 'Mapas Conceptuales',
            loading: 'Cargando...',
            error: 'Error al cargar el perfil'
        },
        en: {
            title: 'User Profile',
            membership: 'Membership Type',
            operations: 'Remaining Operations',
            exports: 'Remaining Exports',
            trial: 'Trial Period',
            trialEnd: 'Trial End Date',
            pageLimit: 'Page Limit',
            conceptMaps: 'Concept Maps',
            loading: 'Loading...',
            error: 'Error loading profile'
        },
        fr: {
            title: 'Profil Utilisateur',
            membership: 'Type d\'Adhésion',
            operations: 'Opérations Restantes',
            exports: 'Exportations Restantes',
            trial: 'Période d\'Essai',
            trialEnd: 'Date de Fin d\'Essai',
            pageLimit: 'Limite de Pages',
            conceptMaps: 'Cartes Conceptuelles',
            loading: 'Chargement...',
            error: 'Erreur lors du chargement du profil'
        }
    };

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await axios.get('/api/membership-info');
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
                <ul className="space-y-2">
                    <li><strong>{translations[language].membership}:</strong> {profile.membership_type}</li>
                    <li><strong>{translations[language].operations}:</strong> {profile.weekly_operations_remaining}</li>
                    <li><strong>{translations[language].exports}:</strong> {profile.weekly_exports_remaining}</li>
                    {profile.is_trial && (
                        <>
                            <li><strong>{translations[language].trial}:</strong> {profile.is_trial ? 'Yes' : 'No'}</li>
                            <li><strong>{translations[language].trialEnd}:</strong> {new Date(profile.trial_end_date).toLocaleDateString()}</li>
                        </>
                    )}
                    <li><strong>{translations[language].pageLimit}:</strong> {profile.page_limit}</li>
                    <li><strong>{translations[language].conceptMaps}:</strong> {profile.can_create_concept_maps ? 'Yes' : 'No'}</li>
                </ul>
            </CardContent>
        </Card>
    );
};

export default UserProfile;