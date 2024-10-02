import React from 'react';
import { Button } from "./ui/button";
import { useLanguage } from '../contexts/LanguageContext';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SaveShareConversation = ({ messages }) => {
    const { language } = useLanguage();

    const translations = {
        es: {
            save: "Guardar conversación",
            share: "Compartir conversación",
            saveSuccess: "Conversación guardada exitosamente",
            shareSuccess: "Enlace de conversación copiado al portapapeles",
            error: "Error al procesar la solicitud"
        },
        en: {
            save: "Save conversation",
            share: "Share conversation",
            saveSuccess: "Conversation saved successfully",
            shareSuccess: "Conversation link copied to clipboard",
            error: "Error processing request"
        },
        fr: {
            save: "Sauvegarder la conversation",
            share: "Partager la conversation",
            saveSuccess: "Conversation sauvegardée avec succès",
            shareSuccess: "Lien de conversation copié dans le presse-papiers",
            error: "Erreur lors du traitement de la demande"
        }
    };

    const saveMutation = useMutation({
        mutationFn: () => axios.post('/api/save-conversation', { messages }),
        onSuccess: () => {
            toast.success(translations[language].saveSuccess);
        },
        onError: () => {
            toast.error(translations[language].error);
        }
    });

    const shareMutation = useMutation({
        mutationFn: () => axios.post('/api/share-conversation', { messages }),
        onSuccess: (data) => {
            navigator.clipboard.writeText(data.shareLink);
            toast.success(translations[language].shareSuccess);
        },
        onError: () => {
            toast.error(translations[language].error);
        }
    });

    return (
        <div className="mt-4">
            <Button onClick={() => saveMutation.mutate()} className="mr-2">
                {translations[language].save}
            </Button>
            <Button onClick={() => shareMutation.mutate()}>
                {translations[language].share}
            </Button>
        </div>
    );
};

export default SaveShareConversation;