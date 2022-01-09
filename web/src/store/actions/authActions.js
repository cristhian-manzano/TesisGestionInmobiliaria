import { setSession, removeSession } from '../../helpers/session';
import { sendRequest } from '../../helpers/utils';

export const login = async (dispatch, loginPayload) => {
  dispatch({ type: 'REQUEST_LOGIN' });

  const response = await sendRequest({
    urlPath: '/auth/signin',
    method: 'POST',
    data: loginPayload
  });

  if (response.error) {
    dispatch({ type: 'LOGIN_ERROR', error: response.message });
  } else {
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data });
    setSession(response.data.data);
  }

  return response;
};

export const logout = (dispatch) => {
  dispatch({ type: 'LOGOUT' });
  removeSession();
};
