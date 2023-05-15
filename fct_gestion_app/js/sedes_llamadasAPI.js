// Función para pintar todas las candidaturas y poderlas gestionar por un profesor
async function getCandidaturas() {
    let div = document.getElementById('candidaturas')
    
    // creamos la tabla
    let tabla = document.createElement('table')
    tabla.classList.add('table')

    let encabezadosTabla = ['Fecha Inicio', 'Fecha Fin', 'Empresa', 'Estado']
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
        const response = await fetch(`${API_BASE_URL}/candidaturas`)
        const responseData = await response.json()

        responseData.forEach(candidatura => {
            let fila = document.createElement('tr')
            fila.innerHTML = `
                <td>${candidatura.fecha_inicio}</td>
                <td>${candidatura.fecha_fin}</td>
                <td>${candidatura.empresa_id}</td>
                <td>${candidatura.estado}</td>`
            tabla.appendChild(fila)
        })

        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
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