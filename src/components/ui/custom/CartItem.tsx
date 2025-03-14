
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PizzaItem } from './PizzaCard';

interface CartItemProps {
  item: PizzaItem & { quantity: number };
}

const CartItem = ({ item }: CartItemProps) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="flex items-center py-4 border-b border-motta-200 animate-fade-in">
      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="font-medium text-motta-900">{item.name}</h3>
        <p className="text-sm text-motta-600 line-clamp-1">{item.description}</p>
        <p className="text-sm font-medium text-motta-primary mt-1">
          {formatPrice(item.price)}
        </p>
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        <button 
          onClick={() => decreaseQuantity(item.id)}
          className="p-1 rounded-full border border-motta-200 hover:bg-motta-100 transition-colors"
          aria-label="Diminuir quantidade"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        
        <span className="font-medium text-sm px-2 min-w-8 text-center">
          {item.quantity}
        </span>
        
        <button 
          onClick={() => increaseQuantity(item.id)}
          className="p-1 rounded-full border border-motta-200 hover:bg-motta-100 transition-colors"
          aria-label="Aumentar quantidade"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      
      <div className="ml-4 text-right">
        <p className="font-bold text-motta-900">
          {formatPrice(item.price * item.quantity)}
        </p>
        
        <button 
          onClick={() => removeItem(item.id)}
          className="text-red-500 hover:text-red-700 transition-colors inline-flex items-center text-xs mt-1"
          aria-label="Remover item"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Remover
        </button>
      </div>
    </div>
  );
};

export default CartItem;
