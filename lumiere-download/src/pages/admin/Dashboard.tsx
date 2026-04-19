import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, Users, TrendingUp, IndianRupee, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const { isAdmin, loading } = useAdminAuth();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const orders = JSON.parse(localStorage.getItem('lumiere_orders') || '[]');
      const users = JSON.parse(localStorage.getItem('lumiere_db') || '[]');
      const productsData = JSON.parse(localStorage.getItem('products') || '[]'); // Assuming some local product storage or mock

      const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total), 0) || 0;
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length || 0;

      return {
        totalProducts: productsData.length || 24, // Default fallback if no products found
        totalOrders: orders.length || 0,
        totalUsers: users.length || 0,
        totalRevenue,
        pendingOrders,
      };
    },
    enabled: true,
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const db = JSON.parse(localStorage.getItem('lumiere_orders') || '[]');
      return db.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
    },
    enabled: true,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const statCards = [
    { title: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: IndianRupee, color: 'text-green-600' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-600' },
    { title: 'Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-purple-600' },
    { title: 'Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-orange-600' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back to Lumière Jewel Admin</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Order ID</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Customer</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium">Total</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                        <td className="py-3 px-2">{order.customer_name}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">{formatPrice(Number(order.total))}</td>
                        <td className="py-3 px-2 text-right text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
