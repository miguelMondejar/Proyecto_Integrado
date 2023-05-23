// Función para pintar las candidaturas de un usuario espefico
async function getCandidaturaUsuario() {
    let div = document.getElementById('candidaturas')

    // Creamos la tabla
    let tabla = document.createElement('table')
    tabla.classList.add('table')

    let encabezadosTabla = ['Fecha Inicio', 'Fecha Fin', 'Empresa', 'Estado']
    let encabezadosFilas = document.createElement('tr')

    // Rellenamos el encabezado de la tabla
    for (let h of encabezadosTabla) {
        let th = document.createElement('th')
        th.textContent = h
        encabezadosFilas.appendChild(th)
    }
    tabla.appendChild(encabezadosFilas)

    // Hacemos la llamada a la API y pintamos en la tabla
    try {
        const response = await fetch(`${API_BASE_URL}/candidaturas`)
        const responseData = await response.json()
        let idAlumno = await obtenerIDUsuarioLogado()

        for (let candidatura of responseData) {
            if(candidatura.usuario_id == idAlumno) {
                let empresaData = await obtenerNombreEmpresa(candidatura.empresa_id)
                
                let fila = document.createElement('tr')
                fila.innerHTML = `
                    <td>${candidatura.fecha_inicio}</td>
                    <td>${candidatura.fecha_fin}</td>
                    <td>${empresaData.nombre}</td>
                    <td>${candidatura.estado}</td>`
                tabla.appendChild(fila)
            }
        }
        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Función para pintar todas las candidaturas y poderlas gestionar por un profesor
async function getCandidaturas() {
    let div = document.getElementById('candidaturas')
    
    // creamos la tabla
    let tabla = document.createElement('table')
    tabla.classList.add('table')

    let encabezadosTabla = ['Fecha Inicio', 'Fecha Fin', 'Alumno', 'Empresa', 'Estado', 'Editar', 'Borrar']
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

        for (let candidatura of responseData) {
            let empresaData = await obtenerNombreEmpresa(candidatura.empresa_id)
            let alumnoData = await obtenerNombreAlumno(candidatura.usuario_id)
            
            let fila = document.createElement('tr')
            fila.innerHTML = `
                <td>${candidatura.fecha_inicio}</td>
                <td>${candidatura.fecha_fin}</td>
                <td>${alumnoData.nombre}</td>
                <td>${empresaData.nombre}</td>
                <td>${candidatura.estado}</td>
                <td><input type='submit' onclick='putCandidatura(${candidatura.id})' value='✏' class='botonEditar'></td>
                <td><input type='submit' onclick='deleteCandidatura(${candidatura.id})' value='❌' class='botonBorrar'></td>`
            tabla.appendChild(fila)
        }
        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

// Función para registrar un usuario
async function registerCandidatura() {
    const form = document.getElementById('formularioRegistro')
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault() // prevenir que el formulario se envíe por defecto

        // cogemos el token del profesor
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append("Content-Type", "application/json")
        miHeaders.append(`Authorization`, `Bearer ${token}`)

        // selects
        let selectEmpresa = document.getElementById('select-empresas')
        let selectAlumno = document.getElementById('select-usuarios')
        let selectEstado = document.getElementById('estado')
        
        // hacemos el registro
        let datos = JSON.stringify({
            "fecha_inicio": document.getElementById('fecha_inicio').value,
            "fecha_fin": document.getElementById('fecha_fin').value,
            "estado": selectEstado.options[selectEstado.selectedIndex].value,
            "usuario_id": parseInt(selectAlumno.options[selectAlumno.selectedIndex].value),
            "empresa_id": parseInt(selectEmpresa.options[selectEmpresa.selectedIndex].value)
        })

        let requestRegistro = {
            method: 'POST',
            headers: miHeaders,
            body: datos,
            redirect: 'follow'
        }

        try {
            let response = await fetch(`${API_BASE_URL}/candidaturas`, requestRegistro)
            if (response.ok) {
                alert("Candidatura creada correctamente")
                window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_candidaturas.html"
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

// Función para eliminar una candidatura
async function deleteCandidatura(id) {
    let mensajeConfirmacion = confirm("¿Está seguro que desea eliminar a esta candidatura?")
    if (mensajeConfirmacion) {
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append(`Authorization`, `Bearer ${token}`)
    
        let requestOptions = {
            method: 'DELETE',
            headers: miHeaders,
            redirect: 'follow'
        }

        fetch(`${API_BASE_URL}/candidaturas/${id}`, requestOptions)
            .then(response => {
                if(response.ok) {
                    alert("Candidatura borrada correctamente")
                    window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_candidaturas.html"
                }
                console.log(response.text())
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
    }
}

// Función para editar una candidatura
async function putCandidatura(id) {
    let div = document.getElementById("editar")

    try {
        const response = await fetch(`${API_BASE_URL}/candidaturas/${id}`)
        const responseData = await response.json()

        let candidatura = responseData.data
        div.innerHTML = `<form id="formularioRegister">
            <input type="date" value="${candidatura.fecha_inicio}" id="fecha_inicio">
            <input type="date" value="${candidatura.fecha_fin}" id="fecha_fin">
            <select id="estado">
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
            </select>
            <select id="select-empresas"></select>
            <select id="select-usuarios"></select>`

        let miHeaders = new Headers()
        miHeaders.append("Content-Type", "application/json")

        div.innerHTML += `<br><input type="submit" value="Guardar" class="btn btn-dark"></form>`

        let form = document.getElementById('formularioRegister')
        form.addEventListener('submit', async (event) => {
            event.preventDefault() // prevenir que el formulario se envíe por defecto

            // selects
            let selectEmpresa = document.getElementById('select-empresas')
            let selectAlumno = document.getElementById('select-usuarios')
            let selectEstado = document.getElementById('estado')

            let datos = JSON.stringify({
                "fecha_inicio": document.getElementById('fecha_inicio').value,
                "fecha_fin": document.getElementById('fecha_fin').value,
                "estado": selectEstado.options[selectEstado.selectedIndex].value,
                "usuario_id": parseInt(selectAlumno.options[selectAlumno.selectedIndex].value),
                "empresa_id": parseInt(selectEmpresa.options[selectEmpresa.selectedIndex].value)
            })

            let requestOptions = {
                method: 'PUT',
                headers: miHeaders,
                body: datos,
                redirect: 'follow'
            }

            fetch(`${API_BASE_URL}/candidaturas/${id}`, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Candidatura actualizada correctamente")
                        window.location.href = "http://127.0.0.1:3000/fct_gestion_app/gestion_candidaturas.html"
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

// Función para validar los campos de registros
function validarRegistro() {
    let campoErrores = document.getElementById("errores")

    if (!validarCamposVacios(document.getElementById('fecha_inicio').value) || !validarCamposVacios(document.getElementById('fecha_inicio').value) || 
    !validarCamposVacios(document.getElementById('estado').value) || !validarCamposVacios(document.getElementById('usuario_id').value) ||
    !validarCamposVacios(document.getElementById('empresa_id').value))  {
        campoErrores.innerHTML += `${mensajeVacio} <br>`
    }
}