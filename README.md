# KashFlow - Gestor de Gastos e Ingresos

## 📋 Descripción

KashFlow es una aplicación web moderna para gestionar tus gastos e ingresos con reportes mensuales, procesamiento de recibos con IA (Gemini Vision) y extracción automática de datos de transacciones.

## 🚀 Características Principales

- ✅ Dashboard con resumen mensual de gastos e ingresos
- ✅ CRUD completo de transacciones
- ✅ Categorización automática de gastos e ingresos
- ✅ Carga de recibos con procesamiento automático (Drag & Drop)
- ✅ Extracción de datos de recibos con IA (Google Gemini 2.5 Flash)
- ✅ Reportes mensuales detallados
- ✅ Autenticación y autorización con políticas
- ✅ Interfaz moderna con React + TypeScript
- ✅ Soporte para México (MXN, es_MX)

## 📋 Requisitos

- **PHP**: 8.2+
- **Node.js**: 18+
- **Composer**: 2.x
- **SQLite** o MySQL
- **Google Gemini API Key** (opcional, para procesamiento de recibos con IA)

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd kashflow
```

### 2. Instalar dependencias PHP

```bash
composer install
```

### 3. Instalar dependencias Node.js

```bash
npm install
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus datos:

```env
APP_NAME=KashFlow
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de Datos
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Localización
APP_LOCALE=es_MX
APP_CURRENCY=MXN
APP_CURRENCY_SYMBOL=$ 

# Gemini API (Opcional)
GEMINI_API_KEY=tu_api_key_aqui
GEMINI_MODEL=gemini-2.5-flash
```

### 5. Generar clave de aplicación

```bash
php artisan key:generate
```

### 6. Ejecutar migraciones

```bash
php artisan migrate
```

### 7. Seedear datos de prueba (Opcional)

```bash
php artisan db:seed
```

### 8. Compilar assets frontend

```bash
npm run build
```

Para desarrollo con hot reload:

```bash
npm run dev
```

## 🏃 Inicio Rápido

### Development

Terminal 1 - Backend:
```bash
php artisan serve
```

Terminal 2 - Frontend:
```bash
npm run dev
```

Accede a: http://localhost:8000

### Credenciales de Prueba

```
Email: test@example.com
Contraseña: password
```

## 📁 Estructura del Proyecto

```
/
├── app/
│   ├── Http/Controllers/      # Controllers
│   ├── Models/                # Modelos Eloquent
│   ├── Policies/              # Políticas de autorización
│   ├── Services/              # Servicios (IA, etc)
│   └── Providers/             # Providers
├── database/
│   ├── migrations/            # Migraciones
│   └── seeders/               # Seeders
├── resources/
│   ├── js/                    # React components
│   ├── css/                   # Estilos
│   └── views/                 # Blade templates
├── routes/                    # Rutas
├── config/                    # Configuración
└── storage/                   # Archivos subidos
```

## 🔑 Configuración Importante

### Google Gemini API

Para usar procesamiento de recibos con IA:

1. Obtén tu API Key en: https://aistudio.google.com/apikey
2. Establece en `.env`:
   ```env
   GEMINI_API_KEY=tu_api_key_aqui
   GEMINI_MODEL=gemini-2.5-flash
   ```

### Base de Datos

Por defecto usa SQLite. Para MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kashflow
DB_USERNAME=root
DB_PASSWORD=
```

## 📊 Uso

### Crear una Transacción

1. Ir a "Transacciones" → "Nueva"
2. Llenar formulario (título, monto, categoría, fecha)
3. (Opcional) Arrastrar un recibo para análisis automático
4. Guardar

### Ver Reportes

1. Ir a "Reportes"
2. Seleccionar mes y año
3. Ver resumen de gastos e ingresos por categoría

### Analizar Recibos

1. En "Nueva Transacción", arrastrar un PDF/JPG/PNG
2. El sistema extrae automáticamente:
   - Nombre del proveedor
   - Monto
   - Fecha
   - Items
   - Impuestos
3. Completar campos faltantes y guardar

## 🔐 Autorización y Seguridad

### Acceso a Recibos
- Los usuarios solo pueden ver y eliminar **sus propios recibos**
- Se valida automáticamente a nivel de middleware con `can:view,receipt` y `can:delete,receipt`
- Intento de acceso a recibos de otro usuario → 403 Forbidden

### Políticas de Autorización
- **ReceiptPolicy**: Verifica que `user->id === receipt->user_id`
- **TransactionPolicy**: Verifica que `user->id === transaction->user_id`
- Validación en 2 capas: Middleware + Policy

### Testing de Autorización

```bash
# Terminal interactiva
php artisan tinker

# Validar que usuario puede ver su recibo
$user = User::find(1);
$receipt = Receipt::find(1);
$user->can('view', $receipt);  # true ✅

# Validar que usuario NO puede ver recibo ajeno
$other_receipt = Receipt::find(2);
$user->can('view', $other_receipt);  # false ✅
```

## 🐛 Troubleshooting

### Error: "Unable to find storage driver"
```bash
php artisan storage:link
```

### Error: "Production mode detected"
```bash
php artisan config:cache
php artisan view:cache
```

### Error al procesar recibos con IA
- Verificar que `GEMINI_API_KEY` esté configurada
- Verificar límites de cuota en Google AI Studio
- Revisar logs en `storage/logs/laravel.log`

## 📥 Descarga de Archivos de Recibos

### Acceso Seguro
Los archivos de recibos se sirven a través de un endpoint protegido que valida que el usuario sea el dueño del archivo:

**Endpoints:**
- **Ver recibo:** `GET /receipts/{id}`
- **Descargar archivo:** `GET /receipts/{id}/download`

### Validación de Seguridad
- ✅ Solo el propietario del recibo puede descargar su archivo
- ✅ Intento de acceso a archivo ajeno → 403 Forbidden
- ✅ Los archivos se sirven de forma segura sin exposición directa

### Ejemplo de Uso (Frontend)
```jsx
<img src={`/receipts/${receipt.id}/download`} alt={receipt.fileName} />
<a href={`/receipts/${receipt.id}/download`} download>
  Descargar PDF
</a>
```

## 📝 Logs

Ver logs de la aplicación:

```bash
# Ver últimas líneas
tail -f storage/logs/laravel.log

# En PowerShell
Get-Content storage/logs/laravel.log -Tail 50
```

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo LICENSE para más detalles.

## 👤 Autor

KashFlow - Gestor de Finanzas Personales

## 📞 Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio.

---

**Última actualización**: Marzo 2025
**Versión**: 1.0.0
