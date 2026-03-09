<?php

return [
    /*
     * Configuración de KashFlow
     */

    'currency' => env('APP_CURRENCY', 'COP'),
    'currency_symbol' => env('APP_CURRENCY_SYMBOL', '$'),
    'locale' => env('APP_LOCALE', 'es'),

    /*
     * Configuración de almacenamiento de recibos
     */
    'receipts' => [
        'disk' => 'public',
        'path' => 'receipts',
        'max_file_size' => 10240, // en KB (10MB)
        'allowed_extensions' => ['pdf', 'jpg', 'jpeg', 'png'],
    ],

    /*
     * Configuración de procesamiento de IA
     */
    'ai' => [
        'enabled' => env('AI_PROCESSING_ENABLED', false),
        'provider' => env('AI_PROVIDER', 'openai'), // openai, google-vision, etc
        'api_key' => env('AI_API_KEY', ''),
        'model' => env('AI_MODEL', 'gpt-4-vision-preview'),
        'timeout' => env('AI_TIMEOUT', 30),
    ],

    /*
     * Límites y restricciones
     */
    'limits' => [
        'max_transactions_per_month' => 999999,
        'max_categories' => 999999,
        'report_history_years' => 5,
    ],
];
