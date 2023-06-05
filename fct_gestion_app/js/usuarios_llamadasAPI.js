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
                        <td><input type='button' onclick='putUsuario(${usuario.id})' value='✏' class='botonEditar'></td>
                        <td><input type='button' onclick='deleteUsuario(${usuario.id})' value='❌' class='botonBorrar'></td>`
                    tabla.appendChild(fila)
                }
            }
        })

        div.appendChild(tabla)
    } catch (error) {
        console.log(mensajeErrorGenerico + error)
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
                    window.location.href = `gestion_alumnos.html`
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
    !validarCamposVacios(document.getElementById('fecha_nacimiento').value) || !validarCamposVacios(document.getElementById('dni').value) || 
    !validarCamposVacios(document.getElementById('telefono').value) || !validarCamposVacios(document.getElementById('correo').value)) {
        campoErrores.innerHTML += `${mensajeVacio} <br>`
    }

    if (!validarPassword(document.getElementById('password1').value) || !validarPassword(document.getElementById('password2').value)) {
        campoErrores.innerHTML += `${mensajeContrasena} <br>`
    } else if (!validar2Password(document.getElementById('password1').value, document.getElementById('password2').value)) {
        campoErrores.innerHTML += `${mensajePassRepetida} <br>`
    }
    
    if (!validarCorreo(document.getElementById('correo').value)) {
        campoErrores.innerHTML += `${mensajeCorreo} <br>`
    }
    
    if (!validarTamanio(document.getElementById('dni').value, 9, 9) ||
    !validarTamanio(document.getElementById('telefono').value, 9, 9)) {
        campoErrores.innerHTML += `${mensajeDNITelefono} <br>`
    }
}

// Función para editar un usuario
async function putUsuario(id) {
    let div = document.getElementById("editar")

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`)
        const responseData = await response.json()

        let usuario = responseData.data
        div.innerHTML = `
            <p class="lead mb-0">Vas a editar al usuario con ID ${usuario.id}</p>
            <div class="text-center" id="formularioRegister">
            <form action="" id="formularioRegistro" onkeyup="validarRegistro()">
                <div class="form-column">
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" name="nombre" value="${usuario.nombre}">
                    <label for="fecha_nacimiento">Fecha Nacimiento</label>
                    <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value="${usuario.fecha_nacimiento}">
                    <label for="correo">Correo eléctronico</label>
                    <input type="email" id="correo" name="correo" value="${usuario.email}">
                    <label for="password1">Contraseña</label>
                    <input type="password" id="password1" name="password1" value="">
                </div>
                <div class="form-column">
                    <label for="apellidos">Apellidos</label>
                    <input type="text" id="apellidos" name="apellidos" value="${usuario.apellidos}">
                    <label for="dni">DNI</label>
                    <input type="text" id="dni" name="dni" value="${usuario.dni}">
                    <label for="telefono">Teléfono</label>
                    <input type="text" id="telefono" name="telefono" value="${usuario.telefono}">
                    <label for="password2">Repite contraseña</label>
                    <input type="password" id="password2" name="password2" value="">
                </div>
                <p id="errores"></p>
                <br><input type="submit" value="Guardar" class="btn btn-dark">
            </form><div>`

        let form = document.getElementById('formularioRegister')
        form.addEventListener('submit', async (event) => {
            event.preventDefault() // prevenir que el formulario se envíe por defecto

            // token
            let token = localStorage.getItem('token')

            let miHeaders = new Headers()
            miHeaders.append("Content-Type", "application/json")
            miHeaders.append("Authorization", `Bearer ${token}`)

            let datos = JSON.stringify({
                "nombre": document.getElementById("nombre").value,
                "apellidos": document.getElementById("apellidos").value,
                "fecha_nacimiento": document.getElementById("fecha_nacimiento").value,
                "dni": document.getElementById("dni").value,
                "email": document.getElementById("correo").value,
                "telefono": document.getElementById("telefono").value,
                "password": document.getElementById("password2").value,
            })

            let requestOptions = {
                method: 'PUT',
                headers: miHeaders,
                body: datos,
                redirect: 'follow'
            }

            fetch(`${API_BASE_URL}/usuarios/${id}`, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Usuario actualizado correctamente")
                        window.location.href = `gestion_alumnos.html`
                    } else {
                        alert("Compruebe los datos del formulario.")
                    }
                    response.text()
                })
                .then(result => console.log(result))
                .catch(error => console.log('error', error))
        })    
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Función para editar un usuario desde el perfil de usuario
async function putPerfilUsuario() {
    let id = await obtenerIDUsuarioLogado()
    putUsuario(id)
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
        }
    
        fetch(`${API_BASE_URL}/usuarios/${id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                alert("Usuario borrado correctamente")
                window.location.href = `gestion_alumnos.html`
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
    })
    
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
        window.location.href = `login.html`
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
            document.getElementById("nombre-usuario").textContent = `¡Hola, ${resultadoUsuario.nombre}! 👋`

            // para que no de error al gestionar los datos del perfil
            if (pagina.includes('perfil_usuario.html')) {
                document.getElementById('nombre_perfil').textContent = resultadoUsuario.nombre
                document.getElementById('apellidos_perfil').textContent = resultadoUsuario.apellidos
                document.getElementById('fecha_nacimiento_perfil').textContent = resultadoUsuario.fecha_nacimiento
                document.getElementById('dni_perfil').textContent = resultadoUsuario.dni
                document.getElementById('correo_perfil').textContent = resultadoUsuario.email
                document.getElementById('telefono_perfil').textContent = resultadoUsuario.telefono
                if (resultadoUsuario.rol_id == 2) {
                    document.getElementById('perfil-usuario').textContent = "Perfil de alumno"
                } else {
                    document.getElementById('perfil-usuario').textContent = "Perfil de docente" 
                }
            }

            // Pintar enlaces en menú dependiendo del rol que tengas
            let menu = document.getElementById('menu')

            if (resultadoUsuario.rol_id == 2) {
                menu.innerHTML = `
                <a href="perfil_usuario.html">Perfil </a>
                <a href="gestion_cv.html"> CV </a>
                <a href="" onclick="logout()"> Cerrar sesión</a>`
            }

            if(resultadoUsuario.rol_id == 1) {
                menu.innerHTML = `
                <a href="gestion_alumnos.html"> Gestión Usuarios </a> 
                <a href="gestion_empresas.html"> Gestión Empresas </a>
                <a href="gestion_sedes.html"> Gestión Sedes </a></li> 
                <a href="gestion_candidaturas.html"> Gestión Candidaturas </a>
                <a href="perfil_usuario.html">Perfil </a>
                <a href="" onclick="logout()"> Cerrar sesión</a>`
            }
            
            // Redireccionar por rol
            // si un alumno intenta acceder a una página diferente a "inicio_alumno" o "perfil_usuario", se le redirige 
            if (resultadoUsuario.rol_id == 2) {
                if (pagina.includes("gestion_alumnos") || pagina.includes("gestion_candidaturas") || pagina.includes("gestion_docentes") 
                || pagina.includes("gestion_empresas") || pagina.includes("gestion_sedes")) {
                    window.location.href = `acceso_denegado.html`
                }
            }

            // Si un profesor intenta acceder a la página "inicio_alumno", se le redirige
            if (resultadoUsuario.rol_id == 1) {
                if (pagina.includes("inicio_alumno") || pagina.includes("gestion_cv")) {
                    window.location.href = `acceso_denegado.html`
                }
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
        console.log(mensajeErrorGenerico + error)
    }
}

// Función que servirá para pintar un select con todos los nombre de alumnos siempre y 
// cuando el alumno no tenga candidaturas aceptadas
async function getUsuariosNombreCandidaturas() {
    let select = document.getElementById('select-usuarios')

    // Hacemos la llamada a la API y obtenemos los usuarios
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`)
        const responseData = await response.json()

        // Hacemos una segunda llamada a la API para obtener las candidaturas del usuario
        const reponseCandidaturas = await fetch(`${API_BASE_URL}/candidaturas`)
        const reponseDataCandidaturas = await reponseCandidaturas.json()

        responseData.forEach(usuario => {
            if (usuario.rol_id == "2") {
                // Comprobamos si el usuario tiene una candidatura aceptada
                const candidaturaUsuarioAceptada = reponseDataCandidaturas.some(candidatura => 
                    candidatura.usuario_id == usuario.id && candidatura.estado == "Aprobada"
                )
                
                // Si tiene alguna aceptada, saldrá como disabled 
                if (!candidaturaUsuarioAceptada) {
                    select.innerHTML += `<option value='${usuario.id}'>${usuario.nombre}`
                } else {
                    select.innerHTML += `<option disabled>${usuario.nombre}`
                }
            }
        })

    } catch (error) {
        console.log(mensajeErrorGenerico + error)
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