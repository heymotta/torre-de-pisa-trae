
import { supabase } from '@/integrations/supabase/client';
import { PizzaItem } from '@/components/ui/custom/PizzaCard';

export const fetchPizzas = async (): Promise<PizzaItem[]> => {
  try {
    console.log('Fetching pizzas from Supabase...');
    // Usando uma timestamp para forçar o recarregamento e quebrar o cache
    const timestamp = new Date().getTime();
    const { data, error } = await supabase
      .from('pizzas')
      .select('*')
      .eq('disponivel', true)
      .order('nome')
      .limit(100)
      .headers({ 'Cache-Control': 'no-cache', 'Pragma': 'no-cache', 'x-timestamp': timestamp.toString() });
      
    if (error) {
      console.error('Error fetching pizzas:', error);
      throw new Error(error.message);
    }
    
    if (!data) {
      console.log('No data returned from Supabase');
      return [];
    }
    
    console.log('Raw pizza data from Supabase:', data);
    
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

// Admin functions for managing pizzas
export const createPizza = async (pizzaData: Omit<PizzaItem, 'id'>): Promise<PizzaItem> => {
  try {
    const { data, error } = await supabase
      .from('pizzas')
      .insert({
        nome: pizzaData.name,
        descricao: pizzaData.description,
        preco: pizzaData.price,
        imagem_url: pizzaData.image,
        categoria: pizzaData.category,
        ingredientes: pizzaData.ingredients,
        disponivel: true
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating pizza:', error);
      throw new Error(error.message);
    }
    
    return {
      id: data.id,
      name: data.nome,
      description: data.descricao || '',
      price: data.preco,
      image: data.imagem_url || '/placeholder.svg',
      category: data.categoria || 'tradicional',
      ingredients: data.ingredientes || []
    };
  } catch (error) {
    console.error('Failed to create pizza:', error);
    throw error;
  }
};

export const updatePizza = async (id: string, pizzaData: Partial<Omit<PizzaItem, 'id'>>): Promise<void> => {
  try {
    const updateData: any = {};
    
    if (pizzaData.name !== undefined) updateData.nome = pizzaData.name;
    if (pizzaData.description !== undefined) updateData.descricao = pizzaData.description;
    if (pizzaData.price !== undefined) updateData.preco = pizzaData.price;
    if (pizzaData.image !== undefined) updateData.imagem_url = pizzaData.image;
    if (pizzaData.category !== undefined) updateData.categoria = pizzaData.category;
    if (pizzaData.ingredients !== undefined) updateData.ingredientes = pizzaData.ingredients;
    
    const { error } = await supabase
      .from('pizzas')
      .update(updateData)
      .eq('id', id);
      
    if (error) {
      console.error('Error updating pizza:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Failed to update pizza:', error);
    throw error;
  }
};

export const deletePizza = async (id: string): Promise<void> => {
  try {
    // Instead of hard deleting, we set disponivel to false
    const { error } = await supabase
      .from('pizzas')
      .update({ disponivel: false })
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting pizza:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Failed to delete pizza:', error);
    throw error;
  }
};
