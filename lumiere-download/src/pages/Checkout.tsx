import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Loader2, Shield, Truck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { PageTransition, FadeIn, SlideIn } from '@/components/ui/motion';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', notes: '',
  });

  const shipping = cartTotal >= 50000 ? 0 : 500;
  const insurance = Math.round(cartTotal * 0.005);
  const orderTotal = cartTotal + shipping + insurance;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (cart.length === 0) { toast.error('Your cart is empty'); return; }

    setLoading(true);
    
    // Offline Order Creation
    setTimeout(() => {
      try {
        console.log("Starting offline order processing...");
        
        // Robust Session Parsing
        let sessionUser = null;
        const rawSession = localStorage.getItem('lumiere_session');
        if (rawSession) {
          try {
            sessionUser = JSON.parse(rawSession);
          } catch (e) {
            console.warn("Failed to parse session JSON, using raw value", e);
            sessionUser = { email: rawSession, displayName: 'User' };
          }
        }

        // Robust Orders Parsing
        let dbOrders = [];
        const rawOrders = localStorage.getItem('lumiere_orders');
        if (rawOrders) {
          try {
            dbOrders = JSON.parse(rawOrders);
            if (!Array.isArray(dbOrders)) dbOrders = [];
          } catch (e) {
            console.error("Failed to parse orders DB", e);
            dbOrders = [];
          }
        }
        
        // Robust UUID Fallback
        let orderId;
        try {
          if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
            orderId = window.crypto.randomUUID();
          } else {
            orderId = Math.random().toString(36).substring(2, 11) + '-' + Date.now();
          }
        } catch (e) {
          orderId = 'ord-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        }

        console.log("Generated Order ID:", orderId);

        const newOrder = {
          id: orderId,
          created_at: new Date().toISOString(),
          customer_name: form.name?.trim() || 'Guest',
          customer_email: form.email?.trim() || 'guest@example.com',
          customer_phone: form.phone?.trim() || '',
          subtotal: cartTotal,
          shipping_cost: shipping,
          total: orderTotal,
          status: 'pending',
          user_id: sessionUser?.id || null,
          notes: form.notes?.trim() || null,
          shipping_address: { 
            address: form.address?.trim() || '', 
            city: form.city?.trim() || '', 
            state: form.state?.trim() || '', 
            pincode: form.pincode?.trim() || '' 
          },
          items: cart.map(item => ({
            product_name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            total: item.product.price * item.quantity,
          }))
        };

        dbOrders.push(newOrder);
        localStorage.setItem('lumiere_orders', JSON.stringify(dbOrders));
        console.log("Order saved to localStorage");

        clearCart();
        navigate(`/order-confirmation/${orderId}`, { replace: true });
        toast.success("Order Placed Successfully!");
      } catch (err: any) {
        console.error('Checkout error details:', err);
        toast.error(`Failed to place order: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }, 1500); 
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <PageTransition>
          <div className="container-luxury py-20 text-center">
            <h1 className="font-serif text-3xl mb-4">Your cart is empty</h1>
            <Link to="/"><Button variant="luxury">Continue Shopping</Button></Link>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="container-luxury py-10 md:py-16">
          <FadeIn>
            <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl mb-8">Checkout</h1>
          </FadeIn>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Customer Details */}
              <SlideIn direction="left" className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-sm p-6">
                  <h2 className="font-serif text-xl mb-5">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="name">Full Name *</Label><Input id="name" name="name" value={form.name} onChange={handleChange} maxLength={100} required /></div>
                    <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" value={form.email} onChange={handleChange} maxLength={255} required /></div>
                    <div className="md:col-span-2"><Label htmlFor="phone">Phone Number *</Label><Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} maxLength={15} required /></div>
                  </div>
                </div>

                <FadeIn delay={0.2}>
                  <div className="bg-card border border-border rounded-sm p-6">
                    <h2 className="font-serif text-xl mb-5">Shipping Address</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div><Label htmlFor="address">Street Address *</Label><Input id="address" name="address" value={form.address} onChange={handleChange} maxLength={300} required /></div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><Label htmlFor="city">City *</Label><Input id="city" name="city" value={form.city} onChange={handleChange} maxLength={100} required /></div>
                        <div><Label htmlFor="state">State *</Label><Input id="state" name="state" value={form.state} onChange={handleChange} maxLength={100} required /></div>
                        <div><Label htmlFor="pincode">PIN Code *</Label><Input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} maxLength={10} required /></div>
                      </div>
                      <div><Label htmlFor="notes">Order Notes (optional)</Label><Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} maxLength={500} placeholder="Special instructions for delivery..." /></div>
                    </div>
                  </div>
                </FadeIn>
              </SlideIn>

              {/* Order Summary */}
              <SlideIn direction="right" delay={0.3} className="lg:col-span-1">
                <div className="sticky top-32 bg-card border border-border rounded-sm p-6 space-y-5">
                  <h2 className="font-serif text-xl">Order Summary</h2>
                  <div className="space-y-3 text-sm max-h-48 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex justify-between gap-2">
                        <span className="text-muted-foreground truncate">{item.product.name} × {item.quantity}</span>
                        <span className="shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Insurance</span><span>{formatPrice(insurance)}</span></div>
                    <div className="flex justify-between pt-3 border-t border-border text-lg font-medium"><span>Total</span><span className="text-primary font-serif">{formatPrice(orderTotal)}</span></div>
                  </div>
                  <Button type="submit" variant="luxury" size="xl" className="w-full" disabled={loading}>
                    {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Placing Order...</> : 'PLACE MY SECURE ORDER'}
                  </Button>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center"><Shield className="w-5 h-5 mx-auto mb-1 text-primary" /><p className="text-[10px] text-muted-foreground">Secure</p></div>
                    <div className="text-center"><Truck className="w-5 h-5 mx-auto mb-1 text-primary" /><p className="text-[10px] text-muted-foreground">Insured</p></div>
                    <div className="text-center"><CreditCard className="w-5 h-5 mx-auto mb-1 text-primary" /><p className="text-[10px] text-muted-foreground">Easy EMI</p></div>
                  </div>
                </div>
              </SlideIn>
            </div>
          </form>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Checkout;
