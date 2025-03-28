
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const EmptyMenuState = () => {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    console.log('Tentando atualizar os dados do cardápio...');
    toast('Atualizando cardápio', {
      description: 'Buscando as pizzas disponíveis...'
    });
    queryClient.invalidateQueries({ queryKey: ['pizzas'] });
  };
  
  return (
    <div className="container mx-auto py-8 pt-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Nosso Cardápio</h1>
        <p className="mb-4">Nenhuma pizza disponível no momento.</p>
        <p className="text-motta-500 mb-6">Estamos trabalhando para adicionar novas opções em breve!</p>
        <p className="mb-6 text-sm text-motta-600">
          (Verifique se há pizzas cadastradas como "disponivel = true" no banco de dados)
        </p>
        
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Atualizar Cardápio
        </Button>
      </div>
    </div>
  );
};

export default EmptyMenuState;
