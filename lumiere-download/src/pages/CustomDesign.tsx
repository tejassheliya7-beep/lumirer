import Layout from '@/components/layout/Layout';
import { PageTransition, FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, Gem, Palette, Clock, Shield, ArrowRight } from 'lucide-react';

const steps = [
  { icon: MessageCircle, title: 'Consultation', description: 'Share your vision with our expert designers via call, WhatsApp, or in-store visit.' },
  { icon: Palette, title: 'Design & CAD', description: 'We create detailed 3D renderings so you can visualize your piece before crafting.' },
  { icon: Gem, title: 'Crafting', description: 'Master artisans handcraft your jewellery using the finest materials and techniques.' },
  { icon: Shield, title: 'Delivery', description: 'Your certified, hallmarked piece is delivered in luxury packaging with full documentation.' },
];

const CustomDesignPage = () => {
  return (
    <Layout>
      <PageTransition>
        {/* Hero */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&q=80"
            alt="Custom jewellery design"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <FadeIn>
              <p className="text-sm uppercase tracking-[0.3em] mb-3 text-white/80">Bespoke Service</p>
              <h1 className="font-serif text-4xl md:text-6xl text-center">Custom Design</h1>
              <p className="mt-4 text-white/70 text-center max-w-lg px-6">
                Bring your dream jewellery to life. Our master craftsmen transform your vision into an exquisite reality.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Process Steps */}
        <section className="section-padding bg-secondary">
          <div className="container-luxury">
            <FadeIn className="text-center mb-16 space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium">Our Process</p>
              <h2 className="font-serif text-3xl md:text-5xl">From Vision to Reality</h2>
            </FadeIn>

            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <StaggerItem key={i} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-primary/30 rounded-full">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-xs text-primary font-medium uppercase tracking-wider mb-2">Step {i + 1}</div>
                  <h3 className="font-serif text-xl mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-luxury">
            <SlideIn direction="left">
              <div className="bg-foreground text-background p-10 md:p-16 text-center space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl">Ready to Create Something Unique?</h2>
                <p className="text-background/70 max-w-md mx-auto">
                  Schedule a free consultation with our design team. No commitment required.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="https://wa.me/919876543210?text=Hi%2C%20I'm%20interested%20in%20custom%20jewellery%20design" target="_blank" rel="noopener noreferrer">
                    <Button variant="luxury" size="xl">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp Us
                    </Button>
                  </a>
                  <a href="tel:+919876543210">
                    <Button variant="luxuryOutline" size="xl" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                      Call Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </div>
                <p className="text-xs text-background/50 uppercase tracking-wider">Average delivery: 3–4 weeks</p>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* Trust */}
        <section className="py-12 border-t border-border">
          <div className="container-luxury flex flex-wrap justify-center gap-8 text-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> 3–4 Week Delivery</div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> BIS Hallmarked</div>
            <div className="flex items-center gap-2"><Gem className="w-4 h-4 text-primary" /> IGI Certified Diamonds</div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default CustomDesignPage;
