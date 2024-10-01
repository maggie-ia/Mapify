import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert } from "./ui/alert";
import { uploadFile } from '../services/fileService';

const FileUpload = ({ onFileUploaded }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { language } = useLanguage();

    const translations = {
        es: {
            title: 'Subir Archivo',
            selectFile: 'Seleccionar archivo',
            upload: 'Subir',
            uploading: 'Subiendo...',
            fileSelected: 'Archivo seleccionado:',
            noFileSelected: 'Ningún archivo seleccionado',
            invalidFileType: 'Tipo de archivo no válido. Por favor, seleccione un archivo PDF, TXT o DOCX.',
            uploadSuccess: 'Archivo subido con éxito',
            uploadError: 'Error al subir el archivo',
        },
        en: {
            title: 'Upload File',
            selectFile: 'Select file',
            upload: 'Upload',
            uploading: 'Uploading...',
            fileSelected: 'File selected:',
            noFileSelected: 'No file selected',
            invalidFileType: 'Invalid file type. Please select a PDF, TXT, or DOCX file.',
            uploadSuccess: 'File uploaded successfully',
            uploadError: 'Error uploading file',
        },
        fr: {
            title: 'Télécharger un fichier',
            selectFile: 'Sélectionner un fichier',
            upload: 'Télécharger',
            uploading: 'Téléchargement en cours...',
            fileSelected: 'Fichier sélectionné :',
            noFileSelected: 'Aucun fichier sélectionné',
            invalidFileType: 'Type de fichier non valide. Veuillez sélectionner un fichier PDF, TXT ou DOCX.',
            uploadSuccess: 'Fichier téléchargé avec succès',
            uploadError: 'Erreur lors du téléchargement du fichier',
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (selectedFile && allowedTypes.includes(selectedFile.type)) {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError(translations[language].invalidFileType);
        }
    };

    const handleUpload = async () => {
        if (file) {
            setIsUploading(true);
            try {
                const response = await uploadFile(file);
                onFileUploaded(response);
                setIsUploading(false);
                setFile(null);
            } catch (error) {
                setError(translations[language].uploadError);
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-quinary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">{translations[language].title}</h2>
            <Input 
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf,.txt,.docx"
                className="mb-4"
            />
            {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
            {file && (
                <p className="mb-4 text-quaternary">
                    {translations[language].fileSelected} {file.name}
                </p>
            )}
            {!file && (
                <p className="mb-4 text-quaternary">{translations[language].noFileSelected}</p>
            )}
            <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="w-full bg-tertiary hover:bg-quaternary text-white"
            >
                {isUploading ? translations[language].uploading : translations[language].upload}
            </Button>
        </div>
    );
};

export default FileUpload;