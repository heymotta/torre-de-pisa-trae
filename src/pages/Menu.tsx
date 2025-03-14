
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BurgerCard, { BurgerItem } from '@/components/ui/custom/BurgerCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock menu data - in a real app, this would come from an API
const burgers: BurgerItem[] = [
  {
    id: '1',
    name: 'Classic Motta',
    description: 'Hambúrguer artesanal, queijo cheddar, alface, tomate, cebola caramelizada e nosso molho especial.',
    price: 29.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Hambúrguer 180g', 'Queijo Cheddar', 'Alface', 'Tomate', 'Cebola Caramelizada', 'Molho Especial'],
    category: 'tradicional'
  },
  {
    id: '2',
    name: 'Motta Bacon',
    description: 'Hambúrguer artesanal, queijo cheddar, bacon crocante, cebola crispy e nosso molho barbecue.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Hambúrguer 180g', 'Queijo Cheddar', 'Bacon Crocante', 'Cebola Crispy', 'Molho Barbecue'],
    category: 'especial'
  },
  {
    id: '3',
    name: 'Veggie Motta',
    description: 'Hambúrguer vegetal, queijo vegano, rúcula, tomate, abacate e maionese vegana.',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Hambúrguer Vegetal', 'Queijo Vegano', 'Rúcula', 'Tomate', 'Abacate', 'Maionese Vegana'],
    category: 'vegano'
  },
  {
    id: '4',
    name: 'Double Motta',
    description: 'Dois hambúrgueres artesanais, queijo cheddar duplo, bacon crocante e molho especial.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1553979458-12217a83c819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['2 Hambúrgueres 180g', 'Queijo Cheddar Duplo', 'Bacon Crocante', 'Molho Especial'],
    category: 'especial'
  },
  {
    id: '5',
    name: 'Chicken Motta',
    description: 'Filé de frango empanado, queijo muçarela, alface, tomate e maionese de ervas.',
    price: 27.90,
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Filé de Frango Empanado', 'Queijo Muçarela', 'Alface', 'Tomate', 'Maionese de Ervas'],
    category: 'frango'
  },
  {
    id: '6',
    name: 'Motta Fish',
    description: 'Filé de peixe empanado, queijo, alface, picles e molho tártaro.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Filé de Peixe Empanado', 'Queijo', 'Alface', 'Picles', 'Molho Tártaro'],
    category: 'peixe'
  }
];

type Category = 'todos' | 'tradicional' | 'especial' | 'vegano' | 'frango' | 'peixe';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBurgers, setFilteredBurgers] = useState<BurgerItem[]>(burgers);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter burgers based on category and search term
  useEffect(() => {
    const filtered = burgers.filter(burger => {
      const matchesCategory = activeCategory === 'todos' || burger.category === activeCategory;
      const matchesSearch = burger.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            burger.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    
    setFilteredBurgers(filtered);
  }, [activeCategory, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1561758033-563f9666b8c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
            alt="Menu Banner" 
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Nosso Cardápio</h1>
              <p className="text-lg md:text-xl max-w-xl mx-auto">
                Descubra nossos deliciosos hambúrgueres artesanais
              </p>
            </div>
          </div>
        </div>
        
        <div className="container px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-motta-500" />
              </div>
              <Input
                type="text"
                placeholder="Buscar hambúrgueres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs 
              defaultValue="todos" 
              value={activeCategory}
              onValueChange={(value) => setActiveCategory(value as Category)}
              className="w-full md:w-auto"
            >
              <TabsList className="w-full md:w-auto grid grid-cols-3 md:grid-cols-6 gap-1">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="tradicional">Tradicionais</TabsTrigger>
                <TabsTrigger value="especial">Especiais</TabsTrigger>
                <TabsTrigger value="vegano">Veganos</TabsTrigger>
                <TabsTrigger value="frango">Frango</TabsTrigger>
                <TabsTrigger value="peixe">Peixe</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Menu Grid */}
          <div className="animate-fade-in">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-motta-200"></div>
                    <div className="p-4">
                      <div className="h-6 bg-motta-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-motta-200 rounded mb-2"></div>
                      <div className="h-4 bg-motta-200 rounded mb-2 w-5/6"></div>
                      <div className="h-10 bg-motta-200 rounded mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBurgers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBurgers.map((burger) => (
                  <BurgerCard key={burger.id} burger={burger} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-display font-semibold mb-2">Nenhum resultado encontrado</h3>
                <p className="text-motta-600">
                  Tente ajustar seus filtros ou termo de busca para encontrar o que procura.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
