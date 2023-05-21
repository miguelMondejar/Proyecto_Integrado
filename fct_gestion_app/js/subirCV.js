async function subirCV() {
    document.getElementById('cvForm').addEventListener('submit', async function(e) {
        e.preventDefault()

        // Obtiene el archivo seleccionado por el alumno
        let cvFile = document.getElementById('cvFile').files[0];
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
                        alert('Error al subir el CV')
                        throw new Error('Error en la solicitud: ' + response.status);
                    }
                    return response.json();
                })
                .then(result => {
                    // Aquí puedes manejar la respuesta del servidor y actualizar la interfaz de usuario si es necesario
                    console.log(result)
                    alert('CV subido correctamente')
                })
                .catch(error => console.log('Error al subir el CV', error))
        } else {
            // No se ha seleccionado ningún archivo, muestra un mensaje de error
            alert('No se ha seleccionado ningún archivo')
        }        
    })
}