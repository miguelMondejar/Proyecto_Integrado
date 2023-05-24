// ruta API
const API_BASE_URL = "http://127.0.0.1:8000/api"

// formularios
const nombre = document.getElementById('nombre').value
const apellidos = document.getElementById('apellidos').value
const fecha_nacimiento = document.getElementById('fecha_nacimiento').value
const dni = document.getElementById('dni').value
const email = document.getElementById('email').value
const telefono = document.getElementById('telefono').value
const password1 = document.getElementById('password1').value
const password2 = document.getElementById('password2').value

const cif = document.getElementById('cif').value
const direccion = document.getElementById('direccion').value

const localidad = document.getElementById('localidad').value
const codigo_postal = document.getElementById('codigo_postal').value

const fecha_inicio = document.getElementById('fecha_inicio').value
const fecha_fin = document.getElementById('fecha_fin').value
const estado = document.getElementById('estado').value

const ruta = document.getElementById('ruta').value

// Funciones de ayuda
// Función para recargar la página
const recargaPagina = () => {
    location.reload()
}

// Función para desplegar un menú al hacer clic en el perfil
function mostrarMenu() {
    const enlaceMenu = document.getElementById('enlace-menu')

    enlaceMenu.addEventListener('click', function(event) {
        event.preventDefault()
        // Hacemos aparecer el menú
        let menu = document.getElementById("menu")
        if (menu.style.display === "none") {
            menu.style.display = "block"
        } else {
            menu.style.display = "none"
        }
    })
}