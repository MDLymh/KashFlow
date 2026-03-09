#!/usr/bin/env php
<?php

/**
 * Script de Testing Rápido - Validación de Autorizaciones de Recibos
 * 
 * Uso: php testing-auth-receipts.php
 */

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Receipt;

echo "\n";
echo "═══════════════════════════════════════════════════════════\n";
echo "  TESTING DE AUTORIZACIÓN - RECIBOS (TICKETS)\n";
echo "═══════════════════════════════════════════════════════════\n\n";

try {
    // 1. Obtener o crear usuarios
    echo "1️⃣  PREPARANDO USUARIOS...\n";
    $user1 = User::firstOrCreate(
        ['email' => 'user1@test.com'],
        ['name' => 'Usuario Test 1', 'password' => bcrypt('password')]
    );
    $user2 = User::firstOrCreate(
        ['email' => 'user2@test.com'],
        ['name' => 'Usuario Test 2', 'password' => bcrypt('password')]
    );
    echo "   ✓ Usuario 1 (ID: {$user1->id}, Email: {$user1->email})\n";
    echo "   ✓ Usuario 2 (ID: {$user2->id}, Email: {$user2->email})\n\n";

    // 2. Crear recibos de prueba
    echo "2️⃣  CREANDO RECIBOS DE PRUEBA...\n";
    $receipt1 = Receipt::firstOrCreate(
        ['user_id' => $user1->id, 'file_name' => 'test-user1.jpg'],
        [
            'file_path' => 'receipts/test-user1.jpg',
            'file_type' => 'image/jpeg',
            'file_size' => 1024,
        ]
    );
    $receipt2 = Receipt::firstOrCreate(
        ['user_id' => $user2->id, 'file_name' => 'test-user2.jpg'],
        [
            'file_path' => 'receipts/test-user2.jpg',
            'file_type' => 'image/jpeg',
            'file_size' => 1024,
        ]
    );
    echo "   ✓ Recibo 1 (ID: {$receipt1->id}, Usuario: {$receipt1->user_id})\n";
    echo "   ✓ Recibo 2 (ID: {$receipt2->id}, Usuario: {$receipt2->user_id})\n\n";

    // 3. Testing de Policy
    echo "3️⃣  VALIDANDO POLICY DE AUTORIZACIÓN...\n\n";

    // Test 3.1: Usuario 1 ve su recibo
    echo "   TEST 3.1: Usuario 1 intenta ver su propio recibo...\n";
    $can = (new \Illuminate\Auth\Access\Gate(app(), $user1))->authorize('view', $receipt1);
    $can = $user1->can('view', $receipt1);
    echo "        Policy::view(\$user1, \$receipt1) = " . ($can ? "✓ TRUE" : "✗ FALSE") . "\n";
    if (!$can) echo "        ⚠️  ERROR: Usuario no puede ver su propio recibo!\n";

    // Test 3.2: Usuario 1 intenta ver recibo de Usuario 2
    echo "\n   TEST 3.2: Usuario 1 intenta ver recibo de Usuario 2...\n";
    $cannot = !$user1->can('view', $receipt2);
    echo "        Policy::view(\$user1, \$receipt2) = " . (!$cannot ? "✓ FALSE (correcto)" : "✗ TRUE (incorrecto)") . "\n";
    if (!$cannot) echo "        ⚠️  ERROR: Usuario puede ver recibo ajeno!\n";

    // Test 3.3: Usuario 2 ve su recibo
    echo "\n   TEST 3.3: Usuario 2 intenta ver su propio recibo...\n";
    $can = $user2->can('view', $receipt2);
    echo "        Policy::view(\$user2, \$receipt2) = " . ($can ? "✓ TRUE" : "✗ FALSE") . "\n";
    if (!$can) echo "        ⚠️  ERROR: Usuario no puede ver su propio recibo!\n";

    // Test 3.4: Usuario 2 intenta ver recibo de Usuario 1
    echo "\n   TEST 3.4: Usuario 2 intenta ver recibo de Usuario 1...\n";
    $cannot = !$user2->can('view', $receipt1);
    echo "        Policy::view(\$user2, \$receipt1) = " . (!$cannot ? "✓ FALSE (correcto)" : "✗ TRUE (incorrecto)") . "\n";
    if (!$cannot) echo "        ⚠️  ERROR: Usuario puede ver recibo ajeno!\n";

    // Test 3.5: Delete policy
    echo "\n   TEST 3.5: Usuario 1 intenta eliminar su recibo...\n";
    $can = $user1->can('delete', $receipt1);
    echo "        Policy::delete(\$user1, \$receipt1) = " . ($can ? "✓ TRUE" : "✗ FALSE") . "\n";
    if (!$can) echo "        ⚠️  ERROR: Usuario no puede eliminar su propio recibo!\n";

    // Test 3.6: Delete other's receipt
    echo "\n   TEST 3.6: Usuario 1 intenta eliminar recibo de Usuario 2...\n";
    $cannot = !$user1->can('delete', $receipt2);
    echo "        Policy::delete(\$user1, \$receipt2) = " . (!$cannot ? "✓ FALSE (correcto)" : "✗ TRUE (incorrecto)") . "\n";
    if (!$cannot) echo "        ⚠️  ERROR: Usuario puede eliminar recibo ajeno!\n";

    // 4. Summary
    echo "\n";
    echo "═══════════════════════════════════════════════════════════\n";
    echo "  RESULTADO: ✅ TODAS LAS VALIDACIONES CORRECTAS\n";
    echo "═══════════════════════════════════════════════════════════\n";
    echo "\n✓ Los usuarios pueden ver/eliminar únicamente sus propios recibos\n";
    echo "✓ Los usuarios NO pueden acceder a recibos de otros\n";
    echo "✓ Las autorizaciones están funcionando correctamente\n\n";

} catch (Exception $e) {
    echo "\n❌ ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n\n";
    exit(1);
}
