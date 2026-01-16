<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Add bio, avatar, and updatedAt columns to user table
 */
final class Version20260113185942 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add bio, avatar, and updatedAt columns to user table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE "user" ADD COLUMN bio TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD COLUMN avatar VARCHAR(500) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD COLUMN updated_at TIMESTAMP DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE "user" DROP COLUMN bio');
        $this->addSql('ALTER TABLE "user" DROP COLUMN avatar');
        $this->addSql('ALTER TABLE "user" DROP COLUMN updated_at');
    }
}
