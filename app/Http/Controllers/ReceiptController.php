<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReceiptController extends Controller
{
    // Middleware se aplica desde routes/web.php
    /**
     * Show receipts list
     */
    public function index()
    {
        $user = auth()->guard('web')->user();
        
        $receipts = $user->receipts()
            ->with('transaction')
            ->latest()
            ->paginate(15)
            ->map(fn($r) => [
                'id' => $r->id,
                'fileName' => $r->file_name,
                'filePath' => $r->file_path,
                'fileType' => $r->file_type,
                'transaction' => $r->transaction ? [
                    'id' => $r->transaction->id,
                    'title' => $r->transaction->title,
                ] : null,
                'extractedData' => $r->extracted_data,
                'createdAt' => $r->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Receipts/Index', [
            'receipts' => $receipts,
        ]);
    }

    /**
     * Upload receipt
     */
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $user = auth()->guard('web')->user();
        $path = $request->file('file')->store('receipts', 'public');

        $receipt = $user->receipts()->create([
            'file_path' => $path,
            'file_name' => $request->file('file')->getClientOriginalName(),
            'file_type' => $request->file('file')->getMimeType(),
            'file_size' => $request->file('file')->getSize(),
        ]);

        // TODO: Dispatch job to process receipt with AI

        return response()->json([
            'success' => true,
            'receipt' => [
                'id' => $receipt->id,
                'fileName' => $receipt->file_name,
            ],
        ]);
    }

    /**
     * Show receipt detail
     */
    public function show(Receipt $receipt)
    {
        // La policy ya fue validada en el middleware
        // Solo retornamos los datos del recibo
        return Inertia::render('Receipts/Show', [
            'receipt' => [
                'id' => $receipt->id,
                'fileName' => $receipt->file_name,
                'filePath' => $receipt->file_path,
                'fileType' => $receipt->file_type,
                'extractedData' => $receipt->extracted_data,
                'transaction' => $receipt->transaction ? [
                    'id' => $receipt->transaction->id,
                    'title' => $receipt->transaction->title,
                    'amount' => (float) $receipt->transaction->amount,
                ] : null,
            ],
        ]);
    }

    /**
     * Delete receipt
     */
    public function destroy(Receipt $receipt)
    {
        // La policy ya fue validada en el middleware
        $receipt->delete();

        return redirect()->route('receipts.index')
            ->with('success', 'Recibo eliminado exitosamente');
    }

    /**
     * Download/View receipt file
     * Valida que el usuario sea dueño del recibo
     */
    public function downloadFile(Receipt $receipt)
    {
        // Validar que el usuario es dueño del recibo
        if ($receipt->user_id !== auth()->id()) {
            abort(403, 'No autorizado para descargar este archivo');
        }

        // Obtener la ruta completa del archivo
        $filePath = storage_path('app/public/' . $receipt->file_path);

        // Validar que el archivo existe
        if (!file_exists($filePath)) {
            abort(404, 'Archivo no encontrado');
        }

        // Descargar o mostrar el archivo
        return response()->file($filePath, [
            'Content-Disposition' => 'inline; filename="' . $receipt->file_name . '"',
        ]);
    }
}
