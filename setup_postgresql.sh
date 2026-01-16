#!/bin/bash

echo "=========================================="
echo "Configuration PostgreSQL - Script Bash"
echo "=========================================="
echo ""

# Vérifier PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé ou non trouvé dans le PATH"
    echo "   Installez PostgreSQL: https://www.postgresql.org/download/"
    exit 1
fi

echo "✓ PostgreSQL trouvé"
psql --version
echo ""

# Demander le mot de passe
echo "Entrez votre mot de passe PostgreSQL (utilisateur postgres):"
read -s POSTGRES_PASSWORD

# Créer la base de données
echo ""
echo "Création de la base de données..."
PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -h localhost -c "CREATE DATABASE app_db OWNER postgres;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Base de données créée"
elif PGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -h localhost -d app_db -c "SELECT 1;" &>/dev/null; then
    echo "⚠ La base de données app_db existe déjà"
else
    echo "❌ Erreur lors de la création de la base de données"
    exit 1
fi

echo ""
echo "=========================================="
echo "✓ Configuration PostgreSQL terminée!"
echo "=========================================="
echo ""
echo "Informations de connexion:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: app_db"
echo "  User: postgres"
echo ""
echo "Prochaines étapes:"
echo "  1. cd backend"
echo "  2. composer install"
echo "  3. php bin/console doctrine:migrations:migrate"
echo ""
