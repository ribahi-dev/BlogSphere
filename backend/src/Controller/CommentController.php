<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Comment;
use App\Entity\User;
use App\Service\JwtService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/comments')]
class CommentController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private JwtService $jwtService,
    ) {}

    /**
     * Lister les commentaires d'un article
     */
    #[Route('/article/{articleId}', name: 'list_comments', methods: ['GET'])]
    public function listByArticle(int $articleId): JsonResponse
    {
        try {
            $article = $this->entityManager->getRepository(Article::class)->find($articleId);
            if (!$article) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            $comments = $this->entityManager->getRepository(Comment::class)->findBy(
                ['article' => $article],
                ['createdAt' => 'DESC']
            );

            $data = array_map(function (Comment $comment) {
                return $this->serializeComment($comment);
            }, $comments);

            return new JsonResponse($data);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Créer un commentaire (admin only - admin peut commenter les articles des auteurs)
     */
    #[Route('', name: 'create_comment', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }

            // Seul l'admin peut créer des commentaires
            if (!$user->isAdmin()) {
                return new JsonResponse(['error' => 'Only admin can create comments'], Response::HTTP_FORBIDDEN);
            }

            $data = json_decode($request->getContent(), true);

            if (!isset($data['content']) || !isset($data['articleId'])) {
                return new JsonResponse(['error' => 'Content and articleId are required'], Response::HTTP_BAD_REQUEST);
            }

            $article = $this->entityManager->getRepository(Article::class)->find($data['articleId']);
            if (!$article || !$article->isPublished()) {
                return new JsonResponse(['error' => 'Article not found or not published'], Response::HTTP_NOT_FOUND);
            }

            $comment = new Comment();
            $comment->setContent($data['content']);
            $comment->setArticle($article);
            $comment->setAuthor($user);

            $this->entityManager->persist($comment);
            $this->entityManager->flush();

            return new JsonResponse($this->serializeComment($comment), Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Mettre à jour un commentaire (owner or admin only)
     */
    #[Route('/{id}', name: 'update_comment', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }

            $comment = $this->entityManager->getRepository(Comment::class)->find($id);
            if (!$comment) {
                return new JsonResponse(['error' => 'Comment not found'], Response::HTTP_NOT_FOUND);
            }

            // Vérifier les permissions
            if ($comment->getAuthor()->getId() !== $user->getId() && !$user->isAdmin()) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $data = json_decode($request->getContent(), true);

            if (isset($data['content'])) {
                $comment->setContent($data['content']);
                $comment->setUpdatedAt(new \DateTimeImmutable());
                $this->entityManager->flush();
            }

            return new JsonResponse($this->serializeComment($comment));

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Supprimer un commentaire (owner, article author or admin only)
     */
    #[Route('/{id}', name: 'delete_comment', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }

            $comment = $this->entityManager->getRepository(Comment::class)->find($id);
            if (!$comment) {
                return new JsonResponse(['error' => 'Comment not found'], Response::HTTP_NOT_FOUND);
            }

            // Vérifier les permissions (comment owner, article author, or admin)
            $isCommentOwner = $comment->getAuthor()->getId() === $user->getId();
            $isArticleAuthor = $comment->getArticle()->getAuthor()->getId() === $user->getId();
            $isAdmin = $user->isAdmin();

            if (!$isCommentOwner && !$isArticleAuthor && !$isAdmin) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $this->entityManager->remove($comment);
            $this->entityManager->flush();

            return new JsonResponse(['message' => 'Comment deleted successfully']);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer l'utilisateur connecté depuis le token JWT
     */
    private function getAuthenticatedUser(Request $request): ?User
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader) {
            return null;
        }

        $token = JwtService::extractTokenFromHeader($authHeader);
        if (!$token) {
            return null;
        }

        $claims = $this->jwtService->validateToken($token);
        if (!$claims) {
            return null;
        }

        return $this->entityManager->getRepository(User::class)->find($claims['sub']);
    }

    /**
     * Sérialiser un commentaire
     */
    private function serializeComment(Comment $comment): array
    {
        return [
            'id' => $comment->getId(),
            'content' => $comment->getContent(),
            'author' => [
                'id' => $comment->getAuthor()->getId(),
                'name' => $comment->getAuthor()->getName(),
                'email' => $comment->getAuthor()->getEmail(),
            ],
            'articleId' => $comment->getArticle()->getId(),
            'createdAt' => $comment->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updatedAt' => $comment->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}
