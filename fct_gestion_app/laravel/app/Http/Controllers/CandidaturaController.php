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
     * Función index para mostrar la lista de candidaturas
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
     * Función store para crear nueva candidatura
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
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

        // Verificamos si el usuario tiene una candidatura aceptada
        $usuarioId = $request->usuario_id;
        $candidaturaAceptada = Candidatura::where('usuario_id', $usuarioId)->where('estado', 'Aprobada')->exists();

        // Si tiene una candidatura aceptada, no se podría crear la candidatura
        if ($candidaturaAceptada) {
            return response()->json(['error' => 'El usuario ya tiene una candidatura aceptada.'], 400);
        }

        // Si no tiene una candidatura aceptada, creamos la candidatura
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
     * Función para mostrar una candidatura específica
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
     * Función para actualizar por ID
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Candidatura  $candidatura
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
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

        // Verificamos si el usuario tiene una candidatura aceptada
        $usuarioId = $request->usuario_id;
        $candidaturaAceptada = Candidatura::where('usuario_id', $usuarioId)->where('estado', 'Aprobada')->exists();

        // Si tiene una candidatura aceptada, no se podría crear la candidatura
        if ($candidaturaAceptada && $request->estado == "Aprobada") {
            return response()->json(['error' => 'El usuario ya tiene una candidatura aceptada.'], 400);
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
     * Fución para eliminar por ID
     *
     * @param  \App\Models\Candidatura  $candidatura
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // buscamos la candidatura
        $candidatura = Candidatura::findOrFail($id);

        // si no existe
        if(!$candidatura) {
            return response()->json(['error' => "Candidatura no encontrada"], 404);
        }

        $candidatura->delete();
        return response()->json(['mensaje' => "Candidatura borrada perfectamente."], Response::HTTP_OK);
    }
}
