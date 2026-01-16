<?php

namespace App\Controller;

use App\Entity\Tag;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/tags')]
class TagController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    #[Route('', name: 'list_tags', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $tags = $this->entityManager->getRepository(Tag::class)->findAll();

        $data = array_map(function (Tag $tag) {
            return [
                'id' => $tag->getId(),
                'name' => $tag->getName(),
                'slug' => $tag->getSlug(),
            ];
        }, $tags);

        return new JsonResponse($data);
    }
}
