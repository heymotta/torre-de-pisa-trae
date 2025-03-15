
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Auth state:', { isAuthenticated, loading, initialized });

  // Show loading state while checking authentication
  if (!initialized || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4"></div>
          <p>Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Render children if authenticated
  console.log('ProtectedRoute - User is authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
