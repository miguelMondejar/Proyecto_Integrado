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
            let empresaData = await obtenerNombreEmpresa(sede.empresa_id)

            fila.innerHTML = `
                <td>${sede.nombre}</td>
                <td>${empresaData.nombre}</td>
                <td>${sede.direccion}</td>
                <td>${sede.localidad}</td>
                <td>${sede.codigo_postal}</td>
                <td>${sede.telefono}</td>
                <td><input type='button' onclick='' value='✏' class='botonEditar'></td>
                <td><input type='button' onclick='deleteSede(${sede.id})' value='❌' class='botonBorrar'></td>`
            tabla.appendChild(fila)
        }

        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Esta función será utilizada para que me devuelva el nombre de la empresa en el listado de Sedes
async function obtenerNombreEmpresa(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/empresas/${id}`)
        const empresaData = await response.json()
        return empresaData.data
    } catch (error) {
        console.log(`Error al obtener los datos de la empresa con ID ${id}:`, error)
        return null
    }
}

// Función para registrar una sede a una empresa
async function registerSede() {
    const form = document.getElementById('formularioRegistro')
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault() // prevenir que el formulario se envíe por defecto

        // cogemos el token del profesor
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append("Content-Type", "application/json")
        miHeaders.append(`Authorization`, `Bearer ${token}`)

        // select
        let selectEmpresa = document.getElementById('select-empresas')

        // hacemos el registro
        let datos = JSON.stringify({
            "nombre": document.getElementById('nombre').value,
            "direccion": document.getElementById('direccion').value,
            "localidad": document.getElementById('localidad').value,
            "provincia": document.getElementById('provincia').value,
            "codigo_postal": document.getElementById('codigo_postal').value,
            "telefono": document.getElementById('telefono').value,
            "empresa_id": parseInt(selectEmpresa.options[selectEmpresa.selectedIndex].value)
        })

        let requestRegistro = {
            method: 'POST',
            headers: miHeaders,
            body: datos,
            redirect: 'follow'
        }

        try {
            let response = await fetch(`${API_BASE_URL}/sedes`, requestRegistro)
            if (response.ok) {
                alert("Sede creada correctamente")
                window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_sedes.html"
            } else {
                alert("Datos erroneos, compruebelos.")
                let error = await response.text()
                console.log('Error:', error)
            }
        } catch (error) {
            console.log('error', error)
        }
    })
}

// Función para eliminar una sede
async function deleteSede(id) {
    let mensajeConfirmacion = confirm("¿Está seguro que desea eliminar a esta sede?")
    if (mensajeConfirmacion) {
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append(`Authorization`, `Bearer ${token}`)
    
        let requestOptions = {
            method: 'DELETE',
            headers: miHeaders,
            redirect: 'follow'
        }

        fetch(`${API_BASE_URL}/sedes/${id}`, requestOptions)
            .then(response => {
                if(response.ok) {
                    alert("Sede borrada correctamente")
                    window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_sedes.html"
                }
                console.log(response.text())
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
    }
}

// Función para editar una sede
async function putSede(id) {

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