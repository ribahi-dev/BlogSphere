<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Adding Articles, Comments and User Roles
 */
final class Version20260111120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add Article, Comment entities and user_type column to User';
    }

    public function up(Schema $schema): void
    {
        // Add user_type column to user table
        $this->addSql('ALTER TABLE "user" ADD COLUMN user_type VARCHAR(20) DEFAULT \'AUTHOR\' NOT NULL');

        // Create article table
        $this->addSql('CREATE TABLE article (
            id SERIAL PRIMARY KEY,
            author_id INTEGER NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            description VARCHAR(255) DEFAULT NULL,
            published BOOLEAN DEFAULT false NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT NULL,
            published_at TIMESTAMP DEFAULT NULL,
            CONSTRAINT FK_23A0E66F675F31B FOREIGN KEY (author_id) REFERENCES "user" (id)
        )');
        $this->addSql('CREATE INDEX IDX_23A0E66F675F31B ON article (author_id)');

        // Create comment table
        $this->addSql('CREATE TABLE comment (
            id SERIAL PRIMARY KEY,
            article_id INTEGER NOT NULL,
            author_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT NULL,
            CONSTRAINT FK_9474526C7294869C FOREIGN KEY (article_id) REFERENCES article (id),
            CONSTRAINT FK_9474526CF675F31B FOREIGN KEY (author_id) REFERENCES "user" (id)
        )');
        $this->addSql('CREATE INDEX IDX_9474526C7294869C ON comment (article_id)');
        $this->addSql('CREATE INDEX IDX_9474526CF675F31B ON comment (author_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE comment');
        $this->addSql('DROP TABLE article');
        $this->addSql('ALTER TABLE "user" DROP COLUMN user_type');
    }
}
