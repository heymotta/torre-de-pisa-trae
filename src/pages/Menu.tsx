
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PizzaItem } from '@/components/ui/custom/PizzaCard';
import Header from '@/components/layout/Header';
import { fetchPizzas } from '@/services/pizzaService';
import MenuSearch from '@/components/menu/MenuSearch';
import CategoryTabs from '@/components/menu/CategoryTabs';
import PizzaGrid from '@/components/menu/PizzaGrid';
import MenuSkeleton from '@/components/menu/MenuSkeleton';
import MenuError from '@/components/menu/MenuError';
import EmptyMenuState from '@/components/menu/EmptyMenuState';

const Menu = () => {
  const { data: pizzas, isLoading, error } = useQuery({
    queryKey: ['pizzas'],
    queryFn: fetchPizzas,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPizzas, setFilteredPizzas] = useState<PizzaItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
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
    } else {
      setFilteredPizzas([]);
    }
  }, [pizzas, searchQuery, activeCategory]);
  
  if (isLoading) {
    return (
      <>
        <Header />
        <MenuSkeleton />
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <MenuError />
      </>
    );
  }
  
  if (!pizzas || pizzas.length === 0) {
    return (
      <>
        <Header />
        <EmptyMenuState />
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
    </>
  );
};

export default Menu;
