const errorMessages = {
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

export const getErrorMessage = (errorType, language) => {
    return errorMessages[language][errorType];
};