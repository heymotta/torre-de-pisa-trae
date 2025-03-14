
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile } from '@/types/auth';
import { login, signup, logout } from '@/services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Omit<UserProfile, 'id' | 'email'>) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  updateProfile: (data: Partial<Omit<UserProfile, 'id' | 'email'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchUserProfile, updateUserProfile } = useUserProfile();

  // Set up auth state listener
  useEffect(() => {
    const setupUser = async (session: Session | null) => {
      if (session?.user) {
        try {
          const profile = await fetchUserProfile(session.user.id, session.user.email || '');
          
          if (profile) {
            setUser(profile);
          }
        } catch (error) {
          console.error('Error setting up user:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setupUser(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        await setupUser(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, fetchUserProfile]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await login(email, password);
      navigate('/menu');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login: ' + (error.message || 'Tente novamente'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (
    email: string, 
    password: string, 
    userData: Omit<UserProfile, 'id' | 'email'>
  ) => {
    setLoading(true);
    try {
      await signup(email, password, userData);
      navigate('/menu');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Erro ao fazer cadastro: ' + (error.message || 'Tente novamente'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Erro ao encerrar sessão: ' + (error.message || 'Tente novamente'));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Omit<UserProfile, 'id' | 'email'>>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateUserProfile(user.id, data);
      
      // Update local user state
      setUser(prev => prev ? {...prev, ...data} : null);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil: ' + (error.message || 'Tente novamente'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login: handleLogin,
      signup: handleSignup,
      logout: handleLogout,
      loading,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
