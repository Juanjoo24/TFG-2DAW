document.addEventListener("DOMContentLoaded", function() {
    const tabla = document.getElementById('lista-carrito');
    const totalTexto = document.getElementById('total');
    const formulario = document.getElementById('form-registro');

    // Sacamos lo que hay guardado en el navegador
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    //  mostramos el carrito en la tabla
    function dibujarTabla() {
        if (!tabla) return; 
        
        tabla.innerHTML = "";
        let suma = 0;

        if (carrito.length === 0) {
            tabla.innerHTML = '<tr><td colspan="3" class="text-center">La cesta está vacía</td></tr>';
            if(totalTexto) totalTexto.innerText = "0.00€";
            return;
        }

        // Recorremos el carrito para crear las filas
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
        
        // Ponemos el evento a los botones de borrar
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
            e.preventDefault();
            
            if (carrito.length === 0) {
                alert("No hay nada en la cesta");
                return;
            }

            // Preparamos los datos para enviar al servidor
            let pedido = {
                emailCliente: document.getElementById('email-input').value,
                direccionEntrega: document.getElementById('direccion-input').value,
                total: parseFloat(totalTexto.innerText),
                articulos: carrito
            };

            // Enviamos al backend
            fetch('/api/pedidos/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            })
            .then(function(res) {
                if (res.ok) {
                    alert("¡Gracias por tu compra!");
                    localStorage.removeItem('carrito'); 
                    window.location.href = "/bienvenida";
                } else {
                    alert("Error al guardar el pedido");
                }
            })
            .catch(function(err) {
                alert("Error de conexión con el servidor");
            });
        };
    }

    dibujarTabla();
});