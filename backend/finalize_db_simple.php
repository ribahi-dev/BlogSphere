#!/usr/bin/env php
<?php
// Script simple pour finaliser la base de données

require_once 'vendor/autoload.php';

echo "\n";
echo "=====================================\n";
echo "Finalisation Base de Données\n";
echo "=====================================\n\n";

// Connexion
$pdo = new PDO(
    'pgsql:host=127.0.0.1;port=5432;dbname=app_db',
    'postgres',
    '2005'
);

// 1. Ajouter des utilisateurs
echo "[1/3] Ajout des utilisateurs...\n";

$users = [
    ['admin@example.com', 'Administrateur', 'ADMIN'],
    ['author1@example.com', 'Jean Dupont', 'AUTHOR'],
    ['author2@example.com', 'Marie Martin', 'AUTHOR'],
    ['user@example.com', 'Pierre Leclerc', 'USER']
];

foreach ($users as $user) {
    $pdo->exec("
        INSERT INTO \"user\" (email, password, roles, name, created_at, user_type)
        SELECT '{$user[0]}', 'hashed_pwd', '[]', '{$user[1]}', NOW(), '{$user[2]}'
        WHERE NOT EXISTS (SELECT 1 FROM \"user\" WHERE email = '{$user[0]}')
    ");
}

echo "   ✅ Utilisateurs ajoutés\n\n";

// 2. Ajouter des articles
echo "[2/3] Ajout des articles...\n";

$pdo->exec("
    INSERT INTO article (author_id, title, content, description, published, created_at, published_at)
    SELECT u.id, 'Introduction à PostgreSQL', 'PostgreSQL est un système puissant...', 'Découvrez PostgreSQL', true, NOW(), NOW()
    FROM \"user\" u WHERE u.email = 'author1@example.com'
    AND NOT EXISTS (SELECT 1 FROM article WHERE title = 'Introduction à PostgreSQL')
");

$pdo->exec("
    INSERT INTO article (author_id, title, content, description, published, created_at, published_at)
    SELECT u.id, 'Symfony 7: Les meilleures pratiques', 'Symfony est un framework moderne...', 'Les meilleures pratiques', true, NOW(), NOW()
    FROM \"user\" u WHERE u.email = 'author2@example.com'
    AND NOT EXISTS (SELECT 1 FROM article WHERE title = 'Symfony 7: Les meilleures pratiques')
");

$pdo->exec("
    INSERT INTO article (author_id, title, content, description, published, created_at, published_at)
    SELECT u.id, 'API RESTful avec Symfony', 'Construire une API robuste...', 'Créer une API RESTful', true, NOW(), NOW()
    FROM \"user\" u WHERE u.email = 'author1@example.com'
    AND NOT EXISTS (SELECT 1 FROM article WHERE title = 'API RESTful avec Symfony')
");

echo "   ✅ Articles ajoutés\n\n";

// 3. Ajouter des commentaires
echo "[3/3] Ajout des commentaires...\n";

$pdo->exec("
    INSERT INTO comment (article_id, author_id, content, created_at)
    SELECT a.id, u.id, 'Très bon article!', NOW()
    FROM article a, \"user\" u
    WHERE a.title = 'Introduction à PostgreSQL'
    AND u.email = 'author2@example.com'
    AND NOT EXISTS (SELECT 1 FROM comment WHERE content = 'Très bon article!')
");

$pdo->exec("
    INSERT INTO comment (article_id, author_id, content, created_at)
    SELECT a.id, u.id, 'Excellent guide!', NOW()
    FROM article a, \"user\" u
    WHERE a.title = 'Symfony 7: Les meilleures pratiques'
    AND u.email = 'author1@example.com'
    AND NOT EXISTS (SELECT 1 FROM comment WHERE content = 'Excellent guide!')
");

echo "   ✅ Commentaires ajoutés\n\n";

// Résumé
echo "=====================================\n";
echo "RÉSUMÉ FINAL\n";
echo "=====================================\n\n";

$stmt = $pdo->query("SELECT COUNT(*) FROM \"user\"");
$user_count = $stmt->fetchColumn();

$stmt = $pdo->query("SELECT COUNT(*) FROM article");
$article_count = $stmt->fetchColumn();

$stmt = $pdo->query("SELECT COUNT(*) FROM comment");
$comment_count = $stmt->fetchColumn();

echo "📊 Statistiques finales:\n";
echo "   • Utilisateurs: $user_count\n";
echo "   • Articles: $article_count\n";
echo "   • Commentaires: $comment_count\n\n";

echo "✅ Base de données finalisée!\n\n";

?>
