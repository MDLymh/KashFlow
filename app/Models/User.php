<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get all transactions for this user
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get all receipts for this user
     */
    public function receipts()
    {
        return $this->hasMany(Receipt::class);
    }

    /**
     * Get all monthly reports for this user
     */
    public function monthlyReports()
    {
        return $this->hasMany(MonthlyReport::class);
    }

    /**
     * Get all user categories for this user
     */
    public function userCategories()
    {
        return $this->hasMany(UserCategory::class);
    }

    /**
     * Boot the model and set up event listeners
     */
    protected static function boot()
    {
        parent::boot();

        // When a user is created, associate default categories
        static::created(function ($user) {
            $defaultCategories = Category::all();
            
            foreach ($defaultCategories as $category) {
                UserCategory::create([
                    'user_id' => $user->id,
                    'category_id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'icon' => $category->icon,
                    'color' => $category->color,
                ]);
            }
        });
    }
}
