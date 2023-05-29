// ruta API
const API_BASE_URL = "http://127.0.0.1:8000/api"

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