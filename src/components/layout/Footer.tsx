import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">B</span>
              </div>
              <span className="font-display text-xl font-semibold">
                Blog<span className="text-gradient-primary">Sphere</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Une plateforme de blogging moderne pour partager vos idées et découvrir de nouveaux horizons.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Accueil</Link></li>
              <li><Link to="/articles" className="text-muted-foreground hover:text-foreground transition-colors">Articles</Link></li>
              <li><Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">Catégories</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">À propos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categories/technologie" className="text-muted-foreground hover:text-foreground transition-colors">Technologie</Link></li>
              <li><Link to="/categories/design" className="text-muted-foreground hover:text-foreground transition-colors">Design</Link></li>
              <li><Link to="/categories/developpement" className="text-muted-foreground hover:text-foreground transition-colors">Développement</Link></li>
              <li><Link to="/categories/business" className="text-muted-foreground hover:text-foreground transition-colors">Business</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Confidentialité</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 BlogSphere. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
