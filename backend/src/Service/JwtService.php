<?php

namespace App\Service;

use App\Entity\User;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Token\Plain;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\ValidAt;
use DateTimeImmutable;

class JwtService
{
    private string $jwtSecret;
    private int $jwtExpiration;
    private Configuration $config;

    public function __construct(string $jwtSecret, string $jwtExpiration = '7')
    {
        $this->jwtSecret = $jwtSecret;
        $this->jwtExpiration = (int)$jwtExpiration;

        $this->config = Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::plainText($jwtSecret)
        );
    }

    /**
     * Générer un token JWT pour un utilisateur
     */
    public function generateToken(User $user): string
    {
        $now = new DateTimeImmutable();
        $expiresAt = $now->modify("+{$this->jwtExpiration} days");

        $token = $this->config->builder()
            ->issuedAt($now)
            ->expiresAt($expiresAt)
            ->relatedTo((string) $user->getId())
            ->withClaim('email', $user->getEmail())
            ->withClaim('name', $user->getName())
            ->withClaim('roles', $user->getRoles())
            ->getToken($this->config->signer(), $this->config->signingKey());

        return $token->toString();
    }

    /**
     * Valider et déchiffrer un token JWT
     */
    public function validateToken(string $tokenString): ?array
    {
        try {
            $token = $this->config->parser()->parse($tokenString);

            if (!$token instanceof Plain) {
                return null;
            }

            $clock = new SystemClock(new \DateTimeZone(date_default_timezone_get()));
            $constraints = [
                new SignedWith($this->config->signer(), $this->config->signingKey()),
                new ValidAt($clock),
            ];

            if (!$this->config->validator()->validate($token, ...$constraints)) {
                return null;
            }

            $claims = $token->claims();
            return [
                'sub' => $claims->get('sub'),
                'email' => $claims->get('email'),
                'name' => $claims->get('name'),
                'roles' => $claims->get('roles'),
            ];
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Decode token without validating signature/claims (debugging only)
     */
    // Debug methods removed for finalization.

    /**
     * Extraire le token du header Authorization
     */
    public static function extractTokenFromHeader(string $authHeader): ?string
    {
        if (preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
