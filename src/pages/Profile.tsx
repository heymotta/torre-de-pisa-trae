
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { fetchUserProfile, updateUserProfile } = useUserProfile();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const userProfile = await fetchUserProfile(user.id, user.email);
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            nome: userProfile.nome || '',
            telefone: userProfile.telefone || '',
            endereco: userProfile.endereco || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Erro ao carregar perfil', {
          description: 'Não foi possível carregar seus dados. Tente novamente.'
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user, fetchUserProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setSaving(true);
      await updateUserProfile(user.id, formData);
      toast.success('Perfil atualizado', {
        description: 'Seus dados foram atualizados com sucesso.'
      });
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...formData } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil', {
        description: 'Não foi possível atualizar seus dados. Tente novamente.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
        <Separator className="mb-6" />
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-motta-primary" />
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
        <Separator className="mb-6" />
        <Card>
          <CardContent className="py-6">
            <div className="text-center">
              <p>Não foi possível carregar os dados do perfil.</p>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <Separator className="mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Informações pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais aqui.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone" 
                  name="telefone" 
                  value={formData.telefone} 
                  onChange={handleChange} 
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input 
                  id="endereco" 
                  name="endereco" 
                  value={formData.endereco} 
                  onChange={handleChange} 
                  placeholder="Rua, número, bairro, cidade, estado"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" asChild>
                <Link to="/orders">Ver meus pedidos</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar alterações
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da conta</CardTitle>
            <CardDescription>Informações da sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <UserCircle className="h-24 w-24 text-motta-primary" />
            </div>
            
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Tipo de conta</p>
              <p className="text-sm text-muted-foreground capitalize">{profile.role || 'Cliente'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
