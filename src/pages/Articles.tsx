import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { articlesService, Category, Tag } from '@/services/api';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import './Articles.css';

const Articles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  // Read category from query param (?category=slug) or path param (/categories/:slug)
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('category');
    if (q) {
      setSelectedCategory(q);
      return;
    }
    if (params.slug) {
      setSelectedCategory(params.slug as string);
      // normalize URL to Articles with query so filters UI updates consistently
      navigate(`/articles?category=${params.slug}`, { replace: true });
    }
  }, [location.search, params.slug, navigate]);

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesService.getAll()
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => articlesService.getCategories()
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => articlesService.getTags()
  });

  const filteredArticles = articles.filter((article: any) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || (article.category && article.category.slug === selectedCategory);
    const matchesTags = selectedTags.length === 0 || 
      (article.tags && selectedTags.some(tagSlug => article.tags.some((t: any) => t.slug === tagSlug)));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleTag = (tagSlug: string) => {
    setSelectedTags(prev => 
      prev.includes(tagSlug) 
        ? prev.filter(t => t !== tagSlug)
        : [...prev, tagSlug]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0;
  const isLoading = isLoadingArticles;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Tous les articles
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explorez notre collection d'articles sur la technologie, le design, le développement et bien plus.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Catégories
                </h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(
                        selectedCategory === category.slug ? null : category.slug
                      )}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === category.slug
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {category.name}
                      <span className="float-right text-xs opacity-60">{category.articleCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-display font-semibold mb-3">Tags populaires</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.slug) ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => toggleTag(tag.slug)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                  Effacer les filtres
                </button>
              )}
            </aside>

            {/* Articles Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">Chargement des articles...</p>
                </div>
              ) : filteredArticles.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredArticles.map((article, index) => (
                      <div
                        key={article.id}
                        className="animate-fade-in-up"
                        style={{ '--delay': `${index * 0.05}s` } as React.CSSProperties}
                      >
                        <ArticleCard article={article} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">Aucun article trouvé</p>
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:underline mt-2"
                  >
                    Effacer les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Articles;
