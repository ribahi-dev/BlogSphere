#!/usr/bin/env php
<?php
// Script de démonstration interactif de la base de données

require_once 'vendor/autoload.php';

$pdo = new PDO(
    'pgsql:host=127.0.0.1;port=5432;dbname=app_db',
    'postgres',
    '2005'
);

function show_menu() {
    echo "\n";
    echo "╔════════════════════════════════════════╗\n";
    echo "║  BASE DE DONNÉES - MENU DE DÉMONSTRATION ║\n";
    echo "╚════════════════════════════════════════╝\n\n";
    echo "1. 👥 Voir tous les utilisateurs\n";
    echo "2. 📝 Voir tous les articles\n";
    echo "3. 💬 Voir tous les commentaires\n";
    echo "4. 📊 Statistiques globales\n";
    echo "5. 🔗 Articles avec leurs auteurs\n";
    echo "6. 📋 Commentaires avec contexte\n";
    echo "7. 🏆 Utilisateurs actifs (qui ont écrit)\n";
    echo "8. 📈 Nombre d'articles par auteur\n";
    echo "9. ❓ Voir la structure d'une table\n";
    echo "10. ❌ Quitter\n\n";
}

function show_users($pdo) {
    echo "\n👥 TOUS LES UTILISATEURS:\n";
    echo str_repeat("═", 80) . "\n";
    
    $stmt = $pdo->query("SELECT id, email, name, user_type FROM \"user\" ORDER BY id");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) == 0) {
        echo "Aucun utilisateur trouvé.\n";
        return;
    }
    
    printf("%-5s %-30s %-20s %-10s\n", "ID", "Email", "Nom", "Type");
    echo str_repeat("─", 80) . "\n";
    
    foreach ($users as $user) {
        printf("%-5d %-30s %-20s %-10s\n", 
            $user['id'], 
            $user['email'], 
            substr($user['name'], 0, 20),
            $user['user_type']
        );
    }
    
    echo str_repeat("═", 80) . "\n";
    echo "Total: " . count($users) . " utilisateurs\n";
}

function show_articles($pdo) {
    echo "\n📝 TOUS LES ARTICLES:\n";
    echo str_repeat("═", 100) . "\n";
    
    $stmt = $pdo->query("SELECT a.id, a.title, u.name, a.published, a.created_at FROM article a JOIN \"user\" u ON a.author_id = u.id ORDER BY a.id");
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($articles) == 0) {
        echo "Aucun article trouvé.\n";
        return;
    }
    
    printf("%-5s %-40s %-20s %-10s %-20s\n", "ID", "Titre", "Auteur", "Publié", "Date création");
    echo str_repeat("─", 100) . "\n";
    
    foreach ($articles as $article) {
        $status = $article['published'] ? '✅ Oui' : '❌ Non';
        printf("%-5d %-40s %-20s %-10s %-20s\n",
            $article['id'],
            substr($article['title'], 0, 40),
            substr($article['name'], 0, 20),
            $status,
            substr($article['created_at'], 0, 10)
        );
    }
    
    echo str_repeat("═", 100) . "\n";
    echo "Total: " . count($articles) . " articles\n";
}

function show_comments($pdo) {
    echo "\n💬 TOUS LES COMMENTAIRES:\n";
    echo str_repeat("═", 110) . "\n";
    
    $stmt = $pdo->query("SELECT c.id, c.content, u.name as author, a.title as article FROM comment c JOIN \"user\" u ON c.author_id = u.id JOIN article a ON c.article_id = a.id ORDER BY c.id");
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($comments) == 0) {
        echo "Aucun commentaire trouvé.\n";
        return;
    }
    
    printf("%-5s %-40s %-20s %-30s\n", "ID", "Contenu", "Auteur", "Article");
    echo str_repeat("─", 110) . "\n";
    
    foreach ($comments as $comment) {
        printf("%-5d %-40s %-20s %-30s\n",
            $comment['id'],
            substr($comment['content'], 0, 40),
            substr($comment['author'], 0, 20),
            substr($comment['article'], 0, 30)
        );
    }
    
    echo str_repeat("═", 110) . "\n";
    echo "Total: " . count($comments) . " commentaires\n";
}

function show_stats($pdo) {
    echo "\n📊 STATISTIQUES GLOBALES:\n";
    echo str_repeat("═", 50) . "\n";
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM \"user\"");
    $users = $stmt->fetchColumn();
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM article");
    $articles = $stmt->fetchColumn();
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM comment");
    $comments = $stmt->fetchColumn();
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM article WHERE published=true");
    $published = $stmt->fetchColumn();
    
    echo "👥 Utilisateurs totaux: $users\n";
    echo "📝 Articles totaux: $articles\n";
    echo "   ✅ Publiés: $published\n";
    echo "   ❌ Brouillons: " . ($articles - $published) . "\n";
    echo "💬 Commentaires totaux: $comments\n";
    echo str_repeat("═", 50) . "\n";
}

