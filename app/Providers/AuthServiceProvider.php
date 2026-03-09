<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Transaction;
use App\Models\Receipt;
use App\Policies\TransactionPolicy;
use App\Policies\ReceiptPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Transaction::class => TransactionPolicy::class,
        Receipt::class => ReceiptPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Gates y policies se registran automáticamente por Laravel
    }
}
