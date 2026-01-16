import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast({
        title: "Inscription réussie !",
        description: "Vous recevrez bientôt nos derniers articles.",
      });
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-hero-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-6">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Restez informé
          </h2>
          <p className="text-primary-foreground/70 mb-8">
            Recevez chaque semaine une sélection des meilleurs articles directement dans votre boîte mail.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-card/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="accent" 
              size="lg"
              disabled={isSubmitted}
              className="h-12"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Inscrit !
                </>
              ) : (
                <>
                  S'abonner
                  <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-primary-foreground/50 mt-4">
            Pas de spam, désabonnez-vous à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
}
