import { Layout } from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <section className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">À propos</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">BlogSphere est une plateforme de blogging moderne construite pour partager des idées, apprendre et connecter la communauté.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="prose max-w-none">
            <h2>Notre mission</h2>
            <p>Fournir un espace simple et élégant pour publier et découvrir du contenu de qualité.</p>

            <h2>Contribuer</h2>
            <p>Inscrivez-vous et commencez à écrire vos propres articles en quelques clics.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
