
import { useState, useEffect } from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PizzaItem } from '@/components/ui/custom/PizzaCard';
import { X, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PizzaFormProps {
  pizza?: PizzaItem;
  onSubmit: (pizza: PizzaItem) => void;
  onCancel: () => void;
}

export const PizzaForm = ({ pizza, onSubmit, onCancel }: PizzaFormProps) => {
  const [formData, setFormData] = useState<Omit<PizzaItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    ingredients: [],
    category: 'tradicional'
  });
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with pizza data if editing
  useEffect(() => {
    if (pizza) {
      setFormData({
        name: pizza.name,
        description: pizza.description,
        price: pizza.price,
        image: pizza.image,
        ingredients: pizza.ingredients || [],
        category: pizza.category
      });
      setPriceInput(pizza.price.toString().replace('.', ','));
    }
  }, [pizza]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'URL da imagem é obrigatória';
    }
    
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d,]/g, '');
    setPriceInput(value);
    
    // Convert to number (handle both . and , as decimal separator)
    const numberValue = parseFloat(value.replace(',', '.'));
    if (!isNaN(numberValue)) {
      setFormData(prev => ({ ...prev, price: numberValue }));
      
      // Clear error when field is edited
      if (errors.price) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.price;
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({ ...prev, price: 0 }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
    
    // Clear error when field is edited
    if (errors.category) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), currentIngredient.trim()]
      }));
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Submit the form
    if (pizza) {
      // Update existing pizza
      onSubmit({
        ...formData,
        id: pizza.id
      });
    } else {
      // Add new pizza with a temporary ID, actual ID will be set by the parent component
      onSubmit({
        ...formData,
        id: 'temp-id'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
      <ScrollArea className="max-h-[60vh] pr-4 -mr-4">
        <div className="space-y-5 pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                name="price"
                value={priceInput}
                onChange={handlePriceChange}
                placeholder="0,00"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
              className={errors.image ? 'border-red-500' : ''}
            />
            {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
            
            {formData.image && (
              <div className="mt-2 relative h-32 w-full rounded-md overflow-hidden border border-motta-200">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Imagem+Inválida';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-60">
                <SelectItem value="tradicional">Tradicional</SelectItem>
                <SelectItem value="especial">Premium</SelectItem>
                <SelectItem value="vegetariana">Vegetariana</SelectItem>
                <SelectItem value="doce">Doce</SelectItem>
                <SelectItem value="borda-recheada">Borda Recheada</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Ingredientes</Label>
            <div className="flex gap-2">
              <Input
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="Adicionar ingrediente"
                className="flex-grow"
              />
              <Button 
                type="button" 
                onClick={handleAddIngredient}
                disabled={!currentIngredient.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2">
              {formData.ingredients && formData.ingredients.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center bg-motta-100 text-motta-700 rounded-full px-3 py-1 text-sm">
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="ml-2 text-motta-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-motta-500">Nenhum ingrediente adicionado</p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <DialogFooter className="pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {pizza ? 'Salvar Alterações' : 'Adicionar Pizza'}
        </Button>
      </DialogFooter>
    </form>
  );
};
