<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
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
     * Display the specified resource.
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
            return response()->json(['mensaje' => "Rol no encontrado"], 404);
        }

        return response()->json(['data' => $rol], Response::HTTP_OK);
    }
}