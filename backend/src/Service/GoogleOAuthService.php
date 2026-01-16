<?php

namespace App\Service;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GoogleOAuthService
{
    private string $clientId;
    private string $clientSecret;
    private string $redirectUri;
    private HttpClientInterface $httpClient;

    public function __construct(
        string $googleClientId,
        string $googleClientSecret,
        string $googleRedirectUri
    ) {
        $this->clientId = $googleClientId;
        $this->clientSecret = $googleClientSecret;
        $this->redirectUri = $googleRedirectUri;
        $this->httpClient = HttpClient::create();
    }

    /**
     * Échanger le code d'autorisation pour un token Google
     */
    public function exchangeCodeForTokens(string $code): array
    {
        $response = $this->httpClient->request('POST', 'https://oauth2.googleapis.com/token', [
            'body' => [
                'code' => $code,
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'redirect_uri' => $this->redirectUri,
                'grant_type' => 'authorization_code',
            ],
        ]);

        if ($response->getStatusCode() !== 200) {
            throw new \Exception('Failed to exchange code for tokens: ' . $response->getContent());
        }

        return $response->toArray();
    }

    /**
     * Obtenir les infos de l'utilisateur depuis Google
     */
    public function getUserInfo(string $accessToken): array
    {
        $response = $this->httpClient->request('GET', 'https://openidconnect.googleapis.com/v1/userinfo', [
            'headers' => ['Authorization' => "Bearer $accessToken"],
        ]);

        if ($response->getStatusCode() !== 200) {
            throw new \Exception('Failed to get user info from Google');
        }

        return $response->toArray();
    }
}
