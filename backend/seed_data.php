<?php
// Seeding categories and some initial data via PDO for speed/reliability
$dbPath = __DIR__ . '/var/data.db';

if (!file_exists($dbPath)) {
    die("❌ Database file not found at: $dbPath\n");
}

try {
    $pdo = new PDO("sqlite:$dbPath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== Seeding Categories ===\n";
    
    $categories = [
        ['Technologie', 'technologie', 'Tout sur les dernières innovations', 'Cpu'],
        ['Développement', 'developpement', 'Coding, frameworks et langages', 'Code'],
        ['Design', 'design', 'UI/UX et tendances graphiques', 'Palette'],
        ['Lifestyle', 'lifestyle', 'Vie de développeur et bien-être', 'Coffee'],
    ];
    
    foreach ($categories as $cat) {
        $stmt = $pdo->prepare("INSERT OR IGNORE INTO category (name, slug, description, icon) VALUES (?, ?, ?, ?)");
        $stmt->execute($cat);
    }
    echo "✓ Categories seeded\n";

    echo "=== Seeding Tags ===\n";
    $tags = [
        ['React', 'react'],
        ['Symfony', 'symfony'],
        ['TypeScript', 'typescript'],
        ['Tailwind', 'tailwind'],
    ];
    foreach ($tags as $tag) {
        $stmt = $pdo->prepare("INSERT OR IGNORE INTO tag (name, slug) VALUES (?, ?)");
        $stmt->execute($tag);
    }
    echo "✓ Tags seeded\n";

    // Get author ID
    $stmt = $pdo->query("SELECT id FROM user WHERE user_type = 'AUTHOR' LIMIT 1");
    $author = $stmt->fetch();
    if (!$author) {
        // Create one if missing
        $authorPassword = password_hash('Password123', PASSWORD_BCRYPT);
        $pdo->prepare("INSERT INTO user (email, password, name, user_type, roles, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))")
            ->execute(['author@test.com', $authorPassword, 'Jean Auteur', 'AUTHOR', json_encode(['ROLE_AUTHOR'])]);
        $authorId = $pdo->lastInsertId();
    } else {
        $authorId = $author['id'];
    }

    // Get category ID
    $stmt = $pdo->query("SELECT id FROM category WHERE slug = 'technologie' LIMIT 1");
    $categoryId = $stmt->fetch()['id'];

    echo "=== Seeding Initial Articles ===\n";
    $articles = [
        [
            'Bienvenue sur BlogSphere', 
            'blog-sphere',
            'Ceci est votre premier article.', 
            'Découvrez notre nouvelle plateforme', 
            $authorId, 
            $categoryId, 
            1, 
            date('Y-m-d H:i:s'),
            date('Y-m-d H:i:s')
        ],
        [
            'L\'avenir de l\'IA', 
            'IA-avenir',
            'L\'intelligence artificielle transforme le monde...', 
            'Analyse des tendances 2026', 
            $authorId, 
            $categoryId, 
            1, 
            date('Y-m-d H:i:s'),
            date('Y-m-d H:i:s')
        ],
    ];

    foreach ($articles as $art) {
        $stmt = $pdo->prepare("INSERT OR IGNORE INTO article (title, slug, content, description, author_id, category_id, published, created_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute($art);
    }
    echo "✓ Articles seeded\n";

    echo "=== ✅ SUCCESS! ===\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
