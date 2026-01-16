<?php
// Direct database creation for test accounts
$dbPath = __DIR__ . '/var/data.db';

if (!file_exists($dbPath)) {
    die("❌ Database file not found at: $dbPath\n");
}

try {
    $pdo = new PDO("sqlite:$dbPath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== Creating Test Accounts ===\n\n";
    
    // Delete existing test accounts
    $pdo->exec("DELETE FROM user WHERE email IN ('author@test.com', 'admin@test.com')");
    echo "✓ Cleaned existing test accounts\n\n";
    
    // Create AUTHOR account
    $authorPassword = password_hash('Password123', PASSWORD_BCRYPT);
    $pdo->prepare("
        INSERT INTO user (email, password, name, user_type, roles, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
    ")->execute([
        'author@test.com',
        $authorPassword,
        'Jean Auteur',
        'AUTHOR',
        json_encode(['ROLE_AUTHOR'])
    ]);
    
    echo "✅ AUTHOR Account Created:\n";
    echo "   Email: author@test.com\n";
    echo "   Password: Password123\n";
    echo "   Role: AUTHOR\n\n";
    
    // Create ADMIN account
    $adminPassword = password_hash('Password123', PASSWORD_BCRYPT);
    $pdo->prepare("
        INSERT INTO user (email, password, name, user_type, roles, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
    ")->execute([
        'admin@test.com',
        $adminPassword,
        'Jane Admin',
        'ADMIN',
        json_encode(['ROLE_ADMIN'])
    ]);
    
    echo "✅ ADMIN Account Created:\n";
    echo "   Email: admin@test.com\n";
    echo "   Password: Password123\n";
    echo "   Role: ADMIN\n\n";
    
    echo "=== ✅ SUCCESS! ===\n\n";
    echo "Login URL: http://localhost:8082/login\n\n";
    echo "Test Accounts:\n";
    echo "1. AUTHOR:\n";
    echo "   - Email: author@test.com\n";
    echo "   - Password: Password123\n\n";
    echo "2. ADMIN:\n";
    echo "   - Email: admin@test.com\n";
    echo "   - Password: Password123\n\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
