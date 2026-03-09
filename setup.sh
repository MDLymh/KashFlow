#!/bin/bash

# Script de instalación y configuración de KashFlow
# Uso: bash setup.sh

echo "╔════════════════════════════════════════╗"
echo "║      KashFlow - Setup Inicial           ║"
echo "║   Control de Gastos e Ingresos         ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Función para imprimir error
error() {
    echo -e "${RED}✗${NC} $1"
}

# Función para imprimir info
info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# 1. Verificar prerequisites
echo ""
echo "1. Verificando prerequisitos..."

if ! command -v php &> /dev/null; then
    error "PHP no está instalado"
    exit 1
fi
success "PHP $(php -v | head -n 1 | grep -oP '\d+\.\d+\.\d+') instalado"

if ! command -v composer &> /dev/null; then
    error "Composer no está instalado"
    exit 1
fi
success "Composer instalado"

if ! command -v npm &> /dev/null; then
    error "npm no está instalado"
    exit 1
fi
success "npm $(npm -v) instalado"

if ! command -v node &> /dev/null; then
    error "Node.js no está instalado"
    exit 1
fi
success "Node.js $(node -v) instalado"

# 2. Instalar dependencias PHP
echo ""
echo "2. Instalando dependencias PHP..."
if composer install; then
    success "Dependencias PHP instaladas"
else
    error "Error al instalar dependencias PHP"
    exit 1
fi

# 3. Instalar dependencias Node
echo ""
echo "3. Instalando dependencias Node..."
if npm install; then
    success "Dependencias Node instaladas"
else
    error "Error al instalar dependencias Node"
    exit 1
fi

# 4. Configurar .env
echo ""
echo "4. Configurando archivo .env..."

if [ ! -f .env ]; then
    if cp .env.example .env; then
        success "Archivo .env creado"
    else
        error "Error al crear archivo .env"
        exit 1
    fi
else
    info "El archivo .env ya existe"
fi

# 5. Generar APP_KEY
echo ""
echo "5. Generando APP_KEY..."
if php artisan key:generate; then
    success "APP_KEY generado"
else
    error "Error al generar APP_KEY"
    exit 1
fi

# 6. Crear base de datos (si usa PostgreSQL)
echo ""
echo "6. Configuración de base de datos..."
read -p "¿Qué gestor de BD usarás? (pgsql/sqlite/mysql) [pgsql]: " db_type
db_type=${db_type:-pgsql}

if [ "$db_type" = "pgsql" ]; then
    read -p "¿Nombre de la BD? [kashflow]: " db_name
    db_name=${db_name:-kashflow}
    
    read -p "¿Usuario de PostgreSQL? [postgres]: " db_user
    db_user=${db_user:-postgres}
    
    read -sp "¿Contraseña de PostgreSQL?: " db_pass
    echo ""
    
    if createdb -U "$db_user" "$db_name" 2>/dev/null || true; then
        success "Base de datos '$db_name' lista"
    else
        info "La base de datos podría ya existir o necesita credenciales diferentes"
    fi
    
    # Actualizar .env
    sed -i "s/DB_CONNECTION=.*/DB_CONNECTION=pgsql/" .env
    sed -i "s/DB_DATABASE=.*/DB_DATABASE=$db_name/" .env
    sed -i "s/DB_USERNAME=.*/DB_USERNAME=$db_user/" .env
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$db_pass/" .env
fi

# 7. Ejecutar migraciones
echo ""
echo "7. Ejecutando migraciones..."
if php artisan migrate:fresh --seed; then
    success "Base de datos migrada y cargada con datos iniciales"
else
    error "Error al ejecutar migraciones"
    exit 1
fi

# 8. Compilar assets
echo ""
echo "8. Compilando assets (modo desarrollo)..."
if npm run dev; then
    success "Assets compilados"
else
    error "Error al compilar assets"
    exit 1
fi

# 9. Crear enlaces simbólicos para almacenamiento
echo ""
echo "9. Configurando almacenamiento..."
if php artisan storage:link 2>/dev/null || true; then
    success "Enlaces simbólicos de almacenamiento configurados"
else
    info "Ejecuta manualmente: php artisan storage:link"
fi

# 10. Información final
echo ""
echo "╔════════════════════════════════════════╗"
echo -e "${GREEN}✓ SETUP COMPLETADO EXITOSAMENTE${NC}"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Inicia el servidor de desarrollo:"
echo -e "   ${YELLOW}php artisan serve${NC}"
echo ""
echo "2. En otra terminal, inicia Vite (para hot reload):"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Accede a la aplicación:"
echo -e "   ${YELLOW}http://localhost:8000${NC}"
echo ""
echo "4. Inicia sesión con:"
echo "   Email: test@example.com"
echo "   Password: password"
echo ""
echo "📚 Documentación:"
echo "   - README: ./KASHFLOW_README.md"
echo "   - Arquitectura: ./ARCHITECTURE.md"
echo ""
