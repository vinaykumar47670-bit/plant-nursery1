@echo off
taskkill /FI "WINDOWTITLE eq Fernwood PHP API*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Fernwood Node*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Fernwood Website*" /T /F >nul 2>&1
echo Fernwood servers stopped. MySQL is still running (stop it from the XAMPP Control Panel if you want).
pause
