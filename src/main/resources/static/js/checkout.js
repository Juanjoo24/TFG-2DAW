document.addEventListener("DOMContentLoaded", function() {
    const tabla = document.getElementById('lista-carrito');
    const totalTexto = document.getElementById('total');
    const formulario = document.getElementById('form-registro');
    const direccion = document.getElementById("direccion-input");
    const tarjeta = document.getElementById("tarjeta-input");
    const fechaExp = document.getElementById("fecha-input");
    const cvc = document.getElementById("cvc-input");
    const email = document.getElementById("email-input");

    function renderizarCarrito() {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        tabla.innerHTML = "";
        let suma = 0;

        carrito.forEach((item, index) => {
            suma += item.precio;
            let fila = document.createElement('tr');
            fila.innerHTML = `<td>${item.nombre}</td>
                              <td class="text-end">${item.precio.toFixed(2)}€</td>
                              <td class="text-end"><button class="btn-delete" onclick="eliminarItem(${index})"><i class="bi bi-trash"></i></button></td>`;
            tabla.appendChild(fila);
        });
        totalTexto.innerText = suma.toFixed(2) + "€";
    }

    window.eliminarItem = function(index) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    };

    formulario.onsubmit = function(e) {
        e.preventDefault();
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        if (carrito.length === 0) {
            Swal.fire({ icon: 'warning', title: 'Cesta vacía', text: 'No tienes zapatillas para comprar', confirmButtonColor: '#8B5A2B' });
            return;
        }

        if (direccion.value.trim().length < 8) {
            Swal.fire({ icon: 'error', title: 'Dirección inválida', text: 'Escribe una dirección completa', confirmButtonColor: '#8B5A2B' });
            return;
        }

        if (!/^\d{16}$/.test(tarjeta.value.replace(/\s/g, ''))) {
            Swal.fire({ icon: 'error', title: 'Tarjeta inválida', text: 'Debe tener 16 dígitos', confirmButtonColor: '#8B5A2B' });
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaExp.value)) {
            Swal.fire({ icon: 'error', title: 'Fecha inválida', text: 'Usa formato MM/AA', confirmButtonColor: '#8B5A2B' });
            return;
        }

        if (!/^\d{3,4}$/.test(cvc.value)) {
            Swal.fire({ icon: 'error', title: 'CVC inválido', text: 'Debe tener 3 o 4 dígitos', confirmButtonColor: '#8B5A2B' });
            return;
        }

        Swal.fire({ title: 'Procesando pago...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        fetch('/api/pedidos/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailCliente: email.value,
                direccionEntrega: direccion.value,
                total: parseFloat(totalTexto.innerText),
                articulos: carrito
            })
        }).then(res => {
            if (res.ok) {
                localStorage.removeItem('carrito');
                Swal.fire({ icon: 'success', title: '¡Compra realizada!', text: 'Gracias por confiar en ZapaJuan', confirmButtonColor: '#8B5A2B' })
                    .then(() => window.location.href = "/bienvenida");
            } else {
                Swal.fire({ icon: 'error', title: 'Error en el servidor', text: 'Inténtalo de nuevo más tarde', confirmButtonColor: '#8B5A2B' });
            }
        }).catch(() => {
            Swal.fire({ icon: 'error', title: 'Error de conexión', confirmButtonColor: '#8B5A2B' });
        });
    };

    renderizarCarrito();
});
