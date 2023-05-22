<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use App\Models\User;
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

            // Verificar si el archivo es de tipo PDF
            if ($cvFile->getClientOriginalExtension() === 'pdf') {
                // Guardar el archivo en storage/app/public/cv
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
            } else {
                // El archivo no es de tipo PDF, devuelve un mensaje de error
                return response()->json(['mensaje' => 'Solo se permiten archivos PDF'], 400);
            }
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
        // Buscar el usuario por su ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['mensaje' => 'Usuario no encontrado'], 404);
        }

        // Buscar el curriculum por el id del usuario
        $curriculum = Curriculum::where('usuario_id', $user->id)->get();

        if (!$curriculum) {
            return response()->json(['mensaje' => 'Curriculum no encontrado'], 404);
        }

        // Retornar la respuesta con el curriculum encontrado
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