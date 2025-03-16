
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
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

export interface Order {
  id: string;
  status: string;
  total: number;
  criado_em: string;
  itens: OrderItem[];
}

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    console.log('Fetching orders for user:', userId);
    
    // 1. Fetch orders for this user
    const { data: ordersData, error: ordersError } = await supabase
      .from('pedidos')
      .select('*')
      .eq('usuario_id', userId)
      .order('criado_em', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      throw ordersError;
    }
    
    if (!ordersData || ordersData.length === 0) {
      console.log('No orders found for this user');
      return [];
    }
    
    console.log('Raw orders data:', ordersData);
    
    // 2. For each order, fetch the order items with their pizza details
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

        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
          throw itemsError;
        }
        
        return {
          ...order,
          itens: itemsData || []
        };
      })
    );
    
    console.log('Orders with items:', ordersWithItems);
    return ordersWithItems;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

// Admin functions for fetching all orders
export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    // 1. Fetch all orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('pedidos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (ordersError) {
      console.error('Error fetching all orders:', ordersError);
      throw ordersError;
    }
    
    if (!ordersData || ordersData.length === 0) {
      console.log('No orders found');
      return [];
    }
    
    // 2. For each order, fetch the order items with their pizza details
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

        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
          throw itemsError;
        }
        
        return {
          ...order,
          itens: itemsData || []
        };
      })
    );
    
    return ordersWithItems;
  } catch (error) {
    console.error('Failed to fetch all orders:', error);
    throw error;
  }
};

// Count today's orders
export const countTodayOrders = async (): Promise<number> => {
  try {
    // Get today's date in ISO format
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();
    
    const { count, error } = await supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .gte('criado_em', todayStr);
      
    if (error) {
      console.error('Error counting today\'s orders:', error);
      throw new Error(error.message);
    }
    
    return count || 0;
  } catch (error) {
    console.error('Failed to count today\'s orders:', error);
    throw error;
  }
};

// Calculate total sales for the last month
export const calculateLastMonthSales = async (): Promise<number> => {
  try {
    // Get date from a month ago
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthAgoStr = monthAgo.toISOString();
    
    const { data, error } = await supabase
      .from('pedidos')
      .select('total')
      .gte('criado_em', monthAgoStr);
      
    if (error) {
      console.error('Error calculating last month sales:', error);
      throw new Error(error.message);
    }
    
    // Sum all totals
    const totalSales = data?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
    return totalSales;
  } catch (error) {
    console.error('Failed to calculate last month sales:', error);
    throw error;
  }
};

// Get sales data for the last week
export const getLastWeekSales = async (): Promise<{ name: string; vendas: number }[]> => {
  try {
    // Get date from a week ago
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString();
    
    const { data, error } = await supabase
      .from('pedidos')
      .select('total, criado_em')
      .gte('criado_em', weekAgoStr);
      
    if (error) {
      console.error('Error fetching last week sales:', error);
      throw new Error(error.message);
    }
    
    // Group by day and sum totals
    const salesByDay: Record<string, number> = {};
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Initialize all days with zero sales
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      salesByDay[dayNames[date.getDay()]] = 0;
    }
    
    // Add sales for each day
    data?.forEach(order => {
      const orderDate = new Date(order.criado_em);
      const dayName = dayNames[orderDate.getDay()];
      salesByDay[dayName] = (salesByDay[dayName] || 0) + parseFloat(order.total);
    });
    
    // Convert to array format for chart
    const result = Object.entries(salesByDay).map(([name, vendas]) => ({
      name,
      vendas
    }));
    
    return result;
  } catch (error) {
    console.error('Failed to get last week sales:', error);
    throw error;
  }
};

// Count total unique customers
export const countTotalCustomers = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });
      
    if (error) {
      console.error('Error counting customers:', error);
      throw new Error(error.message);
    }
    
    return count || 0;
  } catch (error) {
    console.error('Failed to count customers:', error);
    throw error;
  }
};

// Get recent orders for dashboard
export const getRecentOrders = async (limit: number = 3): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching recent orders:', error);
      throw new Error(error.message);
    }
    
    // Get items for each order
    const ordersWithItems = await Promise.all(
      (data || []).map(async (order) => {
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

        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
          throw itemsError;
        }
        
        return {
          ...order,
          itens: itemsData || []
        };
      })
    );
    
    return ordersWithItems;
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    throw error;
  }
};

// Get popular pizzas by order count
export const getPopularPizzas = async (limit: number = 3): Promise<{ id: string; nome: string; imagem_url?: string; count: number }[]> => {
  try {
    const { data, error } = await supabase
      .from('pedido_itens')
      .select(`
        pizza_id,
        quantidade,
        pizza:pizza_id (
          nome,
          imagem_url
        )
      `);
      
    if (error) {
      console.error('Error fetching popular pizzas:', error);
      throw new Error(error.message);
    }
    
    // Count occurrences of each pizza
    const pizzaCounts: Record<string, { id: string; nome: string; imagem_url?: string; count: number }> = {};
    
    data?.forEach(item => {
      const pizzaId = item.pizza_id;
      if (!pizzaCounts[pizzaId]) {
        pizzaCounts[pizzaId] = {
          id: pizzaId,
          nome: item.pizza?.nome || 'Pizza Desconhecida',
          imagem_url: item.pizza?.imagem_url,
          count: 0
        };
      }
      pizzaCounts[pizzaId].count += item.quantidade;
    });
    
    // Convert to array and sort by count
    const sortedPizzas = Object.values(pizzaCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
      
    return sortedPizzas;
  } catch (error) {
    console.error('Failed to fetch popular pizzas:', error);
    throw error;
  }
};

export const getOrderStatus = (status: string): {
  label: string;
  color: string;
  index: number;
} => {
  const statusMap = {
    'pendente': { label: 'Pendente', color: 'bg-yellow-500', index: 0 },
    'em preparo': { label: 'Em preparo', color: 'bg-blue-500', index: 1 },
    'saiu para entrega': { label: 'Saiu para entrega', color: 'bg-purple-500', index: 2 },
    'entregue': { label: 'Entregue', color: 'bg-green-500', index: 3 },
    'cancelado': { label: 'Cancelado', color: 'bg-red-500', index: 4 }
  };
  
  return statusMap[status as keyof typeof statusMap] || { 
    label: 'Desconhecido', 
    color: 'bg-gray-500',
    index: -1
  };
};
