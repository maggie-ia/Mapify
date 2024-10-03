import { toast } from 'react-hot-toast';

export const validateFile = (file, maxSize, allowedTypes) => {
    if (!file) {
        toast.error('No se ha seleccionado ningún archivo');
        return false;
    }

    if (file.size > maxSize) {
        toast.error(`El archivo excede el tamaño máximo permitido de ${maxSize / (1024 * 1024)} MB`);
        return false;
    }

    const fileType = file.type.split('/')[1];
    if (!allowedTypes.includes(fileType)) {
        toast.error(`Tipo de archivo no permitido. Se permiten: ${allowedTypes.join(', ')}`);
        return false;
    }

    return true;
};