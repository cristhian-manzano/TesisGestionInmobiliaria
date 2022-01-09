import { createContext, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { authReducer } from '../reducers/authReducer';
import { getSession } from '../../helpers/session';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { token, ...user } = getSession();

  const initialState = {
    user,
    token,
    loading: false,
    errorMessage: null
  };

  const [userSession, dispatch] = useReducer(authReducer, initialState);
  const values = useMemo(() => ({ userSession, dispatch }), [userSession]); // Set userSession as dependency if necessary
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
