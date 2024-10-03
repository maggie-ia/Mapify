import axios from 'axios';
import { createWorker } from 'tesseract.js';
import localforage from 'localforage';

const API_URL = 'http://localhost:5000/api';

const ocrCache = localforage.createInstance({
    name: "ocrCache"
});

export const uploadFile = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    let ocrText = '';
    if (file.type === 'application/pdf') {
        ocrText = await processOCR(file, onProgress);
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

export const processOCR = async (file, onProgress) => {
    const cacheKey = await calculateFileHash(file);
    const cachedResult = await ocrCache.getItem(cacheKey);
    
    if (cachedResult) {
        return cachedResult;
    }

    const worker = await createWorker({
        logger: m => {
            if (m.status === 'recognizing text') {
                onProgress(m.progress);
            }
        },
    });

    try {
        await worker.loadLanguage('eng+spa+fra');
        await worker.initialize('eng+spa+fra');
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        
        await ocrCache.setItem(cacheKey, text);
        return text;
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Error processing OCR for the file');
    }
};

const calculateFileHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};