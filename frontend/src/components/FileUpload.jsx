import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { uploadFile } from '../services/fileService';
import { useAuth } from '../hooks/useAuth';
import FileSizeLimitInfo from './FileSizeLimitInfo';
import ProgressBar from './ProgressBar';
import { fileUploadSchema } from '../utils/validations';

const FileUpload = ({ onFileUploaded }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isValid, setIsValid] = useState(false);
    const { language } = useLanguage();
    const { user } = useAuth();
    const { addNotification } = useNotification();

    const translations = {
        es: {
            title: 'Subir Archivo',
            selectFile: 'Seleccionar archivo',
            upload: 'Subir',
            uploading: 'Subiendo...',
            fileSelected: 'Archivo seleccionado:',
            noFileSelected: 'Ningún archivo seleccionado',
            invalidFileType: 'Tipo de archivo no válido. Por favor, seleccione un archivo PDF, TXT o DOCX.',
            fileSizeExceeded: 'El tamaño del archivo excede el límite permitido para su membresía.',
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
            fileSizeExceeded: 'File size exceeds the limit allowed for your membership.',
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
            fileSizeExceeded: 'La taille du fichier dépasse la limite autorisée pour votre abonnement.',
            uploadSuccess: 'Fichier téléchargé avec succès',
            uploadError: 'Erreur lors du téléchargement du fichier',
        }
    };

    useEffect(() => {
        validateFile();
    }, [file]);

    const validateFile = async () => {
        if (!file) {
            setIsValid(false);
            return;
        }

        try {
            await fileUploadSchema.validate({ file });
            setIsValid(true);
        } catch (err) {
            setIsValid(false);
            addNotification('error', err.message);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!isValid) return;

        setIsUploading(true);
        setProgress(0);
        try {
            const response = await uploadFile(file, (progress) => {
                setProgress(progress);
            });
            onFileUploaded(response);
            setIsUploading(false);
            setFile(null);
            addNotification('success', translations[language].uploadSuccess);
        } catch (error) {
            setIsUploading(false);
            addNotification('error', error.message || translations[language].uploadError);
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
                disabled={!isValid || isUploading}
                className="w-full bg-tertiary hover:bg-quaternary text-white mb-4"
            >
                {isUploading ? translations[language].uploading : translations[language].upload}
            </Button>
            {isUploading && (
                <div className="mt-4">
                    <p className="mb-2 text-quaternary">{translations[language].uploading}</p>
                    <ProgressBar progress={progress} />
                </div>
            )}
            <FileSizeLimitInfo />
        </div>
    );
};

export default FileUpload;