<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Sede;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;

class SedeController extends Controller
{
    protected $user;

    public function __construct(Request $request) {
        $token = $request->header("Authorization");
        if($token != "") {
            $this->user = JWTAuth::parseToken()->authenticate();
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       // Listado de sedes
       $sedes = Sede::all();
       return response()->json($sedes);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Crear una sede nueva
        // Validamos los datos.
        $data = $request->only('nombre', 'direccion', 'localidad', 'provincia','codigo_postal', 'telefono', 'email', 'empresa_id');
        $validador = Validator::make($data, [
            'nombre' => 'required|string|max:25',
            'direccion' => 'required|string|max:50',
            'localidad' => 'required|string|max:50',
            'provincia' => 'required|string|max:50',
            'codigo_postal' => 'required|string|max:5',
            'telefono' => 'required|string|max:9',
            'email' => 'required|email',
            'empresa_id' => 'required|numeric'
        ]);

        // si hay algo mal
        if($validador->fails()) {
            return response()->json(['error' => $validador->messages()], 400);
        }

        $sede = Sede::create([
            'nombre' => $request->nombre,
            'direccion' => $request->direccion,
            'localidad' => $request->localidad,
            'provincia' => $request->provincia,
            'codigo_postal' => $request->codigo_postal,
            'telefono' => $request->telefono,
            'email' => $request->email,
            'empresa_id' => $request->empresa_id
        ]);

        return response()->json([
            'message' => 'Sede creada correctamente',
            'data' => $sede
        ], Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Sede  $sede
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Buscamos la sede
        $sede = Sede::findOrFail($id);

        // comprobamos que exista
        if(!$sede) {
            return response()->json(['mensaje' => "Sede no encontrado"], 404);
        }

        return response()->json(['data' => $sede], Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Sede  $sede
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Actualizar una sede nueva
        // Validamos los datos.
        $data = $request->only('nombre', 'direccion', 'localidad', 'provincia','codigo_postal', 'telefono', 'email', 'empresa_id');
        $validador = Validator::make($data, [
            'nombre' => 'required|string|max:25',
            'direccion' => 'required|string|max:50',
            'localidad' => 'required|string|max:50',
            'provincia' => 'required|string|max:50',
            'codigo_postal' => 'required|string|max:5',
            'telefono' => 'required|string|max:9',
            'email' => 'required|email',
            'empresa_id' => 'required|numeric'
        ]);

        // si hay algo mal
        if($validador->fails()) {
            return response()->json(['error' => $validador->messages()], 400);
        }

        $sede = Sede::findOrFail($id);

        // Si está todo el orden, actualizamos la sede
        $sede->update([
            'nombre' => $request->nombre,
            'direccion' => $request->direccion,
            'localidad' => $request->localidad,
            'provincia' => $request->provincia,
            'codigo_postal' => $request->codigo_postal,
            'telefono' => $request->telefono,
            'email' => $request->email,
            'empresa_id' => $request->empresa_id
        ]);

        return response()->json([
            'message' => 'Sede actualizada correctamente',
            'data' => $sede
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Sede  $sede
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Eliminar una sede
        // buscamos la sede
        $sede = Sede::findOrFail($id);

        // si no existe
        if(!$sede) {
            return response()->json(['mensaje' => "Sede no encontrada"], 404);
        }

        $sede->delete();
        return response()->json(['mensaje' => "Sede borrada perfectamente."], Response::HTTP_OK);
    }
}
