import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './store/context/authContext';

export const ProtectedRoutes = () => {
  const { userAuth } = useContext(AuthContext);
  return userAuth.user ? <Outlet /> : <Navigate to="/login" />;
};
