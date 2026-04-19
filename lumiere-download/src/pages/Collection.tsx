import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { collections } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const collection = collections.find((c) => c.slug === slug);
  
  const { data: collectionProducts = [] } = useQuery({
    queryKey: ['collection-products', slug],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('products')
        .select('*') as any)
        .eq('status', 'published');
      
      if (error) throw error;
      
      return (data || []).filter((p: any) => p.collection === slug);
    }
  });

  if (!collection) {
    return (
      <Layout>
        <div className="container-luxury section-padding text-center">
          <h1 className="font-serif text-4xl mb-4">Collection Not Found</h1>
          <p className="text-muted-foreground mb-8">The collection you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="luxury">Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        {/* Hero Banner */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={collection.image}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <FadeIn>
              <p className="text-sm uppercase tracking-[0.3em] mb-3 text-white/80">Collection</p>
              <h1 className="font-serif text-4xl md:text-6xl text-center">{collection.name}</h1>
              {collection.description && (
                <p className="mt-4 text-white/70 text-center max-w-md">{collection.description}</p>
              )}
            </FadeIn>
          </div>
        </div>

        <div className="container-luxury section-padding">
          <FadeIn>
            <div className="flex items-center justify-between mb-10">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
              <p className="text-sm text-muted-foreground">{collectionProducts.length} pieces</p>
            </div>
          </FadeIn>

          {collectionProducts.length > 0 ? (
            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collectionProducts.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products in this collection yet.</p>
            </div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
};

export default CollectionPage;
