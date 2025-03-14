
import { supabase } from '@/integrations/supabase/client';
import { PizzaItem } from '@/components/ui/custom/PizzaCard';

export const fetchPizzas = async (): Promise<PizzaItem[]> => {
  try {
    console.log('Fetching pizzas from Supabase...');
    const { data, error } = await supabase
      .from('pizzas')
      .select('*')
      .eq('disponivel', true);
      
    if (error) {
      console.error('Error fetching pizzas:', error);
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      console.log('No pizzas found or empty data returned');
      return [];
    }
    
    console.log('Pizzas fetched successfully:', data);
    
    // Map database fields to PizzaItem interface
    const mappedPizzas = data.map(pizza => ({
      id: pizza.id,
      name: pizza.nome,
      description: pizza.descricao || '',
      price: pizza.preco,
      image: pizza.imagem_url || '/placeholder.svg', // Use placeholder if no image
      category: pizza.categoria || 'tradicional',
      ingredients: pizza.ingredientes || []
    }));
    
    console.log('Mapped pizzas:', mappedPizzas);
    return mappedPizzas;
  } catch (error) {
    console.error('Failed to fetch pizzas:', error);
    throw error;
  }
};
