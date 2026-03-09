@echo off
REM 🔍 Script de Diagnóstico - Gemini API 403 Error (Windows)

setlocal enabledelayedexpansion
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🔍 Diagnóstico - Error 403 Gemini API                    ║
echo ║     Verifica configuración y permisos                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM 1. Verificar .env
echo [1] Verificando archivo .env...

if not exist ".env" (
    echo ✗ Archivo .env no encontrado
    echo   Solución: Copia .env.example a .env
    pause
    exit /b 1
)

echo ✓ Archivo .env encontrado

REM 2. Verificar GEMINI_API_KEY
echo.
echo [2] Verificando GEMINI_API_KEY...

for /f "tokens=2 delims==" %%A in ('type .env ^| find "GEMINI_API_KEY"') do (
    set API_KEY=%%A
)

if "!API_KEY!"=="" (
    echo ✗ GEMINI_API_KEY vacío
    echo   Solución: Agrega tu clave API a .env
    echo   GEMINI_API_KEY=AIzaSy...
    pause
    exit /b 1
) else if "!API_KEY!"=="your_google_gemini_api_key_here" (
    echo ✗ GEMINI_API_KEY no actualizado
    echo   Solución: Reemplaza el placeholder con tu clave real
    pause
    exit /b 1
) else (
    echo ✓ GEMINI_API_KEY configurado
    echo   Primeros 10 caracteres: !API_KEY:~0,10!...
    echo   Longitud: !API_KEY!
)

REM 3. Verificar AI_PROCESSING_ENABLED
echo.
echo [3] Verificando AI_PROCESSING_ENABLED...

find /c "AI_PROCESSING_ENABLED=true" .env > nul
if errorlevel 1 (
    echo ⚠ AI_PROCESSING_ENABLED no es true
    echo   Solución: Actualiza en .env: AI_PROCESSING_ENABLED=true
) else (
    echo ✓ AI_PROCESSING_ENABLED=true
)

REM 4. Verificar GEMINI_MODEL
echo.
echo [4] Verificando GEMINI_MODEL...

for /f "tokens=2 delims==" %%A in ('type .env ^| find "GEMINI_MODEL"') do (
    set MODEL=%%A
)

if "!MODEL!"=="" (
    echo ⚠ GEMINI_MODEL no especificado (usará defecto: gemini-2.0-flash)
) else (
    echo ✓ GEMINI_MODEL: !MODEL!
)

REM 5. Verificar que ReceiptAnalysisController existe
echo.
echo [5] Verificando archivos de la aplicación...

if exist "app\Http\Controllers\ReceiptAnalysisController.php" (
    echo ✓ ReceiptAnalysisController.php existe
) else (
    echo ✗ ReceiptAnalysisController.php no encontrado
    pause
    exit /b 1
)

if exist "app\Services\ReceiptAnalysisService.php" (
    echo ✓ ReceiptAnalysisService.php existe
) else (
    echo ✗ ReceiptAnalysisService.php no encontrado
    pause
    exit /b 1
)

REM 6. Verificar que la ruta existe
echo.
echo [6] Verificando rutas...

find /c "receipts/analyze" routes\web.php > nul
if errorlevel 1 (
    echo ✗ Ruta /receipts/analyze no encontrada
    pause
    exit /b 1
) else (
    echo ✓ Ruta /receipts/analyze existe
)

REM 7. Resumen
echo.
echo ════════════════════════════════════════════════════════════
echo ✓ Configuración verificada
echo.
echo Próximos pasos:
echo.
echo 1. Reinicia el servidor:
echo    php artisan serve
echo.
echo 2. Abre en navegador:
echo    http://localhost:8000/transactions/create
echo.
echo 3. Sube una imagen de recibo
echo.
echo 4. Si aún hay error 403:
echo.
echo    a) Verifica en Google Cloud Console:
echo       - Proyecto correcto seleccionado
echo       - Generative AI API habilitada
echo       - Facturación activada
echo.
echo    b) Regenera una nueva API Key:
echo       - Google Cloud Console
echo       - APIs y servicios / Credenciales
echo       - Clave API / Regenerar
echo       - Copia la nueva clave
echo       - Actualiza en .env
echo.
echo    c) Revisa logs en:
echo       - storage/logs/laravel.log
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Para más ayuda:
echo   Lee: GEMINI_ERROR_403_FIX.md
echo   Lee: GEMINI_SETUP.md
echo.

pause
