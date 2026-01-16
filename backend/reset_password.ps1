#!/usr/bin/env pwsh

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Reinitialisation Mot de Passe PostgreSQL" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PSQL_PATH = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$PG_CTL_PATH = "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe"
$PG_DATA = "C:\Program Files\PostgreSQL\18\data"
$PG_HBA = "$PG_DATA\pg_hba.conf"
$SERVICE_NAME = "postgresql-x64-18"
$DB_PASSWORD = "2005"
$DB_USER = "postgres"

Write-Host "[1/6] Arrêt du service PostgreSQL..." -ForegroundColor Yellow
net stop $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 2
Write-Host "[OK] Arrêté" -ForegroundColor Green

Write-Host ""
Write-Host "[2/6] Sauvegarde de pg_hba.conf..." -ForegroundColor Yellow
Copy-Item $PG_HBA "$PG_HBA.backup" -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Sauvegardé" -ForegroundColor Green

Write-Host ""
Write-Host "[3/6] Modification de pg_hba.conf en mode trust..." -ForegroundColor Yellow
$content = Get-Content $PG_HBA
$content = $content -replace 'md5', 'trust'
$content = $content -replace 'scram-sha-256', 'trust'
$content | Set-Content $PG_HBA
Write-Host "[OK] Modifié" -ForegroundColor Green

Write-Host ""
Write-Host "[4/6] Démarrage de PostgreSQL..." -ForegroundColor Yellow
net start $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 3
Write-Host "[OK] Démarré" -ForegroundColor Green

Write-Host ""
Write-Host "[5/6] Réinitialisation du mot de passe..." -ForegroundColor Yellow

# Créer une commande SQL
$sqlFile = "$env:TEMP\reset_password.sql"
$sqlContent = @"
ALTER USER $DB_USER PASSWORD '$DB_PASSWORD';
SELECT 'Mot de passe reinitialise';
"@
$sqlContent | Set-Content $sqlFile

$env:PGPASSWORD = ""
& $PSQL_PATH -U $DB_USER -h 127.0.0.1 -d postgres -f $sqlFile 2>&1 | Out-Null

if (Test-Path $sqlFile) {
    Remove-Item $sqlFile -Force
}

Write-Host "[OK] Mot de passe réinitialisé à: $DB_PASSWORD" -ForegroundColor Green

Write-Host ""
Write-Host "[6/6] Restauration de pg_hba.conf en mode sécurisé..." -ForegroundColor Yellow
$content = Get-Content $PG_HBA
$content = $content -replace 'trust', 'md5'
$content | Set-Content $PG_HBA
Write-Host "[OK] Restauré" -ForegroundColor Green

# Redémarrer
Write-Host ""
Write-Host "Redémarrage de PostgreSQL..." -ForegroundColor Yellow
net stop $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 1
net start $SERVICE_NAME 2>&1 | Out-Null
Start-Sleep -Seconds 2
Write-Host "[OK] Redémarré" -ForegroundColor Green

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Mot de Passe Réinitialisé!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Mot de passe: $DB_PASSWORD" -ForegroundColor Cyan
Write-Host "User: $DB_USER" -ForegroundColor Cyan
Write-Host ""
