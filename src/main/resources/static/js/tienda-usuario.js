document.addEventListener('DOMContentLoaded', function() {
    const btnCesta = document.getElementById('btn-finalizar');
    const contador = document.getElementById('count-final');

    document.querySelectorAll('.btn-dark-card').forEach(boton => {
        boton.addEventListener('click', function() {
            const card = this.closest('.card');
            const nombre = card.querySelector('h6').innerText;
            const precio = parseFloat(card.querySelector('.price-tag').innerText.replace('€', ''));

            fetch('/api/carrito/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, precio }),
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    contador.innerText = data.carritoSize;
                    btnCesta.style.display = 'block';
                }
            });

            this.innerText = "AÑADIDO";
            setTimeout(() => { this.innerText = "AÑADIR AL CARRITO"; }, 700);
        });
    });
});