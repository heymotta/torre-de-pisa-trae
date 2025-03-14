
import { useState, FormEvent } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import PrimaryButton from '@/components/ui/custom/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const Login = () => {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  const { login, signup, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const from = (location.state as any)?.from || '/menu';
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      // We don't reset state here since successful login will redirect
    } catch (error) {
      console.error('Login error:', error);
      // Don't show toast here as it's handled in the auth service
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!nome.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }
    
    if (signupPassword !== signupPasswordConfirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (signupPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signup(signupEmail, signupPassword, {
        nome,
        telefone,
        endereco,
        role: 'client'
      });
      // We don't reset state here since successful signup will redirect
    } catch (error) {
      console.error('Signup error:', error);
      // Don't show toast here as it's handled in the auth service
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="bg-white rounded-xl shadow-md border border-motta-200 overflow-hidden animate-fade-in">
            <Tabs 
              defaultValue="login" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-motta-200">
                <TabsList className="w-full grid grid-cols-2 bg-motta-50">
                  <TabsTrigger value="login" className="py-3">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="py-3">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Conta
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="login" className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-display font-bold mb-2">Bem-vindo de volta!</h1>
                  <p className="text-motta-600">
                    Entre com sua conta para continuar
                  </p>
                </div>
                
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="password" className="block text-sm font-medium">
                        Senha
                      </label>
                      <a 
                        href="#" 
                        className="text-xs text-motta-primary hover:underline"
                      >
                        Esqueceu a senha?
                      </a>
                    </div>
                    
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-motta-500 hover:text-motta-700"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <PrimaryButton 
                      type="submit" 
                      fullWidth 
                      size="lg"
                      isLoading={isSubmitting || loading}
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? "Entrando..." : "Entrar"}
                    </PrimaryButton>
                  </div>
                </form>
                
                <div className="mt-6 text-center text-sm text-motta-600">
                  Ainda não tem uma conta?{' '}
                  <button 
                    onClick={() => setActiveTab('signup')} 
                    className="text-motta-primary font-medium hover:underline"
                    disabled={isSubmitting || loading}
                  >
                    Criar conta
                  </button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-display font-bold mb-2">Crie sua conta</h1>
                  <p className="text-motta-600">
                    Preencha os dados abaixo para se cadastrar
                  </p>
                </div>
                
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="nome" className="block text-sm font-medium">
                      Nome completo
                    </label>
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Seu nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signupEmail" className="block text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="telefone" className="block text-sm font-medium">
                        Telefone
                      </label>
                      <Input
                        id="telefone"
                        type="tel"
                        placeholder="(99) 99999-9999"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="endereco" className="block text-sm font-medium">
                        Endereço
                      </label>
                      <Input
                        id="endereco"
                        type="text"
                        placeholder="Seu endereço"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signupPassword" className="block text-sm font-medium">
                      Senha
                    </label>
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-motta-500 hover:text-motta-700"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        aria-label={showSignupPassword ? "Esconder senha" : "Mostrar senha"}
                        disabled={isSubmitting}
                      >
                        {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium">
                      Confirme a senha
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={signupPasswordConfirm}
                      onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                      required
                      minLength={6}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <PrimaryButton 
                      type="submit" 
                      fullWidth 
                      size="lg"
                      isLoading={isSubmitting || loading}
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? "Criando conta..." : "Criar conta"}
                    </PrimaryButton>
                  </div>
                </form>
                
                <div className="mt-6 text-center text-sm text-motta-600">
                  Já tem uma conta?{' '}
                  <button 
                    onClick={() => setActiveTab('login')} 
                    className="text-motta-primary font-medium hover:underline"
                    disabled={isSubmitting || loading}
                  >
                    Entrar
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
