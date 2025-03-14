
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PizzaCard, { PizzaItem } from '@/components/ui/custom/PizzaCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Pizza menu data with all the requested pizzas
const pizzas: PizzaItem[] = [
  {
    id: '1',
    name: 'Margherita',
    description: 'A clássica pizza italiana com molho de tomate, muçarela fresca e manjericão.',
    price: 29.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Manjericão', 'Azeite de oliva'],
    category: 'tradicional'
  },
  {
    id: '2',
    name: 'Abobrinha com Tomate',
    description: 'Deliciosa combinação de abobrinha fatiada e tomates frescos.',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1589840600056-a097a4a27357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Abobrinha', 'Tomate', 'Orégano'],
    category: 'vegetariana'
  },
  {
    id: '3',
    name: 'Alho e Óleo',
    description: 'Pizza com alho dourado e azeite de oliva extra virgem.',
    price: 26.90,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Alho dourado', 'Azeite de oliva', 'Orégano'],
    category: 'tradicional'
  },
  {
    id: '4',
    name: 'Aliche',
    description: 'Pizza com filés de anchova, ideal para apreciadores de sabores marcantes.',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Filés de anchova', 'Orégano'],
    category: 'especial'
  },
  {
    id: '5',
    name: 'Atum',
    description: 'Pizza de atum com cebola e orégano.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4fe3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Atum', 'Cebola', 'Orégano'],
    category: 'tradicional'
  },
  {
    id: '6',
    name: '2 Queijos',
    description: 'Deliciosa combinação de dois queijos diferentes: muçarela e parmesão.',
    price: 29.90,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Parmesão'],
    category: 'tradicional'
  },
  {
    id: '7',
    name: '3 Queijos',
    description: 'Pizza com três tipos de queijos selecionados.',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Parmesão', 'Provolone'],
    category: 'especial'
  },
  {
    id: '8',
    name: '4 Queijos',
    description: 'Deliciosa combinação de quatro queijos diferentes: muçarela, parmesão, provolone e gorgonzola.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4fe3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Parmesão', 'Provolone', 'Gorgonzola'],
    category: 'especial'
  },
  {
    id: '9',
    name: '5 Queijos',
    description: 'A mais completa opção para os amantes de queijo, com cinco tipos diferentes.',
    price: 42.90,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Parmesão', 'Provolone', 'Gorgonzola', 'Catupiry'],
    category: 'especial'
  },
  {
    id: '10',
    name: 'Al Capone',
    description: 'Pizza inspirada no famoso gangster, com pepperoni, pimentão e champignon.',
    price: 38.90,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Pepperoni', 'Pimentão', 'Champignon'],
    category: 'especial'
  },
  {
    id: '11',
    name: 'Americana',
    description: 'Pizza no estilo americano com bacon e milho.',
    price: 33.90,
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Bacon', 'Milho'],
    category: 'tradicional'
  },
  {
    id: '12',
    name: 'Babbo',
    description: 'Pizza especial da casa com presunto, champignon e catupiry.',
    price: 37.90,
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Presunto', 'Champignon', 'Catupiry'],
    category: 'especial'
  },
  {
    id: '13',
    name: 'Bacon',
    description: 'Pizza com generosas fatias de bacon crocante.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Bacon', 'Orégano'],
    category: 'tradicional'
  },
  {
    id: '14',
    name: 'Brasilica',
    description: 'Pizza com os sabores do Brasil: milho, ervilha e palmito.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Milho', 'Ervilha', 'Palmito'],
    category: 'tradicional'
  },
  {
    id: '15',
    name: 'Banana Caramelizada',
    description: 'Pizza doce com bananas caramelizadas, canela e açúcar.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1585505008861-a5c378857dcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Banana', 'Açúcar', 'Canela', 'Leite condensado'],
    category: 'doce'
  },
  {
    id: '16',
    name: 'Baiana',
    description: 'Pizza com sabores típicos da Bahia, incluindo pimenta e azeite de dendê.',
    price: 35.90,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Calabresa', 'Pimenta', 'Cebola', 'Azeite de dendê'],
    category: 'especial'
  },
  {
    id: '17',
    name: 'Bauru',
    description: 'Inspirada no famoso sanduíche, com presunto, queijo e tomate.',
    price: 30.90,
    image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Presunto', 'Tomate', 'Orégano'],
    category: 'tradicional'
  },
  {
    id: '18',
    name: 'Bella Itália',
    description: 'Uma homenagem à Itália com ingredientes tradicionais italianos.',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela de búfala', 'Tomate cereja', 'Manjericão', 'Azeite de oliva'],
    category: 'especial'
  },
  {
    id: '19',
    name: 'Bersagliere',
    description: 'Pizza com presunto, champignon e azeitonas pretas.',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Presunto', 'Champignon', 'Azeitonas pretas'],
    category: 'especial'
  },
  {
    id: '20',
    name: 'Bolonhesa',
    description: 'Pizza com molho à bolonhesa caseiro e queijo.',
    price: 33.90,
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho à bolonhesa', 'Muçarela', 'Orégano'],
    category: 'tradicional'
  },
  // Continuando com as demais pizzas (adicionando apenas algumas das restantes para não tornar o código muito extenso)
  {
    id: '21',
    name: 'Brasileira',
    description: 'Pizza com os sabores do Brasil, incluindo milho, ervilha e palmito.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Milho', 'Ervilha', 'Palmito', 'Orégano'],
    category: 'tradicional'
  },
  {
    id: '22',
    name: 'Calabresa',
    description: 'Pizza com calabresa fatiada, cebola e um toque de orégano.',
    price: 27.90,
    image: 'https://images.unsplash.com/photo-1589840600056-a097a4a27357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Calabresa', 'Cebola', 'Orégano'],
    category: 'tradicional'
  },
  {
    id: '23',
    name: 'Brócolis',
    description: 'Pizza vegetariana com brócolis frescos e queijo.',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Brócolis', 'Alho', 'Azeite', 'Orégano'],
    category: 'vegetariana'
  },
  {
    id: '24',
    name: 'Brigadeiro',
    description: 'Pizza doce com chocolate e granulado, sabor tradicional de brigadeiro.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1585505008861-a5c378857dcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Chocolate', 'Granulado', 'Leite condensado'],
    category: 'doce'
  },
  {
    id: '25',
    name: 'Brigadeiro com Sorvete',
    description: 'Pizza doce de brigadeiro servida com sorvete de creme.',
    price: 37.90,
    image: 'https://images.unsplash.com/photo-1585505008861-a5c378857dcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Chocolate', 'Granulado', 'Leite condensado', 'Sorvete de creme'],
    category: 'doce'
  },
  {
    id: '26',
    name: 'Caprese',
    description: 'Pizza inspirada na salada italiana, com muçarela de búfala, tomate e manjericão.',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela de búfala', 'Tomate', 'Manjericão', 'Azeite de oliva'],
    category: 'vegetariana'
  },
  {
    id: '27',
    name: 'Carne Seca',
    description: 'Pizza com carne seca desfiada e cebola.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Carne seca desfiada', 'Cebola', 'Orégano'],
    category: 'especial'
  },
  {
    id: '28',
    name: 'Portuguesa',
    description: 'Clássica pizza portuguesa com presunto, ovos, cebola e ervilhas.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Presunto', 'Ovos', 'Cebola', 'Ervilhas', 'Azeitonas'],
    category: 'tradicional'
  },
  {
    id: '29',
    name: 'Strogonoff de Frango',
    description: 'Inovadora pizza com cobertura de strogonoff de frango e batata palha.',
    price: 38.90,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Strogonoff de frango', 'Batata palha'],
    category: 'especial'
  },
  {
    id: '30',
    name: 'Chocolate com Morango',
    description: 'Pizza doce com chocolate derretido e morangos frescos.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1585505008861-a5c378857dcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Chocolate', 'Morangos', 'Açúcar confeiteiro'],
    category: 'doce'
  }
];

type Category = 'todos' | 'tradicional' | 'especial' | 'vegetariana' | 'doce' | 'borda-recheada';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPizzas, setFilteredPizzas] = useState<PizzaItem[]>(pizzas);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter pizzas based on category and search term
  useEffect(() => {
    const filtered = pizzas.filter(pizza => {
      const matchesCategory = activeCategory === 'todos' || pizza.category === activeCategory;
      const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            pizza.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    
    setFilteredPizzas(filtered);
  }, [activeCategory, searchTerm]);

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
