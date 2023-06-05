// Función encargada de subir el currículum al servidor y redirigir al usuario
async function subirCV() {
  document.getElementById('cvForm').addEventListener('submit', async function(e) {
    e.preventDefault()

    // Obtiene el archivo seleccionado por el alumno
    let cvFile = document.getElementById('cvFile').files[0]
    if (cvFile) {
        // Crea un objeto FormData para enviar el archivo al servidor
        let formData = new FormData()
        formData.append('cv', cvFile)

        // token alumno
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append('Authorization', `Bearer ${token}`)

        let requestOptions = {
            method: 'POST',
            headers: miHeaders,
            body: formData
        }

        // Realiza la solicitud POST al servidor para subir el archivo
        fetch(`${API_BASE_URL}/curriculums`, requestOptions)
        .then(response => {
            if (!response.ok) {
                alert('Error al subir el CV. Compruebe que sea formato pdf y/o que no tenga uno subido actualmente.')
                throw new Error('Error en la solicitud: ' + response.status)
            }
            return response.json()
        })
        .then(result => {
            console.log(result)

            // Redirige al usuario a la página de visualización del currículum
            window.location.href = `gestion_cv.html`
        })
        .catch(error => console.log('Error al subir el CV', error))
    } else {
      alert('No se ha seleccionado ningún archivo')
    }
  })
}

// Función que buscará por usuario_id el curriculum del alumno
async function getCV() {
    let cv = document.getElementById('cv')
    let noCV = document.getElementById('no-cv')
    let embedElement = document.getElementById('embed-curriculum')

    try {
        // Obtener el token de autenticación almacenado
        let token = localStorage.getItem('token')
        let idUsuario = await obtenerIDUsuarioLogado()

        let miHeaders = new Headers()
        miHeaders.append('Authorization', `Bearer ${token}`)

        let requestOptions = {
            method: 'GET',
            headers: miHeaders,
            redirect: 'follow'
        }

        // Realizar la solicitud GET al servidor para obtener el currículum
        const response = await fetch(`${API_BASE_URL}/curriculums/${idUsuario}`, requestOptions)

        if (!response.ok) {
            // si no encuentra un curriculum
            noCV.textContent += `No tiene subido ningún CV`
            embedElement.remove()
            throw new Error('Error al obtener el currículum')
        }

        // Obtener la respuesta como un blob (archivo binario)
        let blob = await response.blob()

        // Crear una URL para el blob
        let url = URL.createObjectURL(blob)

        // Botón para eliminar curriculum
        cv.innerHTML += `<input type='button' onclick='deleteCV(${idUsuario})' value='Eliminar CV' class='btn btn-danger'>`
        embedElement.src = url

    } catch (error) {
        console.log('Error al obtener el currículum:', error)
    }
}

// Función para eliminar un cv
async function deleteCV(id) {
    let mensajeConfirmacion = confirm("¿Está seguro que desea eliminar su Curriculum Vitae?")
    if (mensajeConfirmacion) {
        let token = localStorage.getItem('token')

        let miHeaders = new Headers()
        miHeaders.append(`Authorization`, `Bearer ${token}`)
    
        let requestOptions = {
            method: 'DELETE',
            headers: miHeaders,
            redirect: 'follow'
        }
    
        fetch(`${API_BASE_URL}/curriculums/${id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                alert("CV borrado correctamente")
                window.location.href = `gestion_cv.html`
            })
            .catch(error => console.log('error', error))
    }
}