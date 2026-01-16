#!/bin/bash

echo "=========================================="
echo "Création Base de Données - Symfony/PostgreSQL"
echo "=========================================="
echo ""

# Configuration
DB_HOST="127.0.0.1"
DB_PORT="${1:-5432}"  # Paramètre 1, défaut 5432
DB_NAME="app_db"
DB_USER="postgres"
DB_PASSWORD="postgres"

echo "Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Test de connexion
echo "Test de connexion à PostgreSQL..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc "SELECT 1" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Erreur: Impossible de se connecter à PostgreSQL"
    echo "   Vérifiez que:"
    echo "   - PostgreSQL est en cours d'exécution"
    echo "   - L'hôte est correct: $DB_HOST"
    echo "   - Le port est correct: $DB_PORT"
    echo "   - Le mot de passe est correct"
    exit 1
fi

echo "✓ Connexion réussie"
echo ""

# Créer la base de données
echo "Création de la base de données '$DB_NAME'..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Base de données créée avec succès!"
else
    # Vérifier si elle existe déjà
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "⚠ La base de données '$DB_NAME' existe déjà"
    else
        echo "❌ Erreur lors de la création de la base de données"
        exit 1
    fi
fi

echo ""
echo "=========================================="
echo "✓ Base de données configurée!"
echo "=========================================="
echo ""
echo "Prochaines étapes:"
echo "  1. cd backend"
echo "  2. composer install"
echo "  3. php bin/console doctrine:database:create"
echo "  4. php bin/console doctrine:migrations:migrate"
echo ""
