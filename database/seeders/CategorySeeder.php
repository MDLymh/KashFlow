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
            ['name' => 'Alimentación', 'slug' => 'alimentacion', 'type' => 'expense', 'color' => '#f59e0b', 'icon' => '🍔', 'description' => 'Gastos en comida y bebidas'],
            ['name' => 'Transporte', 'slug' => 'transporte', 'type' => 'expense', 'color' => '#ef4444', 'icon' => '🚗', 'description' => 'Gastos en transporte y combustible'],
            ['name' => 'Servicios', 'slug' => 'servicios', 'type' => 'expense', 'color' => '#8b5cf6', 'icon' => '💡', 'description' => 'Servicios (agua, luz, internet, etc)'],
            ['name' => 'Salud', 'slug' => 'salud', 'type' => 'expense', 'color' => '#ec4899', 'icon' => '🏥', 'description' => 'Gastos médicos y farmacéuticos'],
            ['name' => 'Entretenimiento', 'slug' => 'entretenimiento', 'type' => 'expense', 'color' => '#3b82f6', 'icon' => '🎮', 'description' => 'Gastos en ocio y entretenimiento'],
            ['name' => 'Educación', 'slug' => 'educacion', 'type' => 'expense', 'color' => '#06b6d4', 'icon' => '📚', 'description' => 'Gastos en educación y capacitación'],
            ['name' => 'Compras', 'slug' => 'compras', 'type' => 'expense', 'color' => '#14b8a6', 'icon' => '🛍️', 'description' => 'Compras personales'],
            ['name' => 'Vivienda', 'slug' => 'vivienda', 'type' => 'expense', 'color' => '#6366f1', 'icon' => '🏠', 'description' => 'Renta, hipoteca, servicios del hogar'],
            ['name' => 'Otros', 'slug' => 'otros-gastos', 'type' => 'expense', 'color' => '#64748b', 'icon' => '📌', 'description' => 'Otros gastos'],

            // Ingresos
            ['name' => 'Salario', 'slug' => 'salario', 'type' => 'income', 'color' => '#10b981', 'icon' => '💼', 'description' => 'Ingreso por salario'],
            ['name' => 'Freelance', 'slug' => 'freelance', 'type' => 'income', 'color' => '#059669', 'icon' => '💻', 'description' => 'Ingresos por trabajo freelance'],
            ['name' => 'Inversiones', 'slug' => 'inversiones', 'type' => 'income', 'color' => '#047857', 'icon' => '📈', 'description' => 'Ingresos por inversiones'],
            ['name' => 'Bonificación', 'slug' => 'bonificacion', 'type' => 'income', 'color' => '#065f46', 'icon' => '🎁', 'description' => 'Bonificaciones y premios'],
            ['name' => 'Otros Ingresos', 'slug' => 'otros-ingresos', 'type' => 'income', 'color' => '#0d9488', 'icon' => '💰', 'description' => 'Otros ingresos'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
