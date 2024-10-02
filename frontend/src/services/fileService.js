import axios from 'axios';
import { createWorker } from 'tesseract.js';

const API_URL = 'http://localhost:5000/api'; // Asume que el backend está corriendo en este puerto

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    let ocrText = '';
    if (file.type === 'application/pdf') {
        ocrText = await processOCR(file);
        formData.append('ocrText', ocrText);
    }

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

const processOCR = async (file) => {
    const worker = await createWorker('eng');
    try {
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        return text;
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Error processing OCR for the file');
    }
};