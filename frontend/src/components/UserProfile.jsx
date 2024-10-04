import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

import { useAuth } from '../hooks/useAuth';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from 'react-hot-toast';

const UserProfile = () => {
    const { user, updateProfile } = useAuth();
    const { language } = useLanguage();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');


    const translations = {
        es: {
            title: 'Perfil de Usuario',
            username: 'Nombre de usuario',
            email: 'Correo electrónico',
            update: 'Actualizar Perfil',
            success: 'Perfil actualizado con éxito',
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
            username: 'Username',
            email: 'Email',
            success: 'Profile updated successfully',
            update: 'Update Profile',
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
            username: "Nom d'utilisateur",
            email: 'Adresse e-mail',
            update: 'Mettre à jour le profil',
            success: 'Profil mis à jour avec succès',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({ username, email });
            toast.success(translations[language].success);
        } catch (error) {
            toast.error(translations[language].error);
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
        <div className="max-w-md mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-5 text-center text-primary">{translations[language].title}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-quaternary">
                        {translations[language].username}
                    </label>
                    <Input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-quaternary">
                        {translations[language].email}
                    </label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <Button type="submit" className="w-full bg-tertiary text-white hover:bg-quaternary">
                    {translations[language].update}
                </Button>
            </form>
        </div>
    );
};