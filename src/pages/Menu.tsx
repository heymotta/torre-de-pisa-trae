
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PizzaCard, { PizzaItem } from '@/components/ui/custom/PizzaCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Definimos os tipos para as categorias
type Category = 'todos' | 'tradicional' | 'especial' | 'vegetariana' | 'doce' | 'borda-recheada';

const Menu = () => {
  const [pizzas, setPizzas] = useState<PizzaItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPizzas, setFilteredPizzas] = useState<PizzaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar pizzas do Supabase
  useEffect(() => {
    const fetchPizzas = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('pizzas')
          .select('*')
          .eq('disponivel', true);
          
        if (error) {
          throw error;
        }
        
        // Mapear os dados para o formato esperado pelo componente PizzaCard
        const formattedPizzas: PizzaItem[] = data.map(pizza => ({
          id: pizza.id,
          name: pizza.nome,
          description: pizza.descricao || '',
          price: parseFloat(pizza.preco),
          image: pizza.imagem_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80',
          // Atribuímos uma categoria padrão já que não temos esse campo no banco
          category: 'tradicional',
          // Adicionamos ingredientes vazios já que não temos esse campo no banco
          ingredients: []
        }));
        
        setPizzas(formattedPizzas);
      } catch (error) {
        console.error('Erro ao buscar pizzas:', error);
        toast.error('Não foi possível carregar o cardápio. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPizzas();
  }, []);

  // Filtrar pizzas baseado na categoria e termo de busca
  useEffect(() => {
    if (pizzas.length === 0) {
      setFilteredPizzas([]);
      return;
    }
    
    const filtered = pizzas.filter(pizza => {
      // Como não temos categorias no banco, só filtramos pelo termo de busca
      const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           pizza.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    
    setFilteredPizzas(filtered);
  }, [activeCategory, searchTerm, pizzas]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
            alt="Menu Banner" 
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Nosso Cardápio</h1>
              <p className="text-lg md:text-xl max-w-xl mx-auto">
                Descubra nossas deliciosas pizzas artesanais
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
                placeholder="Buscar pizzas..."
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
                <TabsTrigger value="especial">Premium</TabsTrigger>
                <TabsTrigger value="vegetariana">Vegetarianas</TabsTrigger>
                <TabsTrigger value="doce">Doces</TabsTrigger>
                <TabsTrigger value="borda-recheada">Bordas Recheadas</TabsTrigger>
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
            ) : filteredPizzas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPizzas.map((pizza) => (
                  <PizzaCard key={pizza.id} pizza={pizza} />
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
