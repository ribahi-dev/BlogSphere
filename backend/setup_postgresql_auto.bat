@echo off
REM Script pour lancer PowerShell avec droits administrateur

echo Lancement de la configuration PostgreSQL (demande de droits Admin)...
echo.

REM Lancer PowerShell en Admin et exécuter le script
powershell -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"c:\Users\elmeh\Desktop\projet php\backend\setup_postgresql_auto.ps1\"' -Verb RunAs"

pause
