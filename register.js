// Validar contraseña
function validarContrasena(password) {
    // Debe tener al menos 8 caracteres
    if (password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres';
    }
    // Debe tener al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
        return 'La contraseña debe tener al menos una letra mayúscula';
    }
    // Debe tener al menos un número
    if (!/[0-9]/.test(password)) {
        return 'La contraseña debe tener al menos un número';
    }
    return null;
}

// Validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Verificar si el email ya existe
async function emailExiste(email) {
    try {
        const response = await fetch('usuarios.json');
        const data = await response.json();
        return data.usuarios.some(u => u.email === email);
    } catch (error) {
        console.error('Error al verificar email:', error);
        return false;
    }
}

// Registrar nuevo usuario
async function registrarUsuario(nombre, email, password) {
    try {
        const response = await fetch('usuarios.json');
        const data = await response.json();
        
        // Generar nuevo ID
        const nuevoId = data.config.siguiente_id;
        
        // Crear nuevo usuario
        const nuevoUsuario = {
            id: nuevoId,
            email: email,
            password: await hashPassword(password),
            nombre: nombre,
            fecha_registro: new Date().toISOString().split('T')[0],
            ultimo_login: new Date().toISOString().split('T')[0],
            rol: 'usuario'
        };
        
        // Actualizar datos
        data.usuarios.push(nuevoUsuario);
        data.config.siguiente_id++;
        data.config.ultima_actualizacion = new Date().toISOString().split('T')[0];
        
        // Guardar cambios
        await guardarCambios(data);
        
        // Redirigir al login
        alert('¡Registro exitoso! Por favor, inicia sesión.');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario. Por favor, intenta de nuevo.');
    }
}

// Manejar envío del formulario
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validaciones
            if (!nombre) {
                alert('Por favor, ingresa tu nombre completo.');
                return;
            }
            
            if (!validarEmail(email)) {
                alert('Por favor, ingresa un email válido.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            
            const passwordError = validarContrasena(password);
            if (passwordError) {
                alert(passwordError);
                return;
            }
            
            // Verificar si el email ya existe
            if (await emailExiste(email)) {
                alert('Este email ya está registrado.');
                return;
            }
            
            // Registrar usuario
            await registrarUsuario(nombre, email, password);
        });
    }
});
