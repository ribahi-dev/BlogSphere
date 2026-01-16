@echo off
REM Configuration PostgreSQL Complète - Automatique

setlocal enabledelayedexpansion

cls
echo.
echo ============================================================
echo Configuration Automatique PostgreSQL + Base de Donnees
echo ============================================================
echo.

REM Configuration
set PSQL_PATH=C:\Program Files\PostgreSQL\18\bin\psql.exe
set PG_CTL_PATH=C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe
set PG_DATA=C:\Program Files\PostgreSQL\18\data
set PG_HBA=%PG_DATA%\pg_hba.conf
set SERVICE_NAME=postgresql-x64-18
set DB_PASSWORD=2005
set DB_NAME=app_db
set DB_USER=postgres
set DB_HOST=127.0.0.1
set DB_PORT=5432

REM Vérifier les fichiers nécessaires
echo [1/8] Verification des fichiers PostgreSQL...
if not exist "!PSQL_PATH!" (
    echo [ERREUR] psql.exe non trouve a: !PSQL_PATH!
    pause
    exit /b 1
)
if not exist "!PG_HBA!" (
    echo [ERREUR] pg_hba.conf non trouve a: !PG_HBA!
    pause
    exit /b 1
)
echo [OK] Tous les fichiers trouves

REM Etape 1: Arrêter PostgreSQL
echo.
echo [2/8] Arret du service PostgreSQL...
net stop !SERVICE_NAME! >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] PostgreSQL arrete

REM Etape 2: Sauvegarde du fichier pg_hba.conf
echo.
echo [3/8] Sauvegarde de pg_hba.conf...
copy "!PG_HBA!" "!PG_HBA!.backup" >nul 2>&1
echo [OK] Fichier sauvegarde

REM Etape 3: Modifier pg_hba.conf pour trust
echo.
echo [4/8] Modification de pg_hba.conf en mode trust temporaire...
powershell -NoProfile -Command "
    $file = '!PG_HBA!'
    $content = Get-Content $file
    $content = $content -replace 'md5', 'trust'
    $content = $content -replace 'scram-sha-256', 'trust'
    $content | Set-Content $file
" >nul 2>&1
echo [OK] pg_hba.conf modifie

REM Etape 4: Démarrer PostgreSQL
echo.
echo [5/8] Demarrage de PostgreSQL...
net start !SERVICE_NAME! >nul 2>&1
timeout /t 3 /nobreak >nul
echo [OK] PostgreSQL demarrage

REM Etape 5: Créer une commande SQL pour changer le mot de passe et créer la BD
echo.
echo [6/8] Configuration du mot de passe et base de donnees...

REM Créer un fichier SQL temporaire
set TEMP_SQL=%TEMP%\postgres_setup.sql
(
    echo ALTER USER !DB_USER! PASSWORD '!DB_PASSWORD!';
    echo CREATE DATABASE !DB_NAME! OWNER !DB_USER!;
) > "!TEMP_SQL!"

REM Exécuter le SQL
set PGPASSWORD=
"!PSQL_PATH!" -U !DB_USER! -h !DB_HOST! -d postgres -f "!TEMP_SQL!" >nul 2>&1

if errorlevel 1 (
    echo [AVERTISSEMENT] Erreur lors de l'execution SQL
) else (
    echo [OK] Configuration executee
)

REM Supprimer le fichier SQL temporaire
if exist "!TEMP_SQL!" del "!TEMP_SQL!" >nul 2>&1

REM Etape 6: Restaurer pg_hba.conf
echo.
echo [7/8] Restauration de pg_hba.conf en mode securise (md5)...
powershell -NoProfile -Command "
    $file = '!PG_HBA!'
    $content = Get-Content $file
    $content = $content -replace 'trust', 'md5'
    $content | Set-Content $file
" >nul 2>&1
echo [OK] pg_hba.conf restaure

REM Etape 7: Redémarrer PostgreSQL
echo.
echo [8/8] Redemarrage final de PostgreSQL...
net stop !SERVICE_NAME! >nul 2>&1
timeout /t 1 /nobreak >nul
net start !SERVICE_NAME! >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] PostgreSQL redemarrage

REM Afficher les résultats
cls
echo.
echo ============================================================
echo Configuration PostgreSQL Terminee avec Succes!
echo ============================================================
echo.
echo Paramètres de connexion:
echo   Host: !DB_HOST!
echo   Port: !DB_PORT!
echo   Database: !DB_NAME!
echo   User: !DB_USER!
echo   Password: !DB_PASSWORD!
echo.
echo ============================================================
echo Prochaines Etapes:
echo ============================================================
echo.
echo 1. Ouvrir un terminal et aller au dossier backend:
echo    cd c:\Users\elmeh\Desktop\projet php\backend
echo.
echo 2. Installer les dependances:
echo    composer install
echo.
echo 3. Executer les migrations:
echo    php bin/console doctrine:migrations:migrate
echo.
echo 4. Demarrer le serveur:
echo    php -S 127.0.0.1:8001
echo.
echo 5. Acceder a l'application:
echo    http://localhost:5050
echo.
echo ============================================================
echo.
pause
