
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartItem from '@/components/ui/custom/CartItem';
import PrimaryButton from '@/components/ui/custom/PrimaryButton';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Cart = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Você precisa fazer login para finalizar o pedido', {
        description: 'Por favor, faça login para continuar.'
      });
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast.success('Pedido realizado com sucesso!', {
        description: 'Seu pedido foi enviado e está sendo preparado.',
      });
      clearCart();
      setIsSubmitting(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold flex items-center">
              <ShoppingCart className="mr-2 h-8 w-8" /> Seu Carrinho
            </h1>
            <Link 
              to="/menu" 
              className="text-motta-600 hover:text-motta-primary transition-colors flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Continuar Comprando
            </Link>
          </div>
          
          {totalItems > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-motta-200 overflow-hidden">
                  <div className="p-4 border-b border-motta-200 bg-motta-50">
                    <h2 className="font-medium">Itens do Carrinho ({totalItems})</h2>
                  </div>
                  
                  <div className="divide-y divide-motta-200 p-4">
                    {items.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-motta-200 bg-motta-50 flex justify-between items-center">
                    <button 
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 transition-colors flex items-center text-sm"
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Limpar Carrinho
                    </button>
                    
                    <span className="font-medium">
                      Subtotal: <span className="text-motta-primary font-bold">{formatPrice(totalPrice)}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-motta-200 overflow-hidden sticky top-24">
                  <div className="p-4 border-b border-motta-200 bg-motta-50">
                    <h2 className="font-medium">Resumo do Pedido</h2>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-motta-600">Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-motta-600">Taxa de entrega</span>
                      <span>{formatPrice(5.90)}</span>
                    </div>
                    
                    <div className="border-t border-motta-200 pt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-motta-primary">{formatPrice(totalPrice + 5.90)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-motta-200">
                    <PrimaryButton 
                      onClick={handleCheckout} 
                      fullWidth 
                      size="lg"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Finalizar Pedido
                    </PrimaryButton>
                    
                    <p className="text-xs text-motta-500 text-center mt-3">
                      Ao finalizar seu pedido, você concorda com nossos
                      <Link to="/terms" className="text-motta-primary hover:underline mx-1">
                        Termos de Serviço
                      </Link>
                      e
                      <Link to="/privacy" className="text-motta-primary hover:underline ml-1">
                        Política de Privacidade
                      </Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-motta-200 animate-fade-in">
              <div className="flex justify-center mb-4">
                <ShoppingCart className="h-16 w-16 text-motta-400" />
              </div>
              <h2 className="text-2xl font-display font-semibold mb-2">Seu carrinho está vazio</h2>
              <p className="text-motta-600 max-w-md mx-auto mb-8">
                Parece que você ainda não adicionou nenhum item ao seu carrinho.
                Explore nosso cardápio e descubra hambúrgueres deliciosos!
              </p>
              <PrimaryButton as={Link} to="/menu">
                Ver Cardápio
              </PrimaryButton>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
