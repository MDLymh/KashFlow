<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'amount',
        'type',
        'transaction_date',
        'status',
        'receipt_path',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_date' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the transaction
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category of the transaction
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the receipt associated with this transaction
     */
    public function receipt()
    {
        return $this->hasOne(Receipt::class);
    }

    /**
     * Scope to filter by user
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to filter by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('transaction_date', [$startDate, $endDate]);
    }

    /**
     * Scope to filter by month and year
     */
    public function scopeByMonthYear($query, $month, $year)
    {
        return $query->whereYear('transaction_date', $year)
                     ->whereMonth('transaction_date', $month);
    }

    /**
     * Scope to filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
