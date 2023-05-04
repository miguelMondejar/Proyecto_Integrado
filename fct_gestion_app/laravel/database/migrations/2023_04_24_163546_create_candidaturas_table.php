<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidaturas', function (Blueprint $table) {
            $table->id();
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->string('estado', 15);
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('empresa_id');
            $table->timestamps();
            // Relaciones
            $table->foreign('usuario_id')->references('id')->on('usuarios');
            $table->foreign('empresa_id')->references('id')->on('empresas');            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('candidaturas');
    }
};
