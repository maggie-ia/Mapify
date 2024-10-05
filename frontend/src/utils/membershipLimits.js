export const MEMBERSHIP_LIMITS = {
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