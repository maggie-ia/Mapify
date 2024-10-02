export const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error);

  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    return {
      message: error.response.data.message || defaultMessage,
      status: error.response.status
    };
  } else if (error.request) {
    // La solicitud se hizo pero no se recibió respuesta
    return {
      message: 'No se recibió respuesta del servidor. Por favor, intente de nuevo más tarde.',
      status: 'NETWORK_ERROR'
    };
  } else {
    // Algo sucedió al configurar la solicitud que desencadenó un error
    return {
      message: error.message || defaultMessage,
      status: 'UNKNOWN_ERROR'
    };
  }
};