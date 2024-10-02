const MEMBERSHIP_LIMITS = {
  free: {
    weeklyOperations: 3,
    maxPages: 5,
    allowedOperations: ['summarize', 'paraphrase', 'translate'],
    allowedLanguages: ['en', 'es']
  },
  basic: {
    monthlyOperations: 10,
    maxPages: 10,
    allowedOperations: ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'relevantPhrases', 'translate'],
    allowedLanguages: ['en', 'es', 'fr', 'de']
  },
  premium: {
    monthlyOperations: Infinity,
    maxPages: Infinity,
    allowedOperations: ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'relevantPhrases', 'translate'],
    allowedLanguages: 'all'
  }
};

export const checkMembershipLimits = async (operation, pageCount) => {
  // Esta función debería hacer una llamada a la API para verificar los límites del usuario
  // Por ahora, simplemente retornamos true
  return true;
};

export const isOperationAllowed = (operation, membershipType) => {
  if (!membershipType) return false;
  return MEMBERSHIP_LIMITS[membershipType].allowedOperations.includes(operation);
};

export const canTranslateToLanguage = (language, membershipType) => {
  if (!membershipType) return false;
  const allowedLanguages = MEMBERSHIP_LIMITS[membershipType].allowedLanguages;
  return allowedLanguages === 'all' || allowedLanguages.includes(language);
};

export const getPageLimit = (membershipType) => {
  return MEMBERSHIP_LIMITS[membershipType].maxPages;
};
