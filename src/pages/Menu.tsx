
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PizzaCard, { PizzaItem } from '@/components/ui/custom/PizzaCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from 'sonner';
import Header from '@/components/layout/Header';

const fetchPizzas = async () => {
  try {
    const { data, error } = await supabase
      .from('pizzas')
      .select('*')
      .eq('disponivel', true);
      
    if (error) {
      console.error('Error fetching pizzas:', error);
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map database fields to PizzaItem interface
    return data.map(pizza => ({
      id: pizza.id,
      name: pizza.nome,
      description: pizza.descricao || '',
      price: pizza.preco,
      image: pizza.imagem_url || '/placeholder.svg', // Use placeholder if no image
      category: pizza.categoria || 'tradicional',
      ingredients: pizza.ingredientes || []
    })) as PizzaItem[];
  } catch (error) {
    console.error('Failed to fetch pizzas:', error);
    throw error;
  }
};

const Menu = () => {
  const { data: pizzas, isLoading, error, refetch } = useQuery({
    queryKey: ['pizzas'],
    queryFn: fetchPizzas,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPizzas, setFilteredPizzas] = useState<PizzaItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Retry data fetching one time if it fails
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        refetch();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, refetch]);
  
  useEffect(() => {
    if (pizzas) {
      let filtered = [...pizzas];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(pizza => 
          pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pizza.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (activeCategory !== 'all') {
        filtered = filtered.filter(pizza => pizza.category === activeCategory);
      }
      
      setFilteredPizzas(filtered);
    }
  }, [pizzas, searchQuery, activeCategory]);
  
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 pt-24">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <p className="mt-4">Carregando o menu...</p>
          </div>
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 pt-24">
          <div className="text-center text-red-500">
            <p>Erro ao carregar o menu. Por favor, tente novamente.</p>
            <p className="text-sm text-gray-600 mt-2">{error.message}</p>
            <button 
              onClick={() => refetch()} 
              className="mt-4 px-4 py-2 bg-motta-primary text-white rounded hover:bg-motta-600 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </>
    );
  }
  
  if (!pizzas || pizzas.length === 0) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 pt-24">
          <div className="text-center">
            <p>Nenhuma pizza disponível no momento.</p>
          </div>
        </div>
      </>
    );
  }
  
  // Extract unique categories from the pizzas
  const categories = ['all', ...new Set(pizzas.map(pizza => pizza.category))];

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 pt-24">
        <h1 className="text-3xl font-bold text-center mb-8">Nosso Cardápio</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar pizza..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="w-full justify-start overflow-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === 'all' ? 'Todas' : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPizzas.length > 0 ? (
            filteredPizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p>Nenhuma pizza encontrada. Tente outra pesquisa.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Menu;
