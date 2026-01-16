import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, User, PenSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getToken, removeToken } from '@/services/api';

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'Articles', path: '/articles' },
  { name: 'Catégories', path: '/categories' },
  { name: 'À propos', path: '/about' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    setTokenState(getToken());

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token') setTokenState(getToken());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <span className="text-primary-foreground font-display font-bold text-xl">B</span>
              </div>
            </div>
            <span className="font-display text-xl font-semibold hidden sm:block">
              Blog<span className="text-gradient-primary">Sphere</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={cn(
              "transition-all duration-300 overflow-hidden",
              isSearchOpen ? "w-64" : "w-0"
            )}>
              <Input
                type="search"
                placeholder="Rechercher..."
                className="h-9"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {token ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-1" />
                      Mon compte
                    </Link>
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    asChild
                  >
                    <Link to="/author/new">
                      <PenSquare className="h-4 w-4 mr-1" />
                      Écrire
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { removeToken(); setTokenState(null); window.location.href = '/'; }}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">
                      <User className="h-4 w-4 mr-1" />
                      Connexion
                    </Link>
                  </Button>
                  <Button variant="hero" size="sm" asChild>
                    <Link to="/register">
                      <PenSquare className="h-4 w-4 mr-1" />
                      Écrire
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
        )}>
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex gap-2 px-4 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button variant="hero" size="sm" className="flex-1" asChild>
                <Link to="/register">Écrire</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
