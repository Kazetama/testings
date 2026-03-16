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
        Schema::table('events', function (Blueprint $table) {
            $table->integer('max_participants')->nullable()->after('description');
            $table->enum('status', ['open', 'closed', 'coming_soon'])->default('coming_soon')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('max_participants');
            $table->enum('status', ['open', 'closed'])->default('open')->change();
        });
    }
};
