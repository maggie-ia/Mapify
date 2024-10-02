import axios from 'axios';

const BASE_URL = '/api'; // Asumimos que tenemos un endpoint en nuestro backend para esto

export const getLocalizationInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/localization`);
    return response.data;
  } catch (error) {
    console.error('Error fetching localization info:', error);
    return { currency: 'USD', countryCode: 'US' }; // Valor por defecto en caso de error
  }
};

export const formatPrice = (price, currency, countryCode) => {
  return new Intl.NumberFormat(countryCode, {
    style: 'currency',
    currency: currency,
  }).format(price);
};