
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile } from '@/types/auth';
import { login as loginService, signup as signupService, logout as logoutService } from '@/services/authService';

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
    console.log('Setting up auth state listener');
    
    const setupUser = async (session: Session | null) => {
      console.log('Setting up user from session:', session);
      if (session?.user) {
        try {
          console.log('Fetching user profile for ID:', session.user.id);
          const profile = await fetchUserProfile(session.user.id, session.user.email || '');
          
          if (profile) {
            console.log('Profile loaded:', profile);
            setUser(profile);
          } else {
            console.warn('No profile found for user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error setting up user:', error);
          setUser(null);
        }
      } else {
        console.log('No session, clearing user');
        setUser(null);
      }
      setLoading(false);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setupUser(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        await setupUser(session);
      }
    );

    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('handleLogin called with email:', email);
      await loginService(email, password);
      // Navigation is handled by the authentication state change
      console.log('Login service completed successfully');
    } catch (error: any) {
      console.error('Login error in context:', error);
      toast.error('Erro ao fazer login: ' + (error.message || 'Tente novamente'));
      throw error;
    } finally {
      console.log('Login process completed, setting loading to false');
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
      console.log('handleSignup called with email:', email);
      await signupService(email, password, userData);
      // Navigation is handled by the authentication state change
      console.log('Signup service completed successfully');
    } catch (error: any) {
      console.error('Signup error in context:', error);
      toast.error('Erro ao fazer cadastro: ' + (error.message || 'Tente novamente'));
      throw error;
    } finally {
      console.log('Signup process completed, setting loading to false');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log('handleLogout called');
      await logoutService();
      // Navigation is handled here as the auth state change might not immediately clear everything
      navigate('/login');
      console.log('Logout service completed successfully, navigating to login');
    } catch (error: any) {
      console.error('Logout error in context:', error);
      toast.error('Erro ao encerrar sessão: ' + (error.message || 'Tente novamente'));
    } finally {
      console.log('Logout process completed, setting loading to false');
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Omit<UserProfile, 'id' | 'email'>>) => {
    if (!user) {
      console.error('Cannot update profile: No user logged in');
      return;
    }
    
    setLoading(true);
    try {
      console.log('updateProfile called with data:', data);
      await updateUserProfile(user.id, data);
      
      // Update local user state
      setUser(prev => prev ? {...prev, ...data} : null);
      console.log('Profile updated successfully');
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil: ' + (error.message || 'Tente novamente'));
      throw error;
    } finally {
      console.log('Profile update process completed, setting loading to false');
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
