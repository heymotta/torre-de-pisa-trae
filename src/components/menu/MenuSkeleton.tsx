
import { Skeleton } from '@/components/ui/skeleton';

const MenuSkeleton = () => {
  return (
    <div className="container mx-auto py-8 pt-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Nosso Cardápio</h1>
        <p className="mt-4">Carregando o menu...</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSkeleton;
