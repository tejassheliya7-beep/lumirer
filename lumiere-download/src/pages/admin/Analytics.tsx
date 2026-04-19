import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

const COLORS = [
  'hsl(43,72%,52%)', 'hsl(200,70%,50%)', 'hsl(140,60%,45%)',
  'hsl(280,60%,55%)', 'hsl(20,80%,55%)', 'hsl(0,70%,50%)',
];

const AdminAnalytics = () => {
  const { isAdmin, loading } = useAdminAuth();

  // Load orders from localStorage (offline)
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-analytics-orders'],
    queryFn: async () => {
      const db = JSON.parse(localStorage.getItem('lumiere_orders') || '[]');
      return db.sort((a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    },
    enabled: isAdmin,
  });

  // Load users from localStorage (offline)
  const { data: users = [] } = useQuery({
    queryKey: ['admin-analytics-users'],
    queryFn: async () => JSON.parse(localStorage.getItem('lumiere_db') || '[]'),
    enabled: isAdmin,
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

  // Revenue by month (from localStorage orders)
  const revenueByMonth = (orders as any[]).reduce((acc: any[], order) => {
    const month = new Date(order.created_at).toLocaleDateString('en-IN', {
      month: 'short', year: '2-digit',
    });
    const existing = acc.find(a => a.month === month);
    if (existing) {
      existing.revenue += Number(order.total);
      existing.orders += 1;
    } else {
      acc.push({ month, revenue: Number(order.total), orders: 1 });
    }
    return acc;
  }, []);

  // Orders by status
  const ordersByStatus = (orders as any[]).reduce((acc: any[], order) => {
    const existing = acc.find(a => a.name === order.status);
    if (existing) existing.value += 1;
    else acc.push({ name: order.status, value: 1 });
    return acc;
  }, []);

  // Orders by product category (from items embedded in orders)
  const categoryMap: Record<string, number> = {};
  (orders as any[]).forEach(order => {
    (order.items || []).forEach((item: any) => {
      const cat = item.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
  });
  const productsByCategory = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Summary stats
  const totalRevenue = (orders as any[]).reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Business insights and performance</p>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: formatPrice(totalRevenue) },
            { label: 'Total Orders', value: totalOrders },
            { label: 'Registered Users', value: totalUsers },
            { label: 'Avg Order Value', value: formatPrice(avgOrderValue) },
          ].map(kpi => (
            <Card key={kpi.label}>
              <CardContent className="pt-5">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-semibold mt-1">{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue chart */}
        <Card>
          <CardHeader><CardTitle className="text-lg font-serif">Revenue Over Time</CardTitle></CardHeader>
          <CardContent>
            {revenueByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip formatter={(value: number) => formatPrice(value)} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(43,72%,52%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-12">
                No order data yet. Place some orders to see revenue trends.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by status */}
          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Orders by Status</CardTitle></CardHeader>
            <CardContent>
              {ordersByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {ordersByStatus.map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-12">No orders yet</p>
              )}
            </CardContent>
          </Card>

          {/* Products by category from order items */}
          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Orders per Category</CardTitle></CardHeader>
            <CardContent>
              {productsByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={productsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(43,72%,52%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-12">No data yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
