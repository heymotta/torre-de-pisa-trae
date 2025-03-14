
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Clock, CheckCircle, TruckIcon, BadgeInfo } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Progress } from '@/components/ui/progress';

// Order status types
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered';

interface Order {
  id: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  deliveryAddress: string;
  estimatedDelivery?: string;
}

// Mock orders data - in a real app, this would come from an API
const mockOrders: Order[] = [
  {
    id: '1001',
    items: [
      { name: 'Classic Motta', quantity: 2, price: 29.90 },
      { name: 'Motta Bacon', quantity: 1, price: 32.90 },
    ],
    status: 'preparing',
    total: 92.70,
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    deliveryAddress: 'Rua das Flores, 123, Jardim Primavera, São Paulo - SP',
    estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
  },
  {
    id: '1000',
    items: [
      { name: 'Veggie Motta', quantity: 1, price: 28.90 },
      { name: 'Double Motta', quantity: 1, price: 39.90 },
    ],
    status: 'delivered',
    total: 68.80,
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    deliveryAddress: 'Rua das Flores, 123, Jardim Primavera, São Paulo - SP',
  }
];

const OrderStatusDisplay = ({ status }: { status: OrderStatus }) => {
  const statusInfo = {
    pending: {
      title: 'Pendente',
      description: 'Aguardando confirmação do restaurante',
      icon: Clock,
      color: 'text-yellow-500',
      progress: 0
    },
    preparing: {
      title: 'Em Preparo',
      description: 'Seu pedido está sendo preparado',
      icon: BadgeInfo,
      color: 'text-blue-500',
      progress: 25
    },
    ready: {
      title: 'Pronto',
      description: 'Seu pedido está pronto e aguardando o entregador',
      icon: CheckCircle,
      color: 'text-green-500',
      progress: 50
    },
    delivering: {
      title: 'Saiu para Entrega',
      description: 'Seu pedido está a caminho',
      icon: TruckIcon,
      color: 'text-purple-500',
      progress: 75
    },
    delivered: {
      title: 'Entregue',
      description: 'Seu pedido foi entregue. Bom apetite!',
      icon: CheckCircle,
      color: 'text-green-500',
      progress: 100
    }
  };

  const { title, description, icon: Icon, color, progress } = statusInfo[status];

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="font-medium">{title}</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-motta-600">{description}</p>
    </div>
  );
};

const OrderTracking = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold flex items-center">
              <Package className="mr-2 h-7 w-7" /> Meus Pedidos
            </h1>
            <Link 
              to="/menu" 
              className="text-motta-600 hover:text-motta-primary transition-colors flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar para o Cardápio
            </Link>
          </div>
          
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-motta-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Carregando seus pedidos...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-motta-200 overflow-hidden">
                  <div className="p-4 border-b border-motta-200 bg-motta-50 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="text-sm text-motta-600">Pedido #{order.id}</span>
                      <h3 className="font-medium">{formatDate(order.createdAt)}</h3>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-sm text-motta-600">Total</span>
                      <p className="font-bold text-motta-primary">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <OrderStatusDisplay status={order.status} />
                    
                    {order.estimatedDelivery && order.status !== 'delivered' && (
                      <p className="text-sm bg-motta-50 p-2 rounded-md">
                        <span className="font-medium">Entrega estimada:</span> {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Itens do Pedido</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Endereço de Entrega</h4>
                      <p className="text-sm">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-motta-200">
              <div className="flex justify-center mb-4">
                <Package className="h-16 w-16 text-motta-400" />
              </div>
              <h2 className="text-2xl font-display font-semibold mb-2">Nenhum pedido encontrado</h2>
              <p className="text-motta-600 max-w-md mx-auto mb-8">
                Você ainda não fez nenhum pedido.
                Explore nosso cardápio e faça seu primeiro pedido!
              </p>
              <Link 
                to="/menu" 
                className="inline-flex items-center justify-center px-6 py-2 bg-motta-primary text-white rounded-full hover:bg-motta-primary/90 transition-colors"
              >
                Ver Cardápio
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderTracking;
