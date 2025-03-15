
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Pizza, 
  Users,
  ChevronRight 
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />
    },
    {
      name: 'Pedidos',
      path: '/admin/orders',
      icon: <ClipboardList className="mr-2 h-5 w-5" />
    },
    {
      name: 'Cardápio',
      path: '/admin/menu',
      icon: <Pizza className="mr-2 h-5 w-5" />
    },
    {
      name: 'Usuários',
      path: '/admin/users',
      icon: <Users className="mr-2 h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="bg-gray-50 w-full md:w-64 md:min-h-[calc(100vh-64px)] p-4 border-r">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Painel de Administração</h2>
            <p className="text-sm text-gray-500">Olá, {user?.nome || 'Administrador'}</p>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link to={item.path} key={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive(item.path) ? '' : 'hover:bg-gray-100'}`}
                >
                  {item.icon}
                  {item.name}
                  {isActive(item.path) && (
                    <ChevronRight className="ml-auto h-5 w-5" />
                  )}
                </Button>
              </Link>
            ))}
          </nav>
          
          <div className="absolute bottom-4 left-4 md:static md:mt-8">
            <Link to="/">
              <Button variant="outline" className="w-full">
                Voltar para o site
              </Button>
            </Link>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLayout;
