import Layout from '@/components/layout/Layout';

interface StaticPageProps {
  title: string;
  description: string;
}

const StaticPage = ({ title, description }: StaticPageProps) => {
  return (
    <Layout>
      <div className="container-luxury py-20 min-h-[60vh]">
        <h1 className="font-serif text-4xl mb-4">{title}</h1>
        <p className="text-muted-foreground max-w-2xl">{description}</p>
      </div>
    </Layout>
  );
};

export default StaticPage;
