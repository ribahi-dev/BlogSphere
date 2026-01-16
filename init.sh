#!/bin/bash

# Simple initialization script
cd "/c/Users/elmeh/Desktop/projet php/backend"

echo "Running migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "Clearing cache..."
php bin/console cache:clear

echo "Creating test users..."
php bin/console doctrine:query:sql "
INSERT INTO \"user\" (email, password, name, user_type, roles, created_at) 
VALUES 
  ('author1@test.com', '\$2y\$10\$JN8q7bXWVYCMmqSfMfXwGuNVFvPxO2C7.ZlWQhjCljWrUfMVlBj9K', 'Author One', 'AUTHOR', '[\"ROLE_AUTHOR\"]', NOW()),
  ('author2@test.com', '\$2y\$10\$JN8q7bXWVYCMmqSfMfXwGuNVFvPxO2C7.ZlWQhjCljWrUfMVlBj9K', 'Author Two', 'AUTHOR', '[\"ROLE_AUTHOR\"]', NOW()),
  ('admin@test.com', '\$2y\$10\$JN8q7bXWVYCMmqSfMfXwGuNVFvPxO2C7.ZlWQhjCljWrUfMVlBj9K', 'Admin User', 'ADMIN', '[\"ROLE_ADMIN\"]', NOW())
" 2>&1 | grep -E "executed|success|error" || echo "Users created or already exist"

echo "Done!"
