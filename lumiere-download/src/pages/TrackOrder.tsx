import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Package, Truck, CheckCircle, Clock, MapPin, Search, Box, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface OrderData {
  id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  total: number;
  created_at: string;
  updated_at: string;
  shipping_address: any;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock, description: 'Your order has been received and is being reviewed' },
  { key: 'processing', label: 'Processing', icon: Box, description: 'Order confirmed & being prepared for shipping' },
  { key: 'shipped', label: 'Shipped', icon: Truck, description: 'On the way to your address' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Successfully delivered to you' },
];

const getStepIndex = (status: string) => {
  const idx = statusSteps.findIndex(s => s.key === status);
  return idx === -1 ? 0 : idx;
};

const shippingZones = [
  { zone: 'Metro Cities', cities: 'Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad', delivery: '2-3 Business Days', color: 'bg-primary/20 border-primary/40' },
  { zone: 'Tier-1 Cities', cities: 'Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh, Kochi', delivery: '3-5 Business Days', color: 'bg-accent/40 border-accent-foreground/20' },
  { zone: 'Tier-2 Cities', cities: 'Indore, Nagpur, Vadodara, Bhopal, Coimbatore', delivery: '5-7 Business Days', color: 'bg-secondary border-border' },
  { zone: 'Rest of India', cities: 'All other serviceable pin codes', delivery: '7-10 Business Days', color: 'bg-muted border-border' },
];

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async () => {
    if (!orderId.trim()) {
      toast.error('Please enter your Order ID');
      return;
    }
    setLoading(true);
    setSearched(true);
    // Offline Track Order Mock
    setTimeout(() => {
      const db = JSON.parse(localStorage.getItem('lumiere_orders') || '[]');
      const foundOrder = db.find((o: any) => o.id === orderId.trim());

      if (!foundOrder) {
        setOrder(null);
        toast.error('Order not found. Please check your Order ID.');
      } else {
        setOrder(foundOrder as OrderData);
        toast.success('Order tracking retrieved!');
      }
      setLoading(false);
    }, 800);
  };

  const currentStep = order ? getStepIndex(order.status) : -1;

  return (
    <Layout>
      <div className="container-luxury py-12 md:py-20 min-h-[70vh]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl mb-3">Track Your Order</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Enter your Order ID below to see the real-time status and estimated delivery of your shipment.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter your Order ID (e.g. abc12345-...)"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                className="pl-10"
                maxLength={100}
              />
            </div>
            <Button onClick={handleTrack} disabled={loading} variant="luxury">
              {loading ? 'Tracking...' : 'Track'}
            </Button>
          </div>
        </div>

        {/* Order Status Timeline */}
        {order && (
          <div className="max-w-2xl mx-auto mb-16 bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="font-mono text-sm font-medium truncate max-w-[200px]">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-lg">₹{order.total.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {statusSteps.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    {/* Connector line */}
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`absolute left-5 top-10 w-0.5 h-12 ${
                          idx < currentStep ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                    {/* Icon */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      } ${isCurrent ? 'ring-2 ring-primary/40 ring-offset-2' : ''}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {/* Text */}
                    <div className="pb-10">
                      <p className={`font-medium text-sm ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                      {isCurrent && (
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-accent-foreground px-2 py-0.5 rounded">
                          Current Status
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 mt-2 text-xs text-muted-foreground">
              <p>Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>Last updated: {new Date(order.updated_at || order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        )}

        {searched && !order && !loading && (
          <div className="max-w-xl mx-auto text-center py-10 mb-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No order found. Please double-check your Order ID and try again.</p>
          </div>
        )}

        {/* Shipping Zones Map */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-2">Shipping Coverage</h2>
          <p className="text-center text-muted-foreground mb-8">We deliver across India with insured & secure shipping</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {shippingZones.map(zone => (
              <div key={zone.zone} className={`rounded-lg border p-5 ${zone.color} transition-shadow hover:shadow-md`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-accent-foreground" />
                  <h3 className="font-semibold text-sm">{zone.zone}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{zone.cities}</p>
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{zone.delivery}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Info */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h3 className="font-serif text-xl mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" /> Packaging
                </h4>
                <p className="text-muted-foreground">All jewellery is securely packed in tamper-proof luxury boxes with cushioned interiors to prevent damage during transit.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Insurance
                </h4>
                <p className="text-muted-foreground">Every shipment is fully insured. In the unlikely event of damage or loss, you'll receive a complete replacement or refund.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" /> Free Shipping
                </h4>
                <p className="text-muted-foreground">Enjoy complimentary insured shipping on all orders above ₹50,000. A flat fee of ₹500 applies to orders below this amount.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Same-Day Dispatch
                </h4>
                <p className="text-muted-foreground">Orders placed before 2:00 PM IST on business days are dispatched the same day. Weekend orders ship the next business day.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
