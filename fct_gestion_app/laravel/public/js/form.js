function loginUsuario() {
    const form = document.getElementById('login-formulario')
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault() // prevenir que el formulario se envíe por defecto

        // datos del login
        const email = document.getElementById('correo').value
        const password = document.getElementById('pass').value

        // lo pasamos en formato JSON
        let datos = JSON.stringify({
            "email": email,
            "password": password
        });

        // encabezados para el request
        let header = new Headers();
        header.append("Content-Type", "application/json");

        // preparamos el request
        let requestOptions = {
            method: 'POST',
            headers: header,
            body: datos,
            redirect: 'follow'
        };

        // hacemos el fetch y guardamos el token
        fetch(`${API_BASE_URL}/login`, requestOptions)
            .then(response => {
                // Verifica si la respuesta del servidor es 200 OK
                if (!response.ok) {
                    document.getElementById('error-inicio-sesion').innerHTML = "Email/Contraseña no correcto. Inténtelo de nuevo."
                    throw new Error('Error al iniciar sesión')
                }
                // Extrae el token del cuerpo de respuesta de la solicitud
                return response.json()
            })
            .then(data => {
                // Almacenar el token en una variable
                let token = data.token
                // Configurar los encabezados para la solicitud user POST
                let headers = new Headers()
                headers.append('Authorization', `Bearer ${token}`)
                headers.append('Content-Type', 'application/json')

                // Configurar la solicitud user POST
                let userRequestOptions = {
                    method: 'POST',
                    headers: headers,
                    redirect: 'follow'
                }

                // Hacer la solicitud user POST
                fetch(`${API_BASE_URL}/user`, userRequestOptions)
                    .then(response => {
                        // Verifica si la respuesta del servidor es 200 OK
                        if (!response.ok) {
                            throw new Error('Error al obtener usuario')
                        }
                        // Extrae los datos del usuario del cuerpo de respuesta de la solicitud
                        return response.json()
                    })
                    .then(result => {
                        // dependiendo del rol del usuario irá a una página u otra
                        if (result.usuario.rol_id == 1) {
                            // guardamos token en localStorage
                            localStorage.setItem('token', token)
                            // enviamos a inicio de la página profesor
                            window.location.href = "http://127.0.0.1:8000/profesor";
                        } else if (result.usuario.rol_id == 2) {
                            // guardamos token en localStorage
                            localStorage.setItem('token', token)
                            // enviamos a inicio de la página profesor
                            window.location.href = "http://127.0.0.1:8000/alumno";
                        } else {
                            console.log('Rol no válido');
                        }
                    })
                    .catch(error => console.log('Error al obtener usuario', error))
            })
            .catch(error => console.log('Error al iniciar sesión', error))
    })
}