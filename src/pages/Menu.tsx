
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
    staleTime: 0, // No cache - always fetch fresh data
    retry: 3, // Retry 3 times before showing an error
    refetchOnWindowFocus: true, // Refresh data when focus returns to window
    refetchInterval: 60000, // Refresh every minute
    refetchOnMount: 'always', // Always refetch when the component mounts
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPizzas, setFilteredPizzas] = useState<PizzaItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  useEffect(() => {
    console.log('Menu component - pizzas data:', pizzas);
    
    if (pizzas && pizzas.length > 0) {
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
  
  // Force refresh on component mount
  useEffect(() => {
    console.log('Menu component - forcing refresh on mount');
    refetch();
  }, [refetch]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    console.log('Manually refreshing menu data');
    toast.info('Atualizando cardápio...');
    refetch();
  };
  
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Nosso Cardápio</h1>
          <button 
            onClick={handleRefresh}
            className="text-sm text-motta-600 hover:text-motta-primary"
          >
            Atualizar
          </button>
        </div>
        
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
