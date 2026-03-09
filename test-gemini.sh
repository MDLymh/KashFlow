#!/bin/bash

# 📸 Script de Prueba - Gemini Vision API Integration
# Este script ayuda a probar la integración con Google Gemini

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  KashFlow - Prueba de Integración Gemini Vision API         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar que .env tiene GEMINI_API_KEY
echo -e "${YELLOW}1. Verificando configuración...${NC}"
if grep -q "GEMINI_API_KEY=" .env; then
    API_KEY=$(grep "GEMINI_API_KEY=" .env | cut -d '=' -f 2)
    if [ -z "$API_KEY" ] || [ "$API_KEY" == "your_google_gemini_api_key_here" ]; then
        echo -e "${RED}✗ GEMINI_API_KEY no configurado${NC}"
        echo "  Actualiza tu .env con una clave API válida"
        exit 1
    else
        echo -e "${GREEN}✓ GEMINI_API_KEY configurado${NC}"
    fi
else
    echo -e "${RED}✗ GEMINI_API_KEY no encontrado en .env${NC}"
    exit 1
fi

# 2. Verificar que AI_PROCESSING_ENABLED está activado
echo ""
echo -e "${YELLOW}2. Verificando procesamiento de IA...${NC}"
if grep -q "AI_PROCESSING_ENABLED=true" .env; then
    echo -e "${GREEN}✓ AI_PROCESSING_ENABLED=true${NC}"
else
    echo -e "${YELLOW}⚠ AI_PROCESSING_ENABLED no está true${NC}"
    echo "  Actualiza: AI_PROCESSING_ENABLED=true"
fi

# 3. Verificar que los archivos están en su lugar
echo ""
echo -e "${YELLOW}3. Verificando archivos necesarios...${NC}"

files=(
    "app/Services/ReceiptAnalysisService.php"
    "app/Http/Controllers/ReceiptAnalysisController.php"
    "resources/js/pages/Transactions/Create.tsx"
    "GEMINI_SETUP.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ Falta: $file${NC}"
    fi
done

# 4. Ofrecer opciones de prueba
echo ""
echo -e "${YELLOW}4. Opciones de Prueba${NC}"
echo ""
echo "Opciones:"
echo "  1) Verificar conexión a Gemini API"
echo "  2) Abrir página de Nueva Transacción"
echo "  3) Ver documentación de Gemini"
echo "  4) Salir"
echo ""
read -p "Selecciona una opción (1-4): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}Probando conexión a Gemini API...${NC}"
        # Crear un test file temporal
        echo "Test de conexión"
        curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$(grep GEMINI_API_KEY .env | cut -d '=' -f 2)" \
            -H "Content-Type: application/json" \
            -d '{
                "contents": [{
                    "parts": [{
                        "text": "Hola, ¿estás funcionando?"
                    }]
                }]
            }' > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Conexión exitosa a Gemini API${NC}"
        else
            echo -e "${RED}✗ Error de conexión${NC}"
            echo "  Verifica tu GEMINI_API_KEY"
        fi
        ;;
    2)
        echo ""
        echo -e "${YELLOW}Abriendo navegador...${NC}"
        if command -v open &> /dev/null; then
            open "http://localhost:8000/transactions/create"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:8000/transactions/create"
        elif command -v start &> /dev/null; then
            start "http://localhost:8000/transactions/create"
        fi
        echo "  Abre: http://localhost:8000/transactions/create"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}Abriendo documentación...${NC}"
        if [ -f "GEMINI_SETUP.md" ]; then
            less GEMINI_SETUP.md
        else
            echo "Archivo GEMINI_SETUP.md no encontrado"
        fi
        ;;
    4)
        echo "Saliendo..."
        exit 0
        ;;
    *)
        echo -e "${RED}Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✓ Prueba completada${NC}"
