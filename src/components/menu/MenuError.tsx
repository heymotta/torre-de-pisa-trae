
import { ReactNode } from 'react';

interface MenuErrorProps {
  children?: ReactNode;
}

const MenuError = ({ children }: MenuErrorProps) => {
  return (
    <div className="container mx-auto py-8 pt-24">
      <div className="text-center text-red-500">
        <h1 className="text-3xl font-bold mb-8">Nosso Cardápio</h1>
        <p>Erro ao carregar o menu. Por favor, tente novamente.</p>
        {children}
        <button 
          className="mt-4 px-4 py-2 bg-motta-primary text-white rounded hover:bg-motta-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
};

export default MenuError;
