
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PizzaItem } from '@/components/ui/custom/PizzaCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fetchPizzas } from '@/services/pizzaService';
import MenuSearch from '@/components/menu/MenuSearch';
import CategoryTabs from '@/components/menu/CategoryTabs';
import PizzaGrid from '@/components/menu/PizzaGrid';
import MenuSkeleton from '@/components/menu/MenuSkeleton';
import MenuError from '@/components/menu/MenuError';
import EmptyMenuState from '@/components/menu/EmptyMenuState';
import { toast } from 'sonner';

const Menu = () => {
  console.log('Rendering Menu component');
  
  const { data: pizzas, isLoading, error, refetch } = useQuery({
    queryKey: ['pizzas'],
    queryFn: fetchPizzas,
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
    // Add timeout to prevent infinite loading
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPizzas, setFilteredPizzas] = useState<PizzaItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Make sure to handle the case when pizzas might be undefined
  useEffect(() => {
    console.log('Menu component - pizzas data:', pizzas);
    
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
      
      console.log('Menu component - filtered pizzas:', filtered);
      setFilteredPizzas(filtered);
    } else {
      console.log('Menu component - no pizza data available, setting empty array');
      setFilteredPizzas([]);
    }
  }, [pizzas, searchQuery, activeCategory]);
  
  // Show a loading toast only once when component mounts
  useEffect(() => {
    if (isLoading) {
      toast('Carregando cardápio', {
        description: 'Aguarde enquanto buscamos as pizzas disponíveis.'
      });
    }
  }, []);

  console.log('Menu render state:', { isLoading, hasError: !!error, pizzasLength: pizzas?.length });
  
  if (isLoading) {
    console.log('Menu component - loading state');
    return (
      <>
        <Header />
        <MenuSkeleton />
        <Footer />
      </>
    );
  }
  
  if (error) {
    console.error('Menu component - error state:', error);
    return (
      <>
        <Header />
        <MenuError>
          <p className="text-sm mt-2">Erro: {(error as Error).message}</p>
        </MenuError>
        <Footer />
      </>
    );
  }
  
  // Check if pizzas array is undefined or empty
  if (!pizzas || pizzas.length === 0) {
    console.log('Menu component - empty state');
    return (
      <>
        <Header />
        <EmptyMenuState />
        <Footer />
      </>
    );
  }
  
  // Extract unique categories from the pizzas
  const categories = ['all', ...new Set(pizzas.map(pizza => pizza.category))];
  
  console.log('Menu component - rendering with data', { 
    totalPizzas: pizzas.length,
    filteredCount: filteredPizzas.length,
    categories
  });

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 pt-24">
        <h1 className="text-3xl font-bold text-center mb-8">Nosso Cardápio</h1>
        
        <MenuSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        <PizzaGrid pizzas={filteredPizzas} />
      </div>
      <Footer />
    </>
  );
};

export default Menu;
