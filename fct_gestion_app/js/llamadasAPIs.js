const API_BASE_URL = "http://127.0.0.1:8000/api"

// función para pintar usuarios en forma de tabla
async function getUsuarios(tipoUsuario) {
    let div = document.getElementById('usuarios')

    // creamos la tabla
    let tabla = document.createElement('table')
    tabla.classList.add('table')

    let encabezadosTabla = ['Nombre', 'Apellidos', 'Fecha nacimiento', 'DNI', 'Correo', 'Teléfono', 'Editar', 'Borrar']
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
        const response = await fetch(`${API_BASE_URL}/usuarios`)
        const responseData = await response.json()

        responseData.forEach(usuario => {
            if(usuario.rol_id == tipoUsuario) {
                let fila = document.createElement('tr')
                fila.innerHTML = `
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidos}</td>
                    <td>${usuario.fecha_nacimiento}</td>
                    <td>${usuario.dni}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefono}</td>
                    <td><input type='submit' onclick='' value='✏'></td>
                    <td><input type='submit' onclick='deleteUsuario("${usuario.rol_id}", "a")' value='❌'></td>`
                tabla.appendChild(fila)
            }
        })

        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

async function deleteUsuario(id, token) {
    mensajeConfirmacion("usuario")

    let miHeaders = new Headers()
    miHeaders.append("Authorization", `Bearer ${token}`)

    let requestOptions = {
        method: 'DELETE',
        headers: miHeaders,
        redirect: 'follow'
    };

    fetch(`${API_BASE_URL$}/usuarios/{id}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
}

async function getEmpresas() {
    let div = document.getElementById('empresas')
    try {
        const response = await fetch(`${API_BASE_URL}/empresas`)
        const responseData = await response.json()
        
        // imprimimos todos los usuarios que estén en tendencia
        responseData.forEach(usuario => {
            div.innerHTML += "<p>" + usuario.id + " | "+ usuario.nombre + "</p>"
        })
        
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}