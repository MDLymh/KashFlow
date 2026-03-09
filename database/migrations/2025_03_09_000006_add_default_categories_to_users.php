<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // This migration will add default "Otros" categories to existing users
        // We don't need to do anything here as the categories are seeded globally
        // and users will associate them when needed
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to revert
    }
};
