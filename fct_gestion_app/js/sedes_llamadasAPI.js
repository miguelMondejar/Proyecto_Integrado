// Función para pintar todas las candidaturas y poderlas gestionar por un profesor
async function getSedes() {
    let div = document.getElementById('sedes')

    // Creamos la tabla
    let tabla = document.createElement('table')
    tabla.classList.add('table')

    let encabezadosTabla = ['Sede', 'Empresa', 'Dirección', 'Localidad', 'Código postal', 'Teléfono', 'Editar', 'Borrar']
    let encabezadosFilas = document.createElement('tr')

    // Rellenamos el encabezado de la tabla
    for (let h of encabezadosTabla) {
        let th = document.createElement('th')
        th.textContent = h
        encabezadosFilas.appendChild(th)
    }
    tabla.appendChild(encabezadosFilas)

    try {
        const response = await fetch(`${API_BASE_URL}/sedes`)
        const responseData = await response.json()

        // Iteramos sobre cada sede y obtenemos los datos de la empresa
        for (let sede of responseData) {
            let fila = document.createElement('tr')
            let empresaData = await obtenerDatosEmpresa(sede.empresa_id)

            fila.innerHTML = `
                <td>${sede.nombre}</td>
                <td>${empresaData.nombre}</td>
                <td>${sede.direccion}</td>
                <td>${sede.localidad}</td>
                <td>${sede.codigo_postal}</td>
                <td>${sede.telefono}</td>
                <td><input type='button' onclick='' value='✏' class='botonEditar'></td>
                <td><input type='button' onclick='deleteUsuario(${sede.id})' value='❌' class='botonBorrar'></td>`
            tabla.appendChild(fila)
        }

        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Esta función será utilizada para que me devuelva el nombre de la empresa en el listado de Sedes
async function obtenerDatosEmpresa(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/empresas/${id}`)
        const empresaData = await response.json()
        return empresaData.data
    } catch (error) {
        console.log(`Error al obtener los datos de la empresa con ID ${id}:`, error)
        return null
    }
}

// Función para eliminar una candidatura
async function deleteCandidatura(id) {

}

// Función para editar una candidatura
async function putCandidatura(id) {

}

async function getSedesNombre() {
    let select = document.getElementById('select-sedes')

    // hacemos la llamada a la API y pintamos los usuarios
    try {
        const response = await fetch(`${API_BASE_URL}/sedes`)
        const responseData = await response.json()

        responseData.forEach(sedes => {
            select.innerHTML += `<option id='${sedes.id}'>${sedes.nombre}`
        })

    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}