<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CurriculumController extends Controller
{
    protected $user;

    public function __construct(Request $request) {
        $token = $request->header("Authorization");
        if($token != "") {
            $this->user = JWTAuth::parseToken()->authenticate();
        }
    }

    public function store(Request $request) {
        // Verifica si se ha enviado un archivo
        if ($request->hasFile('cv')) {
            $cvFile = $request->file('cv');

            // Guardar el archivo en el almacenamiento de Laravel (por ejemplo, en la carpeta "public/storage/cv")
            $rutaArchivo = $cvFile->storeAs('public/cv', $cvFile->hashName());

            // Guardar la ruta del archivo en la base de datos
            $cv = Curriculum::create([
                'ruta' => $rutaArchivo,
                'usuario_id' => $this->user->id
            ]);

            return response()->json([
                'message' => 'CV creado correctamente',
                'data' => $cv
            ], Response::HTTP_OK);
        }
        return response()->json(['mensaje' => 'No se ha enviado ningún archivo'], 400);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Listado de curriculums
        $curriculum = Curriculum::all();
        return response()->json($curriculum);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Curriculum  $curriculum
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Buscamos la curriculum
        $curriculum = Curriculum::findOrFail($id);

        // comprobamos que exista
        if(!$curriculum) {
            return response()->json(['mensaje' => "Curriculum no encontrado"], 404);
        }

        return response()->json(['data' => $curriculum], Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Curriculum  $curriculum
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Subir un curriculums
        // Validamos los datos.
        $data = $request->only('ruta', 'usuario_id');
        $validador = Validator::make($data, [
            'ruta' => 'required|string|max:25',
            'usuario_id' => 'required|numeric'
        ]);

        // si hay algo mal
        if($validador->fails()) {
            return response()->json(['error' => $validador->messages()], 400);
        }

        $cv = Curriculum::findOrFail($id);

        // Si está todo el orden, actualizamos el cv
        $cv->update([
            'ruta' => $request->ruta,
            'usuario_id' => $request->usuario_id
        ]);

        return response()->json([
            'message' => 'CV actualizado correctamente',
            'data' => $cv
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Curriculum  $curriculum
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Eliminar un cv
        // buscamos el cv
        $cv = Curriculum::findOrFail($id);

        // si no existe
        if(!$cv) {
            return response()->json(['mensaje' => "CV no encontrado"], 404);
        }

        $cv->delete();
        return response()->json(['mensaje' => "CV borrado perfectamente."], Response::HTTP_OK);
    }
}