import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'react-hot-toast';

const MEMBERSHIP_LIMITS = {
    free: {
        weeklyOperations: 3,
        maxPages: 5,
        allowedOperations: ['summarize', 'paraphrase', 'translate', 'problemSolving'],
        maxConceptMapNodes: 0,
        allowedLanguages: ['en', 'es'],
        weeklyExports: 1,
        problemSolvingLimit: 5
    },
    basic: {
        monthlyOperations: 10,
        maxPages: 10,
        allowedOperations: ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'relevantPhrases', 'translate', 'problemSolving'],
        maxConceptMapNodes: 6,
        allowedLanguages: ['en', 'es', 'fr', 'de'],
        monthlyExports: 10,
        problemSolvingLimit: 20
    },
    premium: {
        monthlyOperations: Infinity,
        maxPages: Infinity,
        allowedOperations: ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'relevantPhrases', 'translate', 'problemSolving'],
        maxConceptMapNodes: Infinity,
        allowedLanguages: 'all',
        monthlyExports: Infinity,
        problemSolvingLimit: Infinity
    }
};

const getErrorMessage = (errorType, language) => {
  const translations = {
    es: {
      operationNotAllowed: 'Esta operación no está permitida para tu nivel de membresía.',
      pageLimitExceeded: 'Has excedido el límite de páginas para tu membresía.',
      operationLimitReached: 'Has alcanzado el límite de operaciones para este período.',
      exportLimitReached: 'Has alcanzado el límite de exportaciones para este período.',
      languageNotAllowed: 'Este idioma no está disponible para tu nivel de membresía.'
    },
    en: {
      operationNotAllowed: 'This operation is not allowed for your membership level.',
      pageLimitExceeded: 'You have exceeded the page limit for your membership.',
      operationLimitReached: 'You have reached the operation limit for this period.',
      exportLimitReached: 'You have reached the export limit for this period.',
      languageNotAllowed: 'This language is not available for your membership level.'
    },
    fr: {
      operationNotAllowed: 'Cette opération n\'est pas autorisée pour votre niveau d\'adhésion.',
      pageLimitExceeded: 'Vous avez dépassé la limite de pages pour votre adhésion.',
      operationLimitReached: 'Vous avez atteint la limite d\'opérations pour cette période.',
      exportLimitReached: 'Vous avez atteint la limite d\'exportations pour cette période.',
      languageNotAllowed: 'Cette langue n\'est pas disponible pour votre niveau d\'adhésion.'
    }
  };

  return translations[language][errorType];
};

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