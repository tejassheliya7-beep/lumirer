import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Shield, Award, Truck, RotateCcw } from 'lucide-react';
import logoImg from '@/assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Trust badges */}
      <div className="border-b border-background/10">
        <div className="container-luxury py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <Shield className="w-8 h-8 mb-3 text-primary" />
              <h4 className="font-medium mb-1">100% Certified</h4>
              <p className="text-sm text-background/60">BIS Hallmarked Gold</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Award className="w-8 h-8 mb-3 text-primary" />
              <h4 className="font-medium mb-1">IGI Certified</h4>
              <p className="text-sm text-background/60">Diamond Authenticity</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="w-8 h-8 mb-3 text-primary" />
              <h4 className="font-medium mb-1">Insured Delivery</h4>
              <p className="text-sm text-background/60">Free above ₹50,000</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="w-8 h-8 mb-3 text-primary" />
              <h4 className="font-medium mb-1">Easy Returns</h4>
              <p className="text-sm text-background/60">30-Day Policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImg} alt="Lumière Jewel" className="h-16 w-auto object-contain brightness-0 invert" />
              <div>
                <h2 className="font-serif text-2xl text-gold-gradient">LUMIÈRE</h2>
                <p className="text-xs uppercase tracking-[0.2em] text-background/50">Jewel</p>
              </div>
            </div>
            <p className="text-background/70 mb-6 max-w-sm">
              Crafting timeless elegance since 1985. Each piece tells a story of heritage, 
              craftsmanship, and the pursuit of perfection.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/_ii_worrier07/" target="_blank" rel="noopener noreferrer" className="p-2 border border-background/20 rounded-sm hover:border-primary hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="p-2 border border-background/20 rounded-sm hover:border-primary hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="p-2 border border-background/20 rounded-sm hover:border-primary hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg mb-6">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/category/rings" className="text-background/70 hover:text-primary transition-colors">Rings</Link></li>
              <li><Link to="/category/necklaces" className="text-background/70 hover:text-primary transition-colors">Necklaces</Link></li>
              <li><Link to="/category/earrings" className="text-background/70 hover:text-primary transition-colors">Earrings</Link></li>
              <li><Link to="/category/bracelets" className="text-background/70 hover:text-primary transition-colors">Bracelets</Link></li>
              <li><Link to="/category/mangalsutra" className="text-background/70 hover:text-primary transition-colors">Mangalsutra</Link></li>
              <li><Link to="/category/coins" className="text-background/70 hover:text-primary transition-colors">Gold Coins</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-serif text-lg mb-6">Customer Care</h3>
            <ul className="space-y-3">
              <li><Link to="/track-order" className="text-background/70 hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link to="/size-guide" className="text-background/70 hover:text-primary transition-colors">Size Guide</Link></li>
              <li><Link to="/returns" className="text-background/70 hover:text-primary transition-colors">Returns & Exchange</Link></li>
              <li><Link to="/buyback" className="text-background/70 hover:text-primary transition-colors">Buyback Policy</Link></li>
              <li><Link to="/emi" className="text-background/70 hover:text-primary transition-colors">EMI Options</Link></li>
              <li><Link to="/faq" className="text-background/70 hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-background/70">+91 98765 43210</p>
                  <p className="text-sm text-background/50">Mon-Sat, 10AM-8PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-background/70">care@krishnadiamonds.in</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-background/70">Flagship Store, Connaught Place, New Delhi</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container-luxury py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© 2024 Lumière Jewel. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
