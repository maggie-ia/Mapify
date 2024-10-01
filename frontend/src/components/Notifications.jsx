import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const Notifications = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Notificaciones',
            noNotifications: 'No hay notificaciones nuevas.'
        },
        en: {
            title: 'Notifications',
            noNotifications: 'No new notifications.'
        },
        fr: {
            title: 'Notifications',
            noNotifications: 'Pas de nouvelles notifications.'
        }
    };

    const { data: notifications, isLoading, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await axios.get('/api/notifications');
            return response.data;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>{translations[language].title}</CardTitle>
            </CardHeader>
            <CardContent>
                {notifications && notifications.length > 0 ? (
                    <ul>
                        {notifications.map((notification, index) => (
                            <li key={index} className="mb-2">{notification}</li>
                        ))}
                    </ul>
                ) : (
                    <p>{translations[language].noNotifications}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default Notifications;