import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from "./ui/button";
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';

const DeleteAccount = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Eliminar cuenta',
            warning: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
            confirm: 'Sí, eliminar mi cuenta',
            cancel: 'Cancelar',
            success: 'Tu cuenta ha sido eliminada exitosamente.',
            error: 'Hubo un error al intentar eliminar tu cuenta. Por favor, inténtalo de nuevo más tarde.'
        },
        en: {
            title: 'Delete account',
            warning: 'Are you sure you want to delete your account? This action cannot be undone.',
            confirm: 'Yes, delete my account',
            cancel: 'Cancel',
            success: 'Your account has been successfully deleted.',
            error: 'There was an error trying to delete your account. Please try again later.'
        },
        fr: {
            title: 'Supprimer le compte',
            warning: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne peut pas être annulée.',
            confirm: 'Oui, supprimer mon compte',
            cancel: 'Annuler',
            success: 'Votre compte a été supprimé avec succès.',
            error: 'Une erreur s\'est produite lors de la tentative de suppression de votre compte. Veuillez réessayer plus tard.'
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await api.post('/auth/deactivate-account');
            logout();
            navigate('/');
            alert(translations[language].success);
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(translations[language].error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-5 text-center text-primary">{translations[language].title}</h2>
            {!isConfirming ? (
                <Button onClick={() => setIsConfirming(true)} className="w-full bg-red-500 text-white hover:bg-red-600">
                    {translations[language].title}
                </Button>
            ) : (
                <div>
                    <p className="mb-4 text-quaternary">{translations[language].warning}</p>
                    <div className="flex justify-between">
                        <Button onClick={handleDeleteAccount} className="bg-red-500 text-white hover:bg-red-600">
                            {translations[language].confirm}
                        </Button>
                        <Button onClick={() => setIsConfirming(false)} className="bg-tertiary text-white hover:bg-quaternary">
                            {translations[language].cancel}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;