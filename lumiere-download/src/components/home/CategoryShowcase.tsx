import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import { ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, GoldDivider } from '@/components/ui/motion';

const CategoryShowcase = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-luxury">
        {/* Header */}
        <FadeIn className="text-center mb-16 space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium">
            Shop by Category
          </p>
          <h2 className="font-serif text-4xl md:text-5xl">
            Curated Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our exquisite range of handcrafted jewellery, from timeless classics 
            to contemporary masterpieces.
          </p>
          <GoldDivider className="max-w-xs mx-auto mt-6" />
        </FadeIn>

        {/* Category Grid */}
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <StaggerItem key={category.id}>
              <Link
                to={`/category/${category.slug}`}
                className={`group relative overflow-hidden rounded-sm block ${
                  index === 0 ? 'col-span-2 md:col-span-1 md:row-span-2' : ''
                }`}
              >
                <div className={`aspect-square ${index === 0 ? 'md:aspect-auto md:h-full' : ''} overflow-hidden`}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-serif text-xl md:text-2xl text-white mb-1">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-white/70 text-sm">{category.productCount} pieces</p>
                    <ArrowRight className="w-5 h-5 text-white transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default CategoryShowcase;
