
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/auth';

export const login = async (email: string, password: string) => {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    toast.success('Login realizado com sucesso!');
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Provide more user-friendly error messages
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Email ou senha inválidos');
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
      throw error;
    }
    
    toast.success('Cadastro realizado com sucesso!');
    return data;
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Provide more user-friendly error messages
    if (error.message.includes('already registered')) {
      throw new Error('Este email já está cadastrado');
    } else if (error.message.includes('password')) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    } else {
      throw error;
    }
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    toast.info('Sessão encerrada');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
