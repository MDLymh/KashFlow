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
        Schema::table('receipts', function (Blueprint $table) {
            // Only drop the index if it exists
            if (Schema::hasColumn('receipts', 'processing_status')) {
                $table->dropIndex(['processing_status']);
                $table->dropColumn(['processing_status', 'processing_error']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('receipts', function (Blueprint $table) {
            if (!Schema::hasColumn('receipts', 'processing_status')) {
                $table->enum('processing_status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
                $table->text('processing_error')->nullable();
                $table->index('processing_status');
            }
        });
    }
};
