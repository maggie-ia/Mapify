import { MEMBERSHIP_LIMITS } from './membershipLimits';
import { useAuth } from '../hooks/useAuth';

export const useOperationPermissions = () => {
    const { user } = useAuth();

    const isOperationAllowed = (operation) => {
        if (!user || !user.membership || !MEMBERSHIP_LIMITS[user.membership]) {
            return false;
        }
        return MEMBERSHIP_LIMITS[user.membership].allowedOperations.includes(operation);
    };

    const canTranslateToLanguage = (language) => {
        if (!user || !user.membership || !MEMBERSHIP_LIMITS[user.membership]) {
            return false;
        }
        const allowedLanguages = MEMBERSHIP_LIMITS[user.membership].allowedLanguages;
        return allowedLanguages === 'all' || allowedLanguages.includes(language);
    };

    return { isOperationAllowed, canTranslateToLanguage };
};

// Mantenemos las versiones que no dependen de useAuth para uso en contextos no-React
export const isOperationAllowedStatic = (operation, membershipType) => {
    if (!membershipType || !MEMBERSHIP_LIMITS[membershipType]) {
        return false;
    }
    return MEMBERSHIP_LIMITS[membershipType].allowedOperations.includes(operation);
};

export const canTranslateToLanguageStatic = (language, membershipType) => {
    if (!membershipType || !MEMBERSHIP_LIMITS[membershipType]) {
        return false;
    }
    const allowedLanguages = MEMBERSHIP_LIMITS[membershipType].allowedLanguages;
    return allowedLanguages === 'all' || allowedLanguages.includes(language);
};