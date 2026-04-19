import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CollectionBanner from '@/components/home/CollectionBanner';
import GroomCollection from '@/components/home/GroomCollection';
import TrustSection from '@/components/home/TrustSection';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <GroomCollection />
      <CollectionBanner />
      <TrustSection />
    </Layout>
  );
};

export default Index;
