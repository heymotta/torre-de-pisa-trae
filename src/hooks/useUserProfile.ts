
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const useUserProfile = () => {
  const fetchUserProfile = async (userId: string, userEmail: string): Promise<UserProfile | null> => {
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

  const updateUserProfile = async (
    userId: string, 
    data: Partial<Omit<UserProfile, 'id' | 'email'>>
  ) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        nome: data.nome,
        telefone: data.telefone,
        endereco: data.endereco
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return true;
  };

  return {
    fetchUserProfile,
    updateUserProfile
  };
};
