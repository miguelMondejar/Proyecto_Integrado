// Función que devuelve un listado de empresas en forma de tabla
async function getEmpresas() {
    let div = document.getElementById('empresas')

    // creamos la tabla
    let tabla = document.createElement('table')
    tabla.classList.add('table')

    let encabezadosTabla = ['Nombre', 'CIF', 'Email', 'Editar', 'Borrar']
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
        const response = await fetch(`${API_BASE_URL}/empresas`)
        const responseData = await response.json()

        responseData.forEach(empresa => {
            let fila = document.createElement('tr')
            fila.innerHTML = `
                <td>${empresa.nombre}</td>
                <td>${empresa.cif}</td>
                <td>${empresa.email}</td>
                <td><input type='submit' onclick='' value='✏' class='botonEditar'></td>
                <td><input type='submit' onclick='deleteEmpresa(${empresa.id})' value='❌' class='botonBorrar'></td>`
            tabla.appendChild(fila)
        })

        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Función para eliminar una empresa
async function deleteEmpresa(id) {
    mensajeConfirmacion("empresa")
    let token = localStorage.getItem('token')

    let miHeaders = new Headers()
    miHeaders.append(`Authorization`, `Bearer ${token}`)

    let requestOptions = {
        method: 'DELETE',
        headers: miHeaders,
        redirect: 'follow'
    };

    fetch(`${API_BASE_URL}/empresas/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
}

// Función para editar una empresa
async function putEmpresa(id) {
    
}

// Función que servirá para seleccionar a partir de una lista de los nombres de las empresas
async function getEmpresasNombre() {
    let select = document.getElementById('select-empresas')

    // hacemos la llamada a la API y pintamos las empresas
    try {
        const response = await fetch(`${API_BASE_URL}/empresas`)
        const responseData = await response.json()

        responseData.forEach(empresas => {
            select.innerHTML += `<option id='${empresas.id}'>${empresas.nombre}`
        })

    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}