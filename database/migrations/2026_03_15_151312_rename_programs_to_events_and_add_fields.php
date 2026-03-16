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
        Schema::rename('programs', 'events');

        Schema::table('events', function (Blueprint $table) {
            $table->json('registration_fields')->nullable()->after('description');
            $table->enum('status', ['open', 'closed'])->default('open')->after('registration_fields');
            $table->boolean('is_public')->default(true)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['registration_fields', 'status', 'is_public']);
        });

        Schema::rename('events', 'programs');
    }
};
