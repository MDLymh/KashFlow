<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Show the dashboard
     */
    public function index()
    {
        $user = auth()->user();
        $currentMonth = Carbon::now();

        // Get current month transactions
        $transactions = $user->transactions()
            ->byMonthYear($currentMonth->month, $currentMonth->year)
            ->latest('transaction_date')
            ->get();

        // Calculate totals
        $income = $transactions->where('type', 'income')->sum('amount');
        $expenses = $transactions->where('type', 'expense')->sum('amount');
        $balance = $income - $expenses;

        // Get category breakdown
        $categoryBreakdown = $transactions->groupBy('category_id')
            ->map(function ($items) {
                return [
                    'category' => $items->first()->category->name,
                    'amount' => $items->sum('amount'),
                    'count' => $items->count(),
                    'color' => $items->first()->category->color,
                ];
            })
            ->values();

        // Get category breakdown by type (expenses and income separately)
        $expensesByCategory = $transactions->where('type', 'expense')
            ->groupBy('category_id')
            ->map(function ($items) {
                return [
                    'category' => $items->first()->category->name,
                    'amount' => (float) $items->sum('amount'),
                    'count' => $items->count(),
                    'color' => $items->first()->category->color,
                ];
            })
            ->values();

        $incomeByCategory = $transactions->where('type', 'income')
            ->groupBy('category_id')
            ->map(function ($items) {
                return [
                    'category' => $items->first()->category->name,
                    'amount' => (float) $items->sum('amount'),
                    'count' => $items->count(),
                    'color' => $items->first()->category->color,
                ];
            })
            ->values();

        // Get recent transactions
        $recentTransactions = $user->transactions()
            ->latest('transaction_date')
            ->limit(5)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'title' => $t->title,
                'amount' => (float) $t->amount,
                'type' => $t->type,
                'category' => $t->category->name,
                'date' => $t->transaction_date->format('Y-m-d'),
            ]);

        // Get weekly data (last 12 weeks)
        $weeklyData = $this->getTemporalData($user, 'week', 12);

        // Get monthly data (last 12 months)
        $monthlyData = $this->getTemporalData($user, 'month', 12);

        // Get yearly data (last 5 years)
        $yearlyData = $this->getTemporalData($user, 'year', 5);

        return Inertia::render('dashboard', [
            'currentMonth' => $currentMonth->format('Y-m'),
            'income' => (float) $income,
            'expenses' => (float) $expenses,
            'balance' => (float) $balance,
            'transactionCount' => $transactions->count(),
            'categoryBreakdown' => $categoryBreakdown,
            'expensesByCategory' => $expensesByCategory,
            'incomeByCategory' => $incomeByCategory,
            'recentTransactions' => $recentTransactions,
            'weeklyData' => $weeklyData,
            'monthlyData' => $monthlyData,
            'yearlyData' => $yearlyData,
        ]);
    }

    /**
     * Get temporal data for charts
     */
    private function getTemporalData($user, $period = 'week', $limit = 12)
    {
        $data = [];
        $now = Carbon::now();

        for ($i = $limit - 1; $i >= 0; $i--) {
            if ($period === 'week') {
                $startDate = (clone $now)->subWeeks($i)->startOfWeek();
                $endDate = (clone $now)->subWeeks($i)->endOfWeek();
                $label = $startDate->format('M d');
            } elseif ($period === 'month') {
                $startDate = (clone $now)->subMonths($i)->startOfMonth();
                $endDate = (clone $now)->subMonths($i)->endOfMonth();
                $label = $startDate->format('M Y');
            } else { // year
                $startDate = (clone $now)->subYears($i)->startOfYear();
                $endDate = (clone $now)->subYears($i)->endOfYear();
                $label = $startDate->format('Y');
            }

            $periodTransactions = $user->transactions()
                ->dateRange($startDate, $endDate)
                ->get();

            $income = (float) $periodTransactions->where('type', 'income')->sum('amount');
            $expenses = (float) $periodTransactions->where('type', 'expense')->sum('amount');

            $data[] = [
                'period' => $label,
                'income' => $income,
                'expenses' => $expenses,
                'balance' => $income - $expenses,
            ];
        }

        return $data;
    }
}
