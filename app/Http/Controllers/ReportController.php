<?php

namespace App\Http\Controllers;

use App\Models\MonthlyReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Transaction;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    /**
     * Show unified reports view
     */
    public function index(Request $request)
    {
        $user = auth()->guard('web')->user();
        $reportType = $request->query('type', 'monthly');
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);

        // Validar rango de fechas (máximo 1 año)
        if ($startDate && $endDate) {
            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);
            if ($end->diffInDays($start) > 365) {
                $endDate = $start->copy()->addYear()->format('Y-m-d');
            }
        }

        $transactions = [];
        $categoryBreakdown = [];
        $totals = [];
        $dates = [];
        $monthlyReports = [];

        if ($reportType === 'monthly') {
            $result = $this->getMonthlyReport($user, $month, $year);
            $transactions = $result['transactions'];
            $categoryBreakdown = $result['categoryBreakdown'];
            $totals = $result['totals'];
            $dates = $result['dates'];
        } elseif ($reportType === 'yearly') {
            $result = $this->getYearlyReport($user, $year);
            $monthlyReports = $result['monthlyReports'];
            $totals = $result['totals'];
            $dates = $result['dates'];
        } elseif ($reportType === 'custom' && $startDate && $endDate) {
            $result = $this->getCustomDateReport($user, $startDate, $endDate);
            $transactions = $result['transactions'];
            $categoryBreakdown = $result['categoryBreakdown'];
            $totals = $result['totals'];
            $dates = $result['dates'];
        }

        return Inertia::render('Reports/Index', [
            'reportType' => $reportType,
            'transactions' => $transactions,
            'categoryBreakdown' => $categoryBreakdown,
            'monthlyReports' => $monthlyReports,
            'totals' => $totals,
            'dates' => $dates,
            'currentMonth' => $month,
            'currentYear' => $year,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }

    /**
     * Export report as Excel
     */
    public function export(Request $request)
    {
        $user = auth()->guard('web')->user();
        $reportType = $request->query('type', 'monthly');
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);

        $transactions = [];

        if ($reportType === 'monthly') {
            $result = $this->getMonthlyReport($user, $month, $year);
            $transactions = $result['transactions'];
        } elseif ($reportType === 'custom' && $startDate && $endDate) {
            $result = $this->getCustomDateReport($user, $startDate, $endDate);
            $transactions = $result['transactions'];
        }

        // Create Excel export
        $filename = "reporte_{$reportType}_" . now()->format('Y-m-d_His') . ".xlsx";
        
        return Excel::download(new \App\Exports\ReportExport($transactions), $filename);
    }

    /**
     * Get monthly report data
     */
    private function getMonthlyReport($user, $month, $year)
    {
        $transactions = $user->transactions()
            ->byMonthYear($month, $year)
            ->with('category')
            ->latest('transaction_date')
            ->get();

        $income = $transactions->where('type', 'income')->sum('amount');
        $expense = $transactions->where('type', 'expense')->sum('amount');

        $mapped = $transactions->map(fn($t) => [
            'id' => $t->id,
            'title' => $t->title,
            'amount' => (float) $t->amount,
            'type' => $t->type,
            'category' => $t->category?->name ?? 'Sin categoría',
            'categoryColor' => $t->category?->color ?? '#6B7280',
            'date' => $t->transaction_date->format('Y-m-d'),
        ])->toArray();

        $categoryBreakdown = $transactions->groupBy('category_id')
            ->map(function ($items) {
                $category = $items->first()->category;
                return [
                    'category' => $category?->name ?? 'Sin categoría',
                    'amount' => (float) $items->sum('amount'),
                    'count' => $items->count(),
                    'color' => $category?->color ?? '#6B7280',
                ];
            })
            ->values()
            ->toArray();

        return [
            'transactions' => $mapped,
            'categoryBreakdown' => $categoryBreakdown,
            'totals' => [
                'income' => (float) $income,
                'expense' => (float) $expense,
                'balance' => (float) ($income - $expense),
            ],
            'dates' => [
                'month' => $month,
                'year' => $year,
                'monthName' => Carbon::createFromDate($year, $month, 1)->translatedFormat('F'),
            ],
        ];
    }

    /**
     * Get yearly report data
     */
    private function getYearlyReport($user, $year)
    {
        $monthlyReports = [];
        $totalIncome = 0;
        $totalExpense = 0;

        for ($month = 1; $month <= 12; $month++) {
            $transactions = $user->transactions()
                ->byMonthYear($month, $year)
                ->get();

            $income = (float) $transactions->where('type', 'income')->sum('amount');
            $expense = (float) $transactions->where('type', 'expense')->sum('amount');

            $monthlyReports[] = [
                'month' => $month,
                'monthName' => Carbon::createFromDate($year, $month, 1)->translatedFormat('F'),
                'income' => $income,
                'expense' => $expense,
                'balance' => $income - $expense,
            ];

            $totalIncome += $income;
            $totalExpense += $expense;
        }

        return [
            'monthlyReports' => $monthlyReports,
            'totals' => [
                'income' => (float) $totalIncome,
                'expense' => (float) $totalExpense,
                'balance' => (float) ($totalIncome - $totalExpense),
            ],
            'dates' => [
                'year' => $year,
            ],
        ];
    }

    /**
     * Get custom date range report data
     */
    private function getCustomDateReport($user, $startDate, $endDate)
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        // Validar máximo 1 año
        if ($end->diffInDays($start) > 365) {
            $end = $start->copy()->addYear();
        }

        $transactions = $user->transactions()
            ->whereBetween('transaction_date', [$start, $end])
            ->with('category')
            ->latest('transaction_date')
            ->get();

        $income = $transactions->where('type', 'income')->sum('amount');
        $expense = $transactions->where('type', 'expense')->sum('amount');

        $mapped = $transactions->map(fn($t) => [
            'id' => $t->id,
            'title' => $t->title,
            'amount' => (float) $t->amount,
            'type' => $t->type,
            'category' => $t->category?->name ?? 'Sin categoría',
            'categoryColor' => $t->category?->color ?? '#6B7280',
            'date' => $t->transaction_date->format('Y-m-d'),
        ])->toArray();

        $categoryBreakdown = $transactions->groupBy('category_id')
            ->map(function ($items) {
                $category = $items->first()->category;
                return [
                    'category' => $category?->name ?? 'Sin categoría',
                    'amount' => (float) $items->sum('amount'),
                    'count' => $items->count(),
                    'color' => $category?->color ?? '#6B7280',
                ];
            })
            ->values()
            ->toArray();

        return [
            'transactions' => $mapped,
            'categoryBreakdown' => $categoryBreakdown,
            'totals' => [
                'income' => (float) $income,
                'expense' => (float) $expense,
                'balance' => (float) ($income - $expense),
            ],
            'dates' => [
                'startDate' => $start->format('Y-m-d'),
                'endDate' => $end->format('Y-m-d'),
            ],
        ];
    }

    /**
    public function monthly(Request $request)
    {
        $user = auth()->guard('web')->user();
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);

        // Get or create report
        $report = MonthlyReport::firstOrCreate(
            [
                'user_id' => $user->id,
                'year' => $year,
                'month' => $month,
            ],
            $this->calculateMonthlyReport($user, $year, $month)
        );

        // Get transactions for the month
        $transactions = $user->transactions()
            ->byMonthYear($month, $year)
            ->with('category')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'title' => $t->title,
                'amount' => (float) $t->amount,
                'type' => $t->type,
                'category' => $t->category?->name,
                'categoryColor' => $t->category?->color,
                'date' => $t->transaction_date->format('Y-m-d'),
            ]);

        // Group by category
        $categoryBreakdown = $transactions->groupBy('category')
            ->map(function ($items) {
                return [
                    'category' => $items->first()['category'],
                    'amount' => $items->sum('amount'),
                    'count' => $items->count(),
                    'color' => $items->first()['categoryColor'],
                ];
            })
            ->values();

        $dates = [
            'month' => $month,
            'year' => $year,
            'monthName' => Carbon::createFromDate($year, $month, 1)->translatedFormat('F'),
        ];

        return Inertia::render('Reports/Monthly', [
            'report' => [
                'totalIncome' => (float) $report->total_income,
                'totalExpense' => (float) $report->total_expense,
                'netBalance' => (float) $report->net_balance,
                'incomeCount' => $report->income_count,
                'expenseCount' => $report->expense_count,
            ],
            'transactions' => $transactions,
            'categoryBreakdown' => $categoryBreakdown,
            'dates' => $dates,
        ]);
    }

    /**
     * Show yearly report
     */
    public function yearly(Request $request)
    {
        $user = auth()->guard('web')->user();
        $year = $request->query('year', Carbon::now()->year);

        $monthlyReports = MonthlyReport::where('user_id', $user->id)
            ->byYear($year)
            ->get()
            ->map(fn($r) => [
                'month' => $r->month,
                'monthName' => Carbon::createFromDate($year, $r->month, 1)->translatedFormat('F'),
                'totalIncome' => (float) $r->total_income,
                'totalExpense' => (float) $r->total_expense,
                'netBalance' => (float) $r->net_balance,
            ])
            ->sortBy('month')
            ->values();

        $totalIncome = $monthlyReports->sum('totalIncome');
        $totalExpense = $monthlyReports->sum('totalExpense');
        $netBalance = $totalIncome - $totalExpense;

        return Inertia::render('Reports/Yearly', [
            'year' => $year,
            'monthlyReports' => $monthlyReports,
            'totals' => [
                'totalIncome' => (float) $totalIncome,
                'totalExpense' => (float) $totalExpense,
                'netBalance' => (float) $netBalance,
            ],
        ]);
    }

    /**
     * Calculate monthly report data
     */
    private function calculateMonthlyReport($user, $year, $month)
    {
        $transactions = $user->transactions()
            ->byMonthYear($month, $year)
            ->get();

        $income = $transactions->where('type', 'income')->sum('amount');
        $expense = $transactions->where('type', 'expense')->sum('amount');

        $categoryBreakdown = $transactions->groupBy('category_id')
            ->map(function ($items) {
                return [
                    'category_id' => $items->first()->category_id,
                    'category_name' => $items->first()->category->name,
                    'amount' => (float) $items->sum('amount'),
                    'count' => $items->count(),
                ];
            })
            ->values()
            ->toArray();

        return [
            'total_income' => $income,
            'total_expense' => $expense,
            'net_balance' => $income - $expense,
            'income_count' => $transactions->where('type', 'income')->count(),
            'expense_count' => $transactions->where('type', 'expense')->count(),
            'category_breakdown' => $categoryBreakdown,
        ];
    }
}
