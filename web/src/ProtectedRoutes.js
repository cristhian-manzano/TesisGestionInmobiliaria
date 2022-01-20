import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './store/context/authContext';

export const ProtectedRoutes = () => {
  const { authSession } = useContext(AuthContext);
  return authSession.user ? <Outlet /> : <Navigate to="/login" />;
};
