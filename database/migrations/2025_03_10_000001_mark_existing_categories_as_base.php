<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Mark all existing categories as base categories
        DB::table('categories')->update(['is_base' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reset all categories to non-base
        DB::table('categories')->update(['is_base' => false]);
    }
};
