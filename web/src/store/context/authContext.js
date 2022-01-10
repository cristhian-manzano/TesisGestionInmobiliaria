import { createContext, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { authReducer } from '../reducers/authReducer';
import { getLocalstorage } from '../../helpers/utils';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const user = getLocalstorage('session');

  const initialState = {
    user,
    loading: false,
    errorMessage: null
  };

  const [userAuth, dispatch] = useReducer(authReducer, initialState);
  const values = useMemo(() => ({ userAuth, dispatch }), [userAuth]); // Set userAuth as dependency if necessary
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
