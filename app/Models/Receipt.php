<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'user_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'extracted_data',
    ];

    protected $casts = [
        'extracted_data' => 'array',
    ];

    /**
     * Get the transaction associated with this receipt
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Get the user that owns the receipt
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
