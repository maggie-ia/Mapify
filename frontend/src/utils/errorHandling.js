/**
 * Maneja errores de la API y los formatea para su uso en la interfaz de usuario.
 * @param {Error} error - El error capturado.
 * @param {string} defaultMessage - Mensaje por defecto si no se puede extraer uno del error.
 * @returns {Object} - Objeto de error formateado.
 */
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
  
  /**
   * Muestra un mensaje de error al usuario.
   * @param {string} message - El mensaje de error a mostrar.
   */
  export const showErrorToUser = (message) => {
    // Aquí puedes implementar la lógica para mostrar el error al usuario
    // Por ejemplo, usando un componente de notificación o un modal
    console.error('Error:', message);
    // Ejemplo: alert(message);
  };