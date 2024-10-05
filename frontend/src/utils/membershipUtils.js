import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'react-hot-toast';
import { MEMBERSHIP_LIMITS } from './membershipLimits';
import { getErrorMessage } from './errorMessages';

export const checkMembershipLimits = async (operation, pageCount) => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const limits = MEMBERSHIP_LIMITS[user.membership];

    if (!limits.allowedOperations.includes(operation)) {
        toast.error(getErrorMessage('operationNotAllowed', language));
        return false;
    }

    if (pageCount > limits.maxPages) {
        toast.error(getErrorMessage('pageLimitExceeded', language));
        return false;
    }

    // Check operation counters
    if (user.membership === 'free') {
        if (user.weeklyOperations >= limits.weeklyOperations) {
            toast.error(getErrorMessage('operationLimitReached', language));
            return false;
        }
    } else if (user.membership === 'basic') {
        if (user.monthlyOperations >= limits.monthlyOperations) {
            toast.error(getErrorMessage('operationLimitReached', language));
            return false;
        }
    }
    // Premium users have no operation limits, so no check is needed

    return true;
};

export const getProblemSolvingLimit = () => {
    const { user } = useAuth();
    return MEMBERSHIP_LIMITS[user.membership].problemSolvingLimit;
};

export const isOperationAllowed = (operation) => {
    const { user } = useAuth();
    const limits = MEMBERSHIP_LIMITS[user.membership];
    return limits.allowedOperations.includes(operation);
};

export const getPageLimit = () => {
    const { user } = useAuth();
    return MEMBERSHIP_LIMITS[user.membership].maxPages;
};

export const canTranslateToLanguage = (language) => {
    const { user } = useAuth();
    const allowedLanguages = MEMBERSHIP_LIMITS[user.membership].allowedLanguages;
    return allowedLanguages === 'all' || allowedLanguages.includes(language);
};

export const getConceptMapNodeLimit = () => {
    const { user } = useAuth();
    return MEMBERSHIP_LIMITS[user.membership].maxConceptMapNodes;
};

export const canExport = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const limits = MEMBERSHIP_LIMITS[user.membership];
    
    if (user.membership === 'free' && user.weeklyExports >= limits.weeklyExports) {
        toast.error(getErrorMessage('exportLimitReached', language));
        return false;
    } else if (user.membership === 'basic' && user.monthlyExports >= limits.monthlyExports) {
        toast.error(getErrorMessage('exportLimitReached', language));
        return false;
    }
    
    return true;
};

export const incrementExportCount = () => {
    const { user } = useAuth();
    if (user.membership === 'free') {
        user.weeklyExports += 1;
    } else if (user.membership === 'basic') {
        user.monthlyExports += 1;
    }
    // No es necesario incrementar para usuarios premium
};