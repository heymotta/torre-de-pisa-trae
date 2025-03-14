
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role?: 'client' | 'admin';
  telefone?: string;
  endereco?: string;
}

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

  // Fetch user profile data
  const fetchUserProfile = async (userId: string, userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      // Get user role from auth.users metadata
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      let role = 'client';
      if (!userError && userData && userData.user && userData.user.user_metadata) {
        role = userData.user.user_metadata.role || 'client';
      }

      return {
        id: data.id,
        nome: data.nome || '',
        email: userEmail,
        role: role as 'client' | 'admin',
        telefone: data.telefone || '',
        endereco: data.endereco || ''
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const setupUser = async (session: Session | null) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id, session.user.email || '');
        
        if (profile) {
          setUser(profile);
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

        // Redirect based on auth event
        if (event === 'SIGNED_IN' && session) {
          navigate('/menu');
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    userData: Omit<UserProfile, 'id' | 'email'>
  ) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: userData.nome,
            telefone: userData.telefone,
            endereco: userData.endereco,
            role: 'client' // Default role
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      
      toast.success('Cadastro realizado com sucesso!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Erro ao fazer cadastro. Tente novamente.');
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Omit<UserProfile, 'id' | 'email'>>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: data.nome,
          telefone: data.telefone,
          endereco: data.endereco
        })
        .eq('id', user.id);
      
      if (error) {
        toast.error('Erro ao atualizar perfil: ' + error.message);
        return;
      }
      
      // Update local user state
      setUser(prev => prev ? {...prev, ...data} : null);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      setUser(null);
      toast.info('Sessão encerrada');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao encerrar sessão. Tente novamente.');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      signup,
      logout,
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
