<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\UserCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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
                'is_base' => $uc->category->is_base,
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
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'type' => 'required|in:income,expense',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        // Check if user already has a category with this name
        $existingNameCategory = UserCategory::where('user_id', $user->id)
            ->where('name', $validated['name'])
            ->first();

        if ($existingNameCategory) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Ya tienes una categoría con el nombre "' . $validated['name'] . '"');
        }

        $icon = $validated['icon'] ?? 'folder';
        $color = $validated['color'] ?? '#64748b';

        // Try to find an existing category with the same name, icon, and color
        // The unique key is: name + icon + color (allows same name with different icon/color combinations)
        $category = Category::where('name', $validated['name'])
            ->where('icon', $icon)
            ->where('color', $color)
            ->where('is_base', false)
            ->first();

        // If not found, create a new one with a unique slug
        if (!$category) {
            $baseSlug = Str::slug($validated['name']) . '-' . $icon . '-' . str_replace('#', '', $color);
            $slug = $baseSlug;
            $counter = 1;
            
            // Ensure slug is unique
            while (Category::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $category = Category::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'type' => $validated['type'],
                'icon' => $icon,
                'color' => $color,
                'is_base' => false, // User-created categories are not base
            ]);
        }

        // Check if user already has this exact category
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
                'icon' => $icon,
                'color' => $color,
            ]);
        }

        return redirect()->route('categories.index')
            ->with('success', 'Categoría creada exitosamente');
    }

    /**
     * Edit category
     */
    public function edit($id)
    {
        $user = auth()->guard('web')->user();
        $userCategory = UserCategory::findOrFail($id);

        // Ensure user owns this category
        if ($userCategory->user_id !== $user->id) {
            abort(403);
        }

        // Prevent editing base categories
        if ($userCategory->category->is_base) {
            return redirect()->back()
                ->with('error', 'No se pueden modificar las categorías base');
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
    public function update(Request $request, $id)
    {
        $user = auth()->guard('web')->user();
        $userCategory = UserCategory::findOrFail($id);

        // Ensure user owns this category
        if ($userCategory->user_id !== $user->id) {
            abort(403);
        }

        // Prevent updating base categories
        if ($userCategory->category->is_base) {
            return redirect()->back()
                ->with('error', 'No se pueden modificar las categorías base');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        // Check if user already has a different category with this name
        if ($validated['name'] !== $userCategory->name) {
            $existingNameCategory = UserCategory::where('user_id', $user->id)
                ->where('name', $validated['name'])
                ->where('id', '!=', $id)
                ->first();

            if ($existingNameCategory) {
                return redirect()->back()
                    ->withInput()
                    ->with('error', 'Ya tienes una categoría con el nombre "' . $validated['name'] . '"');
            }
        }

        $userCategory->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría actualizada exitosamente');
    }

    /**
     * Delete category (only user association)
     */
    public function destroy($id)
    {
        $user = auth()->guard('web')->user();
        $userCategory = UserCategory::findOrFail($id);

        // Ensure user owns this category
        if ($userCategory->user_id !== $user->id) {
            abort(403);
        }

        // Prevent deleting base categories
        if ($userCategory->category->is_base) {
            return redirect()->back()
                ->with('error', 'No se pueden eliminar las categorías base');
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
