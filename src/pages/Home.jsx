import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import FileUpload from '../components/FileUpload';
import Summary from '../components/Summary';
import { uploadFile, getSummary } from '../services/fileService';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const [fileId, setFileId] = useState(null);
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Bienvenido a Mapify',
      subtitle: 'Carga tu archivo para comenzar',
    },
    en: {
      title: 'Welcome to Mapify',
      subtitle: 'Upload your file to get started',
    },
    fr: {
      title: 'Bienvenue sur Mapify',
      subtitle: 'Téléchargez votre fichier pour commencer',
    },
  };

  const handleFileUpload = async (file) => {
    try {
      const response = await uploadFile(file);
      setFileId(response.fileId);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['summary', fileId],
    queryFn: () => getSummary(fileId),
    enabled: !!fileId,
  });

  return (
    <div className="container mx-auto mt-10 p-6 bg-[#a7e3f4] rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-4 text-center text-[#545454]">{translations[language].title}</h1>
      <p className="text-xl mb-6 text-center text-[#3a7ca5]">{translations[language].subtitle}</p>
      <FileUpload onFileUpload={handleFileUpload} />
      {isLoading && <p>Cargando resumen...</p>}
      {error && <p>Error al cargar el resumen: {error.message}</p>}
      {summary && <Summary summary={summary} />}
    </div>
  );
};

export default Home;