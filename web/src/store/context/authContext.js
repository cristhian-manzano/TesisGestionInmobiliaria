import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getLocalstorage } from '../../helpers/utils';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authSession, setAuthSession] = useState({
    user: getLocalstorage('session')
  });

  const values = useMemo(() => ({ authSession, setAuthSession }), [authSession]); // Set userAuth as dependency if necessary
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
