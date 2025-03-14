
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Calendar, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Mock data for dashboard
const mockSalesData = [
  { name: 'Seg', vendas: 1200 },
  { name: 'Ter', vendas: 1900 },
  { name: 'Qua', vendas: 1500 },
  { name: 'Qui', vendas: 2400 },
  { name: 'Sex', vendas: 2800 },
  { name: 'Sáb', vendas: 3600 },
  { name: 'Dom', vendas: 2100 },
];

const mockOrdersToday = 28;
const mockTotalCustomers = 345;
const mockTotalProducts = 42;
const mockTotalSales = 12480;

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
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
                <div className="text-2xl font-bold">{mockOrdersToday}</div>
                <p className="text-xs text-motta-600">
                  +5% em relação à semana passada
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-motta-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTotalCustomers}</div>
                <p className="text-xs text-motta-600">
                  +12 novos clientes esta semana
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos no Cardápio</CardTitle>
                <ShoppingBag className="h-4 w-4 text-motta-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTotalProducts}</div>
                <p className="text-xs text-motta-600">
                  3 produtos adicionados este mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas (Último Mês)</CardTitle>
                <TrendingUp className="h-4 w-4 text-motta-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(mockTotalSales)}</div>
                <p className="text-xs text-motta-600">
                  +18% em relação ao mês anterior
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
                    <RechartsBarChart data={mockSalesData}>
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Pedido #1001</p>
                      <p className="text-xs text-motta-600">5 itens • R$92,70</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Em Preparo
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Pedido #1000</p>
                      <p className="text-xs text-motta-600">2 itens • R$68,80</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Entregue
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Pedido #999</p>
                      <p className="text-xs text-motta-600">3 itens • R$75,50</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Saiu para Entrega
                    </span>
                  </div>
                </div>
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded overflow-hidden mr-2">
                        <img 
                          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd" 
                          alt="Classic Motta"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium">Classic Motta</p>
                    </div>
                    <span className="text-sm font-medium">324 vendidos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded overflow-hidden mr-2">
                        <img 
                          src="https://images.unsplash.com/photo-1553979459-d2229ba7433b" 
                          alt="Motta Bacon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium">Motta Bacon</p>
                    </div>
                    <span className="text-sm font-medium">276 vendidos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded overflow-hidden mr-2">
                        <img 
                          src="https://images.unsplash.com/photo-1553979458-12217a83c819" 
                          alt="Double Motta"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium">Double Motta</p>
                    </div>
                    <span className="text-sm font-medium">198 vendidos</span>
                  </div>
                </div>
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
                      <span className="text-sm font-medium">96%</span>
                    </div>
                    <div className="w-full bg-motta-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Tempo Médio de Entrega</span>
                      <span className="text-sm font-medium">32 min</span>
                    </div>
                    <div className="w-full bg-motta-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Satisfação do Cliente</span>
                      <span className="text-sm font-medium">4.8/5</span>
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
