import { useState, useContext } from 'react';

import { sendRequest } from '../../../helpers/utils';
import { AuthContext } from '../../../store/context/authContext';

export const useComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const { authSession } = useContext(AuthContext);

  const create = async (dataForm) => {
    setLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/comment`,
      method: 'POST',
      token: authSession.user?.token,
      data: dataForm
    });
    setLoading(false);

    if (response.error) setError(response.error);
  };

  const list = async (observationId) => {
    setLoading(true);

    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/comment/${observationId}`,
      method: 'GET',
      token: `${authSession?.user?.token}`
    });

    setLoading(false);

    if (response.error) setError(response.error);
    else setData(response.data?.data);
  };

  const remove = async (id) => {
    setLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/comment/${id}`,
      token: authSession.user?.token,
      method: 'DELETE'
    });
    setLoading(false);

    if (response.error) setError(response.error);
  };

  const details = async (id) => {
    setLoading(true);
    const response = await sendRequest({
      urlPath: `${process.env.REACT_APP_RENT_SERVICE_URL}/observation/${id}`,
      method: 'GET',
      token: `${authSession?.user?.token}`
    });

    setLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    setData(response.data?.data);
  };

  const api = {
    create,
    list,
    remove,
    details
  };

  return { loading, error, data, api };
};
