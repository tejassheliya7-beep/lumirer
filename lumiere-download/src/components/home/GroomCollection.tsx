import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem, GoldDivider } from '@/components/ui/motion';
import ProductCard from '@/components/products/ProductCard';

const GroomCollection = () => {
  const groomProducts = products.filter((p) => p.collection === 'groom').slice(0, 4);

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-luxury">
        <FadeIn className="text-center mb-16 space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium">
            For The Modern Groom
          </p>
          <h2 className="font-serif text-4xl md:text-5xl">
            Groom Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Luxury watches, bracelets, rings & accessories crafted for the man who 
            demands nothing less than extraordinary.
          </p>
          <GoldDivider className="max-w-xs mx-auto mt-6" />
        </FadeIn>

        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {groomProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="text-center">
          <Link to="/collection/groom">
            <Button variant="luxury" size="lg">
              Explore Full Collection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};

export default GroomCollection;
