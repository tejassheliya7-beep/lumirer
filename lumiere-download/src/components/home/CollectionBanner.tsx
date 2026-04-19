import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FadeIn, SlideIn, ScaleIn } from '@/components/ui/motion';

const CollectionBanner = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bridal Collection */}
          <SlideIn direction="left">
            <Link to="/collection/bridal" className="group relative overflow-hidden rounded-sm block">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80"
                  alt="Bridal Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
                <p className="text-primary text-sm uppercase tracking-[0.2em] mb-2">Collection</p>
                <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
                  Bridal Elegance
                </h3>
                <p className="text-white/80 mb-6 max-w-sm">
                  Begin your forever with pieces crafted for the most precious moments of your life.
                </p>
                <Button variant="luxury" className="w-fit">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Link>
          </SlideIn>

          {/* Custom Design + Store Visit */}
          <div className="flex flex-col gap-8">
            <SlideIn direction="right" delay={0.2}>
              <Link to="/custom-design" className="group relative overflow-hidden rounded-sm flex-1 block">
                <div className="h-full min-h-[300px] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
                    alt="Custom Design"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8">
                  <p className="text-primary text-sm uppercase tracking-[0.2em] mb-2">Bespoke</p>
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">
                    Design Your Own
                  </h3>
                  <p className="text-white/80 text-sm max-w-xs">
                    Collaborate with our master craftsmen to create a piece that's uniquely yours.
                  </p>
                </div>
              </Link>
            </SlideIn>

            <FadeIn delay={0.4}>
              <div className="group relative overflow-hidden rounded-sm flex-1 bg-foreground">
                <div className="h-full min-h-[300px] flex flex-col justify-center p-8">
                  <p className="text-primary text-sm uppercase tracking-[0.2em] mb-2">Experience</p>
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">
                    Visit Our Showroom
                  </h3>
                  <p className="text-white/70 text-sm mb-6 max-w-sm">
                    Book a private appointment to experience our collection in person with personalized styling.
                  </p>
                  <Link to="/book-appointment">
                    <Button variant="luxuryOutline" className="w-fit border-white text-white hover:bg-white hover:text-foreground">
                      Book Appointment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionBanner;
