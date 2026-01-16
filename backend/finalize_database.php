#!/usr/bin/env php
<?php
// Script pour finaliser la base de données avec des données de test

require_once 'vendor/autoload.php';

echo "\n";
echo "=====================================\n";
echo "Finalisation Base de Données\n";
echo "=====================================\n\n";

// Connexion à la base de données
$pdo = new PDO(
    'pgsql:host=127.0.0.1;port=5432;dbname=app_db',
    'postgres',
    '2005'
);

// 1. Ajouter des utilisateurs
echo "[1/4] Ajout des utilisateurs...\n";

$users = [
    [
        'email' => 'admin@example.com',
        'password' => password_hash('admin123', PASSWORD_BCRYPT),
        'name' => 'Administrateur',
        'roles' => json_encode(['ROLE_ADMIN', 'ROLE_AUTHOR', 'ROLE_USER']),
        'user_type' => 'ADMIN'
    ],
    [
        'email' => 'author1@example.com',
        'password' => password_hash('author123', PASSWORD_BCRYPT),
        'name' => 'Jean Dupont',
        'roles' => json_encode(['ROLE_AUTHOR', 'ROLE_USER']),
        'user_type' => 'AUTHOR'
    ],
    [
        'email' => 'author2@example.com',
        'password' => password_hash('author123', PASSWORD_BCRYPT),
        'name' => 'Marie Martin',
        'roles' => json_encode(['ROLE_AUTHOR', 'ROLE_USER']),
        'user_type' => 'AUTHOR'
    ],
    [
        'email' => 'user@example.com',
        'password' => password_hash('user123', PASSWORD_BCRYPT),
        'name' => 'Pierre Leclerc',
        'roles' => json_encode(['ROLE_USER']),
        'user_type' => 'USER'
    ]
];

