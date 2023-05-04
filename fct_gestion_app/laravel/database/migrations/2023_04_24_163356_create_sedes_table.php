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
        Schema::create('sedes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 25);
            $table->string('direccion', 30);
            $table->string('localidad', 20);
            $table->string('provincia', 20);
            $table->integer('codigo_postal', 5);
            $table->integer('telefono', 9);
            $table->string('email', 30);
            $table->unsignedBigInteger('empresa_id');
            $table->timestamps();
            // Relacion
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
        Schema::dropIfExists('sedes');
    }
};
