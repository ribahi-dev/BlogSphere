import { Link } from 'react-router-dom';
import { articlesService, Category } from '@/services/api';
import { Layers, ArrowUpRight, Code, Palette, Cpu, Briefcase, Heart, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'technologie': Cpu,
  'design': Palette,
  'developpement': Code,
  'lifestyle': Heart,
  'business': Briefcase,
};

const categoryColors: Record<string, string> = {
  'technologie': 'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30',
  'design': 'from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30',
  'developpement': 'from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30',
  'lifestyle': 'from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30',
  'business': 'from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30',
};

export function CategoriesSection() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => articlesService.getCategories()
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-secondary">
            <Layers className="h-5 w-5 text-foreground" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Explorer par catégorie</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category: Category, index: number) => {
              const Icon = categoryIcons[category.slug] || Layers;
              const colorClass = categoryColors[category.slug] || 'from-gray-500/20 to-gray-600/20';

              return (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className={`group relative p-6 rounded-2xl bg-gradient-to-br ${colorClass} border border-border/50 transition-all duration-300 hover-lift animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Icon className="h-8 w-8 mb-3 text-foreground/80" />
                  <h3 className="font-display font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.articleCount} articles</p>
                  <ArrowUpRight className="absolute top-4 right-4 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/60" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
