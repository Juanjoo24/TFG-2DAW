document.addEventListener("DOMContentLoaded", function() {
    const tabla = document.getElementById('lista-carrito');
    const totalTexto = document.getElementById('total');
    const formulario = document.getElementById('form-registro');
    const direccion = document.getElementById("direccion-input");
    const tarjeta = document.getElementById("tarjeta-input");
    const fechaExp = document.getElementById("fecha-input");
    const cvc = document.getElementById("cvc-input");

    // Sacamos lo que hay guardado en el navegador
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // --- FUNCIONES DE VALIDACIÓN ---
    function validarTarjeta(numero) {
        const limpio = numero.replace(/\s+/g, '').replace(/-/g, '');
        return /^\d{16}$/.test(limpio);
    }

    function validarFecha(fecha) {
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha);
    }

    function validarCVC(codigo) {
        return /^\d{3,4}$/.test(codigo);
    }

    // --- MOSTRAR EL CARRITO EN LA TABLA ---
    function dibujarTabla() {
        if (!tabla) return; 
        
        tabla.innerHTML = "";
        let suma = 0;

        if (carrito.length === 0) {
            tabla.innerHTML = '<tr><td colspan="3" class="text-center">La cesta está vacía</td></tr>';
            if(totalTexto) totalTexto.innerText = "0.00€";
            return;
        }

        for (let i = 0; i < carrito.length; i++) {
            let item = carrito[i];
            suma += item.precio;
            
            let fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${item.nombre}</td>
                <td class="text-end">${item.precio.toFixed(2)}€</td>
                <td class="text-end">
                    <button class="borrar-item" data-id="${i}" style="color:red; border:none; background:none; cursor:pointer;">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        }

        if(totalTexto) totalTexto.innerText = suma.toFixed(2) + "€";
        
        let botonesBorrar = document.querySelectorAll('.borrar-item');
        botonesBorrar.forEach(function(boton) {
            boton.onclick = function() {
                let indice = this.getAttribute('data-id');
                carrito.splice(indice, 1); 
                localStorage.setItem('carrito', JSON.stringify(carrito)); 
                dibujarTabla(); 
            };
        });
    }

    if (formulario) {
        formulario.onsubmit = function(e) {
            e.preventDefault(); // Frenamos por completo el envío del formulario 
            
            //  Validar que la cesta no esté vacía
            if (carrito.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Cesta vacía',
                    text: 'No tienes ningún artículo en tu cesta para comprar.',
                    confirmButtonColor: '#8B5A2B'
                });
                return; 
            }

            // Validar Dirección de Entrega
            if (!direccion || direccion.value.trim() === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Campo obligatorio',
                    text: 'Por favor, introduce la dirección de entrega de tus zapatillas.',
                    confirmButtonColor: '#8B5A2B'
                });
                return; 
            }
            if (direccion.value.trim().length < 8) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Dirección incompleta',
                    text: 'Por favor, introduce una dirección de entrega más detallada.',
                    confirmButtonColor: '#8B5A2B'
                });
                return; 
            }

            //  Validar Número de Tarjeta
            if (!tarjeta || tarjeta.value.trim() === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Datos bancarios',
                    text: 'El número de tarjeta es obligatorio.',
                    confirmButtonColor: '#8B5A2B'
                });
                return; 
            }
            if (!validarTarjeta(tarjeta.value.trim())) {
                Swal.fire({
                    icon: 'error',
                    title: 'Tarjeta no válida',
                    text: 'El número de tarjeta debe contener exactamente 16 números.',
                    confirmButtonColor: '#8B5A2B'
                });
                return; 
            }

            // Validar Fecha de Expiración 
            if (!fechaExp || fechaExp.value.trim() === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Datos bancarios',
                    text: 'La fecha de expiración de la tarjeta es obligatoria.',
                    confirmButtonColor: '#8B5A2B'
                });
                return; 
            }
            if (!validarFecha(fechaExp.value.trim())) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fecha incorrecta',
                    text: 'La fecha debe tener el formato MM/AA (Por ejemplo: 05/28).',
                    confirmButtonColor: '#8B5A2B'
                });
                return; 
            }

            //  Validar Código CVC
            if (!cvc || cvc.value.trim() === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Datos bancarios',
                    text: 'El código de seguridad CVC es obligatorio.',
                    confirmButtonColor: '#8B5A2B'
                });
                return; 
            }
            if (!validarCVC(cvc.value.trim())) {
                Swal.fire({
                    icon: 'error',
                    title: 'CVC incorrecto',
                    text: 'El código CVC debe contener 3 o 4 dígitos numéricos.',
                    confirmButtonColor: '#8B5A2B'
                });
                return; 
            }

            Swal.fire({
                title: 'Procesando pago',
                text: 'Estamos validando tu tarjeta, espera un momento...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            let pedido = {
                emailCliente: document.getElementById('email-input').value,
                direccionEntrega: direccion.value,
                total: parseFloat(totalTexto.innerText),
                articulos: carrito
            };

            fetch('/api/pedidos/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            })
            .then(function(res) {
                if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Compra completada!',
                        text: 'Tu pago ha sido procesado con éxito en ZapaJuan.',
                        confirmButtonColor: '#8B5A2B'
                    }).then(() => {
                        localStorage.removeItem('carrito'); 
                        window.location.href = "/bienvenida";
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en el pago',
                        text: 'No se pudo registrar tu pedido en la base de datos.',
                        confirmButtonColor: '#8B5A2B'
                    });
                }
            })
            .catch(function(err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No pudimos conectar con el servidor de la tienda.',
                    confirmButtonColor: '#8B5A2B'
                });
            });
        };
    }

    dibujarTabla();
});