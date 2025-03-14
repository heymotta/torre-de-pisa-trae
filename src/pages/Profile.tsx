
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PrimaryButton from '@/components/ui/custom/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user information in localStorage to persist changes
      if (user) {
        const updatedUser = {
          ...user,
          name,
          email,
          phone,
          address
        };
        
        localStorage.setItem('mottaBurguerUser', JSON.stringify(updatedUser));
        toast.success('Informações atualizadas com sucesso!');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Erro ao atualizar informações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md border border-motta-200 overflow-hidden animate-fade-in">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold">Meu Perfil</h1>
                  <p className="text-motta-600 mt-1">
                    Gerencie suas informações pessoais
                  </p>
                </div>
                
                <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4 sm:mt-0">
                      Sair da conta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deseja realmente sair?</DialogTitle>
                      <DialogDescription>
                        Você será desconectado da sua conta. Para acessar novamente, será necessário fazer login.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowLogoutDialog(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                      >
                        Sim, sair
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Endereço completo</Label>
                    <Input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1"
                      placeholder="Rua, número, bairro, complemento, cidade, estado"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <PrimaryButton 
                    type="submit" 
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Salvar alterações
                  </PrimaryButton>
                </div>
              </form>
              
              {user?.role === 'admin' && (
                <div className="mt-8 pt-6 border-t border-motta-200">
                  <h2 className="text-xl font-display font-bold mb-4">Acesso Administrativo</h2>
                  <PrimaryButton
                    onClick={() => navigate('/admin/dashboard')}
                  >
                    Acessar Painel Administrativo
                  </PrimaryButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
