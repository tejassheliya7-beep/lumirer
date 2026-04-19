import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';

const FeaturedProducts = () => {
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      // In offline mode, status will be correctly stored.
      // We filter for published products that are bestsellers or new arrivals.
      const { data, error } = await (supabase
        .from('products')
        .select('*') as any) // Cast as any for chaining safety with mock
        .eq('status', 'published');
      
      if (error) throw error;
      
      return (data || [])
        .filter((p: any) => p.is_bestseller || p.is_new)
        .slice(0, 4);
    }
  });

  return (
    <section className="section-padding bg-secondary">
      <div className="container-luxury">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium">
                Our Selection
              </p>
              <h2 className="font-serif text-4xl md:text-5xl">
                Bestsellers & New Arrivals
              </h2>
            </div>
            <Link to="/bestsellers">
              <Button variant="luxuryOutline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Products Grid */}
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
          {featuredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground italic">
              No featured products available at the moment.
            </div>
          )}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturedProducts;
