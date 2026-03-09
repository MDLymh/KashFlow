<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Show transactions list
     */
    public function index(Request $request)
    {
        $user = auth()->guard('web')->user();
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);

        $transactions = $user->transactions()
            ->byMonthYear($month, $year)
            ->with('category')
            ->latest('transaction_date')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'title' => $t->title,
                'description' => $t->description,
                'amount' => (float) $t->amount,
                'type' => $t->type,
                'category' => $t->category?->name,
                'categoryColor' => $t->category?->color,
                'date' => $t->transaction_date->format('Y-m-d'),
                'hasReceipt' => $t->receipt_path ? true : false,
            ]);

        // Get user's categories (via UserCategory association)
        $categories = $user->userCategories()
            ->with('category')
            ->get()
            ->map(fn($uc) => [
                'id' => $uc->category_id,
                'name' => $uc->name,
                'type' => $uc->category->type,
                'color' => $uc->color,
            ]);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'categories' => $categories,
            'currentMonth' => $month,
            'currentYear' => $year,
        ]);
    }

    /**
     * Show create form
     */
    public function create()
    {
        $user = auth()->guard('web')->user();
        
        // Get user's categories (via UserCategory association)
        $categories = $user->userCategories()
            ->with('category')
            ->get()
            ->map(fn($uc) => [
                'id' => $uc->category_id,
                'name' => $uc->name,
                'type' => $uc->category->type,
                'color' => $uc->color,
                'icon' => $uc->icon,
            ]);

        return Inertia::render('Transactions/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store transaction
     */
    public function store(Request $request)
    {
        $user = auth()->guard('web')->user();
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:income,expense',
            'category_id' => 'required|exists:categories,id',
            'transaction_date' => 'required|date',
            'receipt' => 'nullable|image|mimes:jpeg,png,jpg,pdf|max:10240',
        ]);

        // Verify that the category belongs to this user
        $userCategory = $user->userCategories()
            ->where('category_id', $validated['category_id'])
            ->first();

        if (!$userCategory) {
            return redirect()->back()
                ->with('error', 'La categoría seleccionada no es válida');
        }

        $transaction = $user->transactions()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'type' => $validated['type'],
            'category_id' => $validated['category_id'],
            'transaction_date' => $validated['transaction_date'],
        ]);

        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('receipts', 'public');
            
            $transaction->receipt()->create([
                'user_id' => $user->id,
                'file_path' => $path,
                'file_name' => $request->file('receipt')->getClientOriginalName(),
                'file_type' => $request->file('receipt')->getMimeType(),
                'file_size' => $request->file('receipt')->getSize(),
            ]);
        }

        return redirect()->route('transactions.index')
            ->with('success', 'Transacción creada exitosamente');
    }

    /**
     * Show transaction detail
     */
    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);

        $data = [
            'id' => $transaction->id,
            'title' => $transaction->title,
            'description' => $transaction->description,
            'amount' => (float) $transaction->amount,
            'type' => $transaction->type,
            'category' => $transaction->category->name,
            'categoryId' => $transaction->category_id,
            'date' => $transaction->transaction_date->format('Y-m-d'),
            'receipt' => $transaction->receipt ? [
                'id' => $transaction->receipt->id,
                'fileName' => $transaction->receipt->file_name,
                'filePath' => $transaction->receipt->file_path,
                'extractedData' => $transaction->receipt->extracted_data,
            ] : null,
        ];

        return Inertia::render('Transactions/Show', [
            'transaction' => $data,
        ]);
    }

    /**
     * Show edit form
     */
    public function edit(Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $user = auth()->guard('web')->user();
        
        // Get user's categories (via UserCategory association)
        $categories = $user->userCategories()
            ->with('category')
            ->get()
            ->map(fn($uc) => [
                'id' => $uc->category_id,
                'name' => $uc->name,
                'type' => $uc->category->type,
                'color' => $uc->color,
            ]);

        return Inertia::render('Transactions/Edit', [
            'transaction' => [
                'id' => $transaction->id,
                'title' => $transaction->title,
                'description' => $transaction->description,
                'amount' => (float) $transaction->amount,
                'type' => $transaction->type,
                'categoryId' => $transaction->category_id,
                'date' => $transaction->transaction_date->format('Y-m-d'),
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Update transaction
     */
    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:income,expense',
            'category_id' => 'required|exists:categories,id',
            'transaction_date' => 'required|date',
        ]);

        $transaction->update($validated);

        return redirect()->route('transactions.show', $transaction)
            ->with('success', 'Transacción actualizada exitosamente');
    }

    /**
     * Delete transaction
     */
    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);

        $transaction->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Transacción eliminada exitosamente');
    }
}
