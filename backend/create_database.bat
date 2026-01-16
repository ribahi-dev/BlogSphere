@echo off
REM Script de création de base de données PostgreSQL pour Symfony

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Creation Base de Donnees - Symfony/PostgreSQL
echo ==========================================
echo.

REM Configuration par défaut
set DB_HOST=127.0.0.1
set DB_PORT=5432
set DB_NAME=app_db
set DB_USER=postgres
set DB_PASSWORD=postgres

REM Accepter le port en paramètre
if not "%~1"=="" set DB_PORT=%~1

echo Configuration:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   Database: %DB_NAME%
echo   User: %DB_USER%
echo.

REM Trouver psql
set PSQL_PATH=
for /f "delims=" %%A in ('where psql.exe 2^>nul') do (
    set PSQL_PATH=%%A
    goto :found_psql
)

:found_psql
if "!PSQL_PATH!"=="" (
    echo.
    echo [ERREUR] psql.exe introuvable!
    echo.
    echo Solutions:
    echo   1. Installez PostgreSQL depuis https://www.postgresql.org/download/windows/
    echo   2. Ajoutez PostgreSQL au PATH Windows
    echo      Exemple: C:\Program Files\PostgreSQL\16\bin
    echo.
    pause
    exit /b 1
)

echo [OK] PostgreSQL trouve: !PSQL_PATH!
echo.

REM Test de connexion
echo Test de connexion a PostgreSQL...
set PGPASSWORD=%DB_PASSWORD%
"!PSQL_PATH!" -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -tc "SELECT 1" >nul 2>&1

if errorlevel 1 (
    echo.
    echo [ERREUR] Impossible de se connecter a PostgreSQL!
    echo.
    echo Verifiez que:
    echo   - PostgreSQL est en cours d execution
    echo   - L hote est correct: %DB_HOST%
    echo   - Le port est correct: %DB_PORT%
    echo   - Le mot de passe est correct
    echo.
    pause
    exit /b 1
)

echo [OK] Connexion reussie!
echo.

REM Créer la base de données
echo Creation de la base de donnees '%DB_NAME%'...
set PGPASSWORD=%DB_PASSWORD%
"!PSQL_PATH!" -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -c "CREATE DATABASE %DB_NAME% OWNER %DB_USER%;" >nul 2>&1

if errorlevel 1 (
    REM Vérifier si elle existe déjà
    set PGPASSWORD=%DB_PASSWORD%
    "!PSQL_PATH!" -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 1;" >nul 2>&1
    
    if errorlevel 1 (
        echo [ERREUR] La base de donnees n a pas pu etre creee!
        pause
        exit /b 1
    ) else (
        echo [AVERTISSEMENT] La base de donnees '%DB_NAME%' existe deja
    )
) else (
    echo [OK] Base de donnees creee avec succes!
)

echo.
echo ==========================================
echo [OK] Base de donnees configuree!
echo ==========================================
echo.
echo Prochaines etapes:
echo   1. cd backend
echo   2. composer install
echo   3. php bin/console doctrine:database:create
echo   4. php bin/console doctrine:migrations:migrate
echo.
pause
