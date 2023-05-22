// Expresion regular correo
let emailExpresion = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
// Expresion regular contraseña
let passExpresion = /^.{8,20}$/

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

// función para validar que no esté vacío un campo
function validarCamposVacios(campo) {
    return campo.trim() !== ""
}

// funcion para validar correo
function validarCorreo(campo) {
    return emailExpresion.test(campo)
}

// funcion para validar una contraseña
function validarPassword(campo) {
    return passExpresion.test(campo)
}

// funcion para validar dos contraseñas sean iguales
function validar2Password(campo1, campo2) {
    return campo1 == campo2
}

// funcion para validar un tamaño de un campo
function validarTamanio(campo, min, max) {
    return campo.length >= min && campo.length <= max
}

// Removes all child nodes for the element specified
const limpiarOutput = (elementName) => {
    let elementNode = document.getElementById(elementName)
    while (elementNode.firstChild) {
        elementNode.removeChild(elementNode.firstChild)
    }
}