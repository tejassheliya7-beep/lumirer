import { Shield, Award, Gem, Clock, CreditCard, Truck } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, GoldDivider } from '@/components/ui/motion';

const TrustSection = () => {
  const features = [
    { icon: Shield, title: 'BIS Hallmarked', description: 'Every piece certified for gold purity' },
    { icon: Award, title: 'IGI Certified Diamonds', description: 'International certification for authenticity' },
    { icon: Gem, title: 'Lifetime Exchange', description: '100% value on gold exchange' },
    { icon: Clock, title: 'Heritage Since 1985', description: 'Trusted by generations' },
    { icon: CreditCard, title: 'Easy EMI', description: '0% interest up to 12 months' },
    { icon: Truck, title: 'Insured Shipping', description: 'Free delivery across India' },
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="container-luxury">
        <FadeIn className="text-center mb-16 space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium">
            Why Choose Us
          </p>
          <h2 className="font-serif text-4xl md:text-5xl">
            The Lumière Promise
          </h2>
          <GoldDivider className="max-w-xs mx-auto mt-6" />
        </FadeIn>

        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {features.map((feature, index) => (
            <StaggerItem key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-primary/30 rounded-full group-hover:bg-primary/10 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default TrustSection;
