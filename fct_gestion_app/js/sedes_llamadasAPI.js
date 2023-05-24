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
                <td><input type='button' onclick='putSede(${sede.id})' value='✏' class='botonEditar'></td>
                <td><input type='button' onclick='deleteSede(${sede.id})' value='❌' class='botonBorrar'></td>`
            tabla.appendChild(fila)
        }

        div.appendChild(tabla)
    } catch (error) {
        console.log(mensajeErrorGenerico + error)
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
    let div = document.getElementById("editar")

    try {
        const response = await fetch(`${API_BASE_URL}/sedes/${id}`)
        const responseData = await response.json()

        let sede = responseData.data
        div.innerHTML = `
            <p class="lead mb-0">Vas a editar la sede con ID <strong>${sede.id}</strong></p>
            <div class="text-center" id="formularioRegister">
            <form action="" id="formularioRegistro" onkeyup="validarRegistroSede()">
                <div class="form-column">
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" name="nombre" value="${sede.nombre}">
                    <label for="localidad">Localidad</label>
                    <input type="text" id="localidad" name="localidad" value="${sede.localidad}">
                    <label for="codigo_postal">Código Postal</label>
                    <input type="number" id="codigo_postal" name="codigo_postal" value="${sede.codigo_postal}">
                    <label for="empresa">Empresa</label>
                    <select id="select-empresas">
                    </select>
                </div>
                <div class="form-column">
                    <label for="direccion">Dirección</label>
                    <input type="text" id="direccion" name="direccion" value="${sede.direccion}">
                    <label for="provincia">Provincia</label>
                    <input type="text" id="provincia" name="provincia" value="${sede.provincia}">
                    <label for="telefono">Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" value="${sede.telefono}">    
                </div>
                <p id="errores"></p>
                <br><input type="submit" value="Guardar" class="btn btn-dark">
            </form></div>`

        let form = document.getElementById('formularioRegister')
        form.addEventListener('submit', async (event) => {
            event.preventDefault() // prevenir que el formulario se envíe por defecto

            // token
            let token = localStorage.getItem('token')

            let miHeaders = new Headers()
            miHeaders.append("Content-Type", "application/json")
            miHeaders.append("Authorization", `Bearer ${token}`)

            // select empresa
            let selectEmpresa = document.getElementById('select-empresas')

            let datos = JSON.stringify({
                "nombre": document.getElementById('nombre').value,
                "direccion": document.getElementById('direccion').value,
                "localidad": document.getElementById('localidad').value,
                "provincia": document.getElementById('provincia').value,
                "codigo_postal": document.getElementById('codigo_postal').value,
                "telefono": document.getElementById('telefono').value,
                "empresa_id": parseInt(selectEmpresa.options[selectEmpresa.selectedIndex].value)
            })

            let requestOptions = {
                method: 'PUT',
                headers: miHeaders,
                body: datos,
                redirect: 'follow'
            }

            fetch(`${API_BASE_URL}/sedes/${id}`, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Sede actualizada correctamente")
                        window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_sedes.html"
                    } else {
                        alert("Compruebe los datos del formulario.")
                    }
                    response.text()
                })
                .then(result => console.log(result))
                .catch(error => console.log('error', error))
        })    

        // Obtener las empresas y pintarlas en el select
        await getEmpresasNombre()

        // Cuando le des en editar salga la empresa que esté actualmente seleccionada
        let selectEmpresa = document.getElementById('select-empresas');
        for (let i = 0; i < selectEmpresa.options.length; i++) {
            // se va a selecciona la opcion que coincida con sede.empresa_id
            if (parseInt(selectEmpresa.options[i].value) === sede.empresa_id) {
                selectEmpresa.options[i].selected = true
                break
            }
        }
    } catch (error) {
        console.log(mensajeErrorGenerico + error)
    }
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
        console.log(mensajeErrorGenerico + error)
    }
}

// Función para validar los campos de registros
function validarRegistroSede() {
    limpiarOutput("errores")
    let campoErrores = document.getElementById("errores")

    if (!validarCamposVacios(document.getElementById('nombre').value) || !validarCamposVacios(document.getElementById('direccion').value) || 
    !validarCamposVacios(document.getElementById('localidad').value) || !validarCamposVacios(document.getElementById('provincia').value) ||
    !validarCamposVacios(document.getElementById('codigo_postal').value) || !validarCamposVacios(document.getElementById('telefono').value) || 
    !validarCamposVacios(document.getElementById('select-empresas').value))  {
        campoErrores.innerHTML += `${mensajeVacio} <br>`
    }

    if (!validarTamanio(document.getElementById('codigo_postal').value, 5, 5)) {
        campoErrores.innerHTML += `${mensajeCP} <br>`
    }

    if (!validarTamanio(document.getElementById('telefono').value, 9, 9)) {
        campoErrores.innerHTML += `${mensajeTelefono} <br>`
    }
}