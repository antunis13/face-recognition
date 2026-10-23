
@echo off
cd /d "%~dp0"

echo Iniciando o backend FastAPI...
start "Backend FastAPI" cmd /k "cd /d ""%~dp0ministerio_saude-main"" && python -m uvicorn api.main:app --reload"

echo Aguardando a inicializacao do backend...
timeout /t 5 /nobreak >nul

echo Iniciando o frontend Next.js...
start "Frontend Next.js" cmd /k "cd /d ""%~dp0"" && corepack yarn dev"

echo.
echo Os dois servidores foram iniciados.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8000
echo.
pause
