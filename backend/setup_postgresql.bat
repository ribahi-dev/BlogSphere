@echo off
REM Script de configuration PostgreSQL pour le projet

echo ====================================
echo Configuration PostgreSQL
echo ====================================

REM Essayer de trouver psql
for /f "delims=" %%A in ('where /r "C:\Program Files" psql.exe 2^>nul') do set PSQL_PATH=%%A

if not defined PSQL_PATH (
    for /f "delims=" %%A in ('where /r "C:\Program Files (x86)" psql.exe 2^>nul') do set PSQL_PATH=%%A
)

if not defined PSQL_PATH (
    echo [ERREUR] PostgreSQL non trouve. Assurez-vous qu'il est installe.
    echo Installez PostgreSQL depuis: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo [OK] PostgreSQL trouve: %PSQL_PATH%

echo.
echo Connexion a PostgreSQL...
REM Creer la base de donnees
"%PSQL_PATH%" -U postgres -c "CREATE DATABASE app_db OWNER postgres;"

if errorlevel 1 (
    echo [AVERTISSEMENT] La base de donnees existe peut-etre deja.
)

echo.
echo [OK] Configuration PostgreSQL termine!
echo.
echo Les donnees de connexion sont:
echo   Host: localhost
echo   Port: 5432
echo   Database: app_db
echo   User: postgres
echo   Password: (celle que vous avez entree lors de l'installation)
echo.
pause
