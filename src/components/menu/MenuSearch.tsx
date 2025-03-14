
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MenuSearch = ({ searchQuery, setSearchQuery }: MenuSearchProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Pesquisar pizza..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default MenuSearch;
