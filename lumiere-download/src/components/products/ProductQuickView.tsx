import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductQuickView = ({ product, isOpen, onClose }: ProductQuickViewProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Glass Card */}
          <motion.div
            className="relative w-full max-w-lg md:max-w-2xl rounded-2xl overflow-hidden border border-primary/20 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, hsla(0,0%,100%,0.85), hsla(40,50%,97%,0.75))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-md border border-border/50 text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <motion.div
                className="relative w-full md:w-1/2 aspect-square overflow-hidden"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-primary text-primary-foreground text-xs uppercase tracking-wider px-3 py-1 rounded-sm">
                      New
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-foreground text-background text-xs uppercase tracking-wider px-3 py-1 rounded-sm">
                      Bestseller
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-serif text-2xl md:text-3xl leading-tight text-foreground">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">(4.8)</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{product.goldPurity}</span>
                    <span>•</span>
                    <span>{product.metalColor}</span>
                    {product.diamondWeight && (
                      <>
                        <span>•</span>
                        <span>{product.diamondWeight}ct</span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-3 mt-6">
                  <Button
                    variant="luxury"
                    className="w-full"
                    onClick={() => {
                      addToCart(product);
                      onClose();
                    }}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>

                  <div className="flex gap-3">
                    <Button
                      variant="luxuryOutline"
                      className="flex-1"
                      onClick={() => addToWishlist(product)}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${inWishlist ? 'fill-primary text-primary' : ''}`} />
                      {inWishlist ? 'Wishlisted' : 'Wishlist'}
                    </Button>
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <Button variant="luxuryOutline" className="w-full" onClick={onClose}>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Gold accent line */}
            <motion.div
              className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
