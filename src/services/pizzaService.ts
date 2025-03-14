
import { supabase } from '@/integrations/supabase/client';
import { PizzaItem } from '@/components/ui/custom/PizzaCard';

export const fetchPizzas = async (): Promise<PizzaItem[]> => {
  try {
    console.log('Fetching pizzas from Supabase...');
    
    // Simplify the query to make sure we're getting results
    const { data, error } = await supabase
      .from('pizzas')
      .select('*')
      .eq('disponivel', true);
      
    if (error) {
      console.error('Error fetching pizzas:', error);
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      console.log('No pizzas found or empty array returned');
      return [];
    }
    
    console.log('Raw pizza data from Supabase:', data);
    
    // Improve mapping to handle potential missing fields
    const mappedPizzas = data.map(pizza => ({
      id: pizza.id,
      name: pizza.nome || 'Pizza sem nome',
      description: pizza.descricao || 'Sem descrição disponível',
      price: pizza.preco || 0,
      image: pizza.imagem_url || '/placeholder.svg',
      category: pizza.categoria || 'tradicional',
      ingredients: pizza.ingredientes || []
    }));
    
    console.log('Mapped pizzas:', mappedPizzas);
    console.log('Number of pizzas fetched:', mappedPizzas.length);
    return mappedPizzas;
  } catch (error) {
    console.error('Failed to fetch pizzas:', error);
    // Return empty array instead of throwing to prevent loading state from hanging
    return [];
  }
};
