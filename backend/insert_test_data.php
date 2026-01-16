#!/usr/bin/env php
<?php
// Script pour ajouter des données de test

require_once 'vendor/autoload.php';

echo "Insertion de données de test...\n\n";

// Connexion à la base de données
$pdo = new PDO(
    'pgsql:host=127.0.0.1;port=5432;dbname=app_db',
    'postgres',
    '2005'
);

// Insérer un utilisateur de test
$email = 'test@example.com';
$password = password_hash('password123', PASSWORD_BCRYPT);
$name = 'Utilisateur Test';
$roles = json_encode(['ROLE_USER', 'ROLE_AUTHOR']);
$created_at = date('Y-m-d H:i:s');

$stmt = $pdo->prepare("
    INSERT INTO \"user\" (email, password, roles, name, created_at, user_type)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->execute([$email, $password, $roles, $name, $created_at, 'AUTHOR']);

echo "✅ Utilisateur créé:\n";
echo "   Email: $email\n";
echo "   Password: password123\n";
echo "   Name: $name\n\n";

// Vérifier
$stmt = $pdo->query("SELECT * FROM \"user\"");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Utilisateurs actuels:\n";
foreach ($users as $user) {
    echo "  - {$user['email']} ({$user['name']})\n";
}

echo "\n✅ Données de test ajoutées!\n";
?>
