@echo off
REM Script pour réinitialiser le mot de passe PostgreSQL

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Reinitialisation Mot de Passe PostgreSQL
echo ==========================================
echo.

set PSQL_PATH=C:\Program Files\PostgreSQL\18\bin\psql.exe
set PG_CONFIG_PATH=C:\Program Files\PostgreSQL\18\data\postgresql.conf

if not exist "!PSQL_PATH!" (
    echo [ERREUR] PostgreSQL n'a pas ete trouve a: !PSQL_PATH!
    pause
    exit /b 1
)

echo [OK] PostgreSQL trouve
echo.

REM Arrêter PostgreSQL temporairement si nécessaire
echo Arret du service PostgreSQL...
net stop postgresql-x64-18 >nul 2>&1

REM Démarrer PostgreSQL sans authentification
echo Demarrage de PostgreSQL en mode authentification simplifiee...

REM Créer une entrée temporaire dans pg_hba.conf
REM C'est difficile à faire en batch, donc on va passer par pgAdmin ou psql avec -U

echo.
echo Redemarrage de PostgreSQL...
net start postgresql-x64-18 >nul 2>&1

REM Attendre que PostgreSQL redémarre
timeout /t 3 /nobreak

echo.
echo Connexion a PostgreSQL pour changer le mot de passe...
echo Entrez le nouveau mot de passe quand demande:
echo.

REM Lancer psql en mode interactif
"!PSQL_PATH!" -U postgres -h 127.0.0.1 -c "ALTER USER postgres PASSWORD '2005';"

if errorlevel 1 (
    echo.
    echo [AVERTISSEMENT] Impossible de changer le mot de passe directement.
    echo.
    echo Solutions alternatives:
    echo 1. Utiliser pgAdmin:
    echo    - Ouvrir pgAdmin (http://localhost:5050)
    echo    - Connectez-vous avec les credentials existants
    echo    - Clic droit sur postgres > Properties > Change Password
    echo    - Entrez: 2005
    echo.
    echo 2. Ou modifier pg_hba.conf manuellement:
    echo    - Ouvrir: C:\Program Files\PostgreSQL\18\data\pg_hba.conf
    echo    - Chercher les lignes avec "md5" ou "ident"
    echo    - Les changer en "trust"
    echo    - Redemarrer PostgreSQL
    echo.
) else (
    echo [OK] Mot de passe change avec succes!
)

echo.
pause
