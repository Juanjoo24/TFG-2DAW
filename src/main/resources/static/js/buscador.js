document.addEventListener('DOMContentLoaded', () => {

    const buscador = document.querySelector('.search-input');
    const zapatillas = document.querySelectorAll('.producto-item');

    buscador.addEventListener('input', (e) => {

        const texto = e.target.value.toLowerCase();

        zapatillas.forEach((zapa) => {

            const marca = zapa.querySelector('p').innerText.toLowerCase();
            const nombre = zapa.querySelector('h6').innerText.toLowerCase();

            if (marca.includes(texto) || nombre.includes(texto)) {
                zapa.style.display = '';
            } else {
                zapa.style.display = 'none';
            }
        });
    });
});