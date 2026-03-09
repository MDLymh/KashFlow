<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\UserCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Show categories for the authenticated user
     */
    public function index(Request $request)
    {
        $user = auth()->guard('web')->user();
        $type = $request->query('type', null);

        // Get user's categories
        $query = UserCategory::where('user_id', $user->id);
        
        if ($type) {
            $query->whereHas('category', function ($q) use ($type) {
                $q->where('type', $type);
            });
        }

        $categories = $query->with('category')
            ->get()
            ->map(fn($uc) => [
                'id' => $uc->id,
                'name' => $uc->name,
                'slug' => $uc->category->slug,
                'description' => $uc->description,
                'icon' => $uc->icon,
                'type' => $uc->category->type,
                'color' => $uc->color,
                'transactionCount' => $user->transactions()
                    ->where('category_id', $uc->category_id)
                    ->count(),
                'isOtros' => in_array(strtolower($uc->category->slug), ['otros', 'otros-gastos', 'otros-ingresos']),
                'categoryId' => $uc->category_id,
            ]);

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filterType' => $type,
        ]);
    }

    /**
     * Create category
     */
    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    /**
     * Store category
     */
    public function store(Request $request)
    {
        $user = auth()->guard('web')->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'type' => 'required|in:income,expense',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        // Find or create the base category
        $category = Category::firstOrCreate(
            ['slug' => $validated['slug']],
            [
                'name' => $validated['name'],
                'type' => $validated['type'],
                'icon' => $validated['icon'] ?? '📁',
                'color' => $validated['color'] ?? '#64748b',
            ]
        );

        // Check if user already has this category
        $existingUserCategory = UserCategory::where('user_id', $user->id)
            ->where('category_id', $category->id)
            ->first();

        if (!$existingUserCategory) {
            // Create user category association
            UserCategory::create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'name' => $validated['name'],
                'description' => $validated['description'],
                'icon' => $validated['icon'] ?? '📁',
                'color' => $validated['color'] ?? '#64748b',
            ]);
        }

        return redirect()->route('categories.index')
            ->with('success', 'Categoría creada exitosamente');
    }

    /**
     * Edit category
     */
    public function edit(UserCategory $userCategory)
    {
        // Ensure user owns this category
        if ($userCategory->user_id !== auth()->guard('web')->id()) {
            abort(403);
        }

        return Inertia::render('Categories/Edit', [
            'category' => [
                'id' => $userCategory->id,
                'name' => $userCategory->name,
                'slug' => $userCategory->category->slug,
                'description' => $userCategory->description,
                'icon' => $userCategory->icon,
                'type' => $userCategory->category->type,
                'color' => $userCategory->color,
            ],
        ]);
    }

    /**
     * Update category
     */
    public function update(Request $request, UserCategory $userCategory)
    {
        // Ensure user owns this category
        if ($userCategory->user_id !== auth()->guard('web')->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $userCategory->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría actualizada exitosamente');
    }

    /**
     * Delete category (only user association)
     */
    public function destroy(UserCategory $userCategory)
    {
        $user = auth()->guard('web')->user();

        // Ensure user owns this category
        if ($userCategory->user_id !== $user->id) {
            abort(403);
        }

        // Prevent deleting 'Otros' category
        if (in_array(strtolower($userCategory->category->slug), ['otros', 'otros-gastos', 'otros-ingresos'])) {
            return redirect()->back()
                ->with('error', 'No se puede eliminar la categoría "Otros"');
        }

        try {
            // Get count of user's transactions in this category
            $transactionCount = $user->transactions()
                ->where('category_id', $userCategory->category_id)
                ->count();
            
            // If category has transactions, reassign them to "Otros"
            if ($transactionCount > 0) {
                // Determine the correct slug for "Otros" based on category type
                $otherSlug = $userCategory->category->type === 'income' ? 'otros-ingresos' : 'otros-gastos';
                
                // Find the "Otros" category for the same type
                $otherCategory = Category::where('slug', $otherSlug)
                    ->where('type', $userCategory->category->type)
                    ->first();

                if ($otherCategory) {
                    // Reassign all user's transactions
                    $user->transactions()
                        ->where('category_id', $userCategory->category_id)
                        ->update(['category_id' => $otherCategory->id]);
                }
            }

            // Delete only the user's category association
            $userCategory->delete();

            $message = $transactionCount > 0 
                ? "Categoría eliminada exitosamente. {$transactionCount} transacciones se han movido a \"Otros\""
                : 'Categoría eliminada exitosamente';

            return redirect()->route('categories.index')
                ->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Error deleting user category: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error al eliminar la categoría: ' . $e->getMessage());
        }
    }
}
