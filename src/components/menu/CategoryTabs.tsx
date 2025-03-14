
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) => {
  return (
    <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
      <TabsList className="w-full justify-start overflow-auto">
        {categories.map((category) => (
          <TabsTrigger key={category} value={category} className="capitalize">
            {category === 'all' ? 'Todas' : category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
