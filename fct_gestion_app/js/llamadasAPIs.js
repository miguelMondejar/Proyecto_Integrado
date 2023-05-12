const API_BASE_URL = "http://127.0.0.1:8000/api"

const nombre = document.getElementById('nombre').value
const apellidos = document.getElementById('apellidos').value
const fecha_nacimiento = document.getElementById('fecha_nacimiento').value
const dni = document.getElementById('dni').value
const email = document.getElementById('email').value
const telefono = document.getElementById('telefono').value
const password1 = document.getElementById('password1').value
const password2 = document.getElementById('password2').value

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
                    <td><input type='submit' onclick='deleteUsuario(${usuario.id})' value='❌'></td>`
                tabla.appendChild(fila)
            }
        })

        div.appendChild(tabla)
    } catch (error) {
        console.log(`Something went wrong: ${error}`)
    }
}

async function registerUsuario() {
    const form = document.getElementById('formularioRegister')
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault() // prevenir que el formulario se envíe por defecto

        // cogemos el token del profesor
        let token = localStorage.getItem('token')

        // si los datos son correctos
        if(validarRegistro() == true) {
            let miHeaders = new Headers()
            miHeaders.append(`Authorization`, `Bearer ${token}`)
        
            // hacemos el registro
            let datos = JSON.stringify({
                "nombre": nombre,
                "apellidos": apellidos,
                "fecha_nacimiento": fecha_nacimiento,
                "dni": dni,
                "email": email,
                "telefono": telefono,
                "password": password2,
                "rol_id": 2
            });
        
            let requestRegistro = {
                method: 'POST',
                headers: miHeaders,
                body: datos,
                redirect: 'follow'
            };
        
            fetch(`${API_BASE_URL}/register`, requestRegistro)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error))
        }
    })
}

function validarRegistro() {
    if (nombre == "" || apellidos == "" || fecha_nacimiento == "" || dni == "" || 
    email == "" || telefono == "" || password1 == "" || password2 == "") {
        alert('Todos los campos son obligatorios');
        return false;
    }

    // Verificar si las contraseñas coinciden
    if (password1 !== password2) {
        alert("Las contraseñas no coinciden");
        return false;
    }

    // Si todo está correcto, enviar el formulario
    return true;
}
  
async function deleteUsuario(id) {
    mensajeConfirmacion("usuario")
    let token = localStorage.getItem('token')

    let miHeaders = new Headers()
    miHeaders.append(`Authorization`, `Bearer ${token}`)

    let requestOptions = {
        method: 'DELETE',
        headers: miHeaders,
        redirect: 'follow'
    };

    fetch(`${API_BASE_URL}/usuarios/${id}`, requestOptions)
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