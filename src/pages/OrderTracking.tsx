
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Truck, 
  Package, 
  ArrowLeft 
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
  id: string;
  pedido_id: string;
  pizza_id: string;
  quantidade: number;
  subtotal: number;
  pizza: {
    nome: string;
    preco: number;
    imagem_url?: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  criado_em: string;
  itens: OrderItem[];
}

const statusSteps = [
  { key: 'pendente', label: 'Pendente', icon: Clock },
  { key: 'em preparo', label: 'Em preparo', icon: ChefHat },
  { key: 'saiu para entrega', label: 'Saiu para entrega', icon: Truck },
  { key: 'entregue', label: 'Entregue', icon: CheckCircle }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

const OrderTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        // 1. Buscar os pedidos do usuário
        const { data: ordersData, error: ordersError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('usuario_id', user?.id)
          .order('criado_em', { ascending: false });

        if (ordersError) throw ordersError;
        if (!ordersData) return;
        
        // 2. Para cada pedido, buscar os seus itens
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: itemsData, error: itemsError } = await supabase
              .from('pedido_itens')
              .select(`
                *,
                pizza:pizza_id (
                  nome,
                  preco,
                  imagem_url
                )
              `)
              .eq('pedido_id', order.id);

            if (itemsError) throw itemsError;
            
            return {
              ...order,
              itens: itemsData || []
            };
          })
        );
        
        setOrders(ordersWithItems);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        toast.error('Erro ao carregar seus pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated]);

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold flex items-center">
              <Package className="mr-2 h-8 w-8" /> Meus Pedidos
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate('/menu')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao Cardápio
            </Button>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-motta-200 overflow-hidden">
                  <div className="p-4 border-b border-motta-200 bg-motta-50 flex justify-between">
                    <div className="h-6 bg-motta-200 rounded w-1/4"></div>
                    <div className="h-6 bg-motta-200 rounded w-1/5"></div>
                  </div>
                  <div className="p-6">
                    <div className="h-24 bg-motta-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map(order => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-xl shadow-sm border border-motta-200 overflow-hidden transition-all duration-300"
                >
                  <div 
                    className="p-4 border-b border-motta-200 bg-motta-50 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">Pedido #{order.id.substring(0, 8)}</span>
                      <span className="mx-3 text-motta-300">•</span>
                      <span className="text-sm text-motta-600">{formatDate(order.criado_em)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-motta-primary">{formatPrice(parseFloat(order.total.toString()))}</span>
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-300 overflow-hidden ${expandedOrder === order.id ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className="p-6">
                      <div className="mb-6">
                        <h3 className="font-medium mb-3">Status do Pedido</h3>
                        <div className="relative flex justify-between">
                          {statusSteps.map((step, index) => {
                            const currentStatus = getStatusIndex(order.status);
                            const isActive = index <= currentStatus;
                            const StepIcon = step.icon;
                            
                            return (
                              <div key={step.key} className="flex flex-col items-center z-10">
                                <div className={`${isActive ? 'bg-motta-primary text-white' : 'bg-motta-100 text-motta-400'} h-10 w-10 rounded-full flex items-center justify-center transition-colors`}>
                                  <StepIcon className="h-5 w-5" />
                                </div>
                                <span className={`text-xs mt-2 text-center max-w-[80px] ${isActive ? 'text-motta-primary font-medium' : 'text-motta-400'}`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                          
                          {/* Progress line */}
                          <div className="absolute top-5 left-0 w-full h-0.5 bg-motta-100 -z-10"></div>
                          <div 
                            className="absolute top-5 left-0 h-0.5 bg-motta-primary -z-10 transition-all duration-500"
                            style={{ 
                              width: `${getStatusIndex(order.status) / (statusSteps.length - 1) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-medium mb-3">Itens do Pedido</h3>
                        <div className="space-y-4">
                          {order.itens.map(item => (
                            <div key={item.id} className="flex items-center py-2 border-b border-motta-100">
                              <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.pizza?.imagem_url || "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&q=80"} 
                                  alt={item.pizza?.nome} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              
                              <div className="ml-4 flex-grow">
                                <h4 className="font-medium">{item.pizza?.nome}</h4>
                                <p className="text-sm text-motta-600">
                                  Quantidade: {item.quantidade}
                                </p>
                              </div>
                              
                              <div className="text-right ml-4">
                                <p className="font-medium">{formatPrice(parseFloat(item.subtotal.toString()))}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-motta-200">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-motta-primary">{formatPrice(parseFloat(order.total.toString()))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-motta-200 animate-fade-in">
              <div className="flex justify-center mb-4">
                <Package className="h-16 w-16 text-motta-400" />
              </div>
              <h2 className="text-2xl font-display font-semibold mb-2">Nenhum pedido encontrado</h2>
              <p className="text-motta-600 max-w-md mx-auto mb-8">
                Você ainda não realizou nenhum pedido. Explore nosso cardápio e faça seu primeiro pedido!
              </p>
              <Button onClick={() => navigate('/menu')} className="bg-motta-primary hover:bg-motta-primary/90">
                Ver Cardápio
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderTracking;
