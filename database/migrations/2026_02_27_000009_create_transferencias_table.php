<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transferencias', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('cuenta_origen_id')
                ->constrained('cuentas')
                ->cascadeOnDelete();

            $table->foreignId('cuenta_destino_id')
                ->constrained('cuentas')
                ->cascadeOnDelete();

            $table->foreignId('canal_origen_id')
                ->nullable()
                ->constrained('canales_transaccion')
                ->nullOnDelete();

            $table->foreignId('canal_destino_id')
                ->nullable()
                ->constrained('canales_transaccion')
                ->nullOnDelete();

            $table->decimal('monto', 14, 2);

            $table->date('fecha');

            $table->text('descripcion')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'fecha']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transferencias');
    }
};
