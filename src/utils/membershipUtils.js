import { useAuth } from '../hooks/useAuth';

const MEMBERSHIP_LIMITS = {
  free: {
    weeklyOperations: 3,
    maxPages: 5,
    allowedOperations: ['summarize', 'paraphrase', 'translate'],
    maxConceptMapNodes: 0,
    allowedLanguages: ['en', 'es']
  },
  basic: {
    monthlyOperations: 10,
    maxPages: 10,
    allowedOperations: ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'relevantPhrases', 'translate'],
    maxConceptMapNodes: 6,
    allowedLanguages: ['en', 'es', 'fr', 'de']
  },
  premium: {
    monthlyOperations: Infinity,
    maxPages: Infinity,
    allowedOperations: ['summarize', 'paraphrase', 'synthesize', 'conceptMap', 'relevantPhrases', 'translate'],
    maxConceptMapNodes: Infinity,
    allowedLanguages: 'all'
  }
};

/**
 * Verifica los límites de membresía para una operación dada.
 * @param {string} operation - Tipo de operación a verificar.
 * @throws {Error} Si se exceden los límites de la membresía.
 */
export const checkMembershipLimits = async (operation) => {
  const { user } = useAuth();
  const limits = MEMBERSHIP_LIMITS[user.membership];

  if (!limits.allowedOperations.includes(operation)) {
    throw new Error(`Operation ${operation} not allowed for ${user.membership} membership`);
  }

  // Aquí se deberían verificar los contadores de operaciones del usuario
  // Esta lógica dependerá de cómo se estén almacenando y actualizando estos contadores
  // Por ahora, asumiremos que están dentro de los límites
};

/**
 * Verifica si una operación está permitida para el tipo de membresía actual.
 * @param {string} operation - Tipo de operación a verificar.
 * @returns {boolean} - True si la operación está permitida, false en caso contrario.
 */
export const isOperationAllowed = (operation) => {
  const { user } = useAuth();
  const limits = MEMBERSHIP_LIMITS[user.membership];
  return limits.allowedOperations.includes(operation);
};

/**
 * Obtiene el límite de páginas para la membresía actual.
 * @returns {number} - Límite de páginas.
 */
export const getPageLimit = () => {
  const { user } = useAuth();
  return MEMBERSHIP_LIMITS[user.membership].maxPages;
};

/**
 * Verifica si se puede traducir a un idioma específico.
 * @param {string} language - Código del idioma a verificar.
 * @returns {boolean} - True si se puede traducir al idioma, false en caso contrario.
 */
export const canTranslateToLanguage = (language) => {
  const { user } = useAuth();
  const allowedLanguages = MEMBERSHIP_LIMITS[user.membership].allowedLanguages;
  return allowedLanguages === 'all' || allowedLanguages.includes(language);
};

/**
 * Obtiene el límite de nodos para mapas conceptuales.
 * @returns {number} - Límite de nodos para mapas conceptuales.
 */
export const getConceptMapNodeLimit = () => {
  const { user } = useAuth();
  return MEMBERSHIP_LIMITS[user.membership].maxConceptMapNodes;
};