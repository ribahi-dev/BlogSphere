<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\GoogleOAuthService;
use App\Service\JwtService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private JwtService $jwtService,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private GoogleOAuthService $googleOAuthService,
    ) {}

    /**
     * Inscription avec email et mot de passe
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
                return new JsonResponse(
                    ['error' => 'Email, password et name sont requis'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Vérifier si l'utilisateur existe déjà
            $existingUser = $this->entityManager->getRepository(User::class)->findOneBy([
                'email' => $data['email']
            ]);

            if ($existingUser) {
                return new JsonResponse(
                    ['error' => 'Cet email est déjà utilisé'],
                    Response::HTTP_CONFLICT
                );
            }

            // Créer un nouvel utilisateur
            $user = new User();
            $user->setEmail($data['email']);
            $user->setName($data['name']);
            
            // Définir le type d'utilisateur (AUTHOR par défaut)
            $userType = $data['userType'] ?? 'AUTHOR';
            if (!in_array($userType, ['AUTHOR', 'ADMIN'])) {
                $userType = 'AUTHOR';
            }

            // Si l'utilisateur demande le rôle ADMIN, vérifier le code secret admin
            if ($userType === 'ADMIN') {
                $adminCode = $data['adminCode'] ?? null;
                $expected = $_ENV['ADMIN_SECRET_CODE'] ?? null;
                if (!$expected || $adminCode !== $expected) {
                    return new JsonResponse(
                        ['error' => 'Code admin invalide ou non configuré'],
                        Response::HTTP_FORBIDDEN
                    );
                }
                $user->setUserType('ADMIN');
                $user->setRoles(['ROLE_ADMIN']);
            } else {
                $user->setUserType('AUTHOR');
                $user->setRoles(['ROLE_AUTHOR']);
            }

            // Hacher le mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // Générer un token JWT
            $token = $this->jwtService->generateToken($user);

            return new JsonResponse([
                'message' => 'Inscription réussie',
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'name' => $user->getName(),
                    'userType' => $user->getUserType(),
                    'roles' => $user->getRoles(),
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Erreur lors de l\'inscription: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Connexion avec email et mot de passe
     */
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['email']) || !isset($data['password'])) {
                return new JsonResponse(
                    ['error' => 'Email et password sont requis'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Trouver l'utilisateur
            $user = $this->entityManager->getRepository(User::class)->findOneBy([
                'email' => $data['email']
            ]);

            if (!$user) {
                return new JsonResponse(
                    ['error' => 'Email ou mot de passe incorrect'],
                    Response::HTTP_UNAUTHORIZED
                );
            }

            // Vérifier le mot de passe
            if (!$this->passwordHasher->isPasswordValid($user, $data['password'])) {
                return new JsonResponse(
                    ['error' => 'Email ou mot de passe incorrect'],
                    Response::HTTP_UNAUTHORIZED
                );
            }

            // Générer un token JWT
            $token = $this->jwtService->generateToken($user);

            return new JsonResponse([
                'message' => 'Connexion réussie',
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'name' => $user->getName(),
                    'userType' => $user->getUserType(),
                    'roles' => $user->getRoles(),
                ]
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Erreur lors de la connexion: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Callback Google OAuth
     */
    #[Route('/google/callback', name: 'google_callback', methods: ['GET', 'POST'])]
    public function googleCallback(Request $request): Response
    {
        try {
            $code = $request->query->get('code');
            $error = $request->query->get('error');

            if ($error) {
                return new JsonResponse(['error' => 'Google OAuth error: ' . $error], Response::HTTP_BAD_REQUEST);
            }

            if (!$code) {
                return new JsonResponse(['error' => 'Authorization code missing'], Response::HTTP_BAD_REQUEST);
            }

            // Échanger le code pour des tokens
            $tokens = $this->googleOAuthService->exchangeCodeForTokens($code);
            
            // Obtenir les infos de l'utilisateur
            $googleUser = $this->googleOAuthService->getUserInfo($tokens['access_token']);

            // Trouver ou créer l'utilisateur
            $user = $this->entityManager->getRepository(User::class)->findOneBy([
                'googleId' => $googleUser['sub']
            ]);

            if (!$user) {
                $user = new User();
                $user->setGoogleId($googleUser['sub']);
                $user->setEmail($googleUser['email']);
                $user->setName($googleUser['name'] ?? '');
                $user->setRoles(['ROLE_USER']);
                $this->entityManager->persist($user);
                $this->entityManager->flush();
            } else {
                // Mettre à jour les infos
                $user->setEmail($googleUser['email']);
                $user->setName($googleUser['name'] ?? $user->getName());
                $this->entityManager->flush();
            }

            // Générer un token JWT
            $jwtToken = $this->jwtService->generateToken($user);

            // Rediriger le frontend avec le token
            $frontendUrl = $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173';
            
            return new Response(<<<HTML
<!DOCTYPE html>
<html>
<head><title>Redirecting...</title></head>
<body>
<script>
  localStorage.setItem('auth_token', '$jwtToken');
  window.location.href = '$frontendUrl/';
</script>
</body>
</html>
HTML, Response::HTTP_OK, ['Content-Type' => 'text/html']);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'OAuth error: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Obtenir les infos de l'utilisateur connecté
     */
    #[Route('/me', name: 'auth_me', methods: ['GET'])]
    public function getMe(Request $request): JsonResponse
    {
        try {
            $authHeader = $request->headers->get('Authorization');
            if (!$authHeader) {
                return new JsonResponse(['error' => 'Missing token'], Response::HTTP_UNAUTHORIZED);
            }

            $token = JwtService::extractTokenFromHeader($authHeader);
            if (!$token) {
                return new JsonResponse(['error' => 'Invalid token format'], Response::HTTP_UNAUTHORIZED);
            }

            $claims = $this->jwtService->validateToken($token);
            if (!$claims) {
                return new JsonResponse(['error' => 'Invalid or expired token'], Response::HTTP_UNAUTHORIZED);
            }

            $user = $this->entityManager->getRepository(User::class)->find($claims['sub']);
            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            return new JsonResponse([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'name' => $user->getName(),
                'userType' => $user->getUserType(),
                'roles' => $user->getRoles(),
                'isAdmin' => $user->isAdmin(),
                'isAuthor' => $user->isAuthor(),
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Vérifier si l'email existe déjà
     */
    #[Route('/check-email', name: 'check_email', methods: ['POST'])]
    public function checkEmail(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['email'])) {
                return new JsonResponse(['error' => 'Email requis'], Response::HTTP_BAD_REQUEST);
            }

            $user = $this->entityManager->getRepository(User::class)->findOneBy([
                'email' => $data['email']
            ]);

            return new JsonResponse([
                'exists' => $user !== null,
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Déconnexion (optionnel - le token expire naturellement)
     */
    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        return new JsonResponse([
            'message' => 'Logout successful. Please remove the token from localStorage.'
        ]);
    }

    // Debug endpoint removed for production hardening.
}
