// Mensajes
const mensajeVacio = "Los campos no pueden estar vacíos."
const mensajeVacioRegistro = "Los campos 'Nombre' y 'Apellidos' no pueden estar vacíos."
const mensajeCorreo = "El correo electrónico debe ser válido."
const mensajeContrasena = "La contraseña debe tener al menos una longitud de 8 caracteres y contener una mayúscula, una minúscula y un número."
const mensajePassRepetida = "La contraseñas son distintas."
const mensajeGenero = "Debe señalar un género."
const mensajeIdioma = "Debe señalar un idioma correcto."
const mensajeCookies = "Las cookies no están aceptadas. Acéptelas para que la página funcione correctamente."
const mensajeMail = "El correo electrónico no es válido."
const mensajeContrasenaLogin = "Contraseña no válida, compruebe también que las cookies estén aceptadas."
const mensajeInicioSesion = "No ha iniciado sesión."

// Expresion regular correo
let emailExpresion = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
// Expresion regular contraseña
let passExpresion = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,20}$/

// Función que valida los campos del login
const validarCamposLogin = () => {
    // limpiamos el output de errores
    limpiarOutput("errorMail") 
    limpiarOutput("errorVacio")

    let validacion = true

    // campos
    let campoCorreo = document.getElementById("correo").value
    let campoContrasena = document.getElementById("pass").value

    // validamos que no esté vacío
    if(campoCorreo == "" || campoContrasena == "") {
        document.getElementById("errorVacio").appendChild(document.createTextNode(mensajeVacio))
        validacion = false
    }

    // validamos correo
    if(!emailExpresion.test(campoCorreo)) { 
        document.getElementById("errorMail").appendChild(document.createTextNode(mensajeCorreo))
        validacion = false
    }

    return validacion
}

function loginUsuario() {
    const form = document.getElementById('login-formulario')
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault() // prevenir que el formulario se envíe por defecto

        // datos del login
        const email = document.getElementById('correo').value
        const password = document.getElementById('pass').value

        // lo pasamos en formato JSON
        let datos = JSON.stringify({
            "email": email,
            "password": password
        });

        // encabezados para el request
        let header = new Headers();
        header.append("Content-Type", "application/json");

        // preparamos el request
        let requestOptions = {
            method: 'POST',
            headers: header,
            body: datos,
            redirect: 'follow'
        };

        // hacemos el fetch y guardamos el token
        fetch(`${API_BASE_URL}/login`, requestOptions)
            .then(response => {
                // Verifica si la respuesta del servidor es 200 OK
                if (!response.ok) {
                    alert('Error al iniciar sesión')
                    throw new Error('Error al iniciar sesión')
                }
                // Extrae el token del cuerpo de respuesta de la solicitud
                return response.json()
            })
            .then(data => {
                // Almacenar el token en una variable
                const token = data.token
                // Configurar los encabezados para la solicitud user POST
                let headers = new Headers()
                headers.append('Authorization', `Bearer ${token}`)
                headers.append('Content-Type', 'application/json')

                // Configurar la solicitud user POST
                let userRequestOptions = {
                    method: 'POST',
                    headers: headers,
                    redirect: 'follow'
                }

                // Hacer la solicitud user POST
                fetch(`${API_BASE_URL}/user`, userRequestOptions)
                    .then(response => {
                        // Verifica si la respuesta del servidor es 200 OK
                        if (!response.ok) {
                            throw new Error('Error al obtener usuario')
                        }
                        // Extrae los datos del usuario del cuerpo de respuesta de la solicitud
                        return response.json()
                    })
                    .then(result => {
                        // dependiendo del rol del usuario irá a una página u otra
                        if (result.usuario.rol_id == 1) {
                            // guardamos token en localStorage
                            localStorage.setItem('token', token)
                            // enviamos a inicio de la página profesor
                            window.location.href = "http://127.0.0.1:3000/fct_gestion_app/inicio_profesor.html";
                        } else if (result.usuario.rol_id == 2) {
                            // guardamos token en localStorage
                            localStorage.setItem('token', token)
                            // enviamos a inicio de la página profesor
                            window.location.href = "http://127.0.0.1:3000/fct_gestion_app/inicio_alumno.html";
                        } else {
                            console.log('Rol no válido');
                        }
                    })
                    .catch(error => console.log('Error al obtener usuario', error))
            })
            .catch(error => console.log('Error al iniciar sesión', error))
    })
}

async function consultarToken() {
    // consultamos el token
    let token = localStorage.getItem('token')
    // si no existe, redirigimos al inicio de sesión
    if(token == null || token == "") {
        alert(mensajeInicioSesion)
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
            document.getElementById("nombre-usuario").textContent = `Bienvenido/a, ${nombreUsuario}`
            return result
        })
        .catch(error => console.log('Error al obtener usuario', error))
}