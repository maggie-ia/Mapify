import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const UserMetrics = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Mis Métricas',
            loading: 'Cargando métricas...',
            error: 'Error al cargar las métricas',
            noMetrics: 'No hay métricas disponibles.',
            operation: 'Operación',
            count: 'Cantidad'
        },
        en: {
            title: 'My Metrics',
            loading: 'Loading metrics...',
            error: 'Error loading metrics',
            noMetrics: 'No metrics available.',
            operation: 'Operation',
            count: 'Count'
        },
        fr: {
            title: 'Mes Métriques',
            loading: 'Chargement des métriques...',
            error: 'Erreur lors du chargement des métriques',
            noMetrics: 'Aucune métrique disponible.',
            operation: 'Opération',
            count: 'Nombre'
        }
    };

    const { data: metrics, isLoading, error } = useQuery({
        queryKey: ['userMetrics'],
        queryFn: async () => {
            const response = await axios.get('/metrics/user');
            return response.data;
        },
    });

    if (isLoading) return <div>{translations[language].loading}</div>;
    if (error) return <div>{translations[language].error}: {error.message}</div>;

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>{translations[language].title}</CardTitle>
            </CardHeader>
            <CardContent>
                {metrics && Object.keys(metrics).length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">{translations[language].operation}</th>
                                <th className="text-left">{translations[language].count}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(metrics).map(([operation, count]) => (
                                <tr key={operation}>
                                    <td>{operation}</td>
                                    <td>{count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>{translations[language].noMetrics}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default UserMetrics;