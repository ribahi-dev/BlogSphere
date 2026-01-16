<?php
/**
 * Complete Application Initialization Script
 * Run this from the backend directory: php init.php
 */

set_time_limit(300);

// Colors for console output
class Colors {
    const RESET = "\033[0m";
    const GREEN = "\033[32m";
    const RED = "\033[31m";
    const YELLOW = "\033[33m";
    const BLUE = "\033[34m";
}

function echo_info($message) {
    echo Colors::BLUE . "[INFO] " . Colors::RESET . $message . "\n";
}

function echo_success($message) {
    echo Colors::GREEN . "[✓] " . Colors::RESET . $message . "\n";
}

function echo_error($message) {
    echo Colors::RED . "[✗] " . Colors::RESET . $message . "\n";
}

function echo_warning($message) {
    echo Colors::YELLOW . "[!] " . Colors::RESET . $message . "\n";
}

echo "\n";
echo "==================================================\n";
echo "Complete Application Initialization\n";
echo "==================================================\n";
echo "\n";

// Check if we're in the backend directory
if (!file_exists('bin/console')) {
    echo_error("Please run this script from the backend directory!");
    exit(1);
}

// Step 1: Database setup
echo_info("Step 1: Setting up database...");
exec('php bin/console doctrine:database:create --if-not-exists 2>&1', $output, $code);
if ($code === 0 || strpos(implode($output), 'already exists') !== false) {
    echo_success("Database ready");
} else {
    echo_warning("Database setup: " . implode("\n", $output));
}

// Step 2: Migrations
echo_info("Step 2: Running database migrations...");
exec('php bin/console doctrine:migrations:migrate --no-interaction 2>&1', $output, $code);
if ($code === 0) {
    echo_success("Migrations completed");
} else {
    echo_warning("Migrations: " . implode("\n", array_slice($output, -5)));
}

// Step 3: Clear cache
echo_info("Step 3: Clearing application cache...");
exec('php bin/console cache:clear 2>&1', $output, $code);
if ($code === 0) {
    echo_success("Cache cleared");
} else {
    echo_warning("Cache clear: " . implode("\n", array_slice($output, -3)));
}

// Step 4: Create test data
echo_info("Step 4: Creating test data...");

// Direct SQL insert - test users with correct working bcrypt hash
$testUsersSQL = [
    "DELETE FROM \"user\" WHERE email IN ('author1@test.com', 'author2@test.com', 'admin@test.com')",
    "INSERT INTO \"user\" (email, password, name, user_type, roles, created_at, updated_at) VALUES ('author1@test.com', '\$2y\$13\$bUeM86vV9PaybB.NVuVoq.RNSNPNRb19fVYfA8S8ObkTNvT7KuW32', 'Author One', 'AUTHOR', '[\"ROLE_AUTHOR\"]', NOW(), NOW())",
    "INSERT INTO \"user\" (email, password, name, user_type, roles, created_at, updated_at) VALUES ('author2@test.com', '\$2y\$13\$bUeM86vV9PaybB.NVuVoq.RNSNPNRb19fVYfA8S8ObkTNvT7KuW32', 'Author Two', 'AUTHOR', '[\"ROLE_AUTHOR\"]', NOW(), NOW())",
    "INSERT INTO \"user\" (email, password, name, user_type, roles, created_at, updated_at) VALUES ('admin@test.com', '\$2y\$13\$bUeM86vV9PaybB.NVuVoq.RNSNPNRb19fVYfA8S8ObkTNvT7KuW32', 'Admin User', 'ADMIN', '[\"ROLE_ADMIN\"]', NOW(), NOW())",
];

foreach ($testUsersSQL as $sql) {
    exec("php bin/console doctrine:query:sql \"$sql\" 2>&1", $output, $code);
}

echo_success("Test users created");

// Step 5: Create categories
echo_info("Step 5: Creating categories...");
$categories = [
    ['name' => 'Technology', 'slug' => 'technology'],
    ['name' => 'Lifestyle', 'slug' => 'lifestyle'],
    ['name' => 'Business', 'slug' => 'business'],
    ['name' => 'Education', 'slug' => 'education'],
];

foreach ($categories as $cat) {
    $sql = sprintf('INSERT INTO category (name, slug) VALUES (\'%s\', \'%s\') ON CONFLICT DO NOTHING', $cat['name'], $cat['slug']);
    exec("php bin/console doctrine:query:sql \"$sql\" 2>&1", $output, $code);
}
echo_success("Categories created");

// Step 6: Create tags
echo_info("Step 6: Creating tags...");
$tags = [
    ['name' => 'PHP', 'slug' => 'php'],
    ['name' => 'Symfony', 'slug' => 'symfony'],
    ['name' => 'Laravel', 'slug' => 'laravel'],
    ['name' => 'Database', 'slug' => 'database'],
    ['name' => 'Web Development', 'slug' => 'web-development'],
];

foreach ($tags as $tag) {
    $sql = sprintf('INSERT INTO tag (name, slug) VALUES (\'%s\', \'%s\') ON CONFLICT DO NOTHING', $tag['name'], $tag['slug']);
    exec("php bin/console doctrine:query:sql \"$sql\" 2>&1", $output, $code);
}
echo_success("Tags created");

// Step 7: Create sample articles
echo_info("Step 7: Creating sample articles...");
$articles = [
    [
        'title' => 'Getting Started with Symfony',
        'slug' => 'getting-started-with-symfony',
        'content' => 'Symfony is a powerful PHP framework for building web applications. In this article, we explore the basics of Symfony and how to get started with your first project.',
        'description' => 'Learn the basics of Symfony',
        'author_id' => 1,
        'category_id' => 1,
    ],
    [
        'title' => 'Advanced PHP Techniques',
        'slug' => 'advanced-php-techniques',
        'content' => 'Dive into advanced PHP concepts including design patterns, performance optimization, and modern PHP standards.',
        'description' => 'Master advanced PHP concepts',
        'author_id' => 2,
        'category_id' => 1,
    ],
    [
        'title' => 'Web Development Best Practices',
        'slug' => 'web-development-best-practices',
        'content' => 'Follow these essential best practices for modern web development to create secure, scalable, and maintainable applications.',
        'description' => 'Best practices guide for developers',
        'author_id' => 1,
        'category_id' => 4,
    ],
];

foreach ($articles as $article) {
    $sql = sprintf(
        'INSERT INTO article (title, slug, content, description, author_id, category_id, published, created_at, published_at) VALUES (\'%s\', \'%s\', \'%s\', \'%s\', %d, %d, true, NOW(), NOW()) ON CONFLICT DO NOTHING',
        addslashes($article['title']),
        $article['slug'],
        addslashes($article['content']),
        addslashes($article['description']),
        $article['author_id'],
        $article['category_id']
    );
    
    exec("php bin/console doctrine:query:sql \"$sql\" 2>&1", $output, $code);
}
echo_success("Sample articles created");

echo "\n";
echo "==================================================\n";
echo Colors::GREEN . "Initialization Complete!" . Colors::RESET . "\n";
echo "==================================================\n";
echo "\n";
echo "Test Credentials:\n";
echo "  Author 1: author1@test.com / password123\n";
echo "  Author 2: author2@test.com / password123\n";
echo "  Admin:    admin@test.com / password123\n";
echo "\n";
echo "Next steps:\n";
echo "  1. Run: symfony server:start -d\n";
echo "  2. Navigate to: http://127.0.0.1:8081\n";
echo "\n";
