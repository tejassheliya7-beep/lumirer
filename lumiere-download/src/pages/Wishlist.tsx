import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useCart();

  if (wishlist.length === 0) {
    return (
      <Layout>
        <div className="container-luxury section-padding">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-secondary rounded-full">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-3xl mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Save your favorite pieces to revisit them later. Your wishlist helps you keep track 
              of designs you love.
            </p>
            <Link to="/">
              <Button variant="luxury" size="xl">
                Discover Collection
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-luxury section-padding">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-2">
              My Wishlist
            </p>
            <h1 className="font-serif text-3xl md:text-4xl">Saved Pieces</h1>
          </div>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
