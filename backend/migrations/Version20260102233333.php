<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260102233333 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE "user" (id SERIAL PRIMARY KEY, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP NOT NULL, google_id VARCHAR(255) DEFAULT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('CREATE TABLE oauth_token (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, provider VARCHAR(50) NOT NULL, access_token TEXT NOT NULL, refresh_token TEXT DEFAULT NULL, expires_at TIMESTAMP NOT NULL, CONSTRAINT FK_D4E2C5A5A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id))');
        $this->addSql('CREATE INDEX IDX_D4E2C5A5A76ED395 ON oauth_token (user_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE oauth_token');
        $this->addSql('DROP TABLE "user"');
    }
}
