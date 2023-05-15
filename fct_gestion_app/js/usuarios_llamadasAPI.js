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
                    <td><input type='submit' onclick='' value='✏'></td>
                    <td><input type='submit' onclick='deleteUsuario(${usuario.id})' value='❌'></td>`
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
    const form = document.getElementById('formularioRegister')
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault() // prevenir que el formulario se envíe por defecto

        // cogemos el token del profesor
        let token = localStorage.getItem('token')

        // si los datos son correctos
        if(validarRegistro() == true) {
            let miHeaders = new Headers()
            miHeaders.append(`Authorization`, `Bearer ${token}`)
        
            // hacemos el registro
            let datos = JSON.stringify({
                "nombre": nombre,
                "apellidos": apellidos,
                "fecha_nacimiento": fecha_nacimiento,
                "dni": dni,
                "email": email,
                "telefono": telefono,
                "password": password2,
                "rol_id": 2
            });
        
            let requestRegistro = {
                method: 'POST',
                headers: miHeaders,
                body: datos,
                redirect: 'follow'
            };
        
            fetch(`${API_BASE_URL}/register`, requestRegistro)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error))
        }
    })
}

// Función para validar los campos de registros
function validarRegistro() {
    if (nombre == "" || apellidos == "" || fecha_nacimiento == "" || dni == "" || 
    email == "" || telefono == "" || password1 == "" || password2 == "") {
        alert("Todos los campos son obligatorios")
        return false
    }

    // Verificar si las contraseñas coinciden
    if (password1 !== password2) {
        alert("Las contraseñas no coinciden")
        return false
    }

    // Si todo está correcto, enviar el formulario
    return true
}

// Función para editar un usuario
async function putUsuario(id) {
    
}
  
// Función para eliminar un usuario
async function deleteUsuario(id) {
    mensajeConfirmacion("usuario")
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
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
}

// Función para cerrar sesión
async function logout() {
    let token = localStorage.getItem('token')

    let miHeaders = new Headers()
    miHeaders.append("Content-Type", "application/json")
    
    let datos = JSON.stringify({
        "token": token
    })
    
    let requestOptions = {
        method: 'POST',
        headers: miHeaders,
        body: datos,
        redirect: 'follow'
    }
    
    fetch(`${API_BASE_URL}/logout`, requestOptions)
        .then(response => {response.json()})
        .then(result => {
            console.log(result)
            if(result.exito == true) {
                localStorage.removeItem("token")
            }
        })
        .catch(error => console.log('error', error))
}

// Función para consultar el token existente
async function consultarToken() {
    // consultamos el token
    let token = localStorage.getItem('token')
    // si no existe, redirigimos al inicio de sesión
    if(token == null || token == "") {
        console.log(mensajeInicioSesion)
        window.location.href = "http://127.0.0.1:3000/fct_gestion_app/login.html";
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
            let nombreUsuario = result.usuario.nombre
            document.getElementById("nombre-usuario").textContent = `Bienvenido/a ${nombreUsuario} 👋`
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