import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { goldRates } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { GoldPurity, DiamondShape } from '@/types/product';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  Shield, 
  Award,
  Download,
  MessageCircle,
  ZoomIn,
  ChevronRight,
  Minus,
  Plus
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const allGoldPurities: GoldPurity[] = ['14K', '18K', '22K'];
const allDiamondShapes: DiamondShape[] = ['Round', 'Princess', 'Cushion', 'Oval', 'Emerald', 'Pear', 'Marquise', 'Asscher', 'Heart'];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('products')
        .select('*') as any)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const inWishlist = product ? isInWishlist(product.id) : false;

  // Gold purity & diamond shape selection state
  const [selectedPurity, setSelectedPurity] = useState<GoldPurity>('18K');
  const [selectedShape, setSelectedShape] = useState<DiamondShape | undefined>();

  // Update selection when product loads
  useEffect(() => {
    if (product) {
      setSelectedPurity(product.goldPurity || '18K');
      setSelectedShape(product.diamondShape);
    }
  }, [product]);

  // Size-based price multipliers for rings and bracelets
  const sizePriceMultipliers: Record<string, number> = {
    '5': 0.92, '6': 0.96, '7': 1.00, '8': 1.04, '9': 1.08,
    '10': 1.12, '11': 1.16, '12': 1.20,
    'S': 0.95, 'M': 1.00, 'L': 1.06,
  };

  const sizeMultiplier = selectedSize ? (sizePriceMultipliers[selectedSize] ?? 1) : 1;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const dynamicPrice = useMemo(() => {
    if (!product) return 0;
    const originalRate = goldRates[product.goldPurity || '18K'];
    const selectedRate = goldRates[selectedPurity];

    let basePrice = product.price;
    if (product.goldWeight > 0 && originalRate > 0) {
      const goldValue = product.goldWeight * originalRate;
      const newGoldValue = product.goldWeight * selectedRate;
      basePrice = product.price + (newGoldValue - goldValue);
    }

    return Math.round(basePrice * sizeMultiplier);
  }, [product, selectedPurity, sizeMultiplier]);

  if (isLoading) {
    return <Layout><div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></Layout>;
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-luxury section-padding text-center">
          <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="luxury">Return Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const goldValue = product.goldWeight * goldRates[selectedPurity];
  const makingCharges = Math.round(goldValue * 0.12);
  const diamondValue = product.diamondWeight ? product.diamondWeight * 45000 : 0;
  const gst = Math.round((goldValue + makingCharges + diamondValue) * 0.03);

  const sizes = product.category === 'rings' 
    ? ['5', '6', '7', '8', '9', '10', '11', '12'] 
    : product.category === 'bracelets' 
    ? ['S', 'M', 'L']
    : [];

  return (
    <Layout>
      <div className="container-luxury section-padding">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/category/${product.category}`} className="hover:text-primary transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-sm bg-secondary group">
              <img
                src={product.images && product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute bottom-4 right-4 p-3 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </button>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {(product.is_new || product.isNew) && (
                  <span className="bg-primary text-primary-foreground text-xs uppercase tracking-wider px-3 py-1">
                    New
                  </span>
                )}
                {(product.is_bestseller || product.isBestseller) && (
                  <span className="bg-foreground text-background text-xs uppercase tracking-wider px-3 py-1">
                    Bestseller
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title & Price */}
            <div className="space-y-4">
              <h1 className="font-serif text-3xl md:text-4xl">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <span className="font-serif text-3xl text-primary">
                  {formatPrice(dynamicPrice)}
                </span>
                {product.originalPrice && selectedPurity === product.goldPurity && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Certifications */}
              <div className="flex items-center gap-3">
                {product.certifications && product.certifications.map((cert: string) => (
                  <span
                    key={cert}
                    className="text-xs uppercase tracking-wider px-3 py-1 bg-accent text-accent-foreground rounded-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Gold Purity Selector */}
            {product.goldWeight > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Select Gold Purity</p>
                  <p className="text-xs text-muted-foreground">Price adjusts with purity</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allGoldPurities.map((purity) => (
                    <button
                      key={purity}
                      onClick={() => setSelectedPurity(purity)}
                      className={`px-5 py-3 rounded-sm border text-sm font-medium transition-all ${
                        selectedPurity === purity
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <span className="block">{purity}</span>
                      <span className="block text-[10px] mt-0.5 opacity-80">
                        ₹{goldRates[purity].toLocaleString('en-IN')}/g
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Diamond Shape Selector */}
            {product.diamondWeight > 0 && (
              <div className="space-y-3">
                <p className="font-medium">Diamond Shape</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {allDiamondShapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className={`py-2.5 px-2 rounded-sm border text-xs font-medium transition-all text-center ${
                        selectedShape === shape
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div>
                <p className="text-sm text-muted-foreground">Gold Purity</p>
                <p className="font-medium">{selectedPurity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Metal Color</p>
                <p className="font-medium">{product.metalColor || product.material}</p>
              </div>
              {product.goldWeight > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Gold Weight</p>
                  <p className="font-medium">{product.goldWeight}g</p>
                </div>
              )}
              {product.diamondWeight && (
                <div>
                  <p className="text-sm text-muted-foreground">Diamond Weight</p>
                  <p className="font-medium">{product.diamondWeight} ct ({product.diamondType})</p>
                </div>
              )}
              {product.diamondCount && (
                <div>
                  <p className="text-sm text-muted-foreground">Diamonds Used</p>
                  <p className="font-medium">{product.diamondCount} stones</p>
                </div>
              )}
              {selectedShape && (
                <div>
                  <p className="text-sm text-muted-foreground">Diamond Shape</p>
                  <p className="font-medium">{selectedShape}</p>
                </div>
              )}
            </div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Select Size</p>
                  <Link to="/size-guide" className="text-sm text-primary hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const mult = sizePriceMultipliers[size] ?? 1;
                    const diff = mult - 1;
                    const diffLabel = diff > 0 ? `+${(diff * 100).toFixed(0)}%` : diff < 0 ? `${(diff * 100).toFixed(0)}%` : 'Base';
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 rounded-sm border transition-colors flex flex-col items-center min-w-[52px] ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        <span className="font-medium text-sm">{size}</span>
                        <span className="text-[10px] opacity-75">{diffLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  variant="luxury"
                  size="xl"
                  className="flex-1"
                  onClick={() => addToCart(product, quantity, selectedSize)}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => addToWishlist(product)}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </div>

              {/* Quick contact */}
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${formatPrice(dynamicPrice)})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Need help? Chat with our jewellery expert
              </a>
            </div>

            {/* Delivery & Trust */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Free Insured Delivery</p>
                  <p className="text-sm text-muted-foreground">Estimated {product.deliveryDays || 7} days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">30-Day Returns</p>
                  <p className="text-sm text-muted-foreground">Hassle-free exchange</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">BIS Hallmarked</p>
                  <p className="text-sm text-muted-foreground">100% certified gold</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Lifetime Exchange</p>
                  <p className="text-sm text-muted-foreground">100% gold value</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown & More Details */}
            <Accordion type="multiple" defaultValue={['price-breakdown']} className="space-y-2">
              <AccordionItem value="price-breakdown" className="border border-border rounded-sm px-4">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  Price Breakup (Transparency)
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-2 text-sm">
                    {product.goldWeight > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gold Value ({product.goldWeight}g × {selectedPurity} @ ₹{goldRates[selectedPurity].toLocaleString('en-IN')}/g)</span>
                        <span>{formatPrice(goldValue)}</span>
                      </div>
                    )}
                    {product.goldWeight > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Making Charges (12%)</span>
                        <span>{formatPrice(makingCharges)}</span>
                      </div>
                    )}
                    {diamondValue > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Diamond Value ({product.diamondWeight} ct{selectedShape ? ` • ${selectedShape}` : ''})</span>
                        <span>{formatPrice(diamondValue)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (3%)</span>
                      <span>{formatPrice(gst)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-medium">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(dynamicPrice)}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {product.specifications && (
                <AccordionItem value="specifications" className="border border-border rounded-sm px-4">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Detailed Specifications
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 text-sm">
                      {product.specifications.map((spec: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-muted-foreground">{spec.label}</span>
                          <span>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="emi" className="border border-border rounded-sm px-4">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  EMI Options
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">Available EMI options starting from:</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-secondary rounded-sm text-center">
                        <p className="font-medium">{formatPrice(Math.round(dynamicPrice / 3))}</p>
                        <p className="text-xs text-muted-foreground">3 months</p>
                      </div>
                      <div className="p-3 bg-secondary rounded-sm text-center">
                        <p className="font-medium">{formatPrice(Math.round(dynamicPrice / 6))}</p>
                        <p className="text-xs text-muted-foreground">6 months</p>
                      </div>
                      <div className="p-3 bg-secondary rounded-sm text-center">
                        <p className="font-medium">{formatPrice(Math.round(dynamicPrice / 12))}</p>
                        <p className="text-xs text-muted-foreground">12 months</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">* 0% interest available on select banks</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {product.certifications && (
                <AccordionItem value="certification" className="border border-border rounded-sm px-4">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    Certifications & Downloads
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-3">
                      {product.certifications.map((cert: string) => (
                        <button
                          key={cert}
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          Download {cert} Certificate
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
