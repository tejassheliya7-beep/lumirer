import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { categories, collections } from '@/data/products';

const LeftSidebar = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories']);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  };

  return (
    <aside className="hidden lg:block w-60 flex-shrink-0 border-r border-border bg-background overflow-y-auto h-[calc(100vh-120px)] sticky top-[90px] md:top-[120px] md:h-[calc(100vh-120px)]">
      <nav className="py-6 px-4 space-y-6">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            Categories
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                expandedSections.includes('categories') ? '' : '-rotate-90'
              }`}
            />
          </button>
          {expandedSections.includes('categories') && (
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center">
                    <Link
                      to={`/category/${category.slug}`}
                      className="flex-1 flex items-center gap-3 px-2 py-2 rounded-sm text-sm hover:bg-secondary hover:text-primary transition-colors"
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-8 h-8 rounded-sm object-cover flex-shrink-0"
                      />
                      <span>{category.name}</span>
                    </Link>
                    {category.subcategories && (
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-1.5 hover:bg-secondary rounded-sm transition-colors"
                      >
                        <ChevronRight
                          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                            expandedCategories.includes(category.id) ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {category.subcategories && expandedCategories.includes(category.id) && (
                    <div className="ml-[3.25rem] space-y-0.5 mt-1">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/category/${sub.slug}`}
                          className="block px-2 py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collections */}
        <div>
          <button
            onClick={() => toggleSection('collections')}
            className="flex items-center justify-between w-full text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            Collections
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                expandedSections.includes('collections') ? '' : '-rotate-90'
              }`}
            />
          </button>
          {expandedSections.includes('collections') && (
            <div className="space-y-1">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collection/${collection.slug}`}
                  className="group block px-2 py-2 rounded-sm hover:bg-secondary transition-colors"
                >
                  <div className="relative w-full aspect-[3/2] rounded-sm overflow-hidden mb-1.5">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-white text-xs font-medium">
                      {collection.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="space-y-1 pt-2 border-t border-border">
          <Link
            to="/new-arrivals"
            className="flex items-center gap-2 px-2 py-2.5 rounded-sm text-sm font-medium hover:bg-secondary hover:text-primary transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            New Arrivals
          </Link>
          <Link
            to="/bestsellers"
            className="flex items-center gap-2 px-2 py-2.5 rounded-sm text-sm font-medium hover:bg-secondary hover:text-primary transition-colors"
          >
            Bestsellers
          </Link>
          <Link
            to="/custom-design"
            className="flex items-center gap-2 px-2 py-2.5 rounded-sm text-sm font-medium text-primary hover:bg-secondary transition-colors"
          >
            Custom Design
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
