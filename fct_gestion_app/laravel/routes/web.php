<?php

use App\Http\Controllers\ArticuloController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComentarioController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Rutas
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
   return view('index');
});

Route::get('/login', function () {
   return view('login');
});

Route::get('/profesor', function () {
   return view('inicio_profesor');
});

Route::get('/profesor/gestion', function () {
   return view('inicio_profesor');
});

Route::get('/alumno', function () {
   return view('inicio_alumno');
});

Route::get('/profesor/gestion/alumnos', function () {
   return view('gestion_alumnos');
});

Route::get('/profesor/gestion/docentes', function () {
   return view('gestion_docentes');
});

Route::get('/profesor/gestion/candidaturas', function () {
   return view('gestion_candidaturas');
});

Route::get('/profesor/gestion/sedes', function () {
   return view('gestion_sedes');
});

Route::get('/profesor/gestion/empresas/form', function () {
   return view('gestion_empresas');
});

Route::get('/profesor/gestion/usuarios/form', function () {
   return view('gestion_alumnos_form');
});

Route::get('/profesor/gestion/candidaturas/form', function () {
   return view('gestion_candidaturas_form');
});

Route::get('/profesor/gestion/sedes/form', function () {
   return view('gestion_sedes_form');
});

Route::get('/profesor/gestion/empresas/form', function () {
   return view('gestion_empresas_form');
});

Route::get('/perfil', function () {
   return view('perfil_usuario');
});


