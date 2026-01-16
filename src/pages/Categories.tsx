import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { categories } from '@/data/mockData';

const Categories = () => {
  return (
    <Layout>
      <section className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Catégories</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-6">Parcourez les catégories pour trouver des articles par thème.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/articles?category=${cat.slug}`}
                className="block p-6 bg-card border border-border rounded-lg hover:shadow-md transition"
              >
                <h3 className="font-semibold mb-2">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.articleCount} article{cat.articleCount > 1 ? 's' : ''}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
