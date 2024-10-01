import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FileUpload from '../components/FileUpload';
import { Button } from "../components/ui/button";

const Home = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Bienvenido a Mapify',
            subtitle: 'Procesa tus documentos de manera inteligente',
            uploadButton: 'Subir archivo',
            membershipButton: 'Ver membresías'
        },
        en: {
            title: 'Welcome to Mapify',
            subtitle: 'Process your documents intelligently',
            uploadButton: 'Upload file',
            membershipButton: 'View memberships'
        },
        fr: {
            title: 'Bienvenue sur Mapify',
            subtitle: 'Traitez vos documents intelligemment',
            uploadButton: 'Télécharger un fichier',
            membershipButton: 'Voir les abonnements'
        }
    };

    const handleFileUploaded = (file) => {
        // Aquí iría la lógica para procesar el archivo subido
        navigate('/options');
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-center text-primary">{translations[language].title}</h1>
            <p className="text-xl mb-6 text-center text-quaternary">{translations[language].subtitle}</p>
            <div className="flex flex-col items-center space-y-4">
                <FileUpload onFileUploaded={handleFileUploaded} />
                <Button 
                    onClick={() => navigate('/membership')}
                    className="bg-tertiary text-white hover:bg-quaternary transition-colors"
                >
                    {translations[language].membershipButton}
                </Button>
            </div>
        </div>
    );
};

export default Home;