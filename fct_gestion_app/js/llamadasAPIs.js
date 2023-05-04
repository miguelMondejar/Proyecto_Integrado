const API_BASE_URL = "http://127.0.0.1:8000/api";

async function getUsuarios() {
    let div = document.getElementById('usuarios')
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`);
        const responseData = await response.json();
        
        // imprimimos todos los usuarios que estén en tendencia
        responseData.forEach(usuario => {
            div.innerHTML += "<p>" + usuario.id + " | "+ usuario.nombre + "</p>"
        });
        
    } catch (error) {
        console.log(`Something went wrong: ${error}`);
    }
}

async function getEmpresas() {
    let div = document.getElementById('empresas')
    try {
        const response = await fetch(`${API_BASE_URL}/empresas`);
        const responseData = await response.json();
        
        // imprimimos todos los usuarios que estén en tendencia
        responseData.forEach(usuario => {
            div.innerHTML += "<p>" + usuario.id + " | "+ usuario.nombre + "</p>"
        });
        
    } catch (error) {
        console.log(`Something went wrong: ${error}`);
    }
}