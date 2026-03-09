<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'description',
        'color',
        'icon',
    ];

    /**
     * Get the user that owns this user category
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the base category
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
