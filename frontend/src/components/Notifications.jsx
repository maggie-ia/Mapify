import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { X } from "lucide-react";

const Notification = ({ type, message, onClose }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            error: 'Error',
            success: 'Éxito',
            info: 'Información',
            warning: 'Advertencia'
        },
        en: {
            error: 'Error',
            success: 'Success',
            info: 'Information',
            warning: 'Warning'
        },
        fr: {
            error: 'Erreur',
            success: 'Succès',
            info: 'Information',
            warning: 'Avertissement'
        }
    };

    return (
        <Alert variant={type} className="mb-4">
            <AlertTitle className="flex justify-between items-center">
                {translations[language][type]}
                <X className="cursor-pointer" onClick={onClose} />
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
};

export default Notification;