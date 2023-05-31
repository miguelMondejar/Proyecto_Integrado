<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleController extends Controller
{
    /**
     * Función index para mostrar la lista de roles
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Listado de roles
        $roles = Role::all();
        return response()->json($roles);
    }

    /**
     * Función para mostrar un rol específico
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Buscamos el rol
        $rol = Role::findOrFail($id);

        // comprobamos que exista
        if(!$rol) {
            return response()->json(['error' => "Rol no encontrado"], 404);
        }

        return response()->json(['data' => $rol], Response::HTTP_OK);
    }
}