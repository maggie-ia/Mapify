import axios from 'axios';
import { checkMembershipLimits } from '../utils/membershipUtils';
import { handleApiError } from '../utils/errorHandling';

const API_URL = '/api';

/**
 * Procesa el texto según la operación especificada.
 * @param {string} operation - Tipo de operación a realizar.
 * @param {string} text - Texto a procesar.
 * @param {Object} additionalParams - Parámetros adicionales (ej. targetLanguage).
 * @returns {Promise<Object>} - Resultado del procesamiento.
 */
export const processText = async ({ operation, text, ...additionalParams }) => {
  try {
    await checkMembershipLimits(operation);
    const response = await axios.post(`${API_URL}/process`, { 
      operation, 
      text, 
      ...additionalParams
    });
    return { ...response.data, operationType: operation };
  } catch (error) {
    return handleApiError(error, `Error processing text (${operation})`);
  }
};

export const summarizeText = async (text) => processText({ operation: 'summarize', text });
export const paraphraseText = async (text) => processText({ operation: 'paraphrase', text });
export const synthesizeText = async (text) => processText({ operation: 'synthesize', text });
export const createConceptMap = async (text) => processText({ operation: 'conceptMap', text });
export const extractRelevantPhrases = async (text) => processText({ operation: 'relevantPhrases', text });
export const translateText = async (text, targetLanguage) => 
  processText({ operation: 'translate', text, targetLanguage });

export const exportResult = async (result, format) => {
  try {
    const response = await axios.post(`${API_URL}/export`, { result, format });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error exporting result');
  }
};