import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface OrderData {
  id: string;
  status: string;
  customer_name: string;
  total: number;
  created_at: string;
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      // Offline Database Read
      setTimeout(() => {
        const db = JSON.parse(localStorage.getItem('lumiere_orders') || '[]');
        const foundOrder = db.find((o: any) => o.id === orderId);
        setOrder(foundOrder || null);
        setLoading(false);
      }, 500);
    };
    fetchOrder();
  }, [orderId]);

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      toast.success('Order ID copied!');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <Layout>
        <div className="container-luxury py-20 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-2" />
            <div className="h-4 bg-muted rounded w-48 mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container-luxury py-20 text-center">
          <h1 className="font-serif text-3xl mb-4">Order Not Found</h1>
          <Link to="/"><Button variant="luxury">Go Home</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-luxury py-12 md:py-20 min-h-[60vh]">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-primary/15 rounded-full">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>

          <h1 className="font-serif text-3xl md:text-4xl mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you, <span className="font-medium text-foreground">{order.customer_name}</span>. Your order has been received.
          </p>

          {/* Order ID Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Your Order ID</p>
            <div className="flex items-center justify-center gap-3">
              <code className="font-mono text-lg md:text-xl font-bold text-foreground break-all select-all">
                {order.id}
              </code>
              <button onClick={copyOrderId} className="p-2 hover:bg-secondary rounded-sm transition-colors shrink-0" title="Copy Order ID">
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Save this ID to track your order anytime</p>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8 text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="font-serif text-lg font-semibold text-primary">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-accent-foreground px-2 py-1 rounded capitalize">
                <Package className="w-3 h-3" /> {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/track-order`}>
              <Button variant="luxury" size="lg">
                Track Order <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="luxuryOutline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
