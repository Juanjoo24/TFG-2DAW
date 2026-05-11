document.addEventListener('DOMContentLoaded', function() {
    
    const buscador = document.querySelector('.search-input');
    // Cogemos todos los divs que envuelven las tarjetas de zapatillas
    const zapatillas = document.querySelectorAll('.producto-item'); 

    if (buscador) {
        buscador.addEventListener('input', function(e) {
            const texto = e.target.value.toLowerCase();

            zapatillas.forEach(function(zapa) {
                // Sacamos el nombre y la marca de la tarjeta
                const marca = zapa.querySelector('p').innerText.toLowerCase();
                const nombre = zapa.querySelector('h6').innerText.toLowerCase();

                // Si el texto coincide con algo, se muestra, si no se oculta
                if (marca.includes(texto) || nombre.includes(texto)) {
                    zapa.style.display = 'block';
                } else {
                    zapa.style.display = 'none';
                }
            });
        });
    }
});