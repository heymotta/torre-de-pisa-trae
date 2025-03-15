
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  console.log('AdminRoute - Auth state:', { isAuthenticated, isAdmin, loading });

  // Show loading state while checking authentication
  if (loading) {
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
    console.log('AdminRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    console.log('AdminRoute - Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and admin
  console.log('AdminRoute - User is admin, rendering protected content');
  return <>{children}</>;
};

export default AdminRoute;
