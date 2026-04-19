import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Shield, Truck, CreditCard } from 'lucide-react';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const shipping = cartTotal >= 50000 ? 0 : 500;
  const insurance = Math.round(cartTotal * 0.005);
  const orderTotal = cartTotal + shipping + insurance;

  if (cart.length === 0) {
    return (
      <Layout>
        <PageTransition>
          <div className="container-luxury section-padding">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-secondary rounded-full">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Discover our exquisite collection and add pieces that speak to your soul.
              </p>
              <Link to="/">
                <Button variant="luxury" size="xl">Continue Shopping</Button>
              </Link>
            </motion.div>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="container-luxury section-padding">
          <FadeIn>
            <h1 className="font-serif text-3xl md:text-4xl mb-8">Shopping Cart</h1>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <StaggerContainer staggerDelay={0.1} className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <StaggerItem key={item.product.id}>
                  <div className="flex gap-6 p-6 bg-card border border-border rounded-sm">
                    <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-sm bg-secondary">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link to={`/product/${item.product.id}`}>
                            <h3 className="font-serif text-lg hover:text-primary transition-colors">{item.product.name}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.product.goldPurity} • {item.product.metalColor}
                            {item.selectedSize && ` • Size ${item.selectedSize}`}
                          </p>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="p-2 hover:bg-secondary rounded-sm transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-border rounded-sm">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 hover:bg-secondary transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 hover:bg-secondary transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-xl text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                          {item.quantity > 1 && <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)} each</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
              <div className="flex justify-end">
                <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={clearCart}>Clear Cart</Button>
              </div>
            </StaggerContainer>

            {/* Order Summary */}
            <FadeIn delay={0.3} className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <div className="bg-card border border-border rounded-sm p-6 space-y-6">
                  <h2 className="font-serif text-xl">Order Summary</h2>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span>{formatPrice(insurance)}</span></div>
                    <div className="flex justify-between pt-4 border-t border-border text-lg font-medium"><span>Total</span><span className="text-primary font-serif">{formatPrice(orderTotal)}</span></div>
                  </div>
                  <Link to="/checkout"><Button variant="luxury" size="xl" className="w-full">Proceed to Checkout<ArrowRight className="w-5 h-5 ml-2" /></Button></Link>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center"><Shield className="w-5 h-5 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">Secure Payment</p></div>
                    <div className="text-center"><Truck className="w-5 h-5 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">Insured Delivery</p></div>
                    <div className="text-center"><CreditCard className="w-5 h-5 mx-auto mb-2 text-primary" /><p className="text-xs text-muted-foreground">Easy EMI</p></div>
                  </div>
                </div>
                {cartTotal < 50000 && (
                  <div className="bg-accent/50 p-4 rounded-sm text-center">
                    <p className="text-sm">Add {formatPrice(50000 - cartTotal)} more for <span className="font-medium text-primary">free shipping</span></p>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Cart;
