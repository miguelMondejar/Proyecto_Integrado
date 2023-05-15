// Función para recargar la página
const recargaPagina = () => {
    location.reload()
}
  
// Removes all child nodes for the element specified
const limpiarOutput = (elementName) => {
    let elementNode = document.getElementById(elementName)
    while (elementNode.firstChild) {
        elementNode.removeChild(elementNode.firstChild)
    }
}

// Mensaje de confirmación
const mensajeConfirmacion = (elemento) => {
    confirm("¿Está seguro que desea eliminar a este " + elemento + " ?")
}

// Función para desplegar un menú al hacer clic en el perfil
function mostrarMenu() {
    const enlaceMenu = document.getElementById('enlace-menu')

    enlaceMenu.addEventListener('click', function(event) {
        event.preventDefault();

        // Hacemos aparecer el menú
        let menu = document.getElementById("menu")
        if (menu.style.display === "none") {
            menu.style.display = "block"
        } else {
            menu.style.display = "none"
        }
    });  
}
  