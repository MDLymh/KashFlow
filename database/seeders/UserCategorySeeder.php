<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use App\Models\UserCategory;
use Illuminate\Database\Seeder;

class UserCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();

        // Get the "Otros" categories
        $otrosExpense = Category::where('slug', 'otros-gastos')->first();
        $otrosIncome = Category::where('slug', 'otros-ingresos')->first();

        foreach ($users as $user) {
            // Add "Otros" categories to each user if they don't already have them
            if ($otrosExpense) {
                UserCategory::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'category_id' => $otrosExpense->id,
                    ],
                    [
                        'name' => $otrosExpense->name,
                        'description' => $otrosExpense->description,
                        'icon' => $otrosExpense->icon,
                        'color' => $otrosExpense->color,
                    ]
                );
            }

            if ($otrosIncome) {
                UserCategory::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'category_id' => $otrosIncome->id,
                    ],
                    [
                        'name' => $otrosIncome->name,
                        'description' => $otrosIncome->description,
                        'icon' => $otrosIncome->icon,
                        'color' => $otrosIncome->color,
                    ]
                );
            }
        }
    }
}
