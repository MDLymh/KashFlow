<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonthlyReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'year',
        'month',
        'total_income',
        'total_expense',
        'net_balance',
        'income_count',
        'expense_count',
        'category_breakdown',
    ];

    protected $casts = [
        'category_breakdown' => 'array',
    ];

    /**
     * Get the user that owns the report
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter by year
     */
    public function scopeByYear($query, $year)
    {
        return $query->where('year', $year);
    }

    /**
     * Scope to filter by month
     */
    public function scopeByMonth($query, $month)
    {
        return $query->where('month', $month);
    }

    /**
     * Scope to filter by year and month
     */
    public function scopeByYearMonth($query, $year, $month)
    {
        return $query->where('year', $year)
                     ->where('month', $month);
    }
}
