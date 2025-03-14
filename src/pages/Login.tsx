
import { useState, FormEvent } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import PrimaryButton from '@/components/ui/custom/PrimaryButton';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  const from = (location.state as any)?.from || '/';
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="bg-white rounded-xl shadow-md border border-motta-200 overflow-hidden animate-fade-in">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-bold mb-2">Bem-vindo de volta!</h1>
                <p className="text-motta-600">
                  Entre com sua conta para continuar
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-motta-500 hover:text-motta-700"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
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
                    isLoading={loading}
                    disabled={loading}
                  >
                    Entrar
                  </PrimaryButton>
                </div>
              </form>
              
              <div className="mt-6 text-center text-sm text-motta-600">
                Ainda não tem uma conta?{' '}
                <Link to="#" className="text-motta-primary font-medium hover:underline">
                  Criar conta
                </Link>
              </div>
              
              <div className="mt-8 border-t border-motta-200 pt-6">
                <p className="text-sm text-center text-motta-500 mb-2">
                  Para fazer login como cliente de teste, use:
                </p>
                <div className="text-xs bg-motta-50 p-3 rounded-md text-motta-700">
                  <p><strong>Email:</strong> cliente@email.com</p>
                  <p><strong>Senha:</strong> cliente123</p>
                </div>
                
                <p className="text-sm text-center text-motta-500 mt-4 mb-2">
                  Para fazer login como administrador de teste, use:
                </p>
                <div className="text-xs bg-motta-50 p-3 rounded-md text-motta-700">
                  <p><strong>Email:</strong> admin@motta.com</p>
                  <p><strong>Senha:</strong> admin123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
