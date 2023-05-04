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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 25);
            $table->string('apellidos', 30);
            $table->date('fecha_nacimiento');
            $table->string('dni', 9)->unique();
            $table->string('email', 50);
            $table->integer('telefono', 9);
            $table->string('password', 20);
            $table->unsignedBigInteger('rol_id');
            $table->rememberToken();
            $table->timestamps();
            // Relacion
            $table->foreign('rol_id')->references('id')->on('roles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
