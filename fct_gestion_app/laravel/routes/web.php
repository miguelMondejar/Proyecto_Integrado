<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// ruta index 
Route::get('/', function () {
   return view('index');
});

// ruta inicio sesión
Route::get('/login', function () {
   return view('login');
});

// PROFESOR
// ruta index del profesor
Route::get('/profesor', function () {
   return view('inicio_profesor');
});
// ruta gestión alumnos
Route::get('/profesor/gestion_alumnos', function () {
   return view('gestion_alumnos');
});
// ruta gestión alumnos formulario
Route::get('/profesor/gestion_alumnos/form', function () {
   return view('gestion_alumnos_form');
});

// ALUMNO
// ruta index del alumno
Route::get('/alumno', function () {
   return view('inicio_alumno');
});



