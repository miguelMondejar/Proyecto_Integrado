<?php

use App\Http\Controllers\ArticuloController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidaturaController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SedeController;

/*
|--------------------------------------------------------------------------
| API Rutas
|--------------------------------------------------------------------------|
*/

// login
Route::post("login", [AuthController::class, "login"]);

// Listas get
Route::get("usuarios", [AuthController::class, "index"]);
Route::get("usuarios/{id}", [AuthController::class, "show"]);

Route::get("empresas", [EmpresaController::class, "index"]);
Route::get("empresas/{id}", [EmpresaController::class, "show"]);

Route::get("sedes", [SedeController::class, "index"]);
Route::get("sedes/{id}", [SedeController::class, "show"]);

Route::get("curriculums", [CurriculumController::class, "index"]);
Route::get("curriculums/{id}", [CurriculumController::class, "show"]);

Route::get("roles", [RoleController::class, "index"]);
Route::get("roles/{id}", [RoleController::class, "show"]);

Route::get("candidaturas", [CandidaturaController::class, "index"]);
Route::get("candidaturas/{id}", [CandidaturaController::class, "show"]);

// Se requiere de un token
Route::group(['middleware' => ["jwt.verify"]], function() {
   // usuarios
   Route::post("register", [AuthController::class, "register"]);
   Route::post("logout", [AuthController::class, "logout"]);
   Route::post("user", [AuthController::class, "getUser"]);
   Route::delete("usuarios/{id}", [AuthController::class, "destroy"]);
   Route::put("usuarios/{id}", [AuthController::class, "update"]);

   // empresas
   Route::post("empresas", [EmpresaController::class, "store"]);
   Route::put("empresas/{id}", [EmpresaController::class, "update"]);
   Route::delete("empresas/{id}", [EmpresaController::class, "destroy"]);

   // sedes
   Route::post("sedes", [SedeController::class, "store"]);
   Route::put("sedes/{id}", [SedeController::class, "update"]);
   Route::delete("sedes/{id}", [SedeController::class, "destroy"]);

   // candidaturas
   Route::post("candidaturas", [CandidaturaController::class, "store"]);
   Route::put("candidaturas/{id}", [CandidaturaController::class, "update"]);
   Route::delete("candidaturas/{id}", [CandidaturaController::class, "destroy"]);

   // cvs
   Route::put("curriculums/{id}", [CurriculumController::class, "update"]);
   Route::delete("curriculums/{id}", [CurriculumController::class, "destroy"]);
   Route::post("curriculums", [CurriculumController::class, "store"]);
});