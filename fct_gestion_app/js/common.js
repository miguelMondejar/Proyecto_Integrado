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