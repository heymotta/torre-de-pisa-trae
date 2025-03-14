
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PizzaItem } from '@/components/ui/custom/PizzaCard';
import { toast } from 'sonner';

interface CartItem extends PizzaItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: PizzaItem) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('mottaBurguerCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Update localStorage and totals whenever cart changes
  useEffect(() => {
    localStorage.setItem('mottaBurguerCart', JSON.stringify(items));
    
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(itemCount);
    
    const priceTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalPrice(priceTotal);
  }, [items]);

  const addItem = (item: PizzaItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        toast.success(`${item.name} adicionado ao carrinho`);
        return prevItems.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      } else {
        toast.success(`${item.name} adicionado ao carrinho`);
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(i => i.id === id);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} removido do carrinho`);
      }
      return prevItems.filter(i => i.id !== id);
    });
  };

  const increaseQuantity = (id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setItems(prevItems => {
      const item = prevItems.find(i => i.id === id);
      
      if (item && item.quantity === 1) {
        return prevItems.filter(i => i.id !== id);
      }
      
      return prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Carrinho esvaziado');
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
