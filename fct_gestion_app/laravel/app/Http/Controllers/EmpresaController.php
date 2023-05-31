<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;

class EmpresaController extends Controller
{
    protected $user;

    public function __construct(Request $request) {
        $token = $request->header("Authorization");
        if($token != "") {
            $this->user = JWTAuth::parseToken()->authenticate();
        }
    }

    /**
     * Función index para mostrar la lista de empresas
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Listado de empresas
        $empresas = Empresa::all();
        return response()->json($empresas);
    }

    /**
     * Función store para crear nueva empresa
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Crear una empresa nueva
        // Validamos los datos.
        $data = $request->only('cif', 'nombre', 'email');
        $validador = Validator::make($data, [
            'cif' => 'required|string|max:10',
            'nombre' => 'required|string|max:25',
            'email' => 'required|email'
        ]);

        // si hay algo mal
        if($validador->fails()) {
            return response()->json(['error' => $validador->messages()], 400);
        }

        $empresa = Empresa::create([
            'cif' => $request->cif,
            'nombre' => $request->nombre,
            'email' => $request->email
        ]);

        return response()->json([
            'message' => 'Empresa creada correctamente',
            'data' => $empresa
        ], Response::HTTP_OK);
    }

    /**
     * Función para mostrar una específica
     *
     * @param  \App\Models\Empresa  $empresa
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Buscamos la empresa
        $empresa = Empresa::findOrFail($id);
        
        // comprobamos que exista
        if(!$empresa) {
            return response()->json(['error' => "Empresa no encontrada"], 404);
        }

        return response()->json(['data' => $empresa], Response::HTTP_OK);
    }

    /**
     * Función para actualizar por ID
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Empresa  $empresa
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Validamos los datos.
        $data = $request->only('cif', 'nombre', 'email');
        $validador = Validator::make($data, [
            'cif' => 'required|string|max:10',
            'nombre' => 'required|string|max:25',
            'email' => 'required|email'
        ]);

        // si hay algo mal
        if($validador->fails()) {
            return response()->json(['error' => $validador->messages()], 400);
        }

        $empresa = Empresa::findOrFail($id);

        // Si está todo el orden, actualizamos la empresa
        $empresa->update([
            'cif' => $request->cif,
            'nombre' => $request->nombre,
            'email' => $request->email
        ]);

        return response()->json([
            'message' => 'Empresa actualizada correctamente',
            'data' => $empresa
        ], Response::HTTP_OK);
    }

    /**
     * Fución para eliminar por ID
     *
     * @param  \App\Models\Empresa  $empresa
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // buscamos la empresa
        $empresa = Empresa::findOrFail($id);

        // si no existe
        if(!$empresa) {
            return response()->json(['error' => "Empresa no encontrada"], 404);
        }

        $empresa->delete();
        return response()->json(['mensaje' => "Empresa borrada perfectamente."], Response::HTTP_OK);
    }
}