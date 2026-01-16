// Mock data for BlogSphere

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: 'admin' | 'author' | 'user';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description?: string;
  content: string;
  coverImage: string;
  author: Author;
  category: Category;
  tags: Tag[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  views: number;
  featured: boolean;
  published: boolean;
}

export const authors: Author[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Passionnée de technologie et de design, Sophie partage ses découvertes et réflexions sur le monde numérique.',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Lucas Bernard',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Développeur web full-stack avec 10 ans d\'expérience. J\'écris sur les bonnes pratiques et les nouvelles technologies.',
    role: 'author',
  },
  {
    id: '3',
    name: 'Emma Dubois',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'UX Designer créative, j\'explore les tendances et partage des conseils pour améliorer l\'expérience utilisateur.',
    role: 'author',
  },
];

export const categories: Category[] = [
  { id: '1', name: 'Technologie', slug: 'technologie', description: 'Les dernières innovations tech', articleCount: 24 },
  { id: '2', name: 'Design', slug: 'design', description: 'Tendances et inspirations design', articleCount: 18 },
  { id: '3', name: 'Développement', slug: 'developpement', description: 'Tutoriels et bonnes pratiques', articleCount: 32 },
  { id: '4', name: 'Lifestyle', slug: 'lifestyle', description: 'Mode de vie et bien-être', articleCount: 15 },
  { id: '5', name: 'Business', slug: 'business', description: 'Entrepreneuriat et stratégie', articleCount: 21 },
];

export const tags: Tag[] = [
  { id: '1', name: 'React', slug: 'react' },
  { id: '2', name: 'JavaScript', slug: 'javascript' },
  { id: '3', name: 'CSS', slug: 'css' },
  { id: '4', name: 'UI/UX', slug: 'ui-ux' },
  { id: '5', name: 'Productivité', slug: 'productivite' },
  { id: '6', name: 'Startup', slug: 'startup' },
  { id: '7', name: 'IA', slug: 'ia' },
  { id: '8', name: 'Mobile', slug: 'mobile' },
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'L\'avenir de l\'intelligence artificielle dans le développement web',
    slug: 'avenir-ia-developpement-web',
    excerpt: 'Découvrez comment l\'IA transforme la façon dont nous créons des applications web et ce que cela signifie pour les développeurs.',
    content: `L'intelligence artificielle révolutionne le monde du développement web...`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    author: authors[0],
    category: categories[0],
    tags: [tags[6], tags[1]],
    comments: [],
    createdAt: '2024-12-20',
    updatedAt: '2024-12-20',
    views: 1250,
    featured: true,
    published: true,
  },
  {
    id: '2',
    title: 'Les principes du design minimaliste moderne',
    slug: 'principes-design-minimaliste',
    excerpt: 'Le minimalisme n\'est pas juste une tendance, c\'est une philosophie de design qui met l\'accent sur l\'essentiel.',
    content: `Le design minimaliste continue d'influencer le web moderne...`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop',
    author: authors[2],
    category: categories[1],
    tags: [tags[3], tags[2]],
    comments: [],
    createdAt: '2024-12-18',
    updatedAt: '2024-12-18',
    views: 890,
    featured: true,
    published: true,
  },
  {
    id: '3',
    title: 'Guide complet de React 19 : Nouveautés et bonnes pratiques',
    slug: 'guide-react-19-nouveautes',
    excerpt: 'Tout ce que vous devez savoir sur React 19, des nouvelles fonctionnalités aux patterns recommandés.',
    content: `React 19 apporte son lot de nouveautés excitantes...`,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    author: authors[1],
    category: categories[2],
    tags: [tags[0], tags[1]],
    comments: [],
    createdAt: '2024-12-15',
    updatedAt: '2024-12-16',
    views: 2100,
    featured: false,
    published: true,
  },
  {
    id: '4',
    title: 'Comment lancer sa startup tech en 2025',
    slug: 'lancer-startup-tech-2025',
    excerpt: 'Les étapes essentielles pour transformer votre idée en une entreprise technologique prospère.',
    content: `Lancer une startup tech n'a jamais été aussi accessible...`,
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    author: authors[0],
    category: categories[4],
    tags: [tags[5], tags[6]],
    comments: [],
    createdAt: '2024-12-12',
    updatedAt: '2024-12-12',
    views: 1560,
    featured: false,
    published: true,
  },
  {
    id: '5',
    title: 'Optimiser les performances de vos applications mobiles',
    slug: 'optimiser-performances-apps-mobiles',
    excerpt: 'Techniques avancées pour créer des applications mobiles rapides et fluides.',
    content: `La performance est cruciale pour le succès d'une application mobile...`,
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    author: authors[1],
    category: categories[2],
    tags: [tags[7], tags[4]],
    comments: [],
    createdAt: '2024-12-10',
    updatedAt: '2024-12-10',
    views: 780,
    featured: false,
    published: true,
  },
  {
    id: '6',
    title: 'Les couleurs tendance du design web en 2025',
    slug: 'couleurs-tendance-design-2025',
    excerpt: 'Explorez les palettes de couleurs qui domineront le paysage du design digital cette année.',
    content: `Les tendances couleur évoluent constamment...`,
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop',
    author: authors[2],
    category: categories[1],
    tags: [tags[2], tags[3]],
    comments: [],
    createdAt: '2024-12-08',
    updatedAt: '2024-12-08',
    views: 1120,
    featured: false,
    published: true,
  },
];

// Stats for dashboard
export const dashboardStats = {
  totalArticles: 156,
  totalUsers: 2340,
  totalComments: 892,
  pendingComments: 23,
  totalViews: 45600,
  viewsThisMonth: 12400,
  articlesThisMonth: 18,
  newUsersThisMonth: 156,
};

export const recentActivity = [
  { type: 'article', message: 'Sophie Martin a publié un nouvel article', time: 'Il y a 2 heures' },
  { type: 'comment', message: 'Nouveau commentaire sur "L\'avenir de l\'IA"', time: 'Il y a 3 heures' },
  { type: 'user', message: 'Marc Dupont s\'est inscrit', time: 'Il y a 5 heures' },
  { type: 'article', message: 'Lucas Bernard a modifié un article', time: 'Il y a 6 heures' },
  { type: 'comment', message: '3 commentaires en attente de modération', time: 'Il y a 8 heures' },
];
