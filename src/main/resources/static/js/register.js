document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const email = document.getElementById("email");
    const usuario = document.getElementById("usuario");
    const contrasena = document.getElementById("contrasena");
    const passMensaje = document.getElementById("passMensaje");

    // Funciones de validación 
    function validarPassword(pass) {
        const mayuscula = /[A-Z]/;
        const minuscula = /[a-z]/;
        const numero = /[0-9]/;
        const especial = /[!@#$%^&*(),.?":{}|<>]/;
        if (pass.length < 8) return false;
        if (!mayuscula.test(pass)) return false;
        if (!minuscula.test(pass)) return false;
        if (!numero.test(pass)) return false;
        if (!especial.test(pass)) return false;
        return true;
    }

    function validarSoloLetras(texto) {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto);
    }

    function validarEmailFormato(correo) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    }

    // validación  en tiempo real para la contraseña 
    contrasena.addEventListener("input", () => {
        const pass = contrasena.value;
        if (pass === "") {
            passMensaje.textContent = "";
        } else if (validarPassword(pass)) {
            passMensaje.textContent = "Contraseña fuerte";
            passMensaje.style.color = "#198754";
        } else {
            passMensaje.textContent = "Requisitos: Mayúscula, minúscula, número, especial y 8+ caracteres";
            passMensaje.style.color = "#dc3545";
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault(); 

        // Validar Nombre
        if (nombre.value.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Campo obligatorio',
                text: 'El nombre es obligatorio',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }
        if (!validarSoloLetras(nombre.value.trim())) {
            Swal.fire({
                icon: 'warning',
                title: 'Nombre no válido',
                text: 'Nombre no válido (solo se permiten letras)',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }

        // Validar Apellido
        if (apellido.value.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Campo obligatorio',
                text: 'El apellido es obligatorio',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }
        if (!validarSoloLetras(apellido.value.trim())) {
            Swal.fire({
                icon: 'warning',
                title: 'Apellido no válido',
                text: 'Apellido no válido (solo se permiten letras)',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }

        // Validar Email
        if (email.value.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Campo obligatorio',
                text: 'El correo electrónico es obligatorio',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }
        if (!validarEmailFormato(email.value.trim())) {
            Swal.fire({
                icon: 'warning',
                title: 'Formato inválido',
                text: 'Introduce un formato de email válido (ejemplo@web.com)',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }

        // Validar Nombre de Usuario
        if (usuario.value.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Campo obligatorio',
                text: 'El nombre de usuario es obligatorio',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }
        if (usuario.value.trim().length < 4) {
            Swal.fire({
                icon: 'warning',
                title: 'Usuario corto',
                text: 'El nombre de usuario debe incluir un mínimo de 4 caracteres',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }

        // Validar Contraseña
        if (contrasena.value === "") {
            Swal.fire({
                icon: 'error',
                title: 'Campo obligatorio',
                text: 'La contraseña es obligatoria',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }
        if (!validarPassword(contrasena.value)) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña insegura',
                text: 'La contraseña elegida no cumple con los requisitos mínimos de seguridad',
                confirmButtonColor: '#1a1a1a'
            });
            return;
        }

        Swal.fire({
            title: 'Procesando registro',
            text: 'Guardando tu nueva cuenta...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        form.submit();
    });
});