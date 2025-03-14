import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleProfileClick = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/profile');
    }
  };

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Cardápio', path: '/menu' },
    { name: 'Sobre', path: '/about' },
    { name: 'Contato', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled || isMobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
              aria-label="Torre de Pisa Home"
            >
              <span className="font-display font-bold text-2xl text-motta-primary">
                Torre<span className="text-motta-secondary">de Pisa</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-base transition-colors hover:text-motta-primary ${
                  location.pathname === link.path ? 'text-motta-primary' : 'text-motta-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              size="sm"
              variant="outline"
              className="relative border-motta-300 bg-white hover:bg-motta-50"
              aria-label="Shopping Cart"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5 text-motta-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-motta-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              size="sm"
              variant={user ? "outline" : "default"}
              className={user ? "border-motta-300 bg-white hover:bg-motta-50" : "bg-motta-primary hover:bg-motta-primary/90"}
              onClick={user ? handleProfileClick : () => navigate('/login')}
            >
              {user ? (
                <div className="flex items-center space-x-2 text-motta-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.nome?.split(' ')[0]}</span>
                </div>
              ) : (
                <span>Entrar</span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <Button
              size="icon"
              variant="outline"
              className="relative border-motta-300 bg-white"
              aria-label="Shopping Cart"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5 text-motta-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-motta-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="border-motta-300 bg-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-motta-700" /> : <Menu className="h-5 w-5 text-motta-700" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block py-2 px-3 rounded-md text-base font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-motta-100 text-motta-primary'
                  : 'text-motta-700 hover:bg-motta-50 hover:text-motta-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start py-2 px-3 rounded-md text-base font-medium bg-motta-50 text-motta-primary mt-2"
            onClick={user ? handleProfileClick : () => navigate('/login')}
          >
            {user ? `${isAdmin ? 'Painel Admin' : 'Meu Perfil'} (${user.nome?.split(' ')[0]})` : 'Entrar'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
