<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Category;
use App\Entity\Tag;
use App\Entity\User;
use App\Service\JwtService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/articles')]
class ArticleController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private JwtService $jwtService,
    ) {}

    /**
     * Lister tous les articles publiés (accès public)
     */
    #[Route('', name: 'list_articles', methods: ['GET'])]
    public function list(): JsonResponse
    {
        try {
            $articles = $this->entityManager->getRepository(Article::class)->findBy(
                ['published' => true],
                ['publishedAt' => 'DESC']
            );

            $data = array_map(function (Article $article) {
                return [
                    'id' => $article->getId(),
                    'title' => $article->getTitle(),
                    'slug' => $article->getSlug(),
                    'description' => $article->getDescription(),
                    'content' => substr($article->getContent(), 0, 200) . '...',
                    'author' => [
                        'id' => $article->getAuthor()->getId(),
                        'name' => $article->getAuthor()->getName(),
                        'email' => $article->getAuthor()->getEmail(),
                    ],
                    'category' => $article->getCategory() ? [
                        'id' => $article->getCategory()->getId(),
                        'name' => $article->getCategory()->getName(),
                        'slug' => $article->getCategory()->getSlug(),
                    ] : null,
                    'tags' => array_map(function (Tag $tag) {
                        return [
                            'id' => $tag->getId(),
                            'name' => $tag->getName(),
                            'slug' => $tag->getSlug(),
                        ];
                    }, $article->getTags()->toArray()),
                    'publishedAt' => $article->getPublishedAt()?->format('Y-m-d H:i:s'),
                    'commentsCount' => count($article->getComments()),
                ];
            }, $articles);

            return new JsonResponse($data);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer les articles de l'utilisateur connecté
     */
    #[Route('/my-articles', name: 'my_articles', methods: ['GET'])]
    public function myArticles(Request $request): JsonResponse
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }

            $articles = $this->entityManager->getRepository(Article::class)->findBy(
                ['author' => $user],
                ['createdAt' => 'DESC']
            );

            $data = array_map(function (Article $article) {
                return $this->serializeArticle($article);
            }, $articles);

            return new JsonResponse($data);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer un article par ID
     */
    #[Route('/{id}', name: 'get_article', methods: ['GET'])]
    public function getArticle(int $id): JsonResponse
    {
        try {
            $article = $this->entityManager->getRepository(Article::class)->find($id);

            if (!$article) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            // Si l'article n'est pas publié, retourner 404
            if (!$article->isPublished()) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            $data = $this->serializeArticle($article, true);
            return new JsonResponse($data);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer un article par SLUG
     */
    #[Route('/slug/{slug}', name: 'get_article_by_slug', methods: ['GET'])]
    public function getArticleBySlug(string $slug): JsonResponse
    {
        try {
            $article = $this->entityManager->getRepository(Article::class)->findOneBy(['slug' => $slug]);

            if (!$article) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            // Si l'article n'est pas publié, retourner 404
            if (!$article->isPublished()) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            $data = $this->serializeArticle($article, true);
            return new JsonResponse($data);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Créer un nouvel article (AUTHOR only)
     */
    #[Route('', name: 'create_article', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }

            if (!$user->isAuthor() && !$user->isAdmin()) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $data = json_decode($request->getContent(), true);

            if (!isset($data['title']) || !isset($data['content'])) {
                return new JsonResponse(['error' => 'Title and content are required'], Response::HTTP_BAD_REQUEST);
            }

            $article = new Article();
            $article->setTitle($data['title']);
            $article->setContent($data['content']);
            $article->setSlug($data['slug'] ?? $this->slugify($data['title']));
            $article->setDescription($data['description'] ?? '');
            $article->setAuthor($user);
            $article->setPublished(false);
            
            if (isset($data['categoryId'])) {
                $category = $this->entityManager->getRepository(Category::class)->find($data['categoryId']);
                if ($category) {
                    $article->setCategory($category);
                }
            }

            if (isset($data['tagIds']) && is_array($data['tagIds'])) {
                foreach ($data['tagIds'] as $tagId) {
                    $tag = $this->entityManager->getRepository(Tag::class)->find($tagId);
                    if ($tag) {
                        $article->addTag($tag);
                    }
                }
            }

            $article->setCreatedAt(new \DateTimeImmutable());
            $article->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->persist($article);
            $this->entityManager->flush();

            return new JsonResponse($this->serializeArticle($article), Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Mettre à jour un article (owner or admin only)
     */
    #[Route('/{id}', name: 'update_article', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }

            $article = $this->entityManager->getRepository(Article::class)->find($id);
            if (!$article) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            // Vérifier les permissions
            if ($article->getAuthor()->getId() !== $user->getId() && !$user->isAdmin()) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $data = json_decode($request->getContent(), true);

            if (isset($data['title'])) {
                $article->setTitle($data['title']);
            }
            if (isset($data['content'])) {
                $article->setContent($data['content']);
            }
            if (isset($data['description'])) {
                $article->setDescription($data['description']);
            }
            if (isset($data['categoryId'])) {
                $category = $this->entityManager->getRepository(Category::class)->find($data['categoryId']);
                if ($category) {
                    $article->setCategory($category);
                }
            }

            $article->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->flush();

            return new JsonResponse($this->serializeArticle($article));

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Publier un article (owner or admin only)
     */
    #[Route('/{id}/publish', name: 'publish_article', methods: ['POST'])]
    public function publish(int $id, Request $request): JsonResponse
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }

            $article = $this->entityManager->getRepository(Article::class)->find($id);
            if (!$article) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            // Vérifier les permissions
            if ($article->getAuthor()->getId() !== $user->getId() && !$user->isAdmin()) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            if ($article->isPublished()) {
                return new JsonResponse(['error' => 'Article is already published'], Response::HTTP_BAD_REQUEST);
            }

            $article->setPublished(true);
            $article->setPublishedAt(new \DateTimeImmutable());

            $this->entityManager->flush();

            return new JsonResponse($this->serializeArticle($article));

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Supprimer un article (owner or admin only)
     */
    #[Route('/{id}', name: 'delete_article', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) {
                return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
            }

            $article = $this->entityManager->getRepository(Article::class)->find($id);
            if (!$article) {
                return new JsonResponse(['error' => 'Article not found'], Response::HTTP_NOT_FOUND);
            }

            // Vérifier les permissions (owner ou admin)
            if ($article->getAuthor()->getId() !== $user->getId() && !$user->isAdmin()) {
                return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
            }

            $this->entityManager->remove($article);
            $this->entityManager->flush();

            return new JsonResponse(['message' => 'Article deleted successfully']);

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
     * Sérialiser un article
     */
    private function serializeArticle(Article $article, bool $fullContent = false): array
    {
        return [
            'id' => $article->getId(),
            'title' => $article->getTitle(),
            'slug' => $article->getSlug(),
            'description' => $article->getDescription(),
            'content' => $fullContent ? $article->getContent() : substr($article->getContent(), 0, 200) . '...',
            'author' => [
                'id' => $article->getAuthor()->getId(),
                'name' => $article->getAuthor()->getName(),
                'email' => $article->getAuthor()->getEmail(),
            ],
            'category' => $article->getCategory() ? [
                'id' => $article->getCategory()->getId(),
                'name' => $article->getCategory()->getName(),
                'slug' => $article->getCategory()->getSlug(),
            ] : null,
            'tags' => array_map(function (Tag $tag) {
                return [
                    'id' => $tag->getId(),
                    'name' => $tag->getName(),
                    'slug' => $tag->getSlug(),
                ];
            }, $article->getTags()->toArray()),
            'published' => $article->isPublished(),
            'createdAt' => $article->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updatedAt' => $article->getUpdatedAt()?->format('Y-m-d H:i:s'),
            'publishedAt' => $article->getPublishedAt()?->format('Y-m-d H:i:s'),
            'commentsCount' => count($article->getComments()),
        ];
    }

    /**
     * Simple slugifier
     */
    private function slugify(string $text): string
    {
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        $text = preg_replace('~[^-\w]+~', '', $text);
        $text = trim($text, '-');
        $text = preg_replace('~-+~', '-', $text);
        $text = strtolower($text);
        return empty($text) ? 'n-a' : $text;
    }
}
