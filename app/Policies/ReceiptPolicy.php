<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Receipt;

class ReceiptPolicy
{
    /**
     * Determine if the user can view the receipt
     */
    public function view(User $user, Receipt $receipt): bool
    {
        return $user->id === $receipt->user_id;
    }

    /**
     * Determine if the user can create receipts
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update the receipt
     */
    public function update(User $user, Receipt $receipt): bool
    {
        return $user->id === $receipt->user_id;
    }

    /**
     * Determine if the user can delete the receipt
     */
    public function delete(User $user, Receipt $receipt): bool
    {
        return $user->id === $receipt->user_id;
    }
}
