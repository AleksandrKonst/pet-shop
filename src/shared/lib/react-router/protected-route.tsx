import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/shared/lib/store/hooks';

export const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const PublicRoute = ({ children }: { children: ReactElement }) => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return !isAuthenticated ? children : <Navigate to="/" />;
};
