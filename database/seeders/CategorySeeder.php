<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Gastos
            ['name' => 'Alimentación', 'slug' => 'alimentacion', 'type' => 'expense', 'color' => '#f59e0b', 'icon' => 'utensils', 'description' => 'Gastos en comida y bebidas'],
            ['name' => 'Transporte', 'slug' => 'transporte', 'type' => 'expense', 'color' => '#ef4444', 'icon' => 'car', 'description' => 'Gastos en transporte y combustible'],
            ['name' => 'Servicios', 'slug' => 'servicios', 'type' => 'expense', 'color' => '#8b5cf6', 'icon' => 'lightbulb', 'description' => 'Servicios (agua, luz, internet, etc)'],
            ['name' => 'Salud', 'slug' => 'salud', 'type' => 'expense', 'color' => '#ec4899', 'icon' => 'heart-pulse', 'description' => 'Gastos médicos y farmacéuticos'],
            ['name' => 'Entretenimiento', 'slug' => 'entretenimiento', 'type' => 'expense', 'color' => '#3b82f6', 'icon' => 'gamepad2', 'description' => 'Gastos en ocio y entretenimiento'],
            ['name' => 'Educación', 'slug' => 'educacion', 'type' => 'expense', 'color' => '#06b6d4', 'icon' => 'book-open', 'description' => 'Gastos en educación y capacitación'],
            ['name' => 'Compras', 'slug' => 'compras', 'type' => 'expense', 'color' => '#14b8a6', 'icon' => 'shopping-bag', 'description' => 'Compras personales'],
            ['name' => 'Vivienda', 'slug' => 'vivienda', 'type' => 'expense', 'color' => '#6366f1', 'icon' => 'home', 'description' => 'Renta, hipoteca, servicios del hogar'],
            ['name' => 'Otros', 'slug' => 'otros-gastos', 'type' => 'expense', 'color' => '#64748b', 'icon' => 'folder', 'description' => 'Otros gastos'],

            // Ingresos
            ['name' => 'Salario', 'slug' => 'salario', 'type' => 'income', 'color' => '#10b981', 'icon' => 'briefcase', 'description' => 'Ingreso por salario'],
            ['name' => 'Freelance', 'slug' => 'freelance', 'type' => 'income', 'color' => '#059669', 'icon' => 'laptop', 'description' => 'Ingresos por trabajo freelance'],
            ['name' => 'Inversiones', 'slug' => 'inversiones', 'type' => 'income', 'color' => '#047857', 'icon' => 'trending-up', 'description' => 'Ingresos por inversiones'],
            ['name' => 'Bonificación', 'slug' => 'bonificacion', 'type' => 'income', 'color' => '#065f46', 'icon' => 'gift', 'description' => 'Bonificaciones y premios'],
            ['name' => 'Otros Ingresos', 'slug' => 'otros-ingresos', 'type' => 'income', 'color' => '#0d9488', 'icon' => 'coins', 'description' => 'Otros ingresos'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                array_merge($category, ['is_base' => true])
            );
        }
    }
}
