<?php

require 'vendor/autoload.php';

use App\Exports\ReportExport;

// Test data
$data = [
    [
        'date' => '2025-01-01',
        'title' => 'Test Transaction',
        'category' => 'Test Category',
        'type' => 'income',
        'amount' => 100.50
    ],
    [
        'date' => '2025-01-02',
        'title' => 'Another Transaction',
        'category' => 'Another Category',
        'type' => 'expense',
        'amount' => 50.25
    ]
];

try {
    // Create export instance
    $export = new ReportExport($data);
    echo "✓ ReportExport created successfully\n";
    
    // Get collection
    $collection = $export->collection();
    echo "✓ Collection generated with " . $collection->count() . " items\n";
    
    // Get headings
    $headings = $export->headings();
    echo "✓ Headings: " . implode(', ', $headings) . "\n";
    
    // Print collection items
    echo "\nCollection items:\n";
    foreach ($collection as $item) {
        echo json_encode($item) . "\n";
    }
    
    echo "\n✓ All tests passed!\n";
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
