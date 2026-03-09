<?php
/**
 * Script de diagnóstico detallado para Gemini API
 * Usa PHP nativo para probar la conexión y validar la clave API
 */

require __DIR__ . '/vendor/autoload.php';

// Cargar .env
$env = parse_ini_file(__DIR__ . '/.env');
$apiKey = $env['GEMINI_API_KEY'] ?? null;
$model = $env['GEMINI_MODEL'] ?? 'gemini-2.0-flash';

echo "=== DIAGNÓSTICO DE GEMINI API ===\n\n";

// 1. Verificar que la clave API existe
echo "1. VERIFICANDO CONFIGURACIÓN:\n";
if (!$apiKey) {
    echo "❌ GEMINI_API_KEY no está configurada en .env\n";
    exit(1);
} else {
    // Mostrar primeros y últimos caracteres (ofuscado)
    $visible = substr($apiKey, 0, 5) . '...' . substr($apiKey, -5);
    echo "✓ GEMINI_API_KEY configurada: $visible\n";
}

echo "✓ Modelo: $model\n";
echo "✓ URL base: https://generativelanguage.googleapis.com/v1beta/models/\n\n";

// 2. Verificar formato de la clave
echo "2. VALIDANDO FORMATO DE CLAVE:\n";
if (strlen($apiKey) < 30) {
    echo "⚠️  ADVERTENCIA: La clave parece muy corta (< 30 caracteres). Verifica que sea completa.\n";
} else {
    echo "✓ Longitud de clave: " . strlen($apiKey) . " caracteres\n";
}

// 3. Probar conexión básica a Google
echo "\n3. PROBANDO CONEXIÓN A GOOGLE:\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://www.google.com');
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✓ Conexión a Google: OK\n";
} else {
    echo "❌ Error de conexión a Google (HTTP $httpCode)\n";
    echo "   Verifica tu conexión de red\n";
    exit(1);
}

// 4. Probar request a Gemini API
echo "\n4. PROBANDO CONEXIÓN A GEMINI API:\n";
$testUrl = "https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=$apiKey";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $testUrl);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'contents' => [
        [
            'parts' => [
                [
                    'text' => 'Test simple: responde con "OK"'
                ]
            ]
        ]
    ]
]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

echo "HTTP Status: $httpCode\n";

if ($httpCode === 200) {
    echo "✓ API respondió exitosamente\n";
    $data = json_decode($response, true);
    if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
        echo "✓ Respuesta: " . $data['candidates'][0]['content']['parts'][0]['text'] . "\n";
    }
} elseif ($httpCode === 401) {
    echo "❌ ERROR 401 - CLAVE API INVÁLIDA O EXPIRADA\n";
    echo "   1. Verifica que copiaste la clave correctamente\n";
    echo "   2. Verifica en Google Cloud Console que la clave aún es válida\n";
    echo "   3. Asegúrate de tener billing habilitado\n";
} elseif ($httpCode === 403) {
    echo "❌ ERROR 403 - PERMISO DENEGADO\n";
    echo "   Posibles causas:\n";
    echo "   1. Billing NO habilitado en Google Cloud\n";
    echo "   2. API de Generative Language NO habilitada\n";
    echo "   3. Clave con restricciones IP que no incluyen tu servidor\n";
    echo "   4. Clave con restricciones de API que no incluyen 'Generative Language API'\n";
    echo "\n   Soluciones:\n";
    echo "   1. Abre https://console.cloud.google.com\n";
    echo "   2. Habilita 'Generative Language API'\n";
    echo "   3. Verifica que tienes un método de pago activo\n";
    echo "   4. Revisa las restricciones de tu clave API\n";
} elseif ($httpCode === 429) {
    echo "⚠️  ERROR 429 - LÍMITE DE CUOTA EXCEDIDO\n";
    echo "   Espera unos minutos o aumenta los límites en Google Cloud Console\n";
} elseif ($httpCode === 500) {
    echo "❌ ERROR 500 - ERROR DEL SERVIDOR\n";
    echo "   Es un problema de Google. Intenta de nuevo en unos minutos.\n";
} else {
    echo "❌ ERROR $httpCode\n";
    echo "Respuesta: " . substr($response, 0, 200) . "\n";
}

if ($curlError) {
    echo "Error CURL: $curlError\n";
}

echo "\n=== FIN DEL DIAGNÓSTICO ===\n";
?>
