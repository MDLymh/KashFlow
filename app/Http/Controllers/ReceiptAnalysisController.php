<?php

namespace App\Http\Controllers;

use App\Services\ReceiptAnalysisService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReceiptAnalysisController extends Controller
{
    protected ReceiptAnalysisService $analysisService;

    public function __construct(ReceiptAnalysisService $analysisService)
    {
        $this->analysisService = $analysisService;
    }

    /**
     * Procesar imagen de recibo y extraer datos
     */
    public function analyze(Request $request): JsonResponse
    {
        $request->validate([
            'receipt' => 'required|file|mimes:jpeg,png,jpg,pdf|max:10240'
        ]);
        

        try {
            $file = $request->file('receipt');
            $analysis = $this->analysisService->analyzeReceipt($file);
            if ($analysis['success']) {
                // Mapear categoría detectada a ID de categoría
                $categoryId = $this->analysisService->mapCategory(
                    $analysis['data']['category'],
                    'expense' // Por defecto gastos, podría ser configurable
                );

                return response()->json([
                    'success' => true,
                    'data' => array_merge($analysis['data'], [
                        'category_id' => $categoryId,
                        'type' => 'expense'
                    ])
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => $analysis['error'],
                'message' => 'No se pudo procesar la imagen. Por favor, completa los campos manualmente.'
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
