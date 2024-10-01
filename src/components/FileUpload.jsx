import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const { language } = useLanguage();

  const translations = {
    es: {
      title: 'Subir Archivo',
      dropzone: 'Arrastra y suelta tu archivo aquí o haz clic para seleccionar',
      button: 'Procesar',
      fileSelected: 'Archivo seleccionado:',
      noFile: 'Ningún archivo seleccionado'
    },
    en: {
      title: 'Upload File',
      dropzone: 'Drag and drop your file here or click to select',
      button: 'Process',
      fileSelected: 'File selected:',
      noFile: 'No file selected'
    },
    fr: {
      title: 'Télécharger un fichier',
      dropzone: 'Glissez et déposez votre fichier ici ou cliquez pour sélectionner',
      button: 'Traiter',
      fileSelected: 'Fichier sélectionné :',
      noFile: 'Aucun fichier sélectionné'
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      // Here you would typically upload the file and process it
      // For now, we'll just call the onUploadSuccess callback
      onUploadSuccess();
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">{translations[language].title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div 
          className="border-4 border-dashed border-tertiary rounded-lg p-8 text-center cursor-pointer"
          onClick={() => document.getElementById('fileInput').click()}
        >
          <p className="text-lg text-quaternary">{translations[language].dropzone}</p>
          <input 
            id="fileInput"
            type="file" 
            accept=".pdf,.txt,.docx" 
            onChange={handleFileChange} 
            className="hidden"
          />
        </div>
        {file && <p className="text-center text-quaternary">{translations[language].fileSelected} {file.name}</p>}
        {!file && <p className="text-center text-quaternary">{translations[language].noFile}</p>}
        <Button 
          type="submit"
          className="w-full bg-tertiary text-white px-6 py-2 rounded-lg hover:bg-quaternary transition-colors"
          disabled={!file}
        >
          {translations[language].button}
        </Button>
      </form>
    </div>
  );
};

export default FileUpload;