import { useState, useContext } from 'react';

import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';

export const useContract = () => {
  const { authSession } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const getAll = async () => {
    setLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/contracts`,
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

  return { loading, error, data, api };
};
