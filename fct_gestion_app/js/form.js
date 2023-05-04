const API_BASE_URL = "http://127.0.0.1:8000/api";

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

        // hacemos el fetch
        fetch(`${API_BASE_URL}/login`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    })
}