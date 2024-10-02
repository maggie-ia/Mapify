import axios from 'axios';

const API_URL = '/api';

export const processText = async ({ operation, text, targetLanguage, pageCount }) => {
  try {
    const response = await axios.post(`${API_URL}/process`, { 
      operation, 
      text, 
      targetLanguage,
      pageCount
    });
    return { ...response.data, operationType: operation };
  } catch (error) {
    console.error(`Error processing text (${operation}):`, error);
    throw error;
  }
};

export const exportResult = async (result, format) => {
  try {
    const response = await axios.post(`${API_URL}/export`, { result, format });
    return response.data;
  } catch (error) {
    console.error('Error exporting result:', error);
    throw error;
  }
};