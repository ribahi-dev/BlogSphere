import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, FileText, Eye, Edit, Trash2, MoreHorizontal, Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { articlesService, authService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const AuthorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Charger les articles de l'utilisateur et ses infos
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      // Charger les infos de l'utilisateur
      const user = await authService.getProfile();
      setCurrentUser(user);

      // Charger les articles de l'utilisateur
      const userArticles = await articlesService.getMyArticles();
      setArticles(userArticles || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    return article.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.published).length,
    draft: articles.filter(a => !a.published).length,
  };

  const handleDelete = async (articleId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    try {
      await articlesService.delete(articleId);
      toast({
        title: "Succès",
        description: "Article supprimé avec succès.",
      });
      loadUserData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'article.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Espace Auteur
            </h1>
            <p className="text-muted-foreground">
              Gérez vos articles
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/author/new">
              <Plus className="w-4 h-4" />
              Nouvel article
            </Link>
          </Button>
        </div>

        {!isLoading && currentUser && (
          <div className="mb-8">
            <Card className="bg-card/50 border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-foreground">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                      <p className="text-xs mt-2 text-muted-foreground">
                        Rôle: <Badge variant="outline" className="mt-1">
                          {currentUser.userType ? currentUser.userType : (currentUser.roles && currentUser.roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'AUTHOR')}
                        </Badge>
                      </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total articles</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{stats.published}</p>
                <p className="text-sm text-muted-foreground">Publiés</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">{stats.draft}</p>
                <p className="text-sm text-muted-foreground">Brouillons</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-card/50 border-border mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Articles Table */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Mes articles</CardTitle>
            <CardDescription>
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p>Chargement de vos articles...</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Titre</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow key={article.id} className="border-border">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">
                              {article.title}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {article.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={article.published ? "default" : "secondary"}>
                            {article.published ? "Publié" : "Brouillon"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {article.createdAt ? new Date(article.createdAt).toLocaleDateString('fr-FR') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/articles/${article.id}`} className="flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  Voir
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/author/edit/${article.id}`} className="flex items-center gap-2">
                                  <Edit className="w-4 h-4" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive flex items-center gap-2"
                                onClick={() => handleDelete(article.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Aucun article trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Essayez de modifier votre recherche"
                    : "Commencez par créer votre premier article"}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link to="/author/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un article
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthorDashboard;