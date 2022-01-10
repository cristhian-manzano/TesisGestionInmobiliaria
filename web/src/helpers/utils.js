import { responsesFormat } from './constants';

export const sendRequest = async ({
  urlPath = '',
  method = 'GET',
  isFormData = false,
  data,
  token
}) => {
  try {
    const headers = new Headers();

    if (!isFormData) {
      headers.append('Content-Type', 'application/json');
    }

    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}${urlPath}`, {
      method,
      headers,
      body: data && !isFormData ? JSON.stringify(data) : data
    });

    const dataResponse = await response.json();

    if (!response.ok && [401, 403].includes(response.status) && token) {
      localStorage.removeItem('sesion');
      return responsesFormat({
        error: true,
        message: 'Usuario no autorizado.',
        data: dataResponse,
        redirect: '/login'
      });
    }

    if (dataResponse.error)
      return responsesFormat({
        error: true,
        message: 'Error solicitud.'
      });

    return responsesFormat({ error: false, message: 'Solicitud exitosa.', data: dataResponse });
  } catch (error) {
    return responsesFormat({ error: true, message: 'Error de conexión.' });
  }
};

export const setLocalstorage = (key, value) => {
  localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
};

export const getLocalstorage = (key) => {
  const value = localStorage.getItem(key);

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
