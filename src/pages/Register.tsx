import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, User, ArrowRight, Github, Chrome, PenSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService, setToken } from '@/services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [userType, setUserType] = useState<'AUTHOR' | 'ADMIN'>('AUTHOR');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Conditions requises",
        description: "Veuillez accepter les conditions d'utilisation.",
        variant: "destructive",
      });
      return;
    }

    if (!name || !email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit avoir au moins 8 caractères",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        name,
        email,
        password,
        userType,
        adminCode: userType === 'ADMIN' ? adminCode : undefined,
      });

      if (response.token) {
        setToken(response.token);
        toast({
          title: "Succès",
          description: "Votre compte a été créé et vous êtes connecté!",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;
    if (!clientId) {
      toast({ title: 'Google non configuré', description: 'Veuillez ajouter VITE_GOOGLE_CLIENT_ID dans votre .env', variant: 'destructive' });
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      prompt: 'select_account',
      access_type: 'offline',
      include_granted_scopes: 'true',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-4">
                <PenSquare className="h-8 w-8 text-accent" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">Rejoignez-nous</h1>
              <p className="text-muted-foreground">Créez votre compte et commencez à écrire</p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              {/* Social Login */}
              <div className="space-y-3 mb-6">
                <Button variant="outline" className="w-full h-11" type="button" onClick={handleGoogleSignIn} disabled={loading}>
                  <Chrome className="mr-2 h-5 w-5" />
                  Continuer avec Google
                </Button>
                <Button variant="outline" className="w-full h-11" type="button" disabled={loading}>
                  <Github className="mr-2 h-5 w-5" />
                  Continuer avec GitHub
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="8 caractères minimum"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      minLength={8}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Profil</Label>
                  <select
                    id="role"
                    title="Sélectionnez votre type de profil"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as 'AUTHOR' | 'ADMIN')}
                    className="w-full p-2 rounded border"
                    disabled={loading}
                  >
                    <option value="AUTHOR">Auteur</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                {userType === 'ADMIN' && (
                  <div className="space-y-2">
                    <Label htmlFor="adminCode">Code Admin</Label>
                    <div className="relative">
                      <Input
                        id="adminCode"
                        type="text"
                        placeholder="Code secret admin"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        className="pl-3"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="mt-0.5"
                    disabled={loading}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                    J'accepte les{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                  </Label>
                </div>

                <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {loading ? 'Inscription...' : 'Créer mon compte'}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Déjà un compte ?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
