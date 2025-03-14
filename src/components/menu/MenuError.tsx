
import { ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface MenuErrorProps {
  children?: ReactNode;
}

const MenuError = ({ children }: MenuErrorProps) => {
  const queryClient = useQueryClient();
  
  const handleRetry = () => {
    console.log('Tentando carregar o cardápio novamente...');
    toast('Tentando novamente', {
      description: 'Recarregando o cardápio...'
    });
    queryClient.invalidateQueries({ queryKey: ['pizzas'] });
  };
  
  return (
    <div className="container mx-auto py-8 pt-24">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Nosso Cardápio</h1>
        <p className="text-red-500 font-medium mb-2">Erro ao carregar o menu. Por favor, tente novamente.</p>
        {children}
        <Button 
          onClick={handleRetry}
          className="mt-6 flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
};

export default MenuError;
