<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_export_monthly_report_as_excel(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);
        
        // Create some transactions
        Transaction::factory()
            ->count(3)
            ->create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'type' => 'income',
            ]);
        
        Transaction::factory()
            ->count(2)
            ->create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'type' => 'expense',
            ]);
        
        $response = $this->actingAs($user)->get(route('reports.export', [
            'type' => 'monthly',
            'month' => now()->month,
            'year' => now()->year,
        ]));
        
        $response->assertSuccessful();
        $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->assertHeader('Content-Disposition');
    }

    public function test_can_export_custom_date_range_report_as_excel(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);
        
        // Create some transactions
        Transaction::factory()
            ->count(5)
            ->create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'transaction_date' => now()->subDays(15),
            ]);
        
        $response = $this->actingAs($user)->get(route('reports.export', [
            'type' => 'custom',
            'startDate' => now()->subMonth()->format('Y-m-d'),
            'endDate' => now()->format('Y-m-d'),
        ]));
        
        $response->assertSuccessful();
        $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_export_requires_authentication(): void
    {
        $response = $this->get(route('reports.export', [
            'type' => 'monthly',
        ]));
        
        $response->assertRedirect(route('login'));
    }
}
