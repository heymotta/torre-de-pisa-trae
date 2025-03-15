
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/auth';

export const login = async (email: string, password: string) => {
  try {
    console.log('Attempting login for:', email);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error);
      throw error;
    }
    
    console.log('Login successful, session:', data.session);
    toast.success('Login realizado com sucesso!');
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Provide more user-friendly error messages
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Email ou senha inválidos');
    } else if (error.message.includes('Too many requests')) {
      throw new Error('Muitas tentativas. Tente novamente mais tarde');
    } else if (error.message.includes('timeout')) {
      throw new Error('Tempo esgotado. Verifique sua conexão');
    } else {
      throw error;
    }
  }
};

export const signup = async (
  email: string, 
  password: string, 
  userData: Omit<UserProfile, 'id' | 'email'>
) => {
  try {
    console.log('Attempting signup for:', email);
    const { error, data } = await supabase.auth.signUp({
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
      console.error('Signup error:', error);
      throw error;
    }
    
    console.log('Signup successful:', data);
    toast.success('Cadastro realizado com sucesso!');
    return data;
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Provide more user-friendly error messages
    if (error.message.includes('already registered')) {
      throw new Error('Este email já está cadastrado');
    } else if (error.message.includes('password')) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    } else if (error.message.includes('timeout')) {
      throw new Error('Tempo esgotado. Verifique sua conexão');
    } else if (error.message.includes('Too many requests')) {
      throw new Error('Muitas tentativas. Tente novamente mais tarde');
    } else {
      throw error;
    }
  }
};

export const logout = async () => {
  try {
    console.log('Attempting logout');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
    
    console.log('Logout successful');
    toast.info('Sessão encerrada');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const checkSession = async () => {
  try {
    console.log('Checking current session');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session check error:', error);
      throw error;
    }
    
    console.log('Current session:', data.session);
    return data.session;
  } catch (error) {
    console.error('Failed to check session:', error);
    throw error;
  }
};

export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return false;
    }
    
    console.log('User metadata:', data.user.user_metadata);
    return data.user.user_metadata?.role === 'admin';
  } catch (error) {
    console.error('Failed to check admin status:', error);
    return false;
  }
};

export const updateUserRole = async (userId: string, role: 'client' | 'admin') => {
  try {
    console.log(`Updating user ${userId} role to ${role}`);
    
    // Use Supabase admin functions to update user
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role } }
    );
    
    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
    
    console.log('User role updated successfully');
    return true;
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
};
