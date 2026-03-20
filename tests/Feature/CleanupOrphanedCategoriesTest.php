<?php

namespace Tests\Feature;

use App\Jobs\CleanupOrphanedCategories;
use App\Models\Category;
use App\Models\User;
use App\Models\UserCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CleanupOrphanedCategoriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_cleanup_deletes_orphaned_categories()
    {
        // Create a user
        $user = User::factory()->create();

        // Create a category with an association
        $category1 = Category::create([
            'name' => 'Groceries',
            'slug' => 'groceries-shopping-cart-ff5733',
            'type' => 'expense',
            'icon' => 'shopping-cart',
            'color' => '#ff5733',
            'is_base' => false,
        ]);

        UserCategory::create([
            'user_id' => $user->id,
            'category_id' => $category1->id,
            'name' => 'Groceries',
            'icon' => 'shopping-cart',
            'color' => '#ff5733',
        ]);

        // Create an orphaned category (no user association)
        $category2 = Category::create([
            'name' => 'Orphaned Category',
            'slug' => 'orphaned-category-folder-64748b',
            'type' => 'expense',
            'icon' => 'folder',
            'color' => '#64748b',
            'is_base' => false,
        ]);

        // Verify categories exist
        $this->assertDatabaseHas('categories', ['id' => $category1->id]);
        $this->assertDatabaseHas('categories', ['id' => $category2->id]);

        // Run the cleanup job
        (new CleanupOrphanedCategories())->handle();

        // Verify the associated category still exists
        $this->assertDatabaseHas('categories', ['id' => $category1->id]);

        // Verify the orphaned category was deleted
        $this->assertDatabaseMissing('categories', ['id' => $category2->id]);
    }

    public function test_cleanup_does_not_delete_base_categories()
    {
        // Create a base category with no associations
        $baseCategory = Category::create([
            'name' => 'Base Salary',
            'slug' => 'base-salary',
            'type' => 'income',
            'icon' => 'briefcase',
            'color' => '#4CAF50',
            'is_base' => true,
        ]);

        // Run the cleanup job
        (new CleanupOrphanedCategories())->handle();

        // Verify the base category still exists
        $this->assertDatabaseHas('categories', ['id' => $baseCategory->id]);
    }

    public function test_multiple_categories_with_same_name_but_different_icon_color()
    {
        // Create a user
        $user = User::factory()->create();

        // Create first category with Groceries + shopping-cart + red
        $category1 = Category::create([
            'name' => 'Groceries',
            'slug' => 'groceries-shopping-cart-ff5733',
            'type' => 'expense',
            'icon' => 'shopping-cart',
            'color' => '#ff5733',
            'is_base' => false,
        ]);

        // Create second category with Groceries + shopping-bag + blue (different icon and color)
        $category2 = Category::create([
            'name' => 'Groceries',
            'slug' => 'groceries-shopping-bag-3498db',
            'type' => 'expense',
            'icon' => 'shopping-bag',
            'color' => '#3498db',
            'is_base' => false,
        ]);

        // Both should exist as separate categories
        $this->assertDatabaseHas('categories', ['id' => $category1->id]);
        $this->assertDatabaseHas('categories', ['id' => $category2->id]);

        // User associates with both
        UserCategory::create([
            'user_id' => $user->id,
            'category_id' => $category1->id,
            'name' => 'Groceries',
            'icon' => 'shopping-cart',
            'color' => '#ff5733',
        ]);

        UserCategory::create([
            'user_id' => $user->id,
            'category_id' => $category2->id,
            'name' => 'Groceries',
            'icon' => 'shopping-bag',
            'color' => '#3498db',
        ]);

        // Run cleanup
        (new CleanupOrphanedCategories())->handle();

        // Both categories should still exist
        $this->assertDatabaseHas('categories', ['id' => $category1->id]);
        $this->assertDatabaseHas('categories', ['id' => $category2->id]);
    }
}
