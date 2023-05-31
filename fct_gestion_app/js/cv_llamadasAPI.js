// Función encargada de subir el curriculum al servidor y registrarlo
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
            miHeaders.append(`Authorization`, `Bearer ${token}`)

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
    try {
        let idUsuario = await obtenerIDUsuarioLogado()
        const response = await fetch(`${API_BASE_URL}/curriculums/${idUsuario}`)
        const responseData = await response.json()
        
        // si no tiene cv subido, saldrá un enlace para ello
        if(cv.value == undefined) {
            cv.innerHTML = `<a href="http://127.0.0.1:3000/fct_gestion_app/inicio_alumno.html">Suba su CV</a>`
        }
        responseData.data.forEach(curriculum => {
            let ruta = curriculum.ruta

            // para que solo salga 'nombre'.pdf
            let nombreArchivo = ruta.substring(ruta.lastIndexOf('/') + 1)
            
            cv.innerHTML = `<a href="">${nombreArchivo}</a> <input type='button' onclick='deleteCV(${curriculum.id})' value='❌' class='botonBorrar'>`
        })
    } catch (error) {
        console.log(mensajeErrorGenerico + error)
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
                window.location.href = "http://127.0.0.1:3000/fct_gestion_app/perfil_usuario.html"
            })
            .catch(error => console.log('error', error))
    }
}