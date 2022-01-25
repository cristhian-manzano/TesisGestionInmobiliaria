import { useState, useEffect } from 'react';
import { sendRequest } from '../helpers/utils';

export const usePropertyFormData = () => {
  const [sectors, setSectors] = useState([]);
  const [typeProperties, setTypeProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTypeProperties = async () => {
    setLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/type-property`,
      method: 'GET'
    });
    setLoading(false);

    if (response.error) {
      setError('Error de conexión!');
    } else {
      setTypeProperties(response.data?.data || []);
    }
  };

  const fetchSectors = async () => {
    setLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_PROPERTY_SERVICE_URL}/sector`,
      method: 'GET'
    });
    setLoading(false);

    if (response.error) {
      setError('Error de conexión!');
    } else {
      setSectors(response.data?.data || []);
    }
  };

  useEffect(() => {
    fetchTypeProperties();
    fetchSectors();
  }, []);

  return { sectors, typeProperties, loading, error };
};
