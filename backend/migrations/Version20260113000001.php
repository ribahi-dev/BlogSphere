<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260113000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create complete database schema with all tables and relationships';
    }

    public function up(Schema $schema): void
    {
        // User table
        if (!$schema->hasTable('user')) {
            $table = $schema->createTable('user');
            $table->addColumn('id', 'integer', ['autoincrement' => true]);
            $table->addColumn('email', 'string', ['length' => 180, 'unique' => true]);
            $table->addColumn('password', 'string', ['notnull' => false]);
            $table->addColumn('name', 'string', ['length' => 255, 'notnull' => false]);
            $table->addColumn('bio', 'text', ['notnull' => false]);
            $table->addColumn('avatar', 'string', ['length' => 500, 'notnull' => false]);
            $table->addColumn('user_type', 'string', ['length' => 20, 'default' => 'AUTHOR']);
            $table->addColumn('roles', 'json', ['default' => '[]']);
            $table->addColumn('google_id', 'string', ['length' => 255, 'notnull' => false]);
            $table->addColumn('created_at', 'datetime_immutable', ['notnull' => false]);
            $table->addColumn('updated_at', 'datetime_immutable', ['notnull' => false]);
            $table->setPrimaryKey(['id']);
        }

        // Category table
        if (!$schema->hasTable('category')) {
            $table = $schema->createTable('category');
            $table->addColumn('id', 'integer', ['autoincrement' => true]);
            $table->addColumn('name', 'string', ['length' => 255]);
            $table->addColumn('slug', 'string', ['length' => 255, 'unique' => true]);
            $table->addColumn('created_at', 'datetime_immutable', ['notnull' => false]);
            $table->setPrimaryKey(['id']);
        }

        // Tag table
        if (!$schema->hasTable('tag')) {
            $table = $schema->createTable('tag');
            $table->addColumn('id', 'integer', ['autoincrement' => true]);
            $table->addColumn('name', 'string', ['length' => 255]);
            $table->addColumn('slug', 'string', ['length' => 255, 'unique' => true]);
            $table->addColumn('created_at', 'datetime_immutable', ['notnull' => false]);
            $table->setPrimaryKey(['id']);
        }

        // Article table
        if (!$schema->hasTable('article')) {
            $table = $schema->createTable('article');
            $table->addColumn('id', 'integer', ['autoincrement' => true]);
            $table->addColumn('title', 'string', ['length' => 255]);
            $table->addColumn('content', 'text');
            $table->addColumn('slug', 'string', ['length' => 255, 'unique' => true]);
            $table->addColumn('description', 'string', ['length' => 255, 'notnull' => false]);
            $table->addColumn('author_id', 'integer');
            $table->addColumn('category_id', 'integer', ['notnull' => false]);
            $table->addColumn('published', 'boolean', ['default' => false]);
            $table->addColumn('created_at', 'datetime_immutable');
            $table->addColumn('updated_at', 'datetime_immutable', ['notnull' => false]);
            $table->addColumn('published_at', 'datetime_immutable', ['notnull' => false]);
            $table->setPrimaryKey(['id']);
            $table->addForeignKeyConstraint('user', ['author_id'], ['id']);
            $table->addForeignKeyConstraint('category', ['category_id'], ['id'], [], 'FK_ARTICLE_CATEGORY');
        }

        // Article Tag junction table
        if (!$schema->hasTable('article_tag')) {
            $table = $schema->createTable('article_tag');
            $table->addColumn('article_id', 'integer');
            $table->addColumn('tag_id', 'integer');
            $table->setPrimaryKey(['article_id', 'tag_id']);
            $table->addForeignKeyConstraint('article', ['article_id'], ['id']);
            $table->addForeignKeyConstraint('tag', ['tag_id'], ['id']);
        }

        // Comment table
        if (!$schema->hasTable('comment')) {
            $table = $schema->createTable('comment');
            $table->addColumn('id', 'integer', ['autoincrement' => true]);
            $table->addColumn('content', 'text');
            $table->addColumn('author_id', 'integer');
            $table->addColumn('article_id', 'integer');
            $table->addColumn('created_at', 'datetime_immutable');
            $table->addColumn('updated_at', 'datetime_immutable', ['notnull' => false]);
            $table->setPrimaryKey(['id']);
            $table->addForeignKeyConstraint('user', ['author_id'], ['id']);
            $table->addForeignKeyConstraint('article', ['article_id'], ['id']);
        }

        // Message table (for admin messaging)
        if (!$schema->hasTable('message')) {
            $table = $schema->createTable('message');
            $table->addColumn('id', 'integer', ['autoincrement' => true]);
            $table->addColumn('sender_id', 'integer');
            $table->addColumn('recipient_id', 'integer');
            $table->addColumn('subject', 'string', ['length' => 255]);
            $table->addColumn('content', 'text');
            $table->addColumn('is_read', 'boolean', ['default' => false]);
            $table->addColumn('created_at', 'datetime_immutable');
            $table->setPrimaryKey(['id']);
            $table->addForeignKeyConstraint('user', ['sender_id'], ['id']);
            $table->addForeignKeyConstraint('user', ['recipient_id'], ['id']);
        }

        // OAuth Token table
        if (!$schema->hasTable('o_auth_token')) {
            $table = $schema->createTable('o_auth_token');
            $table->addColumn('id', 'integer', ['autoincrement' => true]);
            $table->addColumn('user_id', 'integer');
            $table->addColumn('provider', 'string', ['length' => 50]);
            $table->addColumn('access_token', 'text');
            $table->addColumn('refresh_token', 'text', ['notnull' => false]);
            $table->addColumn('expires_at', 'datetime_immutable', ['notnull' => false]);
            $table->addColumn('created_at', 'datetime_immutable');
            $table->setPrimaryKey(['id']);
            $table->addForeignKeyConstraint('user', ['user_id'], ['id']);
        }
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('o_auth_token');
        $schema->dropTable('message');
        $schema->dropTable('comment');
        $schema->dropTable('article_tag');
        $schema->dropTable('article');
        $schema->dropTable('tag');
        $schema->dropTable('category');
        $schema->dropTable('user');
    }
}
