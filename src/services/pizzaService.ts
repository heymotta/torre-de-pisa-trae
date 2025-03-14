
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
      console.log('No pizzas found or empty array returned');
      return [];
    }
    
    console.log('Raw pizza data from Supabase:', data);
    
    const mappedPizzas = data.map(pizza => ({
      id: pizza.id,
      name: pizza.nome || 'Pizza sem nome',
      description: pizza.descricao || 'Sem descrição disponível',
      price: pizza.preco || 0,
      image: pizza.imagem_url || '/placeholder.svg',
      category: pizza.categoria || 'tradicional',
      ingredients: pizza.ingredientes || []
    }));
    
    console.log('Number of pizzas fetched:', mappedPizzas.length);
    return mappedPizzas;
  } catch (error) {
    console.error('Failed to fetch pizzas:', error);
    return [];
  }
};

export const updatePizza = async (id: string, data: Partial<Omit<PizzaItem, 'id'>>): Promise<boolean> => {
  try {
    // Map the frontend data model to the database model
    const pizzaData = {
      nome: data.name,
      descricao: data.description,
      preco: data.price,
      imagem_url: data.image,
      categoria: data.category,
      ingredientes: data.ingredients,
      disponivel: true
    };
    
    const { error } = await supabase
      .from('pizzas')
      .update(pizzaData)
      .eq('id', id);
      
    if (error) {
      console.error('Error updating pizza:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update pizza:', error);
    throw error;
  }
};

export const createPizza = async (data: Omit<PizzaItem, 'id'>): Promise<string> => {
  try {
    // Map the frontend data model to the database model
    const pizzaData = {
      nome: data.name,
      descricao: data.description,
      preco: data.price,
      imagem_url: data.image,
      categoria: data.category,
      ingredientes: data.ingredients,
      disponivel: true
    };
    
    const { data: result, error } = await supabase
      .from('pizzas')
      .insert(pizzaData)
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating pizza:', error);
      throw error;
    }
    
    return result.id;
  } catch (error) {
    console.error('Failed to create pizza:', error);
    throw error;
  }
};

export const deletePizza = async (id: string): Promise<boolean> => {
  try {
    // Instead of actually deleting, we just mark it as unavailable
    const { error } = await supabase
      .from('pizzas')
      .update({ disponivel: false })
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting pizza:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete pizza:', error);
    throw error;
  }
};
