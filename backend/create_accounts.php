<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/autoload_runtime.php';

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

// Setup Symfony kernel
$_SERVER['APP_ENV'] = $_SERVER['APP_ENV'] ?? 'dev';
$_SERVER['APP_DEBUG'] = $_SERVER['APP_DEBUG'] ?? '1';

$kernel = new \App\Kernel($_SERVER['APP_ENV'], (bool)$_SERVER['APP_DEBUG']);
$kernel->boot();

$container = $kernel->getContainer();
$em = $container->get(EntityManagerInterface::class);
$hasher = $container->get(UserPasswordHasherInterface::class);

echo "=== Creating Test Accounts ===\n\n";

// Delete existing test accounts
$repo = $em->getRepository(User::class);
foreach (['author@test.com', 'admin@test.com'] as $email) {
    $user = $repo->findOneBy(['email' => $email]);
    if ($user) {
        $em->remove($user);
        echo "✓ Deleted existing: $email\n";
    }
}
$em->flush();

// Create AUTHOR account
$author = new User();
$author->setEmail('author@test.com');
$author->setName('Jean Auteur');
$author->setUserType('AUTHOR');
$author->setRoles(['ROLE_AUTHOR']);
$hashedPassword = $hasher->hashPassword($author, 'Password123');
$author->setPassword($hashedPassword);

$em->persist($author);
echo "\n✓ AUTHOR Account Created:\n";
echo "  Email: author@test.com\n";
echo "  Password: Password123\n";
echo "  Role: AUTHOR\n";

// Create ADMIN account
$admin = new User();
$admin->setEmail('admin@test.com');
$admin->setName('Jane Admin');
$admin->setUserType('ADMIN');
$admin->setRoles(['ROLE_ADMIN']);
$hashedPassword = $hasher->hashPassword($admin, 'Password123');
$admin->setPassword($hashedPassword);

$em->persist($admin);
echo "\n✓ ADMIN Account Created:\n";
echo "  Email: admin@test.com\n";
echo "  Password: Password123\n";
echo "  Role: ADMIN\n";

$em->flush();

echo "\n=== ✅ Comptes créés avec succès! ===\n";
echo "\nVous pouvez maintenant vous connecter sur:\n";
echo "http://localhost:8082/login\n";
echo "\nOu sur votre prof avec:\n";
echo "- AUTHOR: author@test.com / Password123\n";
echo "- ADMIN: admin@test.com / Password123\n";
?>
