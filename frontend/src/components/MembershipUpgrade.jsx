import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const MembershipUpgrade = () => {
    const { language } = useLanguage();
    const [selectedMembership, setSelectedMembership] = useState(null);

    const translations = {
        es: {
            title: 'Actualizar Membresía',
            basic: 'Básica',
            premium: 'Premium',
            current: 'Actual',
            upgrade: 'Actualizar',
            success: 'Membresía actualizada con éxito',
            error: 'Error al actualizar la membresía'
        },
        en: {
            title: 'Upgrade Membership',
            basic: 'Basic',
            premium: 'Premium',
            current: 'Current',
            upgrade: 'Upgrade',
            success: 'Membership upgraded successfully',
            error: 'Error upgrading membership'
        },
        fr: {
            title: 'Mettre à niveau l\'adhésion',
            basic: 'Basique',
            premium: 'Premium',
            current: 'Actuelle',
            upgrade: 'Mettre à niveau',
            success: 'Adhésion mise à niveau avec succès',
            error: 'Erreur lors de la mise à niveau de l\'adhésion'
        }
    };

    const { data: membershipInfo, isLoading, error } = useQuery({
        queryKey: ['membershipInfo'],
        queryFn: async () => {
            const response = await axios.get('/api/membership-info');
            return response.data;
        },
    });

    const upgradeMutation = useMutation({
        mutationFn: (newMembership) => axios.post('/api/update-membership', { membership_type: newMembership }),
        onSuccess: () => {
            alert(translations[language].success);
        },
        onError: () => {
            alert(translations[language].error);
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleUpgrade = () => {
        if (selectedMembership) {
            upgradeMutation.mutate(selectedMembership);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>{translations[language].title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <input
                            type="radio"
                            id="basic"
                            name="membership"
                            value="basic"
                            checked={selectedMembership === 'basic'}
                            onChange={() => setSelectedMembership('basic')}
                            disabled={membershipInfo.membership_type === 'basic' || membershipInfo.membership_type === 'premium'}
                        />
                        <label htmlFor="basic" className="ml-2">
                            {translations[language].basic} 
                            {membershipInfo.membership_type === 'basic' && ` (${translations[language].current})`}
                        </label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="premium"
                            name="membership"
                            value="premium"
                            checked={selectedMembership === 'premium'}
                            onChange={() => setSelectedMembership('premium')}
                            disabled={membershipInfo.membership_type === 'premium'}
                        />
                        <label htmlFor="premium" className="ml-2">
                            {translations[language].premium}
                            {membershipInfo.membership_type === 'premium' && ` (${translations[language].current})`}
                        </label>
                    </div>
                    <Button 
                        onClick={handleUpgrade} 
                        disabled={!selectedMembership || membershipInfo.membership_type === 'premium'}
                        className="w-full mt-4"
                    >
                        {translations[language].upgrade}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default MembershipUpgrade;