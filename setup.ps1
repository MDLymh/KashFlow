# Script de instalación y configuración de KashFlow para Windows
# Uso: .\setup.ps1

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      KashFlow - Setup Inicial           ║" -ForegroundColor Cyan
Write-Host "║   Control de Gastos e Ingresos         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

function Write-Success {
    Write-Host "✓ $args" -ForegroundColor Green
}

function Write-Error {
    Write-Host "✗ $args" -ForegroundColor Red
}

function Write-Info {
    Write-Host "ℹ $args" -ForegroundColor Yellow
}

# 1. Verificar prerequisites
Write-Host "1. Verificando prerequisitos..."

if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Error "PHP no está instalado o no está en el PATH"
    Exit 1
}
Write-Success "PHP instalado"

if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {
    Write-Error "Composer no está instalado o no está en el PATH"
    Exit 1
}
Write-Success "Composer instalado"

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm no está instalado o no está en el PATH"
    Exit 1
}
Write-Success "npm instalado"

# 2. Instalar dependencias PHP
Write-Host ""
Write-Host "2. Instalando dependencias PHP..."
composer install
if ($LASTEXITCODE -eq 0) {
    Write-Success "Dependencias PHP instaladas"
} else {
    Write-Error "Error al instalar dependencias PHP"
    Exit 1
}

# 3. Instalar dependencias Node
Write-Host ""
Write-Host "3. Instalando dependencias Node..."
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Success "Dependencias Node instaladas"
} else {
    Write-Error "Error al instalar dependencias Node"
    Exit 1
}

# 4. Configurar .env
Write-Host ""
Write-Host "4. Configurando archivo .env..."

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Success "Archivo .env creado"
} else {
    Write-Info "El archivo .env ya existe"
}

# 5. Generar APP_KEY
Write-Host ""
Write-Host "5. Generando APP_KEY..."
php artisan key:generate
if ($LASTEXITCODE -eq 0) {
    Write-Success "APP_KEY generado"
} else {
    Write-Error "Error al generar APP_KEY"
    Exit 1
}

# 6. Base de datos
Write-Host ""
Write-Host "6. Configuración de base de datos..."
Write-Host "Asegúrate de que tu PostgreSQL esté corriendo y que hayas creado la base de datos."
Write-Host ""
Write-Host "Ejemplo con psql:"
Write-Host "  psql -U postgres"
Write-Host "  CREATE DATABASE kashflow;"
Write-Host ""
Write-Info "Actualiza las credenciales en .env si es necesario:"
Write-Host "  DB_CONNECTION=pgsql"
Write-Host "  DB_HOST=127.0.0.1"
Write-Host "  DB_PORT=5432"
Write-Host "  DB_DATABASE=kashflow"
Write-Host "  DB_USERNAME=postgres"
Write-Host "  DB_PASSWORD=tu_contraseña"
Write-Host ""
$response = Read-Host "¿Continuar? (s/n)"
if ($response -ne "s") {
    Exit 0
}

# 7. Ejecutar migraciones
Write-Host ""
Write-Host "7. Ejecutando migraciones..."
php artisan migrate:fresh --seed
if ($LASTEXITCODE -eq 0) {
    Write-Success "Base de datos migrada y cargada"
} else {
    Write-Error "Error al ejecutar migraciones"
    Write-Info "Verifica la configuración de BD en .env"
    Exit 1
}

# 8. Compilar assets
Write-Host ""
Write-Host "8. Compilando assets..."
npm run dev
if ($LASTEXITCODE -eq 0) {
    Write-Success "Assets compilados"
} else {
    Write-Error "Error al compilar assets"
}

# 9. Enlaces simbólicos
Write-Host ""
Write-Host "9. Configurando almacenamiento..."
php artisan storage:link
if ($LASTEXITCODE -eq 0) {
    Write-Success "Enlaces simbólicos configurados"
} else {
    Write-Info "Ejecuta manualmente: php artisan storage:link"
}

# 10. Información final
Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "✓ SETUP COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abre dos terminales (PowerShell, CMD, o Git Bash)"
Write-Host ""
Write-Host "Terminal 1 - Servidor Laravel:"
Write-Host "   php artisan serve" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 2 - Vite (Hot reload):"
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Accede a la aplicación:"
Write-Host "   http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Inicia sesión con:"
Write-Host "   Email: test@example.com"
Write-Host "   Password: password"
Write-Host ""
Write-Host "📚 Documentación:"
Write-Host "   - README: ./KASHFLOW_README.md"
Write-Host "   - Arquitectura: ./ARCHITECTURE.md"
Write-Host ""
