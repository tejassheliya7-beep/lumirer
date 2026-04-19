import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import logoImg from '@/assets/logo.jpg';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { title: 'Products', icon: Package, path: '/admin/products' },
  { title: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { title: 'Users', icon: Users, path: '/admin/users' },
  { title: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('lumiere_session');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-foreground text-background flex flex-col transition-all duration-300 z-50',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-background/10">
          <img src={logoImg} alt="Logo" className="h-8 w-8 rounded-sm object-cover flex-shrink-0" />
          {!collapsed && (
            <div className="flex flex-col leading-none overflow-hidden">
              <span className="font-serif text-sm tracking-wide text-primary">LUMIÈRE</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-background/50">Admin</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-background/60 hover:text-background hover:bg-background/10'
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 pb-4 space-y-1 border-t border-background/10 pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-background/60 hover:text-background hover:bg-background/10 transition-colors"
            title={collapsed ? 'View Store' : undefined}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>View Store</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-background/60 hover:text-destructive hover:bg-background/10 transition-colors w-full"
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-foreground text-background border border-background/20 rounded-full p-1 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main content */}
      <main className={cn('flex-1 transition-all duration-300', collapsed ? 'ml-16' : 'ml-60')}>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
