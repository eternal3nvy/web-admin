import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default LoginRoute;
