import { toast } from 'react-hot-toast';
import { MEMBERSHIP_LIMITS } from './membershipLimits';

export const validateFile = (file, membershipType, language) => {
    if (!file) {
        toast.error(getErrorMessage('noFile', language));
        return false;
    }

    const maxSize = MEMBERSHIP_LIMITS[membershipType].maxFileSize;
    if (file.size > maxSize) {
        toast.error(getErrorMessage('sizeExceeded', language, { size: maxSize / (1024 * 1024) }));
        return false;
    }

    const allowedTypes = ['pdf', 'docx', 'txt'];
    const fileType = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileType)) {
        toast.error(getErrorMessage('invalidType', language, { types: allowedTypes.join(', ') }));
        return false;
    }

    return true;
};

const getErrorMessage = (type, language, params = {}) => {
    const messages = {
        es: {
            noFile: 'No se ha seleccionado ningún archivo',
            sizeExceeded: `El archivo excede el tamaño máximo permitido de ${params.size} MB`,
            invalidType: `Tipo de archivo no permitido. Se permiten: ${params.types}`
        },
        en: {
            noFile: 'No file has been selected',
            sizeExceeded: `The file exceeds the maximum allowed size of ${params.size} MB`,
            invalidType: `File type not allowed. Allowed types: ${params.types}`
        },
        fr: {
            noFile: 'Aucun fichier n\'a été sélectionné',
            sizeExceeded: `Le fichier dépasse la taille maximale autorisée de ${params.size} Mo`,
            invalidType: `Type de fichier non autorisé. Types autorisés : ${params.types}`
        }
    };

    return messages[language][type] || messages['en'][type];
};