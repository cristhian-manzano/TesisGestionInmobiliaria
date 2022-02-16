import { useState, useContext } from 'react';

import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';

export const useTenantRent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const { authSession } = useContext(AuthContext);

  const getAll = async () => {
    setLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/rent`,
      token: authSession.user?.token,
      method: 'GET'
    });
    setLoading(false);

    if (response.error) {
      setError(true);
    } else {
      setData(response.data.data);
    }
  };

  const api = {
    getAll
  };

  return { api, loading, error, data };
};
