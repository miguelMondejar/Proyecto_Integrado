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
                <td><input type='submit' onclick='putEmpresa(${empresa.id})' value='✏' class='botonEditar'></td>
                <td><input type='submit' onclick='deleteEmpresa(${empresa.id})' value='❌' class='botonBorrar'></td>`
            tabla.appendChild(fila)
        })

        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Función para registrar una empresa
async function registerEmpresa() {
    const form = document.getElementById('formularioRegistro')
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault() // prevenir que el formulario se envíe por defecto

        // cogemos el token del profesor
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append("Content-Type", "application/json")
        miHeaders.append(`Authorization`, `Bearer ${token}`)

        // hacemos el registro
        let datos = JSON.stringify({
            "cif": document.getElementById('cif').value,
            "nombre": document.getElementById('nombre').value,
            "email": document.getElementById('correo').value
        })

        let requestRegistro = {
            method: 'POST',
            headers: miHeaders,
            body: datos,
            redirect: 'follow'
        }

        try {
            let response = await fetch(`${API_BASE_URL}/empresas`, requestRegistro)
            if (response.ok) {
                alert("Empresa creada correctamente")
                window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_empresas.html"
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

// Función para eliminar una empresa
async function deleteEmpresa(id) {
    let mensajeConfirmacion = confirm("¿Está seguro que desea eliminar a esta empresa? También eliminará sus empresas")
    if (mensajeConfirmacion) {
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append(`Authorization`, `Bearer ${token}`)
    
        let requestOptions = {
            method: 'DELETE',
            headers: miHeaders,
            redirect: 'follow'
        }

        fetch(`${API_BASE_URL}/empresas/${id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                alert("Empresa borrada correctamente")
                window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_empresas.html"
            })
            .catch(error => console.log('error', error))
    }
}

// Función para editar una empresa
async function putEmpresa(id) {
    let div = document.getElementById("editar")

    try {
        const response = await fetch(`${API_BASE_URL}/empresas/${id}`)
        const responseData = await response.json()

        let empresa = responseData.data
        div.innerHTML = `<form id="formularioRegister" onclick="validarRegistro()">
            <input type="text" value="${empresa.cif}" id="cif">
            <input type="text" value="${empresa.nombre}" id="nombre">
            <input type="email" value="${empresa.email}" id="correo">`

        let miHeaders = new Headers()
        miHeaders.append("Content-Type", "application/json")

        div.innerHTML += `<br><input type="submit" value="Guardar" class="btn btn-dark"></form>`

        let form = document.getElementById('formularioRegister')
        form.addEventListener('submit', async (event) => {
            event.preventDefault() // prevenir que el formulario se envíe por defecto

            let datos = JSON.stringify({
                "cif": document.getElementById('cif').value,
                "nombre": document.getElementById('nombre').value,
                "email": document.getElementById('correo').value
            })

            let requestOptions = {
                method: 'PUT',
                headers: miHeaders,
                body: datos,
                redirect: 'follow'
            }

            fetch(`${API_BASE_URL}/empresas/${id}`, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Empresa actualizada correctamente")
                        window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_empresas.html"
                    }
                    response.text()
                })
                .then(result => console.log(result))
                .catch(error => console.log('error', error))
        })    
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Función que servirá para seleccionar a partir de una lista de los nombres de las empresas
async function getEmpresasNombre() {
    let select = document.getElementById('select-empresas')

    // hacemos la llamada a la API y pintamos las empresas
    try {
        const response = await fetch(`${API_BASE_URL}/empresas`)
        const responseData = await response.json()

        responseData.forEach(empresas => {
            select.innerHTML += `<option value='${empresas.id}'>${empresas.nombre}`
        })

    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Función para validar los campos de registros
function validarRegistro() {
    limpiarOutput("errores")
    let campoErrores = document.getElementById("errores")

    if (!validarCamposVacios(document.getElementById('nombre').value) || !validarCamposVacios(document.getElementById('cif').value) || 
    !validarCamposVacios(document.getElementById('correo').value)) {
        campoErrores.innerHTML += `${mensajeVacio} <br>`
    }

    if (!validarCorreo(document.getElementById('correo').value)) {
        campoErrores.innerHTML += `${mensajeCorreo} <br>`
    }

    if (!validarTamanio(document.getElementById('cif').value, 9, 9)) {
        campoErrores.innerHTML += `${mensajeCIF} <br>`
    }
}