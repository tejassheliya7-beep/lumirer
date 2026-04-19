import { useState, useEffect, useRef } from 'react';
import logoImg from '@/assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, Phone, User, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { categories, collections, products } from '@/data/products';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cartCount, wishlistCount } = useCart();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = searchQuery.trim().length >= 2
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.collection?.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  useEffect(() => {
    const updateSession = () => {
      const sessionData = localStorage.getItem('lumiere_session');
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          setUser(parsed);
          // Simple admin check for demo: if email contains 'admin'
          setIsAdmin(parsed.email?.toLowerCase().includes('admin'));
        } catch (e) {
          setUser({ email: sessionData } as any);
          setIsAdmin(sessionData.toLowerCase().includes('admin'));
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    };

    updateSession();
    window.addEventListener('storage', updateSession);
    const interval = setInterval(updateSession, 1000); // Poll for changes

    return () => {
      window.removeEventListener('storage', updateSession);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('lumiere_session');
    setUser(null);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-foreground text-background text-xs py-2">
        <div className="container-luxury flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Free Shipping on orders above ₹50,000</span>
            <span className="md:hidden">Free Shipping ₹50,000+</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">+91 98765 43210</span>
            </a>
            <Link to="/store-locator" className="hover:text-primary transition-colors hidden sm:inline">
              Store Locator
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-luxury py-2 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-8">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 md:gap-3">
            <img src={logoImg} alt="Lumière Jewel Logo" className="h-10 md:h-16 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base md:text-2xl tracking-wide text-gold-gradient">LUMIÈRE</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Jewel</span>
            </div>
          </Link>

          {/* Actions */}
            <div className="flex items-center gap-1 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSearchOpen(true)}>
              <Search className="w-5 h-5" />
            </Button>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" title="Admin Dashboard">
                      <LayoutDashboard className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <Link to="/account">
                  <Button variant="ghost" size="icon" title="My Account">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" title="Sign in">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in">
          <div className="container-luxury py-6 space-y-6">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Categories</p>
              {categories.map((category) => (
                <div key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="block py-2 text-lg font-serif hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories && (
                    <div className="ml-4 space-y-1">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/category/${sub.slug}`}
                          className="block py-1.5 text-base text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-6 space-y-4">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Collections</p>
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collection/${collection.slug}`}
                  className="block py-2 text-lg font-serif hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {collection.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-border pt-6">
              <Link
                to="/custom-design"
                className="block py-2 text-lg font-serif text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Custom Design
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-sm">
          <div className="container-luxury pt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for rings, necklaces, diamonds..."
                  className="pl-12 pr-4 py-6 text-lg border-border bg-secondary/50 rounded-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            {searchQuery.trim().length >= 2 && (
              <div className="space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-sm hover:bg-secondary transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                      </div>
                      <span className="text-primary font-serif font-medium">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No products found for "{searchQuery}"</p>
                )}
              </div>
            )}

            {searchQuery.trim().length < 2 && (
              <p className="text-sm text-muted-foreground">Type at least 2 characters to search...</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
