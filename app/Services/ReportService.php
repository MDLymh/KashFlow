<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\MonthlyReport;
use Carbon\Carbon;

class ReportService
{
    /**
     * Calculate and store monthly report for a user
     */
    public function generateMonthlyReport($userId, $year, $month)
    {
        $transactions = Transaction::where('user_id', $userId)
            ->byMonthYear($month, $year)
            ->get();

        $income = $transactions->where('type', 'income')->sum('amount');
        $expenses = $transactions->where('type', 'expense')->sum('amount');

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

        $report = MonthlyReport::updateOrCreate(
            [
                'user_id' => $userId,
                'year' => $year,
                'month' => $month,
            ],
            [
                'total_income' => $income,
                'total_expense' => $expenses,
                'net_balance' => $income - $expenses,
                'income_count' => $transactions->where('type', 'income')->count(),
                'expense_count' => $transactions->where('type', 'expense')->count(),
                'category_breakdown' => $categoryBreakdown,
            ]
        );

        return $report;
    }

    /**
     * Get year-to-date summary
     */
    public function getYearToDateSummary($userId, $year)
    {
        $reports = MonthlyReport::where('user_id', $userId)
            ->byYear($year)
            ->get();

        return [
            'total_income' => $reports->sum('total_income'),
            'total_expense' => $reports->sum('total_expense'),
            'net_balance' => $reports->sum('net_balance'),
            'months_count' => $reports->count(),
        ];
    }

    /**
     * Get comparison between two months
     */
    public function compareMonths($userId, $year1, $month1, $year2, $month2)
    {
        $report1 = MonthlyReport::where('user_id', $userId)
            ->byYearMonth($year1, $month1)
            ->first();

        $report2 = MonthlyReport::where('user_id', $userId)
            ->byYearMonth($year2, $month2)
            ->first();

        if (!$report1 || !$report2) {
            return null;
        }

        return [
            'month1' => [
                'income' => $report1->total_income,
                'expense' => $report1->total_expense,
                'balance' => $report1->net_balance,
            ],
            'month2' => [
                'income' => $report2->total_income,
                'expense' => $report2->total_expense,
                'balance' => $report2->net_balance,
            ],
            'change' => [
                'income' => $report2->total_income - $report1->total_income,
                'expense' => $report2->total_expense - $report1->total_expense,
                'balance' => $report2->net_balance - $report1->net_balance,
            ],
        ];
    }
}
