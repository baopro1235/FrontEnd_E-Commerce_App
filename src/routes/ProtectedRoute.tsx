import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, logoutPending } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={
          logoutPending ? null : { from: location, requiresLogin: true }
        }
        replace
      />
    );
  }

  return <Outlet />;
}
