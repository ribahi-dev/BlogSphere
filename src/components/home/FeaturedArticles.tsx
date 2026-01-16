import { ArticleCard } from '@/components/articles/ArticleCard';
import { articlesService } from '@/services/api';
import { Flame, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export function FeaturedArticles() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesService.getAll()
  });

  const featuredArticles = articles.slice(0, 3);
  const mainFeatured = featuredArticles[0];
  const secondaryFeatured = featuredArticles.slice(1, 3);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-accent/10">
            <Flame className="h-5 w-5 text-accent" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">À la une</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mainFeatured && (
            <ArticleCard
              article={mainFeatured}
              variant="featured"
              className="lg:row-span-2"
            />
          )}
          <div className="grid gap-6">
            {secondaryFeatured.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="default"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
