
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
