
import { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from '@/context/CartContext';
import PrimaryButton from './PrimaryButton';

export interface BurgerItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients?: string[];
  category: string;
}

interface BurgerCardProps {
  burger: BurgerItem;
}

const BurgerCard = ({ burger }: BurgerCardProps) => {
  const { addItem } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = () => {
    addItem(burger);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group h-full flex flex-col">
      <div className="relative overflow-hidden h-48">
        <img
          src={burger.image}
          alt={burger.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'img-loaded' : 'img-loading'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="bg-white/90 hover:bg-white p-1.5 rounded-full transition-colors">
                  <Info className="w-4 h-4 text-motta-700" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-medium mb-1">Ingredientes:</p>
                  <ul className="text-xs">
                    {burger.ingredients?.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    )) || <li>Informação não disponível</li>}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-bold text-lg">{burger.name}</h3>
            <span className="font-display font-bold text-motta-primary">{formatPrice(burger.price)}</span>
          </div>
          <p className="text-motta-600 text-sm mb-4 line-clamp-2">{burger.description}</p>
        </div>
        <PrimaryButton 
          onClick={handleAddToCart} 
          className="mt-2" 
          fullWidth 
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Adicionar
        </PrimaryButton>
      </CardContent>
    </Card>
  );
};

export default BurgerCard;
