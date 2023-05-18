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

        responseData.forEach(usuario => {
            if(usuario.rol_id == tipoUsuario) {
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

        // hacemos el registro
        let datos = JSON.stringify({
            "nombre": `${document.getElementById('nombre').value}`,
            "apellidos": `${document.getElementById('apellidos').value}`,
            "fecha_nacimiento": `${document.getElementById('fecha_nacimiento').value}`,
            "dni": `${document.getElementById('dni').value}`,
            "email": `${document.getElementById('correo').value}`,
            "telefono": `${document.getElementById('telefono').value}`,
            "password": `${document.getElementById('password2').value}`,
            "rol_id": "2"
        });

        let requestRegistro = {
            method: 'POST',
            headers: miHeaders,
            body: datos,
            redirect: 'follow'
        };

        fetch(`${API_BASE_URL}/register`, requestRegistro)
            .then(response => {
                if(response.ok) {
                    alert("Alumno creado correctamente")
                    window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_alumnos.html"
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
    let validar = true

    if (!validarCamposVacios(document.getElementById('nombre').value) || !validarCamposVacios(document.getElementById('apellidos').value) || 
    !validarCamposVacios(document.getElementById('password1').value) || !validarCamposVacios(document.getElementById('password2').value) || 
    !validarCamposVacios(document.getElementById('fecha_nacimiento').value) || !validarCamposVacios(document.getElementById('dni').value) || 
    !validarCamposVacios(document.getElementById('telefono').value) || !validarCamposVacios(document.getElementById('correo').value)) {
        campoErrores.innerHTML += `${mensajeVacio} <br>`
        validar = false
    }

    if (!validarCorreo(document.getElementById('correo').value)) {
        campoErrores.innerHTML += `${mensajeCorreo} <br>`
        validar = false
    }

    if (!validarPassword(document.getElementById('password1').value)) {
        campoErrores.innerHTML += `${mensajeContrasena} <br>`
        validar = false
    }

    if (!validar2Password(document.getElementById('password1').value, document.getElementById('password2').value)) {
        campoErrores.innerHTML += `${mensajePassRepetida} <br>`
        validar = false
    }

    if (!validarTamanio(document.getElementById('dni').value, 9, 9) ||
    !validarTamanio(document.getElementById('telefono').value, 9, 9)) {
        campoErrores.innerHTML += `${mensajeDNITelefono} <br>`
        validar = false
    }
}

// Función para editar un usuario
async function putUsuario(id) {
    
}
  
// Función para eliminar un usuario
async function deleteUsuario(id) {
    let mensajeConfirmacion = confirm("¿Está seguro que desea eliminar a este usuario?")
    if(mensajeConfirmacion) {
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
                alert("Alumno borrado correctamente")
                window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_alumnos.html"
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
        window.location.href = "http://127.0.0.1:3000/fct_gestion_app/login.html"
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
            let resultadoUsuario = result.usuario
            document.getElementById("nombre-usuario").textContent = `Bienvenido/a ${resultadoUsuario.nombre} 👋`

            document.getElementById('nombre').textContent = resultadoUsuario.nombre
            document.getElementById('apellidos').textContent = resultadoUsuario.apellidos
            document.getElementById('fecha_nacimiento').textContent = resultadoUsuario.fecha_nacimiento
            document.getElementById('dni').textContent = resultadoUsuario.dni
            document.getElementById('email').textContent = resultadoUsuario.email
            document.getElementById('telefono').textContent = resultadoUsuario.telefono
            return result
        })
        .catch(error => console.log('Error al obtener usuario', error))
}

// Función que servirá para seleccionar a partir de una lista de los nombres de los usuarios
async function getUsuariosNombre() {
    let select = document.getElementById('select-usuarios')

    // hacemos la llamada a la API y pintamos los usuarios
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`)
        const responseData = await response.json()

        responseData.forEach(usuario => {
            if(usuario.rol_id == "2") {
                select.innerHTML += `<option id='${usuario.id}'>${usuario.nombre}`
            }
        })

    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}