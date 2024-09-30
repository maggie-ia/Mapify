import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Bienvenido a Mapify',
      subtitle: 'Carga tu archivo para comenzar',
      dropzone: 'Arrastra y suelta tu archivo aquí o haz clic para seleccionar',
      button: 'Continuar',
    },
    en: {
      title: 'Welcome to Mapify',
      subtitle: 'Upload your file to get started',
      dropzone: 'Drag and drop your file here or click to select',
      button: 'Continue',
    },
    fr: {
      title: 'Bienvenue sur Mapify',
      subtitle: 'Téléchargez votre fichier pour commencer',
      dropzone: 'Glissez et déposez votre fichier ici ou cliquez pour sélectionner',
      button: 'Continuer',
    },
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid PDF, TXT, or DOCX file.');
    }
  };

  const handleContinue = () => {
    if (file) {
      // Here you would typically upload the file and process it
      // For now, we'll just navigate to the options page
      navigate('/options');
    } else {
      alert('Please select a file before continuing.');
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-[#a7e3f4] rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-4 text-center text-[#545454]">{translations[language].title}</h1>
      <p className="text-xl mb-6 text-center text-[#3a7ca5]">{translations[language].subtitle}</p>
      <div 
        className="border-4 border-dashed border-[#11ccf5] rounded-lg p-10 text-center cursor-pointer"
        onClick={() => document.getElementById('fileInput').click()}
      >
        <p className="text-lg text-[#3a7ca5]">{translations[language].dropzone}</p>
        <input 
          id="fileInput"
          type="file" 
          accept=".pdf,.txt,.docx" 
          onChange={handleFileChange} 
          className="hidden"
        />
      </div>
      {file && <p className="mt-4 text-center text-[#3a7ca5]">File selected: {file.name}</p>}
      <button 
        onClick={handleContinue}
        className="mt-6 bg-[#11ccf5] text-white px-6 py-2 rounded-lg hover:bg-[#3a7ca5] transition-colors duration-300 block mx-auto"
      >
        {translations[language].button}
      </button>
    </div>
  );
};

export default Home;