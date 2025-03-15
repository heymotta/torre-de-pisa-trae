
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Menu as MenuIcon, 
  Package, 
  Settings, 
  ShoppingBag, 
  User, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if window width is less than 1024px
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
      // Auto close sidebar on small screens
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Check on initial load
    checkScreenSize();
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
    navigate('/');
  };

  const NAV_ITEMS = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard' 
    },
    { 
      title: 'Pedidos', 
      icon: Package, 
      href: '/admin/orders',
      active: location.pathname === '/admin/orders' 
    },
    { 
      title: 'Cardápio', 
      icon: ShoppingBag, 
      href: '/admin/menu',
      active: location.pathname === '/admin/menu'
    }
  ];

  return (
    <div className="min-h-screen bg-motta-50">
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-motta-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
        
        <Link 
          to="/admin/dashboard" 
          className="flex items-center"
          aria-label="Admin Dashboard"
        >
          <span className="font-display font-bold text-xl text-motta-primary">
            Motta<span className="text-motta-secondary">Admin</span>
          </span>
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile sidebar */}
      <div 
        className={`lg:hidden fixed inset-0 z-30 bg-black/50 transition-opacity ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      <div 
        className={`lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-white z-30 transform transition-transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto py-6 px-4">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.href} 
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    item.active 
                      ? 'bg-motta-100 text-motta-primary' 
                      : 'hover:bg-motta-50 text-motta-700 hover:text-motta-primary'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-motta-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-motta-200 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-motta-700" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.nome}</p>
                <p className="text-xs text-motta-600">{user?.email}</p>
              </div>
            </div>
            
            <Link 
              to="/"
              className="flex items-center text-sm text-motta-600 hover:text-motta-primary transition-colors"
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar para o site
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={`hidden lg:block fixed inset-y-0 left-0 bg-white z-20 w-64 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-48'
        }`}
      >
        <div className="flex h-screen flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-motta-200">
            <Link 
              to="/admin/dashboard" 
              className={`flex items-center ${!isSidebarOpen && 'opacity-0 invisible'}`}
            >
              <span className="font-display font-bold text-xl text-motta-primary">
                Motta<span className="text-motta-secondary">Admin</span>
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              className={isSidebarOpen ? "" : "ml-auto"}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto py-6">
            <nav className="px-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.href} 
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    item.active 
                      ? 'bg-motta-100 text-motta-primary' 
                      : 'hover:bg-motta-50 text-motta-700 hover:text-motta-primary'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className={isSidebarOpen ? "" : "opacity-0 invisible"}>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-motta-200">
            <div className={`flex items-center mb-3 ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 rounded-full bg-motta-200 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-motta-700" />
              </div>
              <div className={isSidebarOpen ? "" : "hidden"}>
                <p className="font-medium text-sm">{user?.nome}</p>
                <p className="text-xs text-motta-600">{user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Link 
                to="/"
                className={`flex items-center text-sm text-motta-600 hover:text-motta-primary transition-colors px-3 py-2 rounded-md ${
                  !isSidebarOpen && 'justify-center'
                }`}
              >
                <Home className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className={isSidebarOpen ? "" : "hidden"}>Voltar para o site</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className={`flex items-center text-sm text-red-600 hover:text-red-700 transition-colors px-3 py-2 rounded-md w-full ${
                  !isSidebarOpen && 'justify-center'
                }`}
              >
                <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className={isSidebarOpen ? "" : "hidden"}>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main 
        className={`pt-16 lg:pt-0 pb-12 transition-all duration-200 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
