import { Link } from 'react-router-dom';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { articlesService } from '@/services/api';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export function RecentArticles() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesService.getAll()
  });

  const recentArticles = articles.slice(0, 6);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Articles récents</h2>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/articles">
              Voir tous
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article: any, index: number) => (
              <div
                key={article.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/articles">
              Voir tous les articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
