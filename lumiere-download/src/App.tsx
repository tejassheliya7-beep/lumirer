import { useState, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import CollectionPage from "./pages/Collection";
import CustomDesignPage from "./pages/CustomDesign";
import CategoryPage from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Account from "./pages/Account";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminAnalytics from "./pages/admin/Analytics";
import StaticPage from "./pages/StaticPage";
import TrackOrder from "./pages/TrackOrder";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminAuth from "@/components/AdminAuth";

const queryClient = new QueryClient();

const App = () => {
  const hasSeenSplash = sessionStorage.getItem('lumiere_splash_seen') === 'true';
  const [showSplash, setShowSplash] = useState(!hasSeenSplash);
  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem('lumiere_splash_seen', 'true');
    setShowSplash(false);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/collection/:slug" element={<CollectionPage />} />
            <Route path="/custom-design" element={<CustomDesignPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<Account />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/size-guide" element={<StaticPage title="Size Guide" description="Find your perfect ring, bracelet, or necklace size with our comprehensive sizing guide." />} />
            <Route path="/returns" element={<StaticPage title="Returns & Exchange" description="We offer a hassle-free 30-day return and exchange policy on all our products." />} />
            <Route path="/buyback" element={<StaticPage title="Buyback Policy" description="We offer competitive buyback rates on all gold and diamond jewellery purchased from us." />} />
            <Route path="/emi" element={<StaticPage title="EMI Options" description="Enjoy flexible EMI options on purchases above ₹10,000 with leading banks." />} />
            <Route path="/faq" element={<StaticPage title="Frequently Asked Questions" description="Find answers to the most commonly asked questions about our products and services." />} />
            <Route path="/privacy" element={<StaticPage title="Privacy Policy" description="Learn how we collect, use, and protect your personal information." />} />
            <Route path="/terms" element={<StaticPage title="Terms of Service" description="Read our terms and conditions governing the use of our website and services." />} />
            <Route path="/shipping" element={<StaticPage title="Shipping Policy" description="We offer free insured shipping on all orders above ₹50,000 across India." />} />
            <Route path="/admin" element={<AdminAuth><AdminDashboard /></AdminAuth>} />
            <Route path="/admin/products" element={<AdminAuth><AdminProducts /></AdminAuth>} />
            <Route path="/admin/orders" element={<AdminAuth><AdminOrders /></AdminAuth>} />
            <Route path="/admin/users" element={<AdminAuth><AdminUsers /></AdminAuth>} />
            <Route path="/admin/analytics" element={<AdminAuth><AdminAnalytics /></AdminAuth>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
  );
};

export default App;
