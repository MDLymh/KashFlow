@echo off
REM 📸 Script de Prueba - Gemini Vision API Integration (Windows)
REM Este script ayuda a probar la integración con Google Gemini

cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  KashFlow - Prueba de Integración Gemini Vision API         ║
echo ║               (Windows PowerShell)                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 1. Verificar que .env tiene GEMINI_API_KEY
echo [1] Verificando configuración...

if not exist ".env" (
    echo ✗ Archivo .env no encontrado
    pause
    exit /b 1
)

REM Leer GEMINI_API_KEY
for /f "tokens=2 delims==" %%A in ('type .env ^| find "GEMINI_API_KEY"') do set API_KEY=%%A

if "%API_KEY%"=="" (
    echo ✗ GEMINI_API_KEY no configurado
    echo.
    echo Actualiza tu .env con:
    echo   GEMINI_API_KEY=your_key_here
    pause
    exit /b 1
) else if "%API_KEY%"=="your_google_gemini_api_key_here" (
    echo ✗ GEMINI_API_KEY no es válido (aún es el placeholder)
    pause
    exit /b 1
) else (
    echo ✓ GEMINI_API_KEY configurado
)

echo.

REM 2. Verificar que AI_PROCESSING_ENABLED está activado
echo [2] Verificando procesamiento de IA...

find /c "AI_PROCESSING_ENABLED=true" .env > nul
if errorlevel 1 (
    echo ⚠ AI_PROCESSING_ENABLED no está true
    echo Actualiza: AI_PROCESSING_ENABLED=true
) else (
    echo ✓ AI_PROCESSING_ENABLED=true
)

echo.

REM 3. Verificar que los archivos están en su lugar
echo [3] Verificando archivos necesarios...

setlocal enabledelayedexpansion
set "files[0]=app\Services\ReceiptAnalysisService.php"
set "files[1]=app\Http\Controllers\ReceiptAnalysisController.php"
set "files[2]=resources\js\pages\Transactions\Create.tsx"
set "files[3]=GEMINI_SETUP.md"

for /l %%i in (0,1,3) do (
    if exist "!files[%%i]!" (
        echo ✓ !files[%%i]!
    ) else (
        echo ✗ Falta: !files[%%i]!
    )
)

echo.
echo [4] Opciones de Prueba
echo.
echo Opciones:
echo   1) Abrir página de Nueva Transacción
echo   2) Ver documentación de Gemini
echo   3) Ver guía de configuración en PowerShell
echo   4) Salir
echo.

set /p choice=Selecciona una opción (1-4): 

if "%choice%"=="1" (
    echo.
    echo Abriendo navegador...
    start http://localhost:8000/transactions/create
    echo Abre: http://localhost:8000/transactions/create
) else if "%choice%"=="2" (
    echo.
    echo Abriendo documentación...
    if exist "GEMINI_SETUP.md" (
        notepad GEMINI_SETUP.md
    ) else (
        echo Archivo GEMINI_SETUP.md no encontrado
    )
) else if "%choice%"=="3" (
    echo.
    echo Guía rápida:
    echo.
    echo 1. Obtener API Key:
    echo    - Ve a https://console.cloud.google.com/
    echo    - Crear un proyecto
    echo    - Ir a APIs y servicios ^> Credenciales
    echo    - Crear credencial ^> Clave API
    echo.
    echo 2. Copiar la clave API
    echo.
    echo 3. Abrir .env y actualizar:
    echo    GEMINI_API_KEY=tu_clave_aqui
    echo    AI_PROCESSING_ENABLED=true
    echo.
    echo 4. Guardar y recargar la app
    echo.
) else if "%choice%"=="4" (
    echo Saliendo...
    exit /b 0
) else (
    echo Opción inválida
    exit /b 1
)

echo.
echo ✓ Prueba completada
pause
