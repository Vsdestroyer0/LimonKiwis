// Función para encriptar contraseñas
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Función para verificar credenciales
async function verificarCredenciales(email, password) {
    try {
        const response = await fetch('usuarios.json');
        const data = await response.json();
        
        const usuario = data.usuarios.find(u => u.email === email);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Hashear la contraseña ingresada
        const hash = await hashPassword(password);
        
        // Verificar si el hash coincide
        if (usuario.password === hash) {
            // Actualizar último login
            usuario.ultimo_login = new Date().toISOString().split('T')[0];
            
            // Guardar cambios
            await guardarCambios(data);
            
            // Crear sesión
            crearSesion(usuario);
            
            // Redirigir al usuario
            window.location.href = 'index.html';
        } else {
            throw new Error('Contraseña incorrecta');
        }
    } catch (error) {
        alert(error.message);
        console.error('Error:', error);
    }
}

// Función para guardar cambios en el JSON
async function guardarCambios(data) {
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Aquí normalmente usaríamos una API para guardar los datos en el servidor
        // Para este ejemplo, solo mostramos el contenido
        console.log('Datos actualizados:', data);
        
        // Actualizar la fecha de la última actualización
        data.config.ultima_actualizacion = new Date().toISOString().split('T')[0];
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

// Función para crear sesión
function crearSesion(usuario) {
    // Aquí podrías guardar el token en localStorage o cookies
    // Para este ejemplo, solo mostramos el usuario
    console.log('Sesión iniciada para:', usuario.nombre);
}

// Función para cerrar sesión
function cerrarSesion() {
    // Aquí limpiarías el token de la sesión
    console.log('Sesión cerrada');
    window.location.href = 'login.html';
}

// Inicializar el formulario de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            await verificarCredenciales(email, password);
        });
    }
});
