import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { categories, getAllCategories } from '@/data/products';
import { FilterState, Category as CategoryType } from '@/types/product';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X, ChevronDown, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const defaultFilters: FilterState = {
  priceRange: [0, 1000000],
  goldPurity: [],
  metalColor: [],
  diamondType: [],
  diamondShape: [],
  weightRange: [0, 100],
  inStock: false,
  sortBy: 'bestseller',
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allCategories = getAllCategories();
  const category = allCategories.find((c) => c.slug === slug);
  
  // Check if this is a parent category with subcategories
  const parentCategory = categories.find((c) => c.slug === slug && c.subcategories);
  
  const { data: categoryProducts = [] } = useQuery({
    queryKey: ['category-products', slug],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('products')
        .select('*') as any)
        .eq('status', 'published');
      
      if (error) throw error;

      if (parentCategory?.subcategories) {
        const subSlugs = parentCategory.subcategories.map((s) => s.slug);
        return (data || []).filter((p: any) => subSlugs.includes(p.category));
      }
      return (data || []).filter((p: any) => p.category === slug);
    }
  });

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Gold purity filter
      if (filters.goldPurity.length > 0 && !filters.goldPurity.includes(product.goldPurity)) {
        return false;
      }

      // Metal color filter
      if (filters.metalColor.length > 0 && !filters.metalColor.includes(product.metalColor)) {
        return false;
      }

      // Diamond type filter
      if (filters.diamondType.length > 0) {
        if (!product.diamondType || !filters.diamondType.includes(product.diamondType)) {
          return false;
        }
      }

      // Diamond shape filter
      if (filters.diamondShape.length > 0) {
        if (!product.diamondShape || !filters.diamondShape.includes(product.diamondShape)) {
          return false;
        }
      }

      // In stock filter (for mock, we treat stock_quantity > 0 as inStock)
      if (filters.inStock && (product.stock_quantity === 0 || product.inStock === false)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return a.is_new ? -1 : 1;
        default:
          return (a.is_bestseller || a.isBestseller) ? -1 : 1;
      }
    });
  }, [categoryProducts, filters]);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  if (!category) {
    return (
      <Layout>
        <div className="container-luxury section-padding text-center">
          <h1 className="font-serif text-4xl mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container-luxury relative z-10">
          <div className="max-w-2xl">
            {category.parentSlug && (
              <Link to={`/category/${category.parentSlug}`} className="text-primary text-sm uppercase tracking-[0.3em] mb-2 inline-block hover:underline">
                ← Back to Diamonds
              </Link>
            )}
            <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4">Collection</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              {category.name}
            </h1>
            <p className="text-white/80 text-lg">
              Explore our exquisite collection of {category.name.toLowerCase()}, 
              each piece crafted with exceptional artistry.
            </p>
          </div>
        </div>
      </section>

      {/* Subcategory Tiles for parent categories */}
      {parentCategory?.subcategories && (
        <section className="section-padding pb-0">
          <div className="container-luxury">
            <h2 className="font-serif text-2xl md:text-3xl mb-8">Shop by Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {parentCategory.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/category/${sub.slug}`}
                  className="group relative overflow-hidden rounded-sm aspect-[3/4]"
                >
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <h3 className="font-serif text-lg md:text-xl text-white mb-1">
                      {sub.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white/70 text-sm">{sub.productCount} pieces</p>
                      <ArrowRight className="w-4 h-4 text-white transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="section-padding">
        <div className="container-luxury">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{filteredProducts.length}</span> products
            </p>

            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-xl">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters
                      filters={filters}
                      onFilterChange={setFilters}
                      onClearFilters={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters({ ...filters, sortBy: value as FilterState['sortBy'] })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bestseller">Bestseller</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-12">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={clearFilters}
              />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="font-serif text-2xl mb-2">No Products Found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                  <Button variant="luxuryOutline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
