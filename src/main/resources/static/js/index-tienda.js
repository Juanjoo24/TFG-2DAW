document.addEventListener('DOMContentLoaded', function() {
    
    // Pillamos el carrito o lo creamos vacío
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const btnCesta = document.getElementById('btn-finalizar');
    const contador = document.getElementById('count-final');

    function revisarBoton() {
        if (carrito.length > 0) {
            btnCesta.style.display = 'block';
            contador.innerText = carrito.length;
        } else {
            btnCesta.style.display = 'none';
        }
    }

    revisarBoton();

    document.querySelectorAll('.btn-dark-card').forEach(boton => {
        boton.addEventListener('click', function() {
            
            // Buscamos los datos de la zapa
            const card = this.closest('.card');
            const nombre = card.querySelector('h6').innerText;
            const precioStr = card.querySelector('.price-tag').innerText;
            
            const precio = parseFloat(precioStr.replace('€', ''));

            carrito.push({
                nombre: nombre,
                precio: precio
            });

            localStorage.setItem('carrito', JSON.stringify(carrito));

            this.innerText = "AÑADIDO";
            this.style.background = "green";
            
            setTimeout(() => {
                this.innerText = "AÑADIR";
                this.style.background = ""; 
            }, 700);

            revisarBoton();
        });
    });
});