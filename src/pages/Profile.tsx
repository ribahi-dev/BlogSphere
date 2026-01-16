import { useState, useEffect } from "react";
import { User, Mail, Lock, Camera, Save, FileText, MessageCircle, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { userService, getUser, setUser, articlesService } from "@/services/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArticleCard } from "@/components/articles/ArticleCard";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getUser();

  const [profileFormData, setProfileFormData] = useState({ name: "", bio: "", avatar: "" });
  const [passwordFormData, setPasswordFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const { data: userProfile, isLoading: isLoadingUserProfile, refetch: refetchProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => userService.getProfile(),
    enabled: !!currentUser,
  });

  const { data: userArticles = [] } = useQuery({
    queryKey: ["userArticles"],
    queryFn: () => articlesService.getMyArticles(),
    enabled: !!currentUser,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: typeof profileFormData) => userService.updateProfile(data),
    onSuccess: (response) => {
      if (response.user) setUser(response.user);
      toast({ title: "Profil mis à jour", description: response.message || "Succès" });
      refetchProfile();
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message || "Impossible de mettre à jour.", variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: Omit<typeof passwordFormData, "confirmPassword">) => userService.changePassword(data),
    onSuccess: (response) => {
      toast({ title: "Succès", description: response.message || "Mot de passe changé." });
      setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message || "Impossible de changer le mot de passe.", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (userProfile) {
      setProfileFormData({ name: userProfile.name || "", bio: userProfile.bio || "", avatar: userProfile.avatar || "" });
    }
  }, [userProfile]);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFormData.name.trim()) {
      toast({ title: "Erreur", description: "Le nom est obligatoire.", variant: "destructive" });
      return;
    }
    setIsLoadingProfile(true);
    await updateProfileMutation.mutateAsync(profileFormData);
    setIsLoadingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordFormData.currentPassword) {
      toast({ title: "Erreur", description: "Entrez votre mot de passe actuel.", variant: "destructive" });
      return;
    }
    if (!passwordFormData.newPassword) {
      toast({ title: "Erreur", description: "Entrez un nouveau mot de passe.", variant: "destructive" });
      return;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    if (passwordFormData.newPassword.length < 8) {
      toast({ title: "Erreur", description: "Minimum 8 caractères.", variant: "destructive" });
      return;
    }
    setIsLoadingPassword(true);
    await changePasswordMutation.mutateAsync({ currentPassword: passwordFormData.currentPassword, newPassword: passwordFormData.newPassword });
    setIsLoadingPassword(false);
  };

  const stats = {
    articles: userArticles?.length || 0,
    views: userArticles?.reduce((acc: number, a: any) => acc + (a.views || 0), 0) || 0,
    comments: userArticles?.reduce((acc: number, a: any) => acc + (a.commentsCount || 0), 0) || 0,
  };

  if (isLoadingUserProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={userProfile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + userProfile?.email} alt={userProfile?.name} />
              <AvatarFallback className="text-2xl">{userProfile?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <button title="Modifier la photo de profil" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-heading font-bold text-foreground">{userProfile?.name}</h1>
              <Badge variant="secondary">{userProfile?.role === "ADMIN" ? "Administrateur" : userProfile?.role === "AUTHOR" ? "Auteur" : "Utilisateur"}</Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" />{userProfile?.email}</p>
            {userProfile?.bio && <p className="text-sm text-muted-foreground mt-2">{userProfile.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Articles</p><p className="text-2xl font-bold">{stats.articles}</p></div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Vues</p><p className="text-2xl font-bold">{stats.views.toLocaleString()}</p></div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Commentaires</p><p className="text-2xl font-bold">{stats.comments}</p></div>
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="articles">Mes Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader><CardTitle>Modifier mon profil</CardTitle><CardDescription>Mettez à jour vos informations personnelles</CardDescription></CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" name="name" value={profileFormData.name} onChange={handleProfileInputChange} placeholder="Votre nom" className="bg-background/50" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={userProfile?.email || ""} disabled className="bg-background/50 opacity-50" />
                    <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea id="bio" name="bio" value={profileFormData.bio} onChange={handleProfileInputChange} placeholder="Présentez-vous..." className="bg-background/50 min-h-[100px]" />
                    <p className="text-xs text-muted-foreground">{profileFormData.bio.length}/500 caractères</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">URL de la photo de profil</Label>
                    <Input id="avatar" name="avatar" value={profileFormData.avatar} onChange={handleProfileInputChange} placeholder="https://example.com/avatar.jpg" className="bg-background/50" />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoadingProfile || updateProfileMutation.isPending}>
                    {isLoadingProfile || updateProfileMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sauvegarde en cours...</> : <><Save className="mr-2 h-4 w-4" />Sauvegarder le profil</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader><CardTitle>Changer le mot de passe</CardTitle><CardDescription>Sécurisez votre compte en changeant régulièrement votre mot de passe</CardDescription></CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="currentPassword" name="currentPassword" type="password" value={passwordFormData.currentPassword} onChange={handlePasswordInputChange} placeholder="Entrez votre mot de passe actuel" className="pl-10 bg-background/50" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="newPassword" name="newPassword" type="password" value={passwordFormData.newPassword} onChange={handlePasswordInputChange} placeholder="8 caractères minimum" className="pl-10 bg-background/50" minLength={8} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordFormData.confirmPassword} onChange={handlePasswordInputChange} placeholder="Confirmez le nouveau mot de passe" className="pl-10 bg-background/50" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoadingPassword || changePasswordMutation.isPending}>
                    {isLoadingPassword || changePasswordMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Changement en cours...</> : <><Lock className="mr-2 h-4 w-4" />Changer le mot de passe</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            {userArticles && userArticles.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">Vous avez écrit {userArticles.length} article{userArticles.length > 1 ? "s" : ""}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userArticles.map((article: any) => <ArticleCard key={article.id} article={article} variant="compact" />)}
                </div>
              </>
            ) : (
              <Card className="bg-card/50 border-border">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">Vous n'avez pas encore écrit d'articles.</p>
                  <Button className="mt-4" onClick={() => navigate("/editor")}>Créer mon premier article</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
