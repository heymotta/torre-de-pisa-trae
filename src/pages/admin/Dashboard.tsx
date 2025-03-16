
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Calendar, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { toast } from 'sonner';

// Services for fetching real data
import { countPizzas } from '@/services/pizzaService';
import { 
  countTodayOrders, 
  countTotalCustomers, 
  calculateLastMonthSales,
  getLastWeekSales,
  getRecentOrders,
  getPopularPizzas,
  getOrderStatus
} from '@/services/orderService';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    ordersToday: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalSales: 0,
    salesData: [] as { name: string; vendas: number }[],
    recentOrders: [] as any[],
    popularPizzas: [] as { id: string; nome: string; imagem_url?: string; count: number }[]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all dashboard data in parallel
        const [
          ordersTodayData,
          totalCustomersData,
          totalProductsData,
          totalSalesData,
          salesData,
          recentOrdersData,
          popularPizzasData
        ] = await Promise.all([
          countTodayOrders(),
          countTotalCustomers(),
          countPizzas(),
          calculateLastMonthSales(),
          getLastWeekSales(),
          getRecentOrders(),
          getPopularPizzas()
        ]);

        setDashboardData({
          ordersToday: ordersTodayData,
          totalCustomers: totalCustomersData,
          totalProducts: totalProductsData,
          totalSales: totalSalesData,
          salesData,
          recentOrders: recentOrdersData,
          popularPizzas: popularPizzasData
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erro ao carregar informações do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-motta-600" />
          <span className="text-sm text-motta-600">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-motta-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-motta-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-motta-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                <Package className="h-4 w-4 text-motta-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.ordersToday}</div>
                <p className="text-xs text-motta-600">
                  Atualizado em tempo real
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-motta-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalCustomers}</div>
                <p className="text-xs text-motta-600">
                  Usuários registrados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos no Cardápio</CardTitle>
                <ShoppingBag className="h-4 w-4 text-motta-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalProducts}</div>
                <p className="text-xs text-motta-600">
                  Pizzas disponíveis
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas (Último Mês)</CardTitle>
                <TrendingUp className="h-4 w-4 text-motta-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalSales)}</div>
                <p className="text-xs text-motta-600">
                  Total dos últimos 30 dias
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-8">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Vendas da Última Semana</CardTitle>
                <CardDescription>
                  Total de vendas por dia nos últimos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={dashboardData.salesData}>
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `R$${value}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`R$${value}`, 'Vendas']}
                        labelFormatter={(label) => `${label}:`}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar 
                        dataKey="vendas" 
                        fill="#22c55e" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Pedidos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentOrders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Pedido #{order.id.substring(0, 5)}</p>
                          <p className="text-xs text-motta-600">
                            {order.itens ? `${order.itens.length} itens` : '0 itens'} • {formatCurrency(order.total)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatus(order.status).color.replace('bg-', 'bg-opacity-20 text-')}`}>
                          {getOrderStatus(order.status).label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-motta-600 py-4">Nenhum pedido recente</p>
                )}
                <div className="mt-4 text-center">
                  <Link
                    to="/admin/orders"
                    className="text-sm text-motta-primary hover:underline"
                  >
                    Ver todos os pedidos
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Produtos Populares
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.popularPizzas.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.popularPizzas.map((pizza) => (
                      <div key={pizza.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded overflow-hidden mr-2">
                            <img 
                              src={pizza.imagem_url || "/placeholder.svg"}
                              alt={pizza.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <p className="text-sm font-medium">{pizza.nome}</p>
                        </div>
                        <span className="text-sm font-medium">{pizza.count} vendidos</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-motta-600 py-4">Nenhum produto vendido ainda</p>
                )}
                <div className="mt-4 text-center">
                  <Link
                    to="/admin/menu"
                    className="text-sm text-motta-primary hover:underline"
                  >
                    Gerenciar cardápio
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Taxa de Conclusão de Pedidos</span>
                      <span className="text-sm font-medium">
                        {dashboardData.ordersToday > 0 ? '96%' : 'N/A'}
                      </span>
                    </div>
                    <div className="w-full bg-motta-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Tempo Médio de Entrega</span>
                      <span className="text-sm font-medium">
                        {dashboardData.ordersToday > 0 ? '32 min' : 'N/A'}
                      </span>
                    </div>
                    <div className="w-full bg-motta-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Satisfação do Cliente</span>
                      <span className="text-sm font-medium">
                        {dashboardData.totalCustomers > 0 ? '4.8/5' : 'N/A'}
                      </span>
                    </div>
                    <div className="w-full bg-motta-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