function show_articles_with_authors($pdo) {
    echo "\n📝 ARTICLES ET LEURS AUTEURS:\n";
    echo str_repeat("═", 80) . "\n";
    
    $stmt = $pdo->query("SELECT a.title, u.name, a.published FROM article a JOIN \"user\" u ON a.author_id = u.id ORDER BY a.id");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($results as $row) {
        $status = $row['published'] ? '✅ Publié' : '❌ Brouillon';
        echo "• " . $row['title'] . "\n";
        echo "  Auteur: " . $row['name'] . " | " . $status . "\n\n";
    }
}

function show_comments_with_context($pdo) {
    echo "\n💬 COMMENTAIRES AVEC CONTEXTE:\n";
    echo str_repeat("═", 100) . "\n";
    
    $stmt = $pdo->query("SELECT a.title as article, u.name as author, c.content FROM comment c JOIN \"user\" u ON c.author_id = u.id JOIN article a ON c.article_id = a.id ORDER BY c.id");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($results as $row) {
        echo "📰 Article: " . $row['article'] . "\n";
        echo "👤 Commentaire de: " . $row['author'] . "\n";
        echo "💬 \"" . $row['content'] . "\"\n\n";
    }
}

function show_active_users($pdo) {
    echo "\n🏆 UTILISATEURS ACTIFS (qui ont écrit des articles):\n";
    echo str_repeat("═", 70) . "\n";
    
    $stmt = $pdo->query("SELECT DISTINCT u.name, COUNT(a.id) as article_count FROM \"user\" u LEFT JOIN article a ON u.id = a.author_id GROUP BY u.id, u.name HAVING COUNT(a.id) > 0 ORDER BY article_count DESC");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($results) == 0) {
        echo "Aucun utilisateur actif trouvé.\n";
        return;
    }
    
    foreach ($results as $row) {
        echo "👤 " . $row['name'] . ": " . $row['article_count'] . " article(s)\n";
    }
}

function show_articles_per_author($pdo) {
    echo "\n📈 NOMBRE D'ARTICLES PAR AUTEUR:\n";
    echo str_repeat("═", 50) . "\n";
    
    $stmt = $pdo->query("SELECT u.name, COUNT(a.id) as count FROM \"user\" u LEFT JOIN article a ON u.id = a.author_id GROUP BY u.id, u.name ORDER BY count DESC");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    printf("%-25s %10s\n", "Auteur", "Articles");
    echo str_repeat("─", 50) . "\n";
    
    foreach ($results as $row) {
        printf("%-25s %10d\n", $row['name'], $row['count']);
    }
}

function show_table_structure($pdo) {
    echo "\nQuelle table voulez-vous voir?\n";
    echo "1. user\n";
    echo "2. article\n";
    echo "3. comment\n";
    echo "4. oauth_token\n";
    $choice = readline("> ");
    
    $tables = ['user', 'article', 'comment', 'oauth_token'];
    if ($choice < 1 || $choice > 4) {
        echo "Choix invalide.\n";
        return;
    }
    
    $table = $tables[$choice - 1];
    
    echo "\n📋 STRUCTURE DE LA TABLE '$table':\n";
    echo str_repeat("═", 80) . "\n";
    
    $stmt = $pdo->query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='$table' ORDER BY ordinal_position");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    printf("%-25s %-30s %-10s\n", "Colonne", "Type", "Nullable");
    echo str_repeat("─", 80) . "\n";
    
    foreach ($columns as $col) {
        printf("%-25s %-30s %-10s\n", $col['column_name'], $col['data_type'], $col['is_nullable']);
    }
}

// Programme principal
echo "\n╔═══════════════════════════════════════════╗\n";
echo "║   BASE DE DONNÉES - OUTIL DE DÉMONSTRATION   ║\n";
echo "║                                               ║\n";
echo "║  📊 PostgreSQL 18 | 🗄️ app_db | 🎯 Symfony  ║\n";
echo "╚═══════════════════════════════════════════╝\n";

while (true) {
    show_menu();
    $choice = readline("Choisissez une option (1-10): ");
    
    switch ($choice) {
        case '1':
            show_users($pdo);
            break;
        case '2':
            show_articles($pdo);
            break;
        case '3':
            show_comments($pdo);
            break;
        case '4':
            show_stats($pdo);
            break;
        case '5':
            show_articles_with_authors($pdo);
            break;
        case '6':
            show_comments_with_context($pdo);
            break;
        case '7':
            show_active_users($pdo);
            break;
        case '8':
            show_articles_per_author($pdo);
            break;
        case '9':
            show_table_structure($pdo);
            break;
        case '10':
            echo "\n✅ À bientôt!\n\n";
            exit(0);
        default:
            echo "❌ Choix invalide.\n";
    }
    
    readline("\nAppuyez sur Entrée pour continuer...");
}

?>
