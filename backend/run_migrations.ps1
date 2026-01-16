#!/usr/bin/env pwsh

Write-Host "Redemarrage PostgreSQL et execution des migrations..." -ForegroundColor Yellow
Write-Host ""

# Redémarrer PostgreSQL
Write-Host "Redemarrage de PostgreSQL..." -ForegroundColor Yellow
$process = Start-Process -FilePath "powershell" -ArgumentList "net stop postgresql-x64-18; Start-Sleep -Seconds 2; net start postgresql-x64-18" -Verb RunAs -PassThru -Wait

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "PostgreSQL redemarrage" -ForegroundColor Green
Write-Host ""

# Aller au dossier backend
cd "C:\Users\elmeh\Desktop\projet php\backend"

# Essayer les migrations
Write-Host "Execution des migrations..." -ForegroundColor Yellow
Write-Host ""

php bin/console doctrine:migrations:status

Write-Host ""
Write-Host "Execution de la migration..." -ForegroundColor Yellow

php bin/console doctrine:migrations:migrate --no-interaction

Write-Host ""
Write-Host "Migration terminee!" -ForegroundColor Green
