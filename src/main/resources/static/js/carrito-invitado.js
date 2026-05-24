document.addEventListener('DOMContentLoaded', function() {
    const btnCesta = document.getElementById('btn-finalizar');
    const contador = document.getElementById('count-final');

    function actualizarBotonFlotante() {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (carrito.length > 0) {
            if (btnCesta) {
                btnCesta.style.display = 'block';
                contador.innerText = carrito.length;
            }
        } else {
            if (btnCesta) btnCesta.style.display = 'none';
        }
    }

    actualizarBotonFlotante();

    document.querySelectorAll('.btn-dark-card').forEach(boton => {
        boton.addEventListener('click', function() {
            const card = this.closest('.card');
            const nombre = card.querySelector('h6').innerText;
            const precio = parseFloat(card.querySelector('.price-tag').innerText.replace('€', ''));

            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            carrito.push({ nombre, precio });
            localStorage.setItem('carrito', JSON.stringify(carrito));

            this.innerText = "AÑADIDO";
            this.style.background = "green";
            setTimeout(() => {
                this.innerText = "AÑADIR";
                this.style.background = ""; 
            }, 700);

            actualizarBotonFlotante();
        });
    });
});