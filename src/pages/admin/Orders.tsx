
import { useState, useEffect } from 'react';
import { 
  Check, CheckCircle, Clock, Filter, Package, Search, TruckIcon, X 
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  deliveryAddress: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1001',
    customerName: 'João Silva',
    customerPhone: '(11) 98765-4321',
    items: [
      { name: 'Classic Motta', quantity: 2, price: 29.90 },
      { name: 'Motta Bacon', quantity: 1, price: 32.90 },
    ],
    status: 'preparing',
    total: 92.70,
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    deliveryAddress: 'Rua das Flores, 123, Jardim Primavera, São Paulo - SP',
  },
  {
    id: '1000',
    customerName: 'Maria Oliveira',
    customerPhone: '(11) 91234-5678',
    items: [
      { name: 'Veggie Motta', quantity: 1, price: 28.90 },
      { name: 'Double Motta', quantity: 1, price: 39.90 },
    ],
    status: 'delivered',
    total: 68.80,
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    deliveryAddress: 'Avenida Paulista, 1578, Bela Vista, São Paulo - SP',
  },
  {
    id: '999',
    customerName: 'Carlos Pereira',
    customerPhone: '(11) 99876-5432',
    items: [
      { name: 'Motta Bacon', quantity: 2, price: 32.90 },
      { name: 'Chicken Motta', quantity: 1, price: 27.90 },
    ],
    status: 'pending',
    total: 93.70,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    deliveryAddress: 'Rua Augusta, 456, Consolação, São Paulo - SP',
  },
  {
    id: '998',
    customerName: 'Ana Santos',
    customerPhone: '(11) 98888-7777',
    items: [
      { name: 'Double Motta', quantity: 1, price: 39.90 },
      { name: 'Motta Fish', quantity: 1, price: 31.90 },
      { name: 'Classic Motta', quantity: 1, price: 29.90 },
    ],
    status: 'delivering',
    total: 101.70,
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    deliveryAddress: 'Rua Oscar Freire, 789, Jardins, São Paulo - SP',
  },
];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Load orders
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.id.includes(searchTerm) || 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

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

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );

    const statusLabels = {
      pending: 'Pendente',
      preparing: 'Em Preparo',
      ready: 'Pronto',
      delivering: 'Saiu para Entrega',
      delivered: 'Entregue'
    };

    toast.success(`Pedido #${orderId} atualizado para ${statusLabels[newStatus]}`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
      preparing: { label: 'Em Preparo', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
      ready: { label: 'Pronto', className: 'bg-green-100 text-green-800 hover:bg-green-200' },
      delivering: { label: 'Saiu para Entrega', className: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
      delivered: { label: 'Entregue', className: 'bg-green-100 text-green-800 hover:bg-green-200' }
    };

    const { label, className } = statusConfig[status];

    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Pedidos</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-motta-600">
            {filteredOrders.length} pedidos encontrados
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-motta-500" />
          <Input 
            type="search" 
            placeholder="Buscar por ID, cliente ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select 
          value={statusFilter} 
          onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
        >
          <SelectTrigger>
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="preparing">Em Preparo</SelectItem>
            <SelectItem value="ready">Pronto</SelectItem>
            <SelectItem value="delivering">Saiu para Entrega</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={sortBy} 
          onValueChange={(value) => setSortBy(value as 'newest' | 'oldest')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais recentes primeiro</SelectItem>
            <SelectItem value="oldest">Mais antigos primeiro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-motta-200 p-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-5 bg-motta-200 rounded w-24"></div>
                  <div className="h-4 bg-motta-200 rounded w-40"></div>
                </div>
                <div className="h-6 bg-motta-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-lg border border-motta-200 overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-motta-50 transition-colors"
                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1.5 text-motta-600" />
                      <h3 className="font-medium">Pedido #{order.id}</h3>
                    </div>
                    <p className="text-sm text-motta-600">
                      {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="font-bold text-motta-primary">
                      {formatPrice(order.total)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
              
              {expandedOrderId === order.id && (
                <div className="p-4 bg-motta-50 border-t border-motta-200 animate-fadeDown">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Detalhes do Cliente</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Nome:</span> {order.customerName}</p>
                        <p><span className="font-medium">Telefone:</span> {order.customerPhone}</p>
                        <p><span className="font-medium">Endereço:</span> {order.deliveryAddress}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Itens do Pedido</h4>
                      <div className="space-y-2 text-sm">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-motta-200 flex justify-between font-medium">
                          <span>Total</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-motta-200 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h4 className="font-medium">Atualizar Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Atualizar Status
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Status do Pedido</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'pending')}
                                disabled={order.status === 'pending'}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                <span>Pendente</span>
                                {order.status === 'pending' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                disabled={order.status === 'preparing'}
                              >
                                <Package className="mr-2 h-4 w-4" />
                                <span>Em Preparo</span>
                                {order.status === 'preparing' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                disabled={order.status === 'ready'}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                <span>Pronto</span>
                                {order.status === 'ready' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'delivering')}
                                disabled={order.status === 'delivering'}
                              >
                                <TruckIcon className="mr-2 h-4 w-4" />
                                <span>Saiu para Entrega</span>
                                {order.status === 'delivering' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                disabled={order.status === 'delivered'}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Entregue</span>
                                {order.status === 'delivered' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setExpandedOrderId(null)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Fechar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-motta-200">
          <Package className="h-12 w-12 text-motta-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
          <p className="text-motta-600 max-w-md mx-auto">
            Não encontramos pedidos com os filtros atuais. Tente ajustar os filtros para ver mais resultados.
          </p>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
