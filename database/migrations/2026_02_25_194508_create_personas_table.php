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
        Schema::create('personas', function (Blueprint $table) {

            $table->id();

            // Relación con usuario dueño
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Datos de la persona
            $table->string('nombre');

            $table->string('tipo'); 
            // cliente | proveedor | contacto | banco | otro

            $table->string('email')->nullable();

            $table->string('telefono')->nullable();

            $table->string('empresa')->nullable();

            $table->text('notas')->nullable();

            $table->string('estado')->default('activo');

            $table->timestamps();

            // índices
            $table->index('nombre');
            $table->index('tipo');
            $table->index('estado');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};
