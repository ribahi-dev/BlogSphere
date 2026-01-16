import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService, setToken, setUser } from '@/services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.token) {
        // Store token for authenticated requests
        setToken(response.token);
        // If backend returned user in the login response, store it locally.
        if ((response as any).user) {
          setUser((response as any).user);
        } else {
          // Otherwise, fetch the profile to ensure we have the latest user data
          try {
            const profile = await authService.getProfile();
            setUser(profile);
          } catch (e) {
            // ignore profile fetch errors here; token is set and subsequent pages will handle auth checks
          }
        }
        toast({
          title: "Succès",
          description: "Vous êtes connecté!",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
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
              <h1 className="font-display text-3xl font-bold mb-2">Bon retour !</h1>
              <p className="text-muted-foreground">Connectez-vous pour accéder à votre espace</p>
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

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={loading}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Se souvenir de moi
                  </Label>
                </div>

                <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {loading ? 'Connexion...' : 'Se connecter'}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
