import { useAuth } from '../hooks/useAuth';

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

export const checkMembershipLimits = async (operation, pageCount) => {
  const { user } = useAuth();
  const limits = MEMBERSHIP_LIMITS[user.membership];

  if (!limits.allowedOperations.includes(operation)) {
    throw new Error(`Operation ${operation} not allowed for ${user.membership} membership`);
  }

  if (pageCount > limits.maxPages) {
    throw new Error(`Document exceeds the ${limits.maxPages} page limit for ${user.membership} membership`);
  }

  // Aquí se deberían verificar los contadores de operaciones del usuario
  // Esta lógica dependerá de cómo se estén almacenando y actualizando estos contadores
  // Por ahora, asumiremos que están dentro de los límites
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

export const getProblemSolvingLimit = () => {
  const { user } = useAuth();
  return MEMBERSHIP_LIMITS[user.membership].problemSolvingLimit;
};

export const canExport = (format) => {
  const { user } = useAuth();
  const limits = MEMBERSHIP_LIMITS[user.membership];
  
  // Verificar si el usuario aún tiene exportaciones disponibles
  if (user.membership === 'free') {
    return user.weeklyExports < limits.weeklyExports;
  } else if (user.membership === 'basic') {
    return user.monthlyExports < limits.monthlyExports;
  }
  
  return true; // Para usuarios premium
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
