@echo off
REM Ajouter PostgreSQL 18 au PATH temporairement

set PATH=C:\Program Files\PostgreSQL\18\bin;%PATH%

echo.
echo ==========================================
echo Test de Connexion PostgreSQL
echo ==========================================
echo.
echo PostgreSQL PATH ajoute temporairement
echo.

REM Test psql
psql --version
echo.

REM Test de connexion
echo Tentative de connexion a PostgreSQL...
echo Entrez le mot de passe quand demande
echo.

psql -U postgres -h 127.0.0.1 -p 5432

echo.
pause
