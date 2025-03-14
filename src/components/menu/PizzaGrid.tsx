
import PizzaCard, { PizzaItem } from '@/components/ui/custom/PizzaCard';

interface PizzaGridProps {
  pizzas: PizzaItem[];
}

const PizzaGrid = ({ pizzas }: PizzaGridProps) => {
  if (pizzas.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <p>Nenhuma pizza encontrada. Tente outra pesquisa.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pizzas.map((pizza) => (
        <PizzaCard key={pizza.id} pizza={pizza} />
      ))}
    </div>
  );
};

export default PizzaGrid;
