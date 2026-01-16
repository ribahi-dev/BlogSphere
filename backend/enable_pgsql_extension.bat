@echo off
REM Script pour activer l'extension PostgreSQL dans PHP

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo Activation Extension PostgreSQL pour PHP
echo ============================================================
echo.

set PHP_INI=C:\xampp\php\php.ini
set BACKUP_INI=%PHP_INI%.backup

if not exist "!PHP_INI!" (
    echo [ERREUR] php.ini non trouve a: !PHP_INI!
    pause
    exit /b 1
)

echo [1/3] Sauvegarde de php.ini...
copy "!PHP_INI!" "!BACKUP_INI!" >nul 2>&1
echo [OK] Sauvegarde effectuee

echo [2/3] Activation de l extension PostgreSQL...

REM Créer un script PowerShell pour modifier php.ini
powershell -NoProfile -Command "
    $file = '!PHP_INI!'
    $content = Get-Content $file
    
    # Chercher et activer extension=pgsql
    if ($content -match ';extension=pgsql') {
        Write-Host '[OK] Activation de extension=pgsql'
        $content = $content -replace '^;extension=pgsql', 'extension=pgsql'
    }
    
    # Chercher et activer extension=pdo_pgsql
    if ($content -match ';extension=pdo_pgsql') {
        Write-Host '[OK] Activation de extension=pdo_pgsql'
        $content = $content -replace '^;extension=pdo_pgsql', 'extension=pdo_pgsql'
    }
    
    # Si pas trouve, ajouter manuellement
    if (-not ($content -match 'extension=pgsql')) {
        Write-Host '[INFO] Ajout de extension=pgsql'
        $content += \"`nextension=pgsql`n\"
    }
    
    if (-not ($content -match 'extension=pdo_pgsql')) {
        Write-Host '[INFO] Ajout de extension=pdo_pgsql'
        $content += \"`nextension=pdo_pgsql`n\"
    }
    
    $content | Set-Content $file
" >nul 2>&1

echo [3/3] Verification...
php -r "if (extension_loaded('pgsql')) { echo '[OK] Extension PostgreSQL chargee'; exit(0); } else { echo '[ERREUR] Extension non chargee'; exit(1); }"

if errorlevel 1 (
    echo.
    echo [ERREUR] L extension PostgreSQL ne s est pas chargee
    echo Restauration de la sauvegarde...
    copy "!BACKUP_INI!" "!PHP_INI!" /y >nul 2>&1
    echo.
    echo Solutions manuelles:
    echo 1. Ouvrez: !PHP_INI!
    echo 2. Cherchez les lignes:
    echo    ;extension=pgsql
    echo    ;extension=pdo_pgsql
    echo 3. Enlevez le ; au debut pour les activer
    echo 4. Sauvegardez et redemarrez PHP/Apache
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Extension activee avec succes!
)

echo.
echo ============================================================
echo Extension PostgreSQL Activee!
echo ============================================================
echo.
pause
