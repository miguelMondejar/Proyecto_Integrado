<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CurriculumController extends Controller
{
    protected $user;

    public function __construct(Request $request) {
        $token = $request->header("Authorization");
        if($token != "") {
            $this->user = JWTAuth::parseToken()->authenticate();
        }
    }

    // Función store para subir y crear un curriculum
    public function store(Request $request) {
        // Comprobar si se ha enviado un archivo
        if ($request->hasFile('cv')) {
            $cvFile = $request->file('cv');

            // Comprobar si el archivo es de tipo PDF
            if ($cvFile->getClientOriginalExtension() === 'pdf') {
                // Comprobar si el usuario ya tiene un currículum
                $usuarioId = $this->user->id;
                $curriculumExiste = Curriculum::where('usuario_id', $usuarioId)->exists();

                // Si el usuario ya tiene un currículum, devuelve un mensaje de error
                if ($curriculumExiste) {
                    return response()->json(['error' => 'El usuario ya tiene un currículum subido'], 400);
                }

                // Guardar el archivo en storage/app/public/cv
                $rutaArchivo = $cvFile->storeAs('public/cv', $cvFile->hashName());

                // Guardar la ruta del archivo en la base de datos
                $cv = Curriculum::create([
                    'ruta' => $rutaArchivo,
                    'usuario_id' => $usuarioId
                ]);

                return response()->json([
                    'message' => 'CV creado correctamente',
                    'data' => $cv
                ], Response::HTTP_OK);
            } else {
                // El archivo no es de tipo PDF, devuelve un mensaje de error
                return response()->json(['error' => 'Solo se permiten archivos PDF'], 400);
            }
        }
        return response()->json(['error' => 'No se ha enviado ningún archivo'], 400);
    }

    /**
     * Función index para mostrar la lista de curriculums
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
     * Función para mostrar uno específico
     *
     * @param  \App\Models\Curriculum  $curriculum
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Buscar el usuario por su ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Buscar el curriculum por el id del usuario
        $curriculum = Curriculum::where('usuario_id', $user->id)->first();

        if (!$curriculum) {
            return response()->json(['error' => 'Curriculum no encontrado'], 404);
        }

        // Obtener la ruta del archivo de curriculum
        $rutaArchivo = storage_path('app/' . $curriculum->ruta);

        if (!file_exists($rutaArchivo)) {
            return response()->json(['error' => 'Archivo de curriculum no encontrado'], 404);
        }

        // Devolver el archivo como respuesta
        return response()->file($rutaArchivo);
    }

    /**
     * Función para actualizar por ID
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Curriculum  $curriculum
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
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
     * Función para eliminar por ID
     *
     * @param  \App\Models\Curriculum  $curriculum
     * @return \Illuminate\Http\Response
     */
    public function destroy($idUsuario)
    {
        // Buscamos el currículum del usuario
        $cv = Curriculum::where('usuario_id', $idUsuario)->first();

        // Si no existe
        if (!$cv) {
            return response()->json(['error' => 'Currículum no encontrado'], 404);
        }

        // Eliminar el archivo del almacenamiento (storage) si existe
        if (Storage::exists($cv->ruta)) {
            Storage::delete($cv->ruta);
        }

        $cv->delete();

        return response()->json(['mensaje' => 'Currículum borrado correctamente'], 200);
    }
}