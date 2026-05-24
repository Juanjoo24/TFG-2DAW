document.addEventListener("DOMContentLoaded", function() {
    const tabla = document.getElementById('lista-carrito');
    const totalTexto = document.getElementById('total');
    const formulario = document.getElementById('form-registro');
    const direccion = document.getElementById("direccion-input");
    const tarjeta = document.getElementById("tarjeta-input");
    const fechaExp = document.getElementById("fecha-input");
    const cvc = document.getElementById("cvc-input");

    let itemsCarritoActual = [];

    // --- VALIDACIONES ---
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

    function cargarCarritoDesdeBD() {
        fetch('/api/carrito', { credentials: 'include' })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(items => {
                itemsCarritoActual = items;
                dibujarTabla(items);
            })
            .catch(() => {
                if (tabla) tabla.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error al cargar la cesta</td></tr>';
            });
    }

    function dibujarTabla(items) {
        if (!tabla) return;
        tabla.innerHTML = "";
        let suma = 0;

        if (!items || items.length === 0) {
            tabla.innerHTML = '<tr><td colspan="3" class="text-center">La cesta está vacía</td></tr>';
            if(totalTexto) totalTexto.innerText = "0.00€";
            return;
        }

        items.forEach(item => {
            suma += item.precio;
            let fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${item.nombre}</td>
                <td class="text-end">${item.precio.toFixed(2)}€</td>
                <td class="text-end">
                    <button class="borrar-item" data-id="${item.id}" style="color:red; border:none; background:none; cursor:pointer;">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>`;
            tabla.appendChild(fila);
        });

        if(totalTexto) totalTexto.innerText = suma.toFixed(2) + "€";
        
        // --- EVENTO DE BORRADO ---
        document.querySelectorAll('.borrar-item').forEach(boton => {
            boton.onclick = function() {
                const id = this.getAttribute('data-id');
                fetch(`/api/carrito/${id}`, { 
                    method: 'DELETE', 
                    credentials: 'include' 
                })
                .then(res => res.json())
                .then(data => { 
                    if(data.success) {
                        cargarCarritoDesdeBD(); 
                    }
                });
            };
        });
    }

    // --- ENVÍO DE FORMULARIO ---
    if (formulario) {
        formulario.onsubmit = function(e) {
            e.preventDefault();
            
            if (itemsCarritoActual.length === 0) {
                Swal.fire({ icon: 'warning', title: 'Cesta vacía', confirmButtonColor: '#8B5A2B' });
                return;
            }
            if (!direccion || direccion.value.trim().length < 8) {
                Swal.fire({ icon: 'error', title: 'Dirección inválida', text: 'Escribe una dirección completa', confirmButtonColor: '#8B5A2B' });
                return;
            }
            if (!tarjeta || !validarTarjeta(tarjeta.value)) {
                Swal.fire({ icon: 'error', title: 'Tarjeta inválida', text: 'Debe tener 16 dígitos', confirmButtonColor: '#8B5A2B' });
                return;
            }
            if (!fechaExp || !validarFecha(fechaExp.value)) {
                Swal.fire({ icon: 'error', title: 'Fecha inválida', text: 'Usa formato MM/AA', confirmButtonColor: '#8B5A2B' });
                return;
            }
            if (!cvc || !validarCVC(cvc.value)) {
                Swal.fire({ icon: 'error', title: 'CVC inválido', text: 'Debe tener 3 o 4 dígitos', confirmButtonColor: '#8B5A2B' });
                return;
            }

            Swal.fire({ title: 'Procesando pago...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            fetch('/api/pedidos/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailCliente: document.getElementById('email-input')?.value || '',
                    direccionEntrega: direccion.value,
                    total: parseFloat(totalTexto.innerText),
                    articulos: itemsCarritoActual
                }),
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    fetch('/api/carrito/vaciar', { method: 'DELETE', credentials: 'include' })
                        .then(() => {
                            Swal.fire({ icon: 'success', title: '¡Compra completada!', confirmButtonColor: '#8B5A2B' })
                                .then(() => window.location.href = "/bienvenida");
                        });
                } else {
                    Swal.fire({ icon: 'error', title: 'Error en el pago', confirmButtonColor: '#8B5A2B' });
                }
            });
        };
    }

    cargarCarritoDesdeBD();
});