import axios from 'axios';
import { checkMembershipLimits } from '../utils/membershipUtils';
import { handleApiError } from '../utils/errorHandling';

const API_URL = '/api';
const MAX_RETRIES = 3;

const retryRequest = async (fn, retries = MAX_RETRIES) => {
<<<<<<< HEAD
  try {
      return await fn();
  } catch (error) {
      if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return retryRequest(fn, retries - 1);
      }
      throw error;
  }
};

export const processText = async ({ operation, text, targetLanguage, pageCount }) => {
  try {
      await checkMembershipLimits(operation, pageCount);
      const response = await retryRequest(() => 
          axios.post(`${API_URL}/process`, { 
              operation, 
              text, 
              targetLanguage,
              pageCount
          })
      );
      return { ...response.data, operationType: operation };
  } catch (error) {
      if (error.message.includes('not allowed') || error.message.includes('exceeds')) {
          throw error; // Re-throw membership-related errors
      }
      return handleApiError(error, `Error processing text (${operation})`);
  }
=======
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return retryRequest(fn, retries - 1);
        }
        throw error;
    }
};

export const processText = async ({ operation, text, targetLanguage, pageCount }) => {
    try {
        await checkMembershipLimits(operation, pageCount);
        const response = await retryRequest(() => 
            axios.post(`${API_URL}/process`, { 
                operation, 
                text, 
                targetLanguage,
                pageCount
            })
        );
        return { ...response.data, operationType: operation };
    } catch (error) {
        if (error.message.includes('not allowed') || error.message.includes('exceeds')) {
            throw error; // Re-throw membership-related errors
        }
        return handleApiError(error, `Error processing text (${operation})`);
    }
>>>>>>> 8f943cf430b39bb7c6bca67caaabf5cf2dbf455c
};

export const summarizeText = async (text, pageCount) => processText({ operation: 'summarize', text, pageCount });
export const paraphraseText = async (text, pageCount) => processText({ operation: 'paraphrase', text, pageCount });
export const synthesizeText = async (text, pageCount) => processText({ operation: 'synthesize', text, pageCount });
export const createConceptMap = async (text, pageCount) => processText({ operation: 'conceptMap', text, pageCount });
export const extractRelevantPhrases = async (text, pageCount) => processText({ operation: 'relevantPhrases', text, pageCount });
export const translateText = async (text, targetLanguage, pageCount) => 
    processText({ operation: 'translate', text, targetLanguage, pageCount });

export const solveProblemFromFile = async (file) => {
<<<<<<< HEAD
  try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await retryRequest(() => 
          axios.post(`${API_URL}/solve-problem`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          })
      );
      return { ...response.data, operationType: 'problemSolving' };
  } catch (error) {
      return handleApiError(error, 'Error solving problem');
  }
};

export const getWritingAssistance = async ({ text, membershipType }) => {
  try {
      const response = await retryRequest(() => 
          axios.post(`${API_URL}/writing-assistance`, { text, membershipType })
      );
      return response.data;
  } catch (error) {
      return handleApiError(error, 'Error getting writing assistance');
  }
};

export const exportResult = async (result, format) => {
  try {
      const response = await retryRequest(() => 
          axios.post(`${API_URL}/export`, { result, format })
      );
      return response.data;
  } catch (error) {
      return handleApiError(error, 'Error exporting result');
  }
=======
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await retryRequest(() => 
            axios.post(`${API_URL}/solve-problem`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        );
        return { ...response.data, operationType: 'problemSolving' };
    } catch (error) {
        return handleApiError(error, 'Error solving problem');
    }
};

export const getWritingAssistance = async ({ text, membershipType }) => {
    try {
        const response = await retryRequest(() => 
            axios.post(`${API_URL}/writing-assistance`, { text, membershipType })
        );
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Error getting writing assistance');
    }
};

export const exportResult = async (result, format) => {
    try {
        const response = await retryRequest(() => 
            axios.post(`${API_URL}/export`, { result, format })
        );
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Error exporting result');
    }
>>>>>>> 8f943cf430b39bb7c6bca67caaabf5cf2dbf455c
};