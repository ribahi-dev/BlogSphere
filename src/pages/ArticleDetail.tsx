import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Eye, Share2, Heart, MessageCircle, Clock, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { articlesService } from "@/services/api";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => articlesService.getBySlug(slug || ""),
    enabled: !!slug
  });

  const { data: allArticles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesService.getAll()
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!article || error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Article non trouvé
          </h1>
          <p className="text-muted-foreground mb-8">
            L'article que vous cherchez n'existe pas ou a été supprimé.
          </p>
          <Button asChild>
            <Link to="/articles">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux articles
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedArticles = allArticles
    .filter((a: any) => a.category?.id === article.category?.id && a.id !== article.id)
    .slice(0, 3);

  const readingTime = Math.ceil((article.content || "").split(" ").length / 200);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Envoyer le commentaire à l'API Symfony
    console.log("Commentaire soumis:", comment);
    setComment("");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={article.coverImage || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80"}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e: any) => e.target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <div className="max-w-4xl">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux articles
            </Link>

            {article.category && (
              <Badge variant="secondary" className="mb-4">
                {article.category.name}
              </Badge>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarImage src={article.author?.avatar} alt={article.author?.name} />
                  <AvatarFallback>{(article.author?.name || 'A').charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground font-medium">{article.author?.name || 'Auteur'}</p>
                  <p className="text-sm">{article.author?.userType === 'ADMIN' ? 'Administrateur' : 'Auteur'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />²
                <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min de lecture</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{(article.views || 0).toLocaleString()} vues</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-8">
              {/* Article Body */}
              <div className="prose prose-lg prose-invert max-w-none mb-12">
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  {article.description}
                </p>

                <div className="text-foreground/90 leading-relaxed space-y-6">
                  <p>
                    {article.content}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
                    Les points clés à retenir
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Premier point important à retenir de cet article</li>
                    <li>Deuxième élément essentiel pour votre compréhension</li>
                    <li>Troisième aspect fondamental du sujet traité</li>
                    <li>Quatrième considération pour aller plus loin</li>
                  </ul>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground my-8">
                    "La simplicité est la sophistication suprême." — Leonardo da Vinci
                  </blockquote>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags && article.tags.map((tag: any) => (
                  <Badge key={tag.id} variant="outline" className="hover:bg-primary/10 cursor-pointer">
                    #{tag.name}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mb-12">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  onClick={() => setIsLiked(!isLiked)}
                  className="gap-2"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Aimé' : 'J\'aime'}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
              </div>

              <Separator className="mb-12" />

              {/* Author Card */}
              <div className="bg-card/50 border border-border rounded-xl p-6 mb-12">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarImage src={article.author.avatar} alt={article.author.name} />
                    <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                      {article.author.name}
                    </h3>
                    <Badge variant="secondary" className="mb-3">
                      {article.author.userType === 'ADMIN' ? 'Administrateur' : 'Auteur'}
                    </Badge>
                    <p className="text-muted-foreground">
                      {article.author.bio || "Auteur passionné sur BlogSphere."}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="mb-12" />

              {/* Comments Section */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  Commentaires ({article.commentsCount || 0})
                </h2>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <Textarea
                    placeholder="Écrire un commentaire..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-4 bg-card/50 border-border min-h-[120px]"
                  />
                  <Button type="submit" disabled={!comment.trim()}>
                    Publier le commentaire
                  </Button>
                </form>

                {/* Comments List */}
                {article.comments && article.comments.length > 0 ? (
                  <div className="space-y-6">
                    {article.comments.map((c: any) => (
                      <div key={c.id} className="bg-card/30 border border-border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{c.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{c.author.name}</p>
                            <p className="text-sm text-muted-foreground">{c.createdAt}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{c.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8 bg-card/30 rounded-lg border border-border">
                    Soyez le premier à commenter cet article !
                  </p>
                )}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-6">
                      Articles similaires
                    </h3>
                    <div className="space-y-4">
                      {relatedArticles.map((a) => (
                        <Link
                          key={a.id}
                          to={`/articles/${a.slug}`}
                          className="block group"
                        >
                          <div className="bg-card/50 border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                            <img
                              src={a.coverImage || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
                              alt={a.title}
                              className="w-full h-32 object-cover"
                            />
                            <div className="p-4">
                              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {a.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-2">
                                {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter CTA */}
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-xl p-6">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                    Newsletter
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Recevez nos meilleurs articles directement dans votre boîte mail.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/#newsletter">S'abonner</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* More Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">
              À lire aussi
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ArticleDetail;
