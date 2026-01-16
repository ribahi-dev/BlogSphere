<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Add slug column to article table
 */
final class Version20260113183712 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add slug column to article table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article ADD COLUMN slug VARCHAR(255) UNIQUE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE article DROP COLUMN slug');
    }
}
