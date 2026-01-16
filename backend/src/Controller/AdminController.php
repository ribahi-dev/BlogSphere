<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Article;
use App\Entity\Comment;
use App\Entity\Message;
use App\Service\JwtService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/admin')]
class AdminController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private JwtService $jwtService,
    ) {}

    /**
     * Récupérer le tableau de bord admin (admin only)
     */
    #[Route('/dashboard', name: 'admin_dashboard', methods: ['GET'])]
    public function getDashboard(Request $request): JsonResponse
    {
        try {
            $admin = $this->getAuthenticatedUser($request);
            if (!$admin || !in_array('ROLE_ADMIN', $admin->getRoles())) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            // Get statistics
            $totalUsers = (int) $this->entityManager->getRepository(User::class)
                ->createQueryBuilder('u')
                ->select('COUNT(u.id)')
                ->getQuery()
                ->getSingleScalarResult();

            $totalArticles = (int) $this->entityManager->getRepository(Article::class)
                ->createQueryBuilder('a')
                ->select('COUNT(a.id)')
                ->getQuery()
                ->getSingleScalarResult();

            $publishedArticles = (int) $this->entityManager->getRepository(Article::class)
                ->createQueryBuilder('a')
                ->select('COUNT(a.id)')
                ->where('a.published = true')
                ->getQuery()
                ->getSingleScalarResult();

            $unpublishedArticles = $totalArticles - $publishedArticles;

            $totalComments = (int) $this->entityManager->getRepository(Comment::class)
                ->createQueryBuilder('c')
                ->select('COUNT(c.id)')
                ->getQuery()
                ->getSingleScalarResult();

            $articlesWithoutTags = (int) $this->entityManager->getRepository(Article::class)
                ->createQueryBuilder('a')
                ->leftJoin('a.tags', 't')
                ->select('COUNT(a.id)')
                ->where('t.id IS NULL')
                ->getQuery()
                ->getSingleScalarResult();

            // Get recent articles
            $recentArticles = $this->entityManager->getRepository(Article::class)
                ->findBy([], ['createdAt' => 'DESC'], 5);

            // Get recent users
            $recentUsers = $this->entityManager->getRepository(User::class)
                ->findBy([], ['createdAt' => 'DESC'], 5);

            return new JsonResponse([
                'statistics' => [
                    'totalUsers' => $totalUsers,
                    'totalArticles' => $totalArticles,
                    'publishedArticles' => $publishedArticles,
                    'unpublishedArticles' => $unpublishedArticles,
                    'totalComments' => $totalComments,
                    'articlesWithoutTags' => $articlesWithoutTags,
                ],
                'recentArticles' => array_map(fn($a) => [
                    'id' => $a->getId(),
                    'title' => $a->getTitle(),
                    'published' => $a->isPublished(),
                    'author' => $a->getAuthor()->getName(),
                    'createdAt' => $a->getCreatedAt()?->format('Y-m-d H:i:s'),
                ], $recentArticles),
                'recentUsers' => array_map(fn($u) => [
                    'id' => $u->getId(),
                    'name' => $u->getName(),
                    'email' => $u->getEmail(),
                    'userType' => $u->getUserType(),
                    'createdAt' => $u->getCreatedAt()?->format('Y-m-d H:i:s'),
                ], $recentUsers),
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lister tous les articles (pour modération - admin only)
     */
    #[Route('/articles', name: 'admin_list_articles', methods: ['GET'])]
    public function listArticles(Request $request): JsonResponse
    {
        try {
            $admin = $this->getAuthenticatedUser($request);
            if (!$admin || !in_array('ROLE_ADMIN', $admin->getRoles())) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $articles = $this->entityManager->getRepository(Article::class)
                ->findBy([], ['createdAt' => 'DESC']);

            return new JsonResponse(array_map(fn($a) => [
                'id' => $a->getId(),
                'title' => $a->getTitle(),
                'slug' => $a->getSlug(),
                'published' => $a->isPublished(),
                'author' => [
                    'id' => $a->getAuthor()->getId(),
                    'name' => $a->getAuthor()->getName(),
                    'email' => $a->getAuthor()->getEmail(),
                ],
                'createdAt' => $a->getCreatedAt()?->format('Y-m-d H:i:s'),
                'publishedAt' => $a->getPublishedAt()?->format('Y-m-d H:i:s'),
            ], $articles));

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lister tous les commentaires (admin only)
     */
    #[Route('/comments', name: 'admin_list_comments', methods: ['GET'])]
    public function listComments(Request $request): JsonResponse
    {
        try {
            $admin = $this->getAuthenticatedUser($request);
            if (!$admin || !in_array('ROLE_ADMIN', $admin->getRoles())) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $comments = $this->entityManager->getRepository(Comment::class)
                ->findBy([], ['createdAt' => 'DESC']);

            return new JsonResponse(array_map(fn($c) => [
                'id' => $c->getId(),
                'content' => $c->getContent(),
                'author' => [
                    'id' => $c->getAuthor()->getId(),
                    'name' => $c->getAuthor()->getName(),
                    'email' => $c->getAuthor()->getEmail(),
                ],
                'article' => [
                    'id' => $c->getArticle()->getId(),
                    'title' => $c->getArticle()->getTitle(),
                ],
                'createdAt' => $c->getCreatedAt()?->format('Y-m-d H:i:s'),
            ], $comments));

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Envoyer un message à un utilisateur (admin only)
     */
    #[Route('/messages', name: 'send_message', methods: ['POST'])]
    public function sendMessage(Request $request): JsonResponse
    {
        try {
            $admin = $this->getAuthenticatedUser($request);
            if (!$admin || !in_array('ROLE_ADMIN', $admin->getRoles())) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $data = json_decode($request->getContent(), true);

            if (!isset($data['recipientId']) || !isset($data['subject']) || !isset($data['content'])) {
                return new JsonResponse(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
            }

            $recipient = $this->entityManager->getRepository(User::class)->find($data['recipientId']);
            if (!$recipient) {
                return new JsonResponse(['error' => 'Recipient not found'], Response::HTTP_NOT_FOUND);
            }

            $message = new Message();
            $message->setSender($admin);
            $message->setRecipient($recipient);
            $message->setSubject($data['subject']);
            $message->setContent($data['content']);
            $message->setIsRead(false);

            $this->entityManager->persist($message);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Message sent successfully',
                'data' => [
                    'id' => $message->getId(),
                    'subject' => $message->getSubject(),
                    'recipient' => $recipient->getName(),
                    'createdAt' => $message->getCreatedAt()?->format('Y-m-d H:i:s'),
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer les messages (admin only)
     */
    #[Route('/messages', name: 'get_messages', methods: ['GET'])]
    public function getMessages(Request $request): JsonResponse
    {
        try {
            $admin = $this->getAuthenticatedUser($request);
            if (!$admin || !in_array('ROLE_ADMIN', $admin->getRoles())) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $messages = $this->entityManager->getRepository(Message::class)
                ->findBy(['recipient' => $admin], ['createdAt' => 'DESC']);

            return new JsonResponse(array_map(fn($m) => [
                'id' => $m->getId(),
                'subject' => $m->getSubject(),
                'content' => $m->getContent(),
                'sender' => [
                    'id' => $m->getSender()->getId(),
                    'name' => $m->getSender()->getName(),
                    'email' => $m->getSender()->getEmail(),
                ],
                'isRead' => $m->isRead(),
                'createdAt' => $m->getCreatedAt()?->format('Y-m-d H:i:s'),
            ], $messages));

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Modifier un article (admin only)
     */
    #[Route('/articles/{id}', name: 'admin_update_article', methods: ['PUT'])]
    public function updateArticle(int $id, Request $request): JsonResponse
    {
        try {
            $admin = $this->getAuthenticatedUser($request);
            if (!$admin || !in_array('ROLE_ADMIN', $admin->getRoles())) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $article = $this->entityManager->getRepository(Article::class)->find($id);
            if (!$article) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            if (isset($data['title'])) {
                $article->setTitle($data['title']);
            }
            if (isset($data['content'])) {
                $article->setContent($data['content']);
            }
            if (isset($data['published'])) {
                $article->setPublished($data['published']);
                if ($data['published'] && !$article->getPublishedAt()) {
                    $article->setPublishedAt(new \DateTimeImmutable());
                }
            }

            $article->setUpdatedAt(new \DateTimeImmutable());
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Article updated successfully',
                'article' => [
                    'id' => $article->getId(),
                    'title' => $article->getTitle(),
                    'published' => $article->isPublished(),
                ]
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Supprimer un article (admin only)
     */
    #[Route('/articles/{id}', name: 'admin_delete_article', methods: ['DELETE'])]
    public function deleteArticle(int $id, Request $request): JsonResponse
    {
        try {
            $admin = $this->getAuthenticatedUser($request);
            if (!$admin || !in_array('ROLE_ADMIN', $admin->getRoles())) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $article = $this->entityManager->getRepository(Article::class)->find($id);
            if (!$article) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            $this->entityManager->remove($article);
            $this->entityManager->flush();

            return new JsonResponse(['message' => 'Article deleted successfully']);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Mettre à jour le rôle d'un utilisateur (admin only)
     */
    #[Route('/users/{id}/role', name: 'update_user_role', methods: ['PUT'])]
    public function updateUserRole(int $id, Request $request): JsonResponse
    {
        try {
            $admin = $this->getAuthenticatedUser($request);
            if (!$admin || !$admin->isAdmin()) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $user = $this->entityManager->getRepository(User::class)->find($id);
            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            if (!isset($data['userType']) || !in_array($data['userType'], ['AUTHOR', 'ADMIN'])) {
                return new JsonResponse(['error' => 'Invalid userType'], Response::HTTP_BAD_REQUEST);
            }

            $user->setUserType($data['userType']);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'User role updated',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'name' => $user->getName(),
                    'userType' => $user->getUserType(),
                    'roles' => $user->getRoles(),
                ]
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer l'utilisateur connecté depuis le token JWT
     */
    private function getAuthenticatedUser(Request $request): ?User
    {
        $authHeader = $request->headers->get('Authorization', '');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        $token = substr($authHeader, 7);
        $claims = $this->jwtService->validateToken($token);
        if (!$claims) {
            return null;
        }

        return $this->entityManager->getRepository(User::class)->find($claims['sub']);
    }
}
