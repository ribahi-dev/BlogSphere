# Script PowerShell pour configurer PostgreSQL automatiquement
# Exécuter en Admin

Write-Host "==========================================" -ForegroundColor Green
Write-Host "Configuration PostgreSQL Automatique" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

$PSQL_PATH = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$PG_CTL_PATH = "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe"
$PG_DATA = "C:\Program Files\PostgreSQL\18\data"
$SERVICE_NAME = "postgresql-x64-18"

# Vérifier les droits admin
$isAdmin = [Security.Principal.WindowsIdentity]::GetCurrent().Groups -contains [Security.Principal.SecurityIdentifier]::new("S-1-5-32-544")
if (-not $isAdmin) {
    Write-Host "[ERREUR] Ce script doit être exécuté en tant qu'Administrateur!" -ForegroundColor Red
    exit 1
}

Write-Host "[1/5] Arrêt du service PostgreSQL..." -ForegroundColor Yellow
net stop $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 2

Write-Host "[2/5] Modification de pg_hba.conf pour mode trust..." -ForegroundColor Yellow
$PG_HBA_PATH = "$PG_DATA\pg_hba.conf"

if (Test-Path $PG_HBA_PATH) {
    $content = Get-Content $PG_HBA_PATH
    $content = $content -replace 'md5', 'trust'
    $content = $content -replace 'scram-sha-256', 'trust'
    $content | Set-Content $PG_HBA_PATH
    Write-Host "[OK] pg_hba.conf modifié" -ForegroundColor Green
} else {
    Write-Host "[ERREUR] pg_hba.conf non trouvé" -ForegroundColor Red
    exit 1
}

Write-Host "[3/5] Démarrage de PostgreSQL..." -ForegroundColor Yellow
net start $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 3

Write-Host "[4/5] Modification du mot de passe PostgreSQL..." -ForegroundColor Yellow

# Créer une commande SQL pour modifier le mot de passe
$sqlCommand = "ALTER USER postgres PASSWORD '2005';"

# Exécuter la commande SQL
$sqlCommand | & $PSQL_PATH -U postgres -h 127.0.0.1 -d postgres 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Mot de passe modifié en '2005'" -ForegroundColor Green
} else {
    Write-Host "[ERREUR] Impossible de modifier le mot de passe" -ForegroundColor Red
}

Write-Host "[5/5] Restauration de l'authentification md5..." -ForegroundColor Yellow

# Restaurer md5
if (Test-Path $PG_HBA_PATH) {
    $content = Get-Content $PG_HBA_PATH
    $content = $content -replace 'trust', 'md5'
    $content | Set-Content $PG_HBA_PATH
    Write-Host "[OK] pg_hba.conf restauré" -ForegroundColor Green
}

# Redémarrer PostgreSQL
net stop $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 1
net start $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "[OK] PostgreSQL configuré avec succès!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Mot de passe: 2005" -ForegroundColor Cyan
Write-Host "User: postgres" -ForegroundColor Cyan
Write-Host "Host: 127.0.0.1" -ForegroundColor Cyan
Write-Host "Port: 5432" -ForegroundColor Cyan
Write-Host ""

# Créer la base de données
Write-Host "Création de la base de données 'app_db'..." -ForegroundColor Yellow

$createDbSql = "CREATE DATABASE app_db OWNER postgres;"
$env:PGPASSWORD = "2005"
$createDbSql | & $PSQL_PATH -U postgres -h 127.0.0.1 -d postgres 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Base de données 'app_db' créée!" -ForegroundColor Green
} else {
    Write-Host "[INFO] La base de données existe probablement déjà" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Configuration Terminée!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. cd C:\Users\elmeh\Desktop\projet php\backend" -ForegroundColor White
Write-Host "2. composer install" -ForegroundColor White
Write-Host "3. php bin/console doctrine:migrations:migrate" -ForegroundColor White
Write-Host ""
