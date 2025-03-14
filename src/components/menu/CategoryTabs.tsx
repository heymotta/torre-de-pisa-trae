
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) => {
  // Helper function to format category name for display
  const formatCategoryName = (category: string) => {
    if (category === 'all') return 'Todas';
    
    // Capitalize first letter
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex space-x-2 min-w-max pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              activeCategory === category
                ? "bg-motta-primary text-white"
                : "bg-motta-100 text-motta-700 hover:bg-motta-200"
            )}
          >
            {formatCategoryName(category)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
