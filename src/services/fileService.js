import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Asume que el backend está corriendo en este puerto

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

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

export const getSummary = async (fileId) => {
    try {
        const response = await axios.get(`${API_URL}/summarize/${fileId}`);
        return response.data;
    } catch (error) {
        console.error('Error get summary:', error);
        throw error;
    }
};