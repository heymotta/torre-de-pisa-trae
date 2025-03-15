
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const useUserProfile = () => {
  const fetchUserProfile = async (userId: string, userEmail: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for ID:', userId);
      
      // First, get user metadata from auth
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }
      
      if (!userData || !userData.user) {
        console.error('No user data found');
        return null;
      }
      
      // Get role from user metadata
      let role = userData.user.user_metadata?.role || 'client';
      console.log('User role from metadata:', role);
      
      // Then, get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        
        // If profile doesn't exist, create a default one
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, creating default profile');
          
          const defaultProfile = {
            id: userId,
            nome: userData.user.user_metadata?.nome || userEmail.split('@')[0],
            telefone: userData.user.user_metadata?.telefone || '',
            endereco: userData.user.user_metadata?.endereco || ''
          };
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile);
            
          if (insertError) {
            console.error('Error creating default profile:', insertError);
            return null;
          }
          
          return {
            id: userId,
            email: userEmail,
            nome: defaultProfile.nome,
            telefone: defaultProfile.telefone,
            endereco: defaultProfile.endereco,
            role: role as 'client' | 'admin'
          };
        }
        
        return null;
      }

      console.log('Profile data loaded:', profileData);
      return {
        id: profileData.id,
        email: userEmail,
        nome: profileData.nome || '',
        role: role as 'client' | 'admin',
        telefone: profileData.telefone || '',
        endereco: profileData.endereco || ''
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
    try {
      console.log('Updating profile for user ID:', userId, 'with data:', data);
      
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
      
      console.log('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      throw error;
    }
  };

  const fetchAllUsers = async (): Promise<UserProfile[]> => {
    try {
      console.log('Fetching all user profiles (admin only)');
      
      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      if (!profilesData || profilesData.length === 0) {
        console.log('No profiles found');
        return [];
      }
      
      // Get all users with their metadata for roles
      const { data, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }
      
      // Check if users is defined before accessing it
      if (!data || !data.users) {
        console.error('No users data returned from auth.admin.listUsers');
        return [];
      }
      
      const users = data.users;
      
      // Map profiles with user data
      const userProfiles: UserProfile[] = profilesData.map(profile => {
        const matchedUser = users.find(user => user.id === profile.id);
        const role = matchedUser?.user_metadata?.role || 'client';
        const email = matchedUser?.email || '';
        
        return {
          id: profile.id,
          nome: profile.nome,
          email: email,
          role: role as 'client' | 'admin',
          telefone: profile.telefone || '',
          endereco: profile.endereco || ''
        };
      });
      
      console.log(`Found ${userProfiles.length} user profiles`);
      return userProfiles;
    } catch (error) {
      console.error('Error in fetchAllUsers:', error);
      return [];
    }
  };

  return {
    fetchUserProfile,
    updateUserProfile,
    fetchAllUsers
  };
};
