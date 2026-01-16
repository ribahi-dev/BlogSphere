#!/usr/bin/env pwsh

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Configuration Automatique PostgreSQL + Base de Donnees" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PSQL_PATH = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$PG_CTL_PATH = "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe"
$PG_DATA = "C:\Program Files\PostgreSQL\18\data"
$PG_HBA = "$PG_DATA\pg_hba.conf"
$SERVICE_NAME = "postgresql-x64-18"
$DB_PASSWORD = "2005"
$DB_NAME = "app_db"
$DB_USER = "postgres"
$DB_HOST = "127.0.0.1"
$DB_PORT = 5432

# Vérifier les fichiers
Write-Host "[1/8] Verification des fichiers PostgreSQL..." -ForegroundColor Yellow
if (-not (Test-Path $PSQL_PATH)) {
    Write-Host "[ERREUR] psql.exe non trouve!" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $PG_HBA)) {
    Write-Host "[ERREUR] pg_hba.conf non trouve!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Tous les fichiers trouves" -ForegroundColor Green

# Etape 1: Arrêter PostgreSQL
Write-Host ""
Write-Host "[2/8] Arret du service PostgreSQL..." -ForegroundColor Yellow
net stop $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 2
Write-Host "[OK] PostgreSQL arrete" -ForegroundColor Green

# Etape 2: Sauvegarde
Write-Host ""
Write-Host "[3/8] Sauvegarde de pg_hba.conf..." -ForegroundColor Yellow
Copy-Item $PG_HBA "$PG_HBA.backup" -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Fichier sauvegarde" -ForegroundColor Green

# Etape 3: Modifier pg_hba.conf
Write-Host ""
Write-Host "[4/8] Modification de pg_hba.conf en mode trust..." -ForegroundColor Yellow
$content = Get-Content $PG_HBA
$content = $content -replace 'md5', 'trust'
$content = $content -replace 'scram-sha-256', 'trust'
$content | Set-Content $PG_HBA
Write-Host "[OK] pg_hba.conf modifie" -ForegroundColor Green

# Etape 4: Démarrer PostgreSQL
Write-Host ""
Write-Host "[5/8] Demarrage de PostgreSQL..." -ForegroundColor Yellow
net start $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 3
Write-Host "[OK] PostgreSQL demarrage" -ForegroundColor Green

# Etape 5: Créer la commande SQL et exécuter
Write-Host ""
Write-Host "[6/8] Configuration du mot de passe et base de donnees..." -ForegroundColor Yellow

$sqlFile = "$env:TEMP\postgres_setup.sql"
$sqlContent = @"
ALTER USER $DB_USER PASSWORD '$DB_PASSWORD';
CREATE DATABASE $DB_NAME OWNER $DB_USER;
"@
$sqlContent | Set-Content $sqlFile

$env:PGPASSWORD = ""
& $PSQL_PATH -U $DB_USER -h $DB_HOST -d postgres -f $sqlFile 2>&1 | Out-Null

if (Test-Path $sqlFile) {
    Remove-Item $sqlFile -Force
}

Write-Host "[OK] Configuration executee" -ForegroundColor Green

# Etape 6: Restaurer pg_hba.conf
Write-Host ""
Write-Host "[7/8] Restauration de pg_hba.conf en mode securise (md5)..." -ForegroundColor Yellow
$content = Get-Content $PG_HBA
$content = $content -replace 'trust', 'md5'
$content | Set-Content $PG_HBA
Write-Host "[OK] pg_hba.conf restaure" -ForegroundColor Green

# Etape 7: Redémarrer PostgreSQL
Write-Host ""
Write-Host "[8/8] Redemarrage final de PostgreSQL..." -ForegroundColor Yellow
net stop $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 1
net start $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 2
Write-Host "[OK] PostgreSQL redemarrage" -ForegroundColor Green

# Résultats
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Configuration PostgreSQL Terminee avec Succes!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Parametres de connexion:" -ForegroundColor Cyan
Write-Host "  Host: $DB_HOST" -ForegroundColor White
Write-Host "  Port: $DB_PORT" -ForegroundColor White
Write-Host "  Database: $DB_NAME" -ForegroundColor White
Write-Host "  User: $DB_USER" -ForegroundColor White
Write-Host "  Password: $DB_PASSWORD" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Prochaines Etapes:" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ouvrir un terminal et aller au dossier backend:" -ForegroundColor Yellow
Write-Host "   cd 'c:\Users\elmeh\Desktop\projet php\backend'" -ForegroundColor White
Write-Host ""
Write-Host "2. Installer les dependances:" -ForegroundColor Yellow
Write-Host "   composer install" -ForegroundColor White
Write-Host ""
Write-Host "3. Executer les migrations:" -ForegroundColor Yellow
Write-Host "   php bin/console doctrine:migrations:migrate" -ForegroundColor White
Write-Host ""
Write-Host "4. Demarrer le serveur:" -ForegroundColor Yellow
Write-Host "   php -S 127.0.0.1:8001" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
