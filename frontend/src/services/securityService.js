import axios from 'axios';

const API_URL = '/api/security';

export const validateInput = (input) => {
    // Implement input validation logic
    const sanitizedInput = input.replace(/[<>]/g, ''); // Basic XSS prevention
    return sanitizedInput;
};

export const encryptSensitiveData = (data) => {
    // Implement client-side encryption (Note: server-side encryption is more secure)
    // This is a placeholder and should be replaced with a proper encryption method
    return btoa(JSON.stringify(data));
};

export const reportSuspiciousActivity = async (userId, activityDetails) => {
    try {
        await axios.post(`${API_URL}/report`, { userId, activityDetails });
    } catch (error) {
        console.error('Error reporting suspicious activity:', error);
    }
};