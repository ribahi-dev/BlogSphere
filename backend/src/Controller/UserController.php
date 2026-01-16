<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\JwtService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/user')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private JwtService $jwtService,
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    /**
     * Récupérer le profil de l'utilisateur connecté
     */
    #[Route('/profile', name: 'get_profile', methods: ['GET'])]
    public function getProfile(Request $request): JsonResponse
    {
        try {
            $authHeader = $request->headers->get('Authorization', '');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return new JsonResponse(['error' => 'Missing or invalid Authorization header'], Response::HTTP_UNAUTHORIZED);
            }
            
            $token = substr($authHeader, 7); // Remove "Bearer " prefix
            $decodedToken = $this->jwtService->validateToken($token);

            if (!$decodedToken) {
                return new JsonResponse(['error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
            }

            $user = $this->entityManager->getRepository(User::class)->find($decodedToken['sub']);

            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            return new JsonResponse($this->serializeUser($user));

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Mettre à jour le profil de l'utilisateur
     */
    #[Route('/profile', name: 'update_profile', methods: ['PUT'])]
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $authHeader = $request->headers->get('Authorization', '');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return new JsonResponse(['error' => 'Missing or invalid Authorization header'], Response::HTTP_UNAUTHORIZED);
            }
            
            $token = substr($authHeader, 7); // Remove "Bearer " prefix
            $decodedToken = $this->jwtService->validateToken($token);

            if (!$decodedToken) {
                return new JsonResponse(['error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
            }

            $user = $this->entityManager->getRepository(User::class)->find($decodedToken['sub']);

            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            // Mettre à jour les champs autorisés
            if (isset($data['name'])) {
                $user->setName($data['name']);
            }
            if (isset($data['bio'])) {
                $user->setBio($data['bio']);
            }
            if (isset($data['avatar'])) {
                $user->setAvatar($data['avatar']);
            }

            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Profil mis à jour avec succès',
                'user' => $this->serializeUser($user),
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Changer le mot de passe
     */
    #[Route('/change-password', name: 'change_password', methods: ['POST'])]
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $authHeader = $request->headers->get('Authorization', '');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return new JsonResponse(['error' => 'Missing or invalid Authorization header'], Response::HTTP_UNAUTHORIZED);
            }
            
            $token = substr($authHeader, 7); // Remove "Bearer " prefix
            $decodedToken = $this->jwtService->validateToken($token);

            if (!$decodedToken) {
                return new JsonResponse(['error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
            }

            $user = $this->entityManager->getRepository(User::class)->find($decodedToken['sub']);

            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            // Vérifier l'ancien mot de passe
            if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
                return new JsonResponse(
                    ['error' => 'currentPassword et newPassword requis'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            if (!$this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
                return new JsonResponse(
                    ['error' => 'Mot de passe actuel incorrect'],
                    Response::HTTP_UNAUTHORIZED
                );
            }

            // Hacher et définir le nouveau mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['newPassword']);
            $user->setPassword($hashedPassword);

            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Mot de passe changé avec succès',
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Sérialiser les données utilisateur
     */
    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'bio' => $user->getBio(),
            'avatar' => $user->getAvatar(),
            'role' => $user->getUserType(),
            'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updatedAt' => $user->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}
