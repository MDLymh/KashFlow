#!/bin/bash

# 🔍 Script de Diagnóstico - Gemini API 403 Error

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🔍 Diagnóstico - Error 403 Gemini API                    ║"
echo "║     Verifica configuración y permisos                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Verificar .env
echo -e "${BLUE}[1] Verificando archivo .env...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}✗ Archivo .env no encontrado${NC}"
    echo "  Copia: cp .env.example .env"
    exit 1
fi

# 2. Verificar GEMINI_API_KEY
echo -e "${BLUE}[2] Verificando GEMINI_API_KEY...${NC}"
API_KEY=$(grep "^GEMINI_API_KEY=" .env | cut -d '=' -f 2 | xargs)

if [ -z "$API_KEY" ]; then
    echo -e "${RED}✗ GEMINI_API_KEY vacío${NC}"
    echo "  Solución: Agrega tu clave API a .env"
    echo "  GEMINI_API_KEY=AIzaSy..."
    exit 1
elif [ "$API_KEY" = "your_google_gemini_api_key_here" ]; then
    echo -e "${RED}✗ GEMINI_API_KEY no actualizado${NC}"
    echo "  Solución: Reemplaza el placeholder con tu clave real"
    exit 1
elif [ ${#API_KEY} -lt 20 ]; then
    echo -e "${RED}✗ GEMINI_API_KEY muy corto (${#API_KEY} caracteres)${NC}"
    echo "  Esperado: ~50 caracteres"
    echo "  Solución: Verifica que copiaste correctamente"
    exit 1
else
    echo -e "${GREEN}✓ GEMINI_API_KEY configurado${NC}"
    echo "  Longitud: ${#API_KEY} caracteres"
    echo "  Primeros 10: ${API_KEY:0:10}..."
fi

# 3. Verificar AI_PROCESSING_ENABLED
echo ""
echo -e "${BLUE}[3] Verificando AI_PROCESSING_ENABLED...${NC}"
if grep -q "AI_PROCESSING_ENABLED=true" .env; then
    echo -e "${GREEN}✓ AI_PROCESSING_ENABLED=true${NC}"
else
    echo -e "${YELLOW}⚠ AI_PROCESSING_ENABLED no es true${NC}"
    echo "  Solución: Actualiza en .env: AI_PROCESSING_ENABLED=true"
fi

# 4. Verificar GEMINI_MODEL
echo ""
echo -e "${BLUE}[4] Verificando GEMINI_MODEL...${NC}"
MODEL=$(grep "^GEMINI_MODEL=" .env | cut -d '=' -f 2 | xargs)
if [ -z "$MODEL" ]; then
    echo -e "${YELLOW}⚠ GEMINI_MODEL no especificado (usará defecto)${NC}"
else
    echo -e "${GREEN}✓ GEMINI_MODEL: $MODEL${NC}"
fi

# 5. Verificar que ReceiptAnalysisController existe
echo ""
echo -e "${BLUE}[5] Verificando archivos de la aplicación...${NC}"
if [ -f "app/Http/Controllers/ReceiptAnalysisController.php" ]; then
    echo -e "${GREEN}✓ ReceiptAnalysisController.php existe${NC}"
else
    echo -e "${RED}✗ ReceiptAnalysisController.php no encontrado${NC}"
    exit 1
fi

if [ -f "app/Services/ReceiptAnalysisService.php" ]; then
    echo -e "${GREEN}✓ ReceiptAnalysisService.php existe${NC}"
else
    echo -e "${RED}✗ ReceiptAnalysisService.php no encontrado${NC}"
    exit 1
fi

# 6. Verificar que la ruta existe
echo ""
echo -e "${BLUE}[6] Verificando rutas...${NC}"
if grep -q "receipts/analyze" routes/web.php; then
    echo -e "${GREEN}✓ Ruta /receipts/analyze existe${NC}"
else
    echo -e "${RED}✗ Ruta /receipts/analyze no encontrada${NC}"
    exit 1
fi

# 7. Resumen
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Configuración verificada${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Reinicia el servidor: php artisan serve"
echo "2. Abre: http://localhost:8000/transactions/create"
echo "3. Sube una imagen de recibo"
echo "4. Si aún hay error 403:"
echo ""
echo "   a) Verifica en Google Cloud Console:"
echo "      - Proyecto correcto seleccionado"
echo "      - Generative AI API habilitada"
echo "      - Facturación activada"
echo ""
echo "   b) Regenera una nueva API Key:"
echo "      - Google Cloud Console"
echo "      - APIs y servicios → Credenciales"
echo "      - Clave API → Regenerar"
echo "      - Copia la nueva clave"
echo "      - Actualiza en .env"
echo ""
echo "   c) Revisa logs:"
echo "      - tail -f storage/logs/laravel.log"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Para más ayuda:"
echo "  Lee: GEMINI_ERROR_403_FIX.md"
echo "  Lee: GEMINI_SETUP.md"
echo ""
