// Mensajes
const mensajeVacio = "Los campos no pueden estar vacíos."
const mensajeCorreo = "El correo electrónico debe ser válido."
const mensajeContrasena = "La contraseña debe tener al menos una longitud de 8 caracteres."
const mensajePassRepetida = "La contraseñas son distintas."
const mensajeDNITelefono = "Tanto el campo de DNI como el campo de Teléfono deben tener 9 caracteres."

// Función para pintar usuarios en forma de tabla. Tipo de usuario es el rol
async function getUsuarios(tipoUsuario) {
    let div = document.getElementById('usuarios')

    // creamos la tabla
    let tabla = document.createElement('table')
    tabla.classList.add('table')
    
    let encabezadosTabla = ['Nombre', 'Apellidos', 'Fecha nacimiento', 'DNI', 'Correo', 'Teléfono', 'Editar', 'Borrar']
    let encabezadosFilas = document.createElement('tr')

    // rellenamos el encabezado de la tabla
    for (let h of encabezadosTabla) {
        let th = document.createElement('th')
        th.textContent = h
        encabezadosFilas.appendChild(th)
    }
    tabla.appendChild(encabezadosFilas)

    // hacemos la llamada a la API y pintamos en la tabla
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`)
        const responseData = await response.json()
        let idUsuario = await obtenerIDUsuarioLogado()

        responseData.forEach(usuario => {
            if(usuario.rol_id == tipoUsuario) {
                // El docente logeado NO saldrá en la lista, así no se podrá eliminar a sí mismo
                if(idUsuario != usuario.id) {
                    let fila = document.createElement('tr')
                    fila.innerHTML = `
                        <td>${usuario.nombre}</td>
                        <td>${usuario.apellidos}</td>
                        <td>${usuario.fecha_nacimiento}</td>
                        <td>${usuario.dni}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.telefono}</td>
                        <td><input type='button' onclick='' value='✏' class='botonEditar'></td>
                        <td><input type='button' onclick='deleteUsuario(${usuario.id})' value='❌' class='botonBorrar'></td>`
                    tabla.appendChild(fila)
                }
            }
        })

        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Función para registrar un usuario
async function registerUsuario() {
    const form = document.getElementById('formularioRegistro')
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault() // prevenir que el formulario se envíe por defecto

        // cogemos el token del profesor
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append("Content-Type", "application/json")
        miHeaders.append(`Authorization`, `Bearer ${token}`)

        // select
        let selectRol = document.getElementById('select-rol')

        // hacemos el registro
        let datos = JSON.stringify({
            "nombre": document.getElementById('nombre').value,
            "apellidos": document.getElementById('apellidos').value,
            "fecha_nacimiento": document.getElementById('fecha_nacimiento').value,
            "dni": document.getElementById('dni').value,
            "email": document.getElementById('correo').value,
            "telefono": document.getElementById('telefono').value,
            "password": document.getElementById('password2').value,
            "rol_id": selectRol.options[selectRol.selectedIndex].value
        })

        let requestRegistro = {
            method: 'POST',
            headers: miHeaders,
            body: datos,
            redirect: 'follow'
        }

        fetch(`${API_BASE_URL}/register`, requestRegistro)
            .then(response => {
                if(response.ok) {
                    alert("Usuario creado correctamente")
                    window.location.href = "http://127.0.0.1:8000/profesor/gestion/alumnos"
                }
                response.text()
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
    })
}

// Función para validar los campos de registros
function validarRegistro() {
    limpiarOutput("errores")
    let campoErrores = document.getElementById("errores")

    if (!validarCamposVacios(document.getElementById('nombre').value) || !validarCamposVacios(document.getElementById('apellidos').value) || 
    !validarCamposVacios(document.getElementById('password1').value) || !validarCamposVacios(document.getElementById('password2').value) || 
    !validarCamposVacios(document.getElementById('fecha_nacimiento').value) || !validarCamposVacios(document.getElementById('dni').value) || 
    !validarCamposVacios(document.getElementById('telefono').value) || !validarCamposVacios(document.getElementById('correo').value)) {
        campoErrores.innerHTML += `${mensajeVacio} <br>`
    }

    if (!validarCorreo(document.getElementById('correo').value)) {
        campoErrores.innerHTML += `${mensajeCorreo} <br>`
    }

    if (!validarPassword(document.getElementById('password1').value)) {
        campoErrores.innerHTML += `${mensajeContrasena} <br>`
    }

    if (!validar2Password(document.getElementById('password1').value, document.getElementById('password2').value)) {
        campoErrores.innerHTML += `${mensajePassRepetida} <br>`
    }

    if (!validarTamanio(document.getElementById('dni').value, 9, 9) ||
    !validarTamanio(document.getElementById('telefono').value, 9, 9)) {
        campoErrores.innerHTML += `${mensajeDNITelefono} <br>`
    }
}

// Función para editar un usuario
async function putUsuario(id) {
    
}
  
// Función para eliminar un usuario
async function deleteUsuario(id) {
    let mensajeConfirmacion = confirm("¿Está seguro que desea eliminar a este usuario?")
    if (mensajeConfirmacion) {
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append(`Authorization`, `Bearer ${token}`)
    
        let requestOptions = {
            method: 'DELETE',
            headers: miHeaders,
            redirect: 'follow'
        };
    
        fetch(`${API_BASE_URL}/usuarios/${id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                alert("Usuario borrado correctamente")
                window.location.href = "http://127.0.0.1:8000/profesor/gestion/alumnos"
            })
            .catch(error => console.log('error', error))
    }
}

