import React, { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert } from "./ui/alert";
import { uploadFile } from '../services/fileService';
import { useAuth } from '../hooks/useAuth';
import FileSizeLimitInfo from './FileSizeLimitInfo';
import { createWorker } from 'tesseract.js';
import { toast } from 'react-hot-toast';

const FileUpload = ({ onFileUploaded }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessingOCR, setIsProcessingOCR] = useState(false);
    const { language } = useLanguage();
    const { user } = useAuth();

    const translations = {
        es: {
            title: 'Subir Archivo',
            selectFile: 'Seleccionar archivo',
            upload: 'Subir',
            uploading: 'Subiendo...',
            processing: 'Procesando OCR...',
            fileSelected: 'Archivo seleccionado:',
            noFileSelected: 'Ningún archivo seleccionado',
            invalidFileType: 'Tipo de archivo no válido. Por favor, seleccione un archivo PDF, TXT o DOCX.',
            uploadSuccess: 'Archivo subido con éxito',
            uploadError: 'Error al subir el archivo',
            fileSizeExceeded: 'El tamaño del archivo excede el límite permitido para su membresía.',
            fileSizeWarning: 'El archivo está cerca del límite de tamaño permitido.',
            ocrError: 'Error al procesar el OCR del archivo',
        },
        en: {
            title: 'Upload File',
            selectFile: 'Select file',
            upload: 'Upload',
            uploading: 'Uploading...',
            processing: 'Processing OCR...',
            fileSelected: 'File selected:',
            noFileSelected: 'No file selected',
            invalidFileType: 'Invalid file type. Please select a PDF, TXT, or DOCX file.',
            uploadSuccess: 'File uploaded successfully',
            uploadError: 'Error uploading file',
            fileSizeExceeded: 'File size exceeds the limit allowed for your membership.',
            fileSizeWarning: 'The file is close to the allowed size limit.',
            ocrError: 'Error processing OCR for the file',
        },
        fr: {
            title: 'Télécharger un fichier',
            selectFile: 'Sélectionner un fichier',
            upload: 'Télécharger',
            uploading: 'Téléchargement en cours...',
            processing: 'Traitement OCR en cours...',
            fileSelected: 'Fichier sélectionné :',
            noFileSelected: 'Aucun fichier sélectionné',
            invalidFileType: 'Type de fichier non valide. Veuillez sélectionner un fichier PDF, TXT ou DOCX.',
            uploadSuccess: 'Fichier téléchargé avec succès',
            uploadError: 'Erreur lors du téléchargement du fichier',
            fileSizeExceeded: 'La taille du fichier dépasse la limite autorisée pour votre abonnement.',
            fileSizeWarning: 'Le fichier est proche de la limite de taille autorisée.',
            ocrError: 'Erreur lors du traitement OCR du fichier',
        }
    };

    const getFileSizeLimit = (membershipType) => {
        switch (membershipType) {
            case 'premium':
                return 50 * 1024 * 1024; // 50MB for premium
            case 'basic':
            case 'free':
            default:
                return 16 * 1024 * 1024; // 16MB for basic and free
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = getFileSizeLimit(user.membership_type);
        
        if (selectedFile && allowedTypes.includes(selectedFile.type)) {
            if (selectedFile.size > maxSize) {
                setError(translations[language].fileSizeExceeded);
                setFile(null);
                setWarning('');
            } else {
                setFile(selectedFile);
                setError('');
                // Set warning if file size is within 10% of the limit
                if (selectedFile.size > maxSize * 0.9) {
                    setWarning(translations[language].fileSizeWarning);
                } else {
                    setWarning('');
                }
            }
        } else {
            setFile(null);
            setError(translations[language].invalidFileType);
            setWarning('');
        }
    };

    const processOCR = useCallback(async (fileBuffer) => {
        const worker = await createWorker('eng');
        try {
            const { data: { text } } = await worker.recognize(fileBuffer);
            await worker.terminate();
            return text;
        } catch (error) {
            console.error('OCR Error:', error);
            throw new Error(translations[language].ocrError);
        }
    }, [language]);

    const handleUpload = async () => {
        if (file) {
            setIsUploading(true);
            try {
                const fileBuffer = await file.arrayBuffer();
                setIsProcessingOCR(true);
                const ocrText = await processOCR(fileBuffer);
                setIsProcessingOCR(false);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('ocrText', ocrText);

                const response = await uploadFile(formData);
                onFileUploaded(response);
                setIsUploading(false);
                setFile(null);
                setWarning('');
                toast.success(translations[language].uploadSuccess);
            } catch (error) {
                setError(error.message || translations[language].uploadError);
                setIsUploading(false);
                setIsProcessingOCR(false);
                toast.error(error.message || translations[language].uploadError);
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
            {warning && <Alert variant="warning" className="mb-4">{warning}</Alert>}
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
                disabled={!file || isUploading || isProcessingOCR}
                className="w-full bg-tertiary hover:bg-quaternary text-white"
            >
                {isUploading ? translations[language].uploading : 
                 isProcessingOCR ? translations[language].processing :
                 translations[language].upload}
            </Button>
            <FileSizeLimitInfo />
        </div>
    );
};

export default FileUpload;