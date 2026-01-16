<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Add category_id column to article table
 */
final class Version20260113183905 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add category_id column to article table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article ADD COLUMN category_id INTEGER DEFAULT NULL');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E66BCF5E72D FOREIGN KEY (category_id) REFERENCES category (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article DROP CONSTRAINT FK_23A0E66BCF5E72D');
        $this->addSql('ALTER TABLE article DROP COLUMN category_id');
    }
}