// Función para cerrar sesión
async function logout() {
    let token = localStorage.getItem('token')

    let miHeaders = new Headers()
    miHeaders.append("Content-Type", "application/json")
    
    // lo pasamos en formato JSON
    let datos = JSON.stringify({
        "token": `${token}`
    });
    
    let requestOptions = {
        method: 'POST',
        headers: miHeaders,
        body: datos,
        redirect: 'follow'
    }
    
    fetch(`${API_BASE_URL}/logout`, requestOptions)
        .then(response => response.text())
        .then(localStorage.removeItem('token'))
        .catch(error => console.log('error', error))
}

// Función para consultar el token existente
async function consultarToken() {
    // consultamos el token
    let token = localStorage.getItem('token')
    // si no existe, redirigimos al inicio de sesión
    if(token == null || token == "") {
        window.location.href = "http://127.0.0.1:8000/login"
    }

    // Configurar los encabezados para la solicitud user POST
    let headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    headers.append('Content-Type', 'application/json')

    // Configurar la solicitud user POST
    let userRequest = {
        method: 'POST',
        headers: headers,
        redirect: 'follow'
    }

    // Hacer la solicitud user POST
    fetch(`${API_BASE_URL}/user`, userRequest)
        .then(response => {
            // Verifica si la respuesta del servidor es 200 OK
            if (!response.ok) {
                throw new Error('Error al obtener usuario')
            }
            
            // Extrae los datos del usuario del cuerpo de respuesta de la solicitud
            return response.json()
        })
        .then(result => {
            let pagina = window.location.href
            let resultadoUsuario = result.usuario
            document.getElementById("nombre-usuario").textContent = `Bienvenido/a ${resultadoUsuario.nombre} 👋`

            // para que no de error al gestionar los datos del perfil
            if(pagina == "http://127.0.0.1:3000/fct_gestion_app/perfil_usuario.html") {
                document.getElementById('nombre').textContent = resultadoUsuario.nombre
                document.getElementById('apellidos').textContent = resultadoUsuario.apellidos
                document.getElementById('fecha_nacimiento').textContent = resultadoUsuario.fecha_nacimiento
                document.getElementById('dni').textContent = resultadoUsuario.dni
                document.getElementById('email').textContent = resultadoUsuario.email
                document.getElementById('telefono').textContent = resultadoUsuario.telefono

                // si el rol del usuario es 2, pintamos el CV en el perfil
                if (resultadoUsuario.rol_id == 2) {
                    document.getElementById("cvTitulo").textContent = "CV"
                } else {
                    document.getElementById("cv").remove()
                    document.getElementById("cvTitulo").remove()
                }
            }

            // redireccionar por rol
            // si un alumno intenta acceder a una página diferente a "inicio_alumno" o "perfil_usuario", se le redirige a su página de inicio
            if (resultadoUsuario.rol_id == 2 && !(pagina.includes("alumno") || pagina.includes("perfil_usuario"))) {
                alert("ACCESO DENEGADO")
                window.location.href = "http://127.0.0.1:8000/alumno"
            }

            // si un profesor intenta acceder a la página "inicio_alumno", se le redirige a su página de inicio
            if (resultadoUsuario.rol_id == 1 && pagina.includes("alumno") && !pagina.includes("perfil_usuario")) {
                alert("ACCESO DENEGADO")
                window.location.href = "http://127.0.0.1:8000/profesor"
            }

            return result
        })
        .catch(error => console.log('Error al obtener usuario', error))
}

// función para obtener el ID del usuario que esté logado
async function obtenerIDUsuarioLogado() {
    try {
        // Consultamos el token
        let token = localStorage.getItem('token')

        // Configuramos los encabezados para la solicitud POST
        let headers = new Headers()
        headers.append('Authorization', `Bearer ${token}`)
        headers.append('Content-Type', 'application/json')

        // Configuramos la solicitud POST
        let userRequest = {
            method: 'POST',
            headers: headers,
            redirect: 'follow'
        }

        // Hacemos la solicitud POST
        const response = await fetch(`${API_BASE_URL}/user`, userRequest)
        
        // Verificamos si la respuesta del servidor es 200 OK
        if (!response.ok) {
            throw new Error('Error al obtener usuario')
        }

        const result = await response.json()
        return result.usuario.id
    } catch (error) {
        console.log('Error al obtener usuario', error)
        return null // Retornamos null en caso de error
    }
}

// Función que servirá para pintar un select con todos los nombre de alumnos
async function getUsuariosNombre() {
    let select = document.getElementById('select-usuarios')

    // hacemos la llamada a la API y pintamos los usuarios
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`)
        const responseData = await response.json()

        responseData.forEach(usuario => {
            if(usuario.rol_id == "2") {
                select.innerHTML += `<option value='${usuario.id}'>${usuario.nombre}`
            }
        })

    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Esta función será utilizada para que me devuelva el nombre de los alumnos un listado
async function obtenerNombreAlumno(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`)
        const alumnoData = await response.json()
        return alumnoData.data
    } catch (error) {
        console.log(`Error al obtener los datos del alumno con ID ${id}:`, error)
        return null
    }
}