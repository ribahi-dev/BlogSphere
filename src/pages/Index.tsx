import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Index.css';

const Index = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/articles')
      .then(res => res.json())
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]));
  }, []);

  return (
    <div className="index-container">
      {/* Header */}
      <header className="index-header">
        <div className="index-header-content">
          <h1 className="index-logo">📚 BlogSphere</h1>
          <nav>
            <Link to="/articles" className="index-nav-link">Articles</Link>
            <Link to="/login" className="index-nav-link-last">Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="index-hero">
        <h2 className="index-hero-title">Bienvenue sur BlogSphere</h2>
        <p className="index-hero-subtitle">Découvrez les meilleurs articles</p>
        <Link to="/articles" className="index-hero-btn">
          Explorer
        </Link>
      </section>

      {/* Articles */}
      <section className="index-articles-section">
        <h3 className="index-articles-title">Articles Récents</h3>
        
        {articles.length === 0 ? (
          <div className="index-articles-empty">
            <p>Aucun article pour le moment</p>
          </div>
        ) : (
          <div className="index-articles-grid">
            {articles.map((article) => (
              <Link key={article.id} to={`/articles/${article.slug}`} className="index-article-card">
                <div className="index-article-content">
                  <h4 className="index-article-title">{article.title}</h4>
                  <p className="index-article-description">{article.description}</p>
                  <div className="index-article-meta">
                    <span>{article.author?.name}</span>
                    <span>{article.category?.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
