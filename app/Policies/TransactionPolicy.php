<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Transaction;

class TransactionPolicy
{
    /**
     * Determine if the user can view the transaction
     */
    public function view(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->user_id;
    }

    /**
     * Determine if the user can create transactions
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the transaction
     */
    public function update(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->user_id;
    }

    /**
     * Determine if the user can delete the transaction
     */
    public function delete(User $user, Transaction $transaction): bool
    {
        return $user->id === $transaction->user_id;
    }
}
