import axios from 'axios';
import { checkMembershipLimits } from '../utils/membershipUtils';
import { handleApiError } from '../utils/errorHandling';

const API_URL = '/api';

/**
 * Procesa el texto según la operación especificada.
 * @param {Object} params - Parámetros de la operación.
 * @param {string} params.operation - Tipo de operación a realizar.
 * @param {string} params.text - Texto a procesar.
 * @param {string} [params.targetLanguage] - Idioma objetivo para traducción.
 * @param {number} [params.pageCount] - Número estimado de páginas.
 * @returns {Promise<Object>} - Resultado del procesamiento.
 */
export const processText = async ({ operation, text, targetLanguage, pageCount }) => {
  try {
    await checkMembershipLimits(operation, pageCount);
    const response = await axios.post(`${API_URL}/process`, { 
      operation, 
      text, 
      targetLanguage,
      pageCount
    });
    return { ...response.data, operationType: operation };
  } catch (error) {
    return handleApiError(error, `Error processing text (${operation})`);
  }
};

export const summarizeText = async (text, pageCount) => processText({ operation: 'summarize', text, pageCount });
export const paraphraseText = async (text, pageCount) => processText({ operation: 'paraphrase', text, pageCount });
export const synthesizeText = async (text, pageCount) => processText({ operation: 'synthesize', text, pageCount });
export const createConceptMap = async (text, pageCount) => processText({ operation: 'conceptMap', text, pageCount });
export const extractRelevantPhrases = async (text, pageCount) => processText({ operation: 'relevantPhrases', text, pageCount });
export const translateText = async (text, targetLanguage, pageCount) => 
  processText({ operation: 'translate', text, targetLanguage, pageCount });

export const exportResult = async (result, format) => {
  try {
    const response = await axios.post(`${API_URL}/export`, { result, format });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Error exporting result');
  }
};