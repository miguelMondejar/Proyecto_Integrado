<?php

namespace App\Http\Controllers;

use App\Models\Candidatura;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;

class CandidaturaController extends Controller
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
        // Listado de candidaturas
        $candidatura = Candidatura::all();
        return response()->json($candidatura);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Crear una candidatura
        // Validamos los datos.
        $data = $request->only('fecha_inicio', 'fecha_fin', 'estado', 'usuario_id', 'empresa_id');
        $validador = Validator::make($data, [
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'estado' => 'required|string|max:15',
            'usuario_id' => 'required|numeric',
            'empresa_id' => 'required|numeric'
        ]);

        // si hay algo mal
        if($validador->fails()) {
            return response()->json(['error' => $validador->messages()], 400);
        }

        $candidatura = Candidatura::create([
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'estado' => $request->estado,
            'usuario_id' => $request->usuario_id,
            'empresa_id' => $request->empresa_id
        ]);

        return response()->json([
            'message' => 'Candidatura creada correctamente',
            'data' => $candidatura
        ], Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Candidatura  $candidatura
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Buscamos la candidatura
        $candidatura = Candidatura::findOrFail($id);

        // comprobamos que exista
        if(!$candidatura) {
            return response()->json(['mensaje' => "Candidatura no encontrado"], 404);
        }

        return response()->json(['data' => $candidatura], Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Candidatura  $candidatura
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Actualizar una candidatura
        // Validamos los datos.
        $data = $request->only('fecha_inicio', 'fecha_fin', 'estado', 'usuario_id', 'empresa_id');
        $validador = Validator::make($data, [
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'estado' => 'required|string|max:15',
            'usuario_id' => 'required|numeric',
            'empresa_id' => 'required|numeric'
        ]);

        // si hay algo mal
        if($validador->fails()) {
            return response()->json(['error' => $validador->messages()], 400);
        }

        $candidatura = Candidatura::findOrFail($id);

        // Si está todo el orden, actualizamos la candidatura
        $candidatura->update([
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'estado' => $request->estado,
            'usuario_id' => $request->usuario_id,
            'empresa_id' => $request->empresa_id
        ]);

        return response()->json([
            'message' => 'Candidatura actualizada correctamente',
            'data' => $candidatura
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Candidatura  $candidatura
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Eliminar una candidatura
        // buscamos la candidatura
        $candidatura = Candidatura::findOrFail($id);

        // si no existe
        if(!$candidatura) {
            return response()->json(['mensaje' => "Candidatura no encontrada"], 404);
        }

        $candidatura->delete();
        return response()->json(['mensaje' => "Candidatura borrada perfectamente."], Response::HTTP_OK);
    }
}
