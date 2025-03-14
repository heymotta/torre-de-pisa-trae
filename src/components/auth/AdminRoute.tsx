
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { checkIsAdmin } from '@/services/authService';
import { toast } from 'sonner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      try {
        // Double-check admin status directly with Supabase
        const adminStatus = await checkIsAdmin();
        setIsAdminUser(adminStatus);
      } catch (error) {
        console.error('Error verifying admin status:', error);
        toast.error('Erro ao verificar permissões de administrador');
      } finally {
        setIsVerifying(false);
      }
    };

    if (!loading && isAuthenticated) {
      verifyAdminStatus();
    } else {
      setIsVerifying(false);
    }
  }, [loading, isAuthenticated]);

  // Show loading state while checking authentication
  if (loading || isVerifying) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Use either the context admin status or the double-checked status
  const hasAdminAccess = isAdmin || isAdminUser;

  // Redirect to home if authenticated but not admin
  if (!hasAdminAccess) {
    toast.error('Acesso negado. Esta área é restrita aos administradores.');
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and admin
  return <>{children}</>;
};

export default AdminRoute;
