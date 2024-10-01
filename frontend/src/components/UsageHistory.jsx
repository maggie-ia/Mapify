import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const UsageHistory = () => {
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Historial de Uso',
            operation: 'Operación',
            date: 'Fecha',
            details: 'Detalles',
            noHistory: 'No hay historial de uso disponible.'
        },
        en: {
            title: 'Usage History',
            operation: 'Operation',
            date: 'Date',
            details: 'Details',
            noHistory: 'No usage history available.'
        },
        fr: {
            title: 'Historique d\'utilisation',
            operation: 'Opération',
            date: 'Date',
            details: 'Détails',
            noHistory: 'Aucun historique d\'utilisation disponible.'
        }
    };

    const { data: history, isLoading, error } = useQuery({
        queryKey: ['usageHistory'],
        queryFn: async () => {
            const response = await axios.get('/api/usage-history');
            return response.data;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>{translations[language].title}</CardTitle>
            </CardHeader>
            <CardContent>
                {history && history.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">{translations[language].operation}</th>
                                <th className="text-left">{translations[language].date}</th>
                                <th className="text-left">{translations[language].details}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.operation_type}</td>
                                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                                    <td>{item.details || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>{translations[language].noHistory}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default UsageHistory;