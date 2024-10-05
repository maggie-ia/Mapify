import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from "./ui/button";
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DeleteAccount = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { language } = useLanguage();

    const translations = {
        es: {
            deleteAccount: 'Eliminar cuenta',
            confirmDelete: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
            confirm: 'Confirmar',
            cancel: 'Cancelar',
            error: 'Error al eliminar la cuenta',
            success: 'Cuenta eliminada exitosamente'
        },
        en: {
            deleteAccount: 'Delete account',
            confirmDelete: 'Are you sure you want to delete your account? This action cannot be undone.',
            confirm: 'Confirm',
            cancel: 'Cancel',
            error: 'Error deleting account',
            success: 'Account deleted successfully'
        },
        fr: {
            deleteAccount: 'Supprimer le compte',
            confirmDelete: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne peut pas être annulée.',
            confirm: 'Confirmer',
            cancel: 'Annuler',
            error: 'Erreur lors de la suppression du compte',
            success: 'Compte supprimé avec succès'
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('/api/auth/delete-account');
            toast.success(translations[language].success);
            logout();
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error(translations[language].error);
        }
    };

    return (
        <div className="mt-8">
            {!isConfirming ? (
                <Button onClick={() => setIsConfirming(true)} className="bg-red-500 text-white hover:bg-red-600">
                    {translations[language].deleteAccount}
                </Button>
            ) : (
                <div className="space-y-4">
                    <p className="text-red-500">{translations[language].confirmDelete}</p>
                    <div className="space-x-4">
                        <Button onClick={handleDeleteAccount} className="bg-red-500 text-white hover:bg-red-600">
                            {translations[language].confirm}
                        </Button>
                        <Button onClick={() => setIsConfirming(false)} className="bg-gray-300 text-black hover:bg-gray-400">
                            {translations[language].cancel}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;