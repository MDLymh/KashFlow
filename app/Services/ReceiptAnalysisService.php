<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;

class ReceiptAnalysisService
{
    protected string $apiKey;
    protected string $model;
    protected int $timeout;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key', env('GEMINI_API_KEY'));
        $this->model = config('services.gemini.model', env('GEMINI_MODEL', 'gemini-2.5-flash'));
        $this->timeout = (int) env('AI_TIMEOUT', 30);
    }

    /**
     * Analizar una imagen de recibo usando Google Gemini Vision
     */
    public function analyzeReceipt(UploadedFile $file): array
    {
        try {
            if (!$this->apiKey) {
                Log::warning('Gemini API Key no configurada');
                return $this->getDefaultResponse();
            }

            // Validar que sea una imagen o PDF
            $supportedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
            $mimeType = $file->getMimeType();
            
            if (!in_array($mimeType, $supportedMimeTypes)) {
                throw new Exception('Tipo de archivo no soportado: ' . $mimeType);
            }

            // Convertir archivo a base64
            $base64Image = base64_encode(file_get_contents($file));
            $fileSize = strlen($base64Image) / 1024; // en KB

            Log::info('Análisis de recibo iniciado', [
                'file_size_kb' => $fileSize,
                'mime_type' => $mimeType,
                'model' => $this->model
            ]);

            // Llamar a Gemini Vision API
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'x-goog-api-key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post('https://generativelanguage.googleapis.com/v1beta/models/' . $this->model . ':generateContent', [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => 'Analiza esta imagen de un recibo o factura y extrae la siguiente información en formato JSON: 
                                    {
                                        "title": "Descripción breve del recibo (ej: Almuerzo, Gasolina, Medicinas)",
                                        "description": "Detalles adicionales si los hay",
                                        "amount": número (solo el total, sin símbolo de moneda),
                                        "category": "Categoría detectada (ej: Comida, Transporte, Salud, etc.)",
                                        "merchant": "Nombre del comercio o establecimiento",
                                        "date": "Fecha en formato YYYY-MM-DD si está disponible, sino null",
                                        "confidence": 0.0 a 1.0 (nivel de confianza en la extracción)
                                    }
                                    Sé preciso y extrae solo información visible en el recibo. Si algo no está claro, usa null.'
                                ],
                                [
                                    'inlineData' => [
                                        'mimeType' => $mimeType,
                                        'data' => $base64Image
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]);

            // Manejo de errores HTTP
            if (!$response->successful()) {
                $status = $response->status();
                $errorBody = $response->body();
                
                Log::error('Error en Gemini API', [
                    'status' => $status,
                    'error' => $errorBody,
                    'model' => $this->model
                ]);

                $errorMessage = match($status) {
                    400 => 'Solicitud inválida a Gemini API. Verifica el formato de la imagen.',
                    401 => 'API Key inválida o expirada. Verifica GEMINI_API_KEY en .env',
                    403 => 'Acceso prohibido. La API Key no tiene permisos. Verifica que la API esté habilitada en Google Cloud Console.',
                    429 => 'Límite de solicitudes excedido. Intenta de nuevo en unos momentos.',
                    500 => 'Error interno de Gemini API. Intenta de nuevo.',
                    default => "Error en la API de Gemini: $status",
                };

                throw new Exception($errorMessage);
            }

            // Parsear la respuesta
            $content = $response->json();
            
            if (!isset($content['candidates'][0]['content']['parts'][0]['text'])) {
                Log::error('Respuesta inesperada de Gemini', [
                    'response' => $content
                ]);
                throw new Exception('Respuesta inesperada de Gemini. Intenta de nuevo.');
            }

            $text = $content['candidates'][0]['content']['parts'][0]['text'];
            
            // Extraer JSON de la respuesta
            $jsonMatch = [];
            preg_match('/\{[\s\S]*\}/', $text, $jsonMatch);
            
            if (empty($jsonMatch)) {
                Log::error('No se pudo extraer JSON', [
                    'response_text' => $text
                ]);
                throw new Exception('No se pudo extraer datos de la respuesta de Gemini.');
            }

            $extractedData = json_decode($jsonMatch[0], true);

            if ($extractedData === null) {
                throw new Exception('Error al parsear JSON de la respuesta.');
            }

            Log::info('Análisis completado exitosamente', [
                'confidence' => $extractedData['confidence'] ?? 0
            ]);

            return [
                'success' => true,
                'data' => [
                    'title' => $extractedData['title'] ?? '',
                    'description' => $extractedData['description'] ?? '',
                    'amount' => (float) ($extractedData['amount'] ?? 0),
                    'category' => $extractedData['category'] ?? '',
                    'merchant' => $extractedData['merchant'] ?? '',
                    'date' => $extractedData['date'] ?? null,
                    'confidence' => $extractedData['confidence'] ?? 0.5,
                ],
                'raw_response' => $text
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'data' => $this->getDefaultResponse()['data']
            ];
        }
    }

    /**
     * Respuesta por defecto cuando no hay API key
     */
    protected function getDefaultResponse(): array
    {
        return [
            'success' => false,
            'error' => 'API de Gemini no configurada',
            'data' => [
                'title' => '',
                'description' => '',
                'amount' => 0,
                'category' => '',
                'merchant' => '',
                'date' => null,
                'confidence' => 0
            ]
        ];
    }

    /**
     * Mapear categoría detectada a categoría de la app
     */
    public function mapCategory(string $detectedCategory, string $type = 'expense'): ?int
    {
        $categoryMapping = [
            // Gastos de comida
            'comida' => 'Comida',
            'restaurante' => 'Comida',
            'almuerzo' => 'Comida',
            'desayuno' => 'Comida',
            'cena' => 'Comida',
            'café' => 'Comida',
            
            // Transporte
            'gasolina' => 'Transporte',
            'taxi' => 'Transporte',
            'uber' => 'Transporte',
            'autobús' => 'Transporte',
            'estacionamiento' => 'Transporte',
            'transporte' => 'Transporte',
            
            // Salud
            'farmacia' => 'Salud',
            'medicina' => 'Salud',
            'hospital' => 'Salud',
            'médico' => 'Salud',
            'salud' => 'Salud',
            
            // Entretenimiento
            'cine' => 'Entretenimiento',
            'película' => 'Entretenimiento',
            'concierto' => 'Entretenimiento',
            'entretenimiento' => 'Entretenimiento',
            
            // Utilidades
            'agua' => 'Utilidades',
            'luz' => 'Utilidades',
            'internet' => 'Utilidades',
            'teléfono' => 'Utilidades',
            'servicios' => 'Utilidades',
            'utilidades' => 'Utilidades',
        ];

        $normalized = strtolower($detectedCategory);
        
        foreach ($categoryMapping as $key => $value) {
            if (stripos($normalized, $key) !== false) {
                // Encontrar la categoría en la base de datos
                $category = \App\Models\Category::where('name', $value)
                    ->where('type', $type)
                    ->first();
                
                return $category?->id;
            }
        }

        // Si no hay coincidencia, retornar la primera categoría del tipo
        $category = \App\Models\Category::where('type', $type)->first();
        return $category?->id;
    }
}