$stmt = $pdo->prepare("
    INSERT INTO \"user\" (email, password, roles, name, created_at, user_type)
    VALUES (?, ?, ?, ?, NOW(), ?)
    ON CONFLICT DO NOTHING
");

foreach ($users as $user) {
    $stmt->execute([
        $user['email'],
        $user['password'],
        $user['roles'],
        $user['name'],
        $user['user_type']
    ]);
}

echo "   ✅ 4 utilisateurs ajoutés\n\n";

// 2. Récupérer les IDs des auteurs
$stmt = $pdo->query("SELECT id, name FROM \"user\" WHERE user_type='AUTHOR' ORDER BY id LIMIT 2");
$authors = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 3. Ajouter des articles
echo "[2/4] Ajout des articles...\n";

$articles = [
    [
        'author_id' => $authors[0]['id'],
        'title' => 'Introduction à PostgreSQL',
        'content' => 'PostgreSQL est un système de gestion de base de données relationnel puissant et open-source. Dans cet article, nous explorons les fonctionnalités principales de PostgreSQL et ses avantages pour les développeurs.',
        'description' => 'Découvrez PostgreSQL et ses capacités avancées',
        'published' => true,
        'published_at' => date('Y-m-d H:i:s', strtotime('-10 days'))
    ],
    [
        'author_id' => $authors[1]['id'],
        'title' => 'Symfony 7: Les meilleures pratiques',
        'content' => 'Symfony est un framework PHP moderne et complet. Cet article couvre les meilleures pratiques pour développer avec Symfony 7, incluant la gestion des dépendances, l\'architecture et les patterns de conception.',
        'description' => 'Les meilleures pratiques pour développer avec Symfony 7',
        'published' => true,
        'published_at' => date('Y-m-d H:i:s', strtotime('-7 days'))
    ],
    [
        'author_id' => $authors[0]['id'],
        'title' => 'API RESTful avec Symfony et PostgreSQL',
        'content' => 'Construire une API RESTful robuste est essentiel dans le développement web moderne. Ce guide complet montre comment utiliser Symfony avec PostgreSQL pour créer une API performante et sécurisée.',
        'description' => 'Créer une API RESTful avec Symfony et PostgreSQL',
        'published' => true,
        'published_at' => date('Y-m-d H:i:s', strtotime('-3 days'))
    ],
    [
        'author_id' => $authors[1]['id'],
        'title' => 'Sécurité des applications web en 2026',
        'content' => 'La sécurité est primordiale. Découvrez les meilleures pratiques en matière de sécurité web, incluant l\'authentification, l\'autorisation, la protection contre les attaques courantes, et bien plus.',
        'description' => 'Protégez vos applications contre les menaces actuelles',
        'published' => false,
        'published_at' => null
    ]
];

$stmt = $pdo->prepare("
    INSERT INTO article (author_id, title, content, description, published, created_at, published_at)
    VALUES (?, ?, ?, ?, ?, NOW(), ?)
    ON CONFLICT DO NOTHING
");

foreach ($articles as $article) {
    $stmt->execute([
        $article['author_id'],
        $article['title'],
        $article['content'],
        $article['description'],
        $article['published'] ? true : false,
        $article['published_at']
    ]);
}

echo "   ✅ 4 articles ajoutés\n\n";

// 4. Récupérer les IDs des articles publiés
$stmt = $pdo->query("SELECT id FROM article WHERE published=true ORDER BY id LIMIT 2");
$articles_published = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 5. Ajouter des commentaires
echo "[3/4] Ajout des commentaires...\n";

if (count($articles_published) > 0) {
    $comments = [
        [
            'article_id' => $articles_published[0]['id'],
            'author_id' => $authors[1]['id'],
            'content' => 'Très bon article! PostgreSQL est vraiment puissant.'
        ],
        [
            'article_id' => $articles_published[0]['id'],
            'author_id' => $authors[1]['id'],
            'content' => 'J\'aimerais en savoir plus sur les index en PostgreSQL.'
        ],
        [
            'article_id' => $articles_published[1]['id'],
            'author_id' => $authors[0]['id'],
            'content' => 'Excellent guide! Cela m\'a vraiment aidé.'
        ]
    ];

    $stmt = $pdo->prepare("
        INSERT INTO comment (article_id, author_id, content, created_at)
        VALUES (?, ?, ?, NOW())
        ON CONFLICT DO NOTHING
    ");

    foreach ($comments as $comment) {
        $stmt->execute([
            $comment['article_id'],
            $comment['author_id'],
            $comment['content']
        ]);
    }

    echo "   ✅ 3 commentaires ajoutés\n\n";
}

// 6. Afficher le résumé
echo "[4/4] Résumé de la base de données...\n\n";

$stmt = $pdo->query("SELECT COUNT(*) as count FROM \"user\"");
$user_count = $stmt->fetchColumn();

$stmt = $pdo->query("SELECT COUNT(*) as count FROM article");
$article_count = $stmt->fetchColumn();

$stmt = $pdo->query("SELECT COUNT(*) as count FROM comment");
$comment_count = $stmt->fetchColumn();

echo "=====================================\n";
echo "RÉSUMÉ DE LA BASE DE DONNÉES\n";
echo "=====================================\n\n";
echo "📊 Statistiques:\n";
echo "   • Utilisateurs: $user_count\n";
echo "   • Articles: $article_count\n";
echo "   • Commentaires: $comment_count\n\n";

echo "👥 Utilisateurs:\n";
$stmt = $pdo->query("SELECT id, email, name, user_type FROM \"user\" ORDER BY id");
$users_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($users_list as $user) {
    echo "   {$user['id']}. {$user['email']} ({$user['name']}) - {$user['user_type']}\n";
}

echo "\n📝 Articles:\n";
$stmt = $pdo->query("SELECT id, title, published FROM article ORDER BY id");
$articles_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($articles_list as $article) {
    $status = $article['published'] ? '✅ Publié' : '❌ Brouillon';
    echo "   {$article['id']}. {$article['title']} ($status)\n";
}

echo "\n💬 Commentaires:\n";
$stmt = $pdo->query("SELECT id, article_id, content FROM comment ORDER BY id LIMIT 5");
$comments_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($comments_list as $comment) {
    $content = substr($comment['content'], 0, 50) . '...';
    echo "   {$comment['id']}. Sur article {$comment['article_id']}: {$content}\n";
}

echo "\n=====================================\n";
echo "✅ Base de données finalisée!\n";
echo "=====================================\n\n";

?>
