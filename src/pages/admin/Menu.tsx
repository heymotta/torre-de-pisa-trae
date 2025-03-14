
import { useState, useEffect } from 'react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BurgerItem } from '@/components/ui/custom/BurgerCard';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BurgerForm } from '@/components/admin/BurgerForm';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Extend the BurgerItem interface to include an optional id for new items
type AdminBurgerItem = BurgerItem;

// Mock menu data - same as in Menu.tsx
const initialBurgers: AdminBurgerItem[] = [
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

const AdminMenu = () => {
  const [burgers, setBurgers] = useState<AdminBurgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingBurger, setEditingBurger] = useState<AdminBurgerItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [burgerToDelete, setBurgerToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBurgers(initialBurgers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter burgers
  const filteredBurgers = burgers.filter(burger => {
    const matchesSearch = burger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          burger.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || burger.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddBurger = (newBurger: AdminBurgerItem) => {
    // In a real app, this would be an API call
    const burgerId = String(Math.max(...burgers.map(b => Number(b.id))) + 1);
    const burgerWithId = { ...newBurger, id: burgerId };
    
    setBurgers(prev => [...prev, burgerWithId]);
    setIsFormOpen(false);
    toast.success('Hambúrguer adicionado com sucesso!');
  };

  const handleUpdateBurger = (updatedBurger: AdminBurgerItem) => {
    // In a real app, this would be an API call
    setBurgers(prev => 
      prev.map(burger => 
        burger.id === updatedBurger.id ? updatedBurger : burger
      )
    );
    setEditingBurger(null);
    toast.success('Hambúrguer atualizado com sucesso!');
  };

  const handleDeleteBurger = () => {
    if (!burgerToDelete) return;
    
    // In a real app, this would be an API call
    setBurgers(prev => prev.filter(burger => burger.id !== burgerToDelete));
    setIsDeleteDialogOpen(false);
    setBurgerToDelete(null);
    toast.success('Hambúrguer removido com sucesso!');
  };

  const openDeleteDialog = (burgerId: string) => {
    setBurgerToDelete(burgerId);
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
            placeholder="Buscar hambúrgueres..." 
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
            <SelectItem value="especial">Especiais</SelectItem>
            <SelectItem value="vegano">Veganos</SelectItem>
            <SelectItem value="frango">Frango</SelectItem>
            <SelectItem value="peixe">Peixe</SelectItem>
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
      ) : filteredBurgers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBurgers.map((burger) => (
            <Card key={burger.id} className="overflow-hidden">
              <div className="relative h-48">
                <img
                  src={burger.image}
                  alt={burger.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="default" 
                    className="h-8 w-8 bg-white/90 text-motta-700 hover:bg-white"
                    onClick={() => setEditingBurger(burger)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8"
                    onClick={() => openDeleteDialog(burger.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{burger.name}</h3>
                  <span className="font-bold text-motta-primary">{formatPrice(burger.price)}</span>
                </div>
                <p className="text-motta-600 text-sm mb-2 line-clamp-2">{burger.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-motta-100 text-motta-700 rounded-full">
                    {burger.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-motta-100 text-motta-700 rounded-full">
                    {burger.ingredients?.length || 0} ingredientes
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t border-motta-200 bg-motta-50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setEditingBurger(burger)}
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
          <h2 className="text-xl font-semibold mb-2">Nenhum hambúrguer encontrado</h2>
          <p className="text-motta-600 max-w-md mx-auto mb-6">
            Não encontramos hambúrgueres com os filtros atuais. Tente ajustar os filtros ou criar um novo item.
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo Item
          </Button>
        </div>
      )}

      {/* Add/Edit Burger Dialog */}
      <Dialog open={!!editingBurger || isFormOpen} onOpenChange={(open) => {
        if (!open) {
          setEditingBurger(null);
          setIsFormOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingBurger ? 'Editar Hambúrguer' : 'Adicionar Novo Hambúrguer'}</DialogTitle>
            <DialogDescription>
              {editingBurger 
                ? 'Atualize as informações do hambúrguer e clique em salvar quando terminar.'
                : 'Preencha os detalhes do novo hambúrguer e clique em adicionar.'}
            </DialogDescription>
          </DialogHeader>
          
          <BurgerForm 
            burger={editingBurger || undefined}
            onSubmit={editingBurger ? handleUpdateBurger : handleAddBurger}
            onCancel={() => {
              setEditingBurger(null);
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
              Tem certeza que deseja excluir este hambúrguer? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteBurger}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMenu;
