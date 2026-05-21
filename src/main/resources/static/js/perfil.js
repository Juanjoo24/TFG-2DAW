document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("perfilForm");
    const nombre = document.getElementById("nombre-input");
    const apellido = document.getElementById("apellido-input");
    const email = document.getElementById("email-input");
    const password = document.getElementById("password-input");

    function validarSoloLetras(texto) {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto);
    }

    function validarEmailFormato(correo) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    }

    function validarPasswordRequisitos(pass) {
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

    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            // Validar campo Nombre
            if (!nombre || nombre.value.trim() === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Campo obligatorio',
                    text: 'El nombre no puede quedar vacío.',
                    confirmButtonColor: '#8B5A2B'
                });
                return;
            }
            if (!validarSoloLetras(nombre.value.trim())) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Nombre no válido',
                    text: 'El nombre solo debe contener caracteres alfabéticos.',
                    confirmButtonColor: '#8B5A2B'
                });
                return;
            }

            // Validar campo Apellido
            if (!apellido || apellido.value.trim() === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Campo obligatorio',
                    text: 'El apellido no puede quedar vacío.',
                    confirmButtonColor: '#8B5A2B'
                });
                return;
            }
            if (!validarSoloLetras(apellido.value.trim())) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Apellido no válido',
                    text: 'El apellido solo debe contener caracteres alfabéticos.',
                    confirmButtonColor: '#8B5A2B'
                });
                return;
            }

            // Validar campo Email
            if (!email || email.value.trim() === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Campo obligatorio',
                    text: 'El correo electrónico es requerido.',
                    confirmButtonColor: '#8B5A2B'
                });
                return;
            }
            if (!validarEmailFormato(email.value.trim())) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Formato inválido',
                    text: 'Por favor, introduce una estructura de email correcta (ejemplo@web.com).',
                    confirmButtonColor: '#8B5A2B'
                });
                return;
            }

            // Validar campo Contraseña
            if (password && password.value !== "") {
                if (!validarPasswordRequisitos(password.value)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Contraseña insegura',
                        text: 'La nueva contraseña debe tener mínimo 8 caracteres, incluyendo mayúsculas, minúsculas, un número y un carácter especial.',
                        confirmButtonColor: '#8B5A2B'
                    });
                    return;
                }
            }

            Swal.fire({
                title: 'Actualizando perfil',
                text: 'Guardando los nuevos cambios en la base de datos...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            form.submit();
        });
    }
});