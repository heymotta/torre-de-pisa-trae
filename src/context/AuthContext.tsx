
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data on initial load
    const storedUser = localStorage.getItem('mottaBurguerUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('mottaBurguerUser');
      }
    }
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (email === 'admin@motta.com' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          name: 'Administrador',
          email: 'admin@motta.com',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('mottaBurguerUser', JSON.stringify(adminUser));
        toast.success('Login realizado com sucesso!');
        navigate('/admin/dashboard');
        return;
      }
      
      if (email === 'cliente@email.com' && password === 'cliente123') {
        const clientUser: User = {
          id: '2',
          name: 'Cliente Exemplo',
          email: 'cliente@email.com',
          role: 'client'
        };
        setUser(clientUser);
        localStorage.setItem('mottaBurguerUser', JSON.stringify(clientUser));
        toast.success('Login realizado com sucesso!');
        navigate('/');
        return;
      }
      
      // If credentials don't match
      toast.error('Email ou senha inválidos');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mottaBurguerUser');
    toast.info('Sessão encerrada');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      logout,
      loading
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
