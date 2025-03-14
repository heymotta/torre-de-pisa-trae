
import { useState, useEffect } from 'react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PizzaItem } from '@/components/ui/custom/PizzaCard';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PizzaForm } from '@/components/admin/PizzaForm';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Extend the PizzaItem interface to include an optional id for new items
type AdminPizzaItem = PizzaItem;

// Mock menu data - same as in Menu.tsx
const initialPizzas: AdminPizzaItem[] = [
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
    name: 'Pepperoni',
    description: 'Pizza com generosas fatias de pepperoni e queijo muçarela derretido.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Pepperoni'],
    category: 'especial'
  },
  {
    id: '3',
    name: 'Vegetariana',
    description: 'Seleção de vegetais frescos com queijo e molho especial da casa.',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Pimentão', 'Cebola', 'Cogumelos', 'Azeitonas', 'Tomate'],
    category: 'vegetariana'
  },
  {
    id: '4',
    name: 'Quatro Queijos',
    description: 'Deliciosa combinação de quatro queijos diferentes: muçarela, parmesão, provolone e gorgonzola.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4fe3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Parmesão', 'Provolone', 'Gorgonzola'],
    category: 'especial'
  },
  {
    id: '5',
    name: 'Calabresa',
    description: 'Pizza com calabresa fatiada, cebola e um toque de orégano.',
    price: 27.90,
    image: 'https://images.unsplash.com/photo-1589840600056-a097a4a27357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Molho de tomate', 'Muçarela', 'Calabresa', 'Cebola', 'Orégano'],
    category: 'tradicional'
  },
  {
    id: '6',
    name: 'Chocolate com Morango',
    description: 'Pizza doce com chocolate derretido e morangos frescos.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1585505008861-a5c378857dcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ingredients: ['Chocolate', 'Morangos', 'Açúcar confeiteiro'],
    category: 'doce'
  }
];

const AdminMenu = () => {
  const [pizzas, setPizzas] = useState<AdminPizzaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingPizza, setEditingPizza] = useState<AdminPizzaItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pizzaToDelete, setPizzaToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPizzas(initialPizzas);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter pizzas
  const filteredPizzas = pizzas.filter(pizza => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pizza.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || pizza.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddPizza = (newPizza: AdminPizzaItem) => {
    // In a real app, this would be an API call
    const pizzaId = String(Math.max(...pizzas.map(b => Number(b.id))) + 1);
    const pizzaWithId = { ...newPizza, id: pizzaId };
    
    setPizzas(prev => [...prev, pizzaWithId]);
    setIsFormOpen(false);
    toast.success('Pizza adicionada com sucesso!');
  };

  const handleUpdatePizza = (updatedPizza: AdminPizzaItem) => {
    // In a real app, this would be an API call
    setPizzas(prev => 
      prev.map(pizza => 
        pizza.id === updatedPizza.id ? updatedPizza : pizza
      )
    );
    setEditingPizza(null);
    toast.success('Pizza atualizada com sucesso!');
  };

  const handleDeletePizza = () => {
    if (!pizzaToDelete) return;
    
    // In a real app, this would be an API call
    setPizzas(prev => prev.filter(pizza => pizza.id !== pizzaToDelete));
    setIsDeleteDialogOpen(false);
    setPizzaToDelete(null);
    toast.success('Pizza removida com sucesso!');
  };

  const openDeleteDialog = (pizzaId: string) => {
    setPizzaToDelete(pizzaId);
    setIsDeleteDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Cardápio</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Item
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-motta-500" />
          <Input 
            type="search" 
            placeholder="Buscar pizzas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select 
          value={categoryFilter} 
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="tradicional">Tradicionais</SelectItem>
            <SelectItem value="especial">Premium</SelectItem>
            <SelectItem value="vegetariana">Vegetarianas</SelectItem>
            <SelectItem value="doce">Doces</SelectItem>
            <SelectItem value="borda-recheada">Bordas Recheadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Menu Items */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <div className="h-40 bg-motta-200"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-motta-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-motta-200 rounded mb-2"></div>
                <div className="h-4 bg-motta-200 rounded mb-2 w-5/6"></div>
              </CardContent>
              <CardFooter className="p-4 border-t border-motta-200 bg-motta-50">
                <div className="h-8 bg-motta-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredPizzas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPizzas.map((pizza) => (
            <Card key={pizza.id} className="overflow-hidden">
              <div className="relative h-48">
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="default" 
                    className="h-8 w-8 bg-white/90 text-motta-700 hover:bg-white"
                    onClick={() => setEditingPizza(pizza)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8"
                    onClick={() => openDeleteDialog(pizza.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{pizza.name}</h3>
                  <span className="font-bold text-motta-primary">{formatPrice(pizza.price)}</span>
                </div>
                <p className="text-motta-600 text-sm mb-2 line-clamp-2">{pizza.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-motta-100 text-motta-700 rounded-full">
                    {pizza.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-motta-100 text-motta-700 rounded-full">
                    {pizza.ingredients?.length || 0} ingredientes
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t border-motta-200 bg-motta-50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setEditingPizza(pizza)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Item
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-motta-200">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-motta-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nenhuma pizza encontrada</h2>
          <p className="text-motta-600 max-w-md mx-auto mb-6">
            Não encontramos pizzas com os filtros atuais. Tente ajustar os filtros ou criar um novo item.
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo Item
          </Button>
        </div>
      )}

      {/* Add/Edit Pizza Dialog */}
      <Dialog open={!!editingPizza || isFormOpen} onOpenChange={(open) => {
        if (!open) {
          setEditingPizza(null);
          setIsFormOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{editingPizza ? 'Editar Pizza' : 'Adicionar Nova Pizza'}</DialogTitle>
            <DialogDescription>
              {editingPizza 
                ? 'Atualize as informações da pizza e clique em salvar quando terminar.'
                : 'Preencha os detalhes da nova pizza e clique em adicionar.'}
            </DialogDescription>
          </DialogHeader>
          
          <PizzaForm 
            pizza={editingPizza || undefined}
            onSubmit={editingPizza ? handleUpdatePizza : handleAddPizza}
            onCancel={() => {
              setEditingPizza(null);
              setIsFormOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta pizza? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePizza}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMenu;
