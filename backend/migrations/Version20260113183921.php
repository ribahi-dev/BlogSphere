<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Create tag table and article_tag junction table
 */
final class Version20260113183921 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create tag table and article_tag junction table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE tag (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            slug VARCHAR(255) NOT NULL UNIQUE
        )');

        $this->addSql('CREATE TABLE article_tag (
            article_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            PRIMARY KEY (article_id, tag_id),
            CONSTRAINT FK_919694F7294869C FOREIGN KEY (article_id) REFERENCES article (id) ON DELETE CASCADE,
            CONSTRAINT FK_919694FBAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE
        )');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE article_tag');
        $this->addSql('DROP TABLE tag');
    }
}
