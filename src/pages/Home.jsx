import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FileUpload from '../components/FileUpload';

const Home = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Bienvenido a Mapify',
            subtitle: 'Carga tu archivo para comenzar a procesar tu texto.'
        },
        en: {
            title: 'Welcome to Mapify',
            subtitle: 'Upload your file to start processing your text.'
        },
        fr: {
            title: 'Bienvenue sur Mapify',
            subtitle: 'Téléchargez votre fichier pour commencer à traiter votre texte.'
        }
    };

    const handleFileUploaded = () => {
        navigate('/operations');
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-center text-primary">
                {translations[language].title}
            </h1>
            <p className="text-xl mb-6 text-center text-quaternary">
                {translations[language].subtitle}
            </p>
            <FileUpload onFileUploaded={handleFileUploaded} />
        </div>
    );
};

export default Home;