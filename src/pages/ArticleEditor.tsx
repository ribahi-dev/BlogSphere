import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Eye, Image, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { articlesService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);

  // Charger l'article si en édition
  useEffect(() => {
    if (isEditing && id) {
      loadArticle(id);
    }
  }, [id, isEditing]);

  const loadArticle = async (articleId: string) => {
    try {
      setLoadingArticle(true);
      const article = await articlesService.getById(articleId);
      setFormData({
        title: article.title || "",
        description: article.description || "",
        content: article.content || "",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'article.",
        variant: "destructive",
      });
      navigate("/author");
    } finally {
      setLoadingArticle(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.title || !formData.content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre et le contenu.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
      };

      if (isEditing && id) {
        // Mise à jour
        await articlesService.update(id, payload);
        if (publish) {
          await articlesService.publish(id);
        }
        toast({
          title: "Succès",
          description: publish ? "Article publié avec succès." : "Article mis à jour.",
        });
      } else {
        // Création
        const response = await articlesService.create(payload);
        const newArticleId = response.id;
        
        if (publish) {
          await articlesService.publish(newArticleId);
          toast({
            title: "Succès",
            description: "Article créé et publié avec succès.",
          });
        } else {
          toast({
            title: "Succès",
            description: "Article sauvegardé comme brouillon.",
          });
        }
      }

      navigate("/author");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder l'article.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    await handleSubmit(e, false);
  };

  const handlePublish = async (e: React.FormEvent) => {
    await handleSubmit(e, true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/author">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                {isEditing ? "Modifier l'article" : "Nouvel article"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? "Mettez à jour votre article" : "Créez un nouvel article"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft} 
              disabled={isLoading || loadingArticle}
            >
              <Save className="w-4 h-4 mr-2" />
              Brouillon
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={isLoading || loadingArticle}
            >
              <Eye className="w-4 h-4 mr-2" />
              Publier
            </Button>
          </div>
        </div>

        {loadingArticle ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p>Chargement de l'article...</p>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSaveDraft}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <Card className="bg-card/50 border-border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Le titre de votre article"
                        className="bg-background/50 text-lg"
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                    <CardDescription>
                      Un court résumé qui apparaîtra dans les listes d'articles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Décrivez brièvement le contenu de votre article..."
                      className="bg-background/50 min-h-[100px]"
                      maxLength={300}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {formData.description.length}/300 caractères
                    </p>
                  </CardContent>
                </Card>

                {/* Content */}
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Contenu *</CardTitle>
                    <CardDescription>
                      Le contenu principal de votre article (supporte Markdown)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Écrivez le contenu de votre article..."
                      className="bg-background/50 min-h-[400px] font-mono"
                      disabled={isLoading}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Info */}
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Aide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground mb-2">Brouillon</p>
                      <p>Votre article sera sauvegardé mais ne sera pas visible au public.</p>
                    </div>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-foreground mb-2">Publier</p>
                      <p>Votre article sera immédiatement visible à tous les visiteurs.</p>
                    </div>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-foreground mb-2">Format Markdown</p>
                      <p>Utilisez **texte** pour le gras, *texte* pour l'italique, # pour les titres, etc.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ArticleEditor;
