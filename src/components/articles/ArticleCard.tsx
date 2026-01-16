import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Article } from '@/data/mockData';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function ArticleCard({ article, variant = 'default', className }: ArticleCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        to={`/articles/${article.slug}`}
        className={cn(
          "group relative block rounded-2xl overflow-hidden hover-lift",
          className
        )}
      >
        <div className="aspect-[16/9] md:aspect-[21/9]">
          <img
            src={article.coverImage || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e: any) => e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <Badge variant="secondary" className="mb-3 bg-accent text-accent-foreground">
            {article.category?.name || 'Catégorie'}
          </Badge>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mb-3 group-hover:text-accent transition-colors">
            {article.title}
          </h2>
          <p className="text-primary-foreground/80 mb-4 line-clamp-2 max-w-2xl">
            {article.excerpt || article.description || 'Article'}
          </p>
          <div className="flex items-center gap-4 text-primary-foreground/70 text-sm">
            <div className="flex items-center gap-2">
              <img
                src={article.author?.avatar || "https://via.placeholder.com/32"}
                alt={article.author?.name || "Author"}
                className="w-8 h-8 rounded-full ring-2 ring-primary-foreground/20"
              />
              <span>{article.author?.name || "Auteur"}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(article.createdAt || new Date()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {(article.views || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/articles/${article.slug}`}
        className={cn(
          "group flex gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-200",
          className
        )}
      >
        <img
          src={article.coverImage || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80"}
          alt={article.title}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          onError={(e: any) => e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80"}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{article.author?.name || "Auteur"}</span>
            <span>•</span>
            <span>{new Date(article.createdAt || new Date()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/articles/${article.slug}`}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden border border-border hover-lift",
        className
      )}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={article.coverImage || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e: any) => e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"}
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {article.category?.name || 'Catégorie'}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {(article.views || 0).toLocaleString()}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {article.excerpt || article.description || 'Article'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={article.author?.avatar || '/default-avatar.png'}
              alt={article.author?.name || 'Author'}
              className="w-7 h-7 rounded-full"
            />
            <div className="text-xs">
              <p className="font-medium">{article.author?.name || 'Auteur'}</p>
              <p className="text-muted-foreground">
                {new Date(article.createdAt || new Date()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <span className="text-primary flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Lire <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
