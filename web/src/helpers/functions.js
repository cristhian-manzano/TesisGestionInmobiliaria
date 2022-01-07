const responseFormat = ({ error = false, message = '', data = {}, redirect = '' }) => {
  return {
    message,
    error,
    data,
    redirect
  };
};

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
      return responseFormat({
        error: false,
        message: 'Usuario no autorizado.',
        data: dataResponse,
        redirect: '/login'
      });
    }

    return responseFormat({ error: false, message: 'Solicitud exitosa.', data: dataResponse });
  } catch (error) {
    console.log(error);
    return responseFormat({ error: true, message: 'Error de conexión.' });
  }
};
