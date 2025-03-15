
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchUserOrders, Order, getOrderStatus } from '@/services/orderService';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const OrderTracking = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const userOrders = await fetchUserOrders(user.id);
        console.log('Orders fetched:', userOrders);
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Não foi possível carregar seus pedidos. Tente novamente mais tarde.');
        toast.error('Erro ao carregar pedidos', {
          description: 'Não foi possível carregar seus pedidos. Tente novamente.'
        });
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    if (user && !initialized) {
      loadOrders();
    }
  }, [user, initialized]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM', às' HH:mm", { locale: ptBR });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  // Don't render anything until we've done our first load attempt
  if (!initialized && loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meus Pedidos</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
        <Separator className="mb-6" />
        
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-14 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meus Pedidos</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
        <Separator className="mb-6" />
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="py-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meus Pedidos</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
        <Separator className="mb-6" />
        
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Você ainda não tem pedidos</h3>
              <p className="text-muted-foreground mb-4">Seus pedidos aparecerão aqui quando você fizer seu primeiro pedido.</p>
              <Button asChild>
                <Link to="/menu">Ver cardápio</Link>
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
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <Separator className="mb-6" />
      
      {orders.map((order) => {
        const { index: statusIndex, label: statusLabel, color } = getOrderStatus(order.status);
        const progressValue = statusIndex >= 0 ? (statusIndex / 3) * 100 : 0;
        
        return (
          <Card key={order.id} className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-lg">Pedido #{order.id.substring(0, 8)}</CardTitle>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${color} text-white`}>
                  {statusLabel}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Realizado em {formatDate(order.criado_em)}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Progresso do Pedido</h4>
                {statusIndex >= 0 && statusIndex < 4 ? (
                  <>
                    <Progress value={progressValue} className="mb-2" />
                    <div className="grid grid-cols-4 text-xs">
                      <div className={statusIndex >= 0 ? "font-medium text-primary" : "text-muted-foreground"}>Pendente</div>
                      <div className={statusIndex >= 1 ? "font-medium text-primary" : "text-muted-foreground"}>Em preparo</div>
                      <div className={statusIndex >= 2 ? "font-medium text-primary" : "text-muted-foreground"}>Saiu para entrega</div>
                      <div className={statusIndex >= 3 ? "font-medium text-primary" : "text-muted-foreground"}>Entregue</div>
                    </div>
                  </>
                ) : (
                  <p className="text-red-500">Pedido cancelado</p>
                )}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Itens do Pedido</h4>
                <div className="space-y-2">
                  {order.itens.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-center w-6">{item.quantidade}x</div>
                        <div>{item.pizza?.nome || 'Pizza indisponível'}</div>
                      </div>
                      <div>R$ {((item.subtotal || item.pizza?.preco * item.quantidade) / 100).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right font-medium">
                  Total: R$ {(order.total / 100).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrderTracking;
