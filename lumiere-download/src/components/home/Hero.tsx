import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FadeIn, SlideIn, ScaleIn } from '@/components/ui/motion';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-cream">
        <div className="absolute inset-0 opacity-30">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, hsl(43, 72%, 52%, 0.3), transparent)' }}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
            className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, hsl(43, 72%, 52%, 0.2), transparent)' }}
          />
        </div>
      </div>

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <FadeIn delay={0.2}>
                <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium">
                  Heritage Since 1985
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                  Where Elegance
                  <br />
                  <span className="text-gold-gradient">Meets Eternity</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.6}>
                <p className="text-sm md:text-lg text-muted-foreground max-w-md leading-relaxed">
                  Discover handcrafted jewellery that transcends time. Each piece 
                  is a masterwork of artistry and precision, designed to be cherished 
                  for generations.
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={0.8}>
              <div className="flex flex-wrap gap-4">
                <Link to="/collection/bridal">
                  <Button variant="luxury" size="xl">
                    Explore Bridal
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/custom-design">
                  <Button variant="luxuryOutline" size="xl">
                    Custom Design
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Live gold rate */}
            <FadeIn delay={1}>
              <div className="flex items-center gap-4 md:gap-8 pt-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">Live 22K Gold</p>
                    <p className="font-serif text-base md:text-xl text-primary">₹5,680/gm</p>
                  </div>
                </div>
                <div className="h-8 md:h-10 w-px bg-border" />
                <div>
                  <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">Live 24K Gold</p>
                  <p className="font-serif text-base md:text-xl text-primary">₹6,200/gm</p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Hero Image */}
          <SlideIn direction="right" delay={0.5} duration={1}>
            <div className="relative">
              <ScaleIn delay={0.7}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
                  >
                    <source src="https://cdn.pixabay.com/video/2024/02/23/201636-915687498_large.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </ScaleIn>
              
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 40, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute -bottom-6 -left-6 bg-card p-6 shadow-xl max-w-xs"
              >
                <p className="text-sm text-muted-foreground mb-2">Featured Collection</p>
                <h3 className="font-serif text-xl mb-3">Bridal Elegance 2024</h3>
                <Link to="/collection/bridal" className="text-primary text-sm uppercase tracking-wider gold-underline">
                  View Collection
                </Link>
              </motion.div>
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  );
};

export default Hero;
