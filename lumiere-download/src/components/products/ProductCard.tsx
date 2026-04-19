import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import ProductQuickView from './ProductQuickView';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
    <div className="group product-card bg-card rounded-sm overflow-hidden cursor-pointer" onClick={() => setQuickViewOpen(true)}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover product-image transition-transform duration-700"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground text-xs uppercase tracking-wider px-3 py-1">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-foreground text-background text-xs uppercase tracking-wider px-3 py-1">
              Bestseller
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-destructive text-destructive-foreground text-xs uppercase tracking-wider px-3 py-1">
              Sale
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full shadow-md"
            onClick={() => addToWishlist(product)}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-primary text-primary' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full shadow-md"
            onClick={() => setQuickViewOpen(true)}
          >
            <Eye className="w-5 h-5" />
          </Button>
        </div>

        {/* Add to Cart - Mobile visible, desktop on hover */}
        <div className="absolute bottom-4 left-4 right-4 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            variant="luxury"
            className="w-full"
            onClick={() => addToCart(product)}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{product.goldPurity}</span>
          <span>•</span>
          <span>{product.metalColor}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-serif text-xl text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {product.goldWeight}g gold weight
          {product.diamondWeight && ` • ${product.diamondWeight}ct diamonds`}
        </p>
      </div>
    </div>
      <ProductQuickView
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
