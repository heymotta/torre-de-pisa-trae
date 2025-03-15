
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/layout/AdminLayout';
import { useUserProfile } from '@/hooks/useUserProfile';
import { updateUserRole } from '@/services/authService';
import { UserProfile } from '@/types/auth';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const UsersAdmin = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchAllUsers } = useUserProfile();

  // Loads users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersList = await fetchAllUsers();
      setUsers(usersList);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar usuários: ' + (error.message || 'Tente novamente'));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, currentRole: 'client' | 'admin') => {
    // Toggle between client and admin
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    
    try {
      await updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? {...user, role: newRole} : user
      ));
      
      toast.success(`Usuário atualizado para ${newRole === 'admin' ? 'administrador' : 'cliente'}`);
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error('Erro ao atualizar papel do usuário: ' + (error.message || 'Tente novamente'));
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Gerenciar Usuários | Admin</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          <Button onClick={loadUsers} variant="outline">
            Atualizar
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex space-x-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableCaption>Lista de todos os usuários do sistema</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleRoleChange(user.id, user.role || 'client')}
                        variant={user.role === 'admin' ? "destructive" : "default"}
                        size="sm"
                      >
                        {user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersAdmin;
