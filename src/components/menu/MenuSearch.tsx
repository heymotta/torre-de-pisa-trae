
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MenuSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MenuSearch = ({ searchQuery, setSearchQuery }: MenuSearchProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  // Update local search when external search changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };
  
  const clearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative max-w-xl mx-auto">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-motta-500 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar pizza por nome ou ingrediente..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-10 py-2 w-full rounded-lg border-motta-300 focus:ring-motta-primary focus:border-motta-primary"
            />
            {localSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-motta-500 hover:text-motta-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            type="submit" 
            className="ml-2 bg-motta-primary hover:bg-motta-primary/90"
          >
            Buscar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MenuSearch;
