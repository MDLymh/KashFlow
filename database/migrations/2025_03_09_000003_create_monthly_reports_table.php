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
        Schema::create('monthly_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->year('year');
            $table->unsignedTinyInteger('month');
            $table->decimal('total_income', 12, 2)->default(0);
            $table->decimal('total_expense', 12, 2)->default(0);
            $table->decimal('net_balance', 12, 2)->default(0);
            $table->integer('income_count')->default(0);
            $table->integer('expense_count')->default(0);
            $table->json('category_breakdown')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'year', 'month']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_reports');
    }
};
