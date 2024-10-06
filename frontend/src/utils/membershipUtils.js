import { MEMBERSHIP_LIMITS } from './membershipLimits';

export const isOperationAllowed = (operation, membershipType) => {
    if (!membershipType || !MEMBERSHIP_LIMITS[membershipType]) {
        return false;
    }
    return MEMBERSHIP_LIMITS[membershipType].allowedOperations.includes(operation);
};

export const canTranslateToLanguage = (language, membershipType) => {
    if (!membershipType || !MEMBERSHIP_LIMITS[membershipType]) {
        return false;
    }
    const allowedLanguages = MEMBERSHIP_LIMITS[membershipType].allowedLanguages;
    return allowedLanguages === 'all' || allowedLanguages.includes(language);
};
