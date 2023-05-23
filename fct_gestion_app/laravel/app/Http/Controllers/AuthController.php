<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\JWTAuth as JWTAuthJWTAuth;

class AuthController extends Controller
{
    // Función que utilizaremos para registrar al usuario
    public function register(Request $request)
    {
        // Indicamos que solo queremos recibir name, email y password de la request
        $data = $request->only('nombre', 'apellidos', 'fecha_nacimiento', 'dni', 'email', 'telefono', 'password', 'rol_id');

        //Realizamos las validaciones
        $validator = Validator::make($data, [
            'nombre' => 'required|string|max:25',
            'apellidos' => 'required|string|max:30',
            'fecha_nacimiento' => 'required|string',
            'dni' => 'required|string|min:8|max:10',
            'email' => 'required|email',
            'telefono' => 'required|string|max:9',
            'password' => 'required|string|min:8|max:20',
            'rol_id' => 'required|numeric'
        ]);

        // Devolvemos un error si fallan las validaciones
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }

        // Creamos el nuevo usuario si todo es correcto
        $user = User::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'fecha_nacimiento' => $request->fecha_nacimiento, 
            'dni' => $request->dni, 
            'email' => $request->email,
            'telefono' => $request->telefono,
            'password' => bcrypt($request->password),
            'rol_id' => $request->rol_id
        ]);

        // Devolvemos la respuesta con los datos del usuario
        return response()->json([
            'exito' => true,
            'mensaje' => 'Usuario creado',
            'usuario' => $user
        ], Response::HTTP_OK);
    }

    // Funcion que utilizaremos para hacer login
    public function login(Request $request)
    {
        // Indicamos que solo queremos recibir email y password de la request
        $credentials = $request->only('email', 'password');

        // Validaciones
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:8|max:20'
        ]);

        // Devolvemos un error de validación en caso de fallo en las verificaciones
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }
        
        // Intentamos hacer login
        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                // Credenciales incorrectas.
                return response()->json(['error' => 'Login falló, credenciales incorrectas'], 401);
            }
        } catch (JWTException $e) {
            // Error al intentar crear el token
            return response()->json(['error' => 'No se pudo crear el token'], 500);
        }

        // Devolvemos el token
        return response()->json(['token' => $token]);
    }

    // Función que utilizaremos para eliminar el token y desconectar al usuario
    public function logout(Request $request)
    {
        try {
            // Si el token es válido eliminamos el token desconectando al usuario.
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'exito' => true,
                'mensaje' => 'Usuario desconectado'
            ]);
        } catch (JWTException $e) {
            // Error al intentar invalidar el token
            return response()->json([
                'exito' => false,
                'mensaje' => 'Error al intentar desconectar al usuario'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } 
    }

    // Función para sacar lista de usuarios
    public function index()
    {
        // Listado de candidaturas
        $usuarios = User::all();
        return response()->json($usuarios);
    }

    // Función para poder actualizar un usuario concreto
    public function update(Request $request, $id)
    {
        // Actualizar una sede nueva
        // Validamos los datos.
        $data = $request->only('nombre', 'apellidos', 'fecha_nacimiento', 'dni', 'email', 'telefono', 'password');
        $validador = Validator::make($data, [
            'nombre' => 'required|string|max:25',
            'apellidos' => 'required|string|max:30',
            'fecha_nacimiento' => 'required|string',
            'dni' => 'required|string|min:8|max:10',
            'email' => 'required|email',
            'telefono' => 'required|string|max:9',
            'password' => 'string|min:8|max:20'
        ]);

        // si hay algo mal
        if($validador->fails()) {
            return response()->json(['error' => $validador->messages()], 400);
        }

        $usuario = User::findOrFail($id);

        // Si está todo el orden, actualizamos la sede
        $usuario->update([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'fecha_nacimiento' => $request->fecha_nacimiento, 
            'dni' => $request->dni, 
            'email' => $request->email,
            'telefono' => $request->telefono,
            'password' => bcrypt($request->password),
        ]);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'data' => $usuario
        ], Response::HTTP_OK);
    }

    // Función para mostrar un usuario por su id
    public function show($id)
    {
        // Buscamos al usuario
        $user = User::findOrFail($id);

        // comprobamos que exista
        if(!$user) {
            return response()->json(['mensaje' => "Usuario no encontrado"], 404);
        }

        return response()->json(['data' => $user], Response::HTTP_OK);
    }

    // Función para eliminar un usuario
    public function destroy($id)
    {
        // Eliminar una empresa
        // buscamos la empresa
        $usuario = User::findOrFail($id);

        // si no existe
        if(!$usuario) {
            return response()->json(['mensaje' => "Usuario no encontrado"], 404);
        }

        $usuario->delete();
        return response()->json(['mensaje' => "Usuario borrado perfectamente."], Response::HTTP_OK);
    }

    // Función que utilizaremos para obtener los datos del usuario.
    public function getUser(Request $request)
    {
        // Miramos si el usuario se puede autenticar con el token
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            return response()->json([
                'exito' => false,
                'mensaje' => 'Token invalido / token expirado',
            ], 401);
        }

        return response()->json([
            'exito' => true,
            'usuario' => $user
        ]);
    }

}
