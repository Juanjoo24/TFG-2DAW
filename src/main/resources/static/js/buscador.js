document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS ---
    const searchInput = document.querySelector('.search-input');
    // Seleccionamos las columnas (divs) que contienen las tarjetas
    const productCards = document.querySelectorAll('.row.g-4 > div'); 
    const btnAddCart = document.querySelectorAll('.btn-add-cart');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const countFinal = document.getElementById('count-final');
    
    let carritoCount = 0;

    // --- LÓGICA DEL BUSCADOR (FILTRADO) ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();

            productCards.forEach(card => {
                // Extraemos el texto de los campos que queremos filtrar
                const marca = card.querySelector('.text-uppercase')?.textContent.toLowerCase() || "";
                const nombre = card.querySelector('h6')?.textContent.toLowerCase() || "";
                const modelo = card.querySelector('.text-secondary')?.textContent.toLowerCase() || "";

                // Si el término está en alguno de los campos, se queda; si no, se oculta
                if (marca.includes(term) || nombre.includes(term) || modelo.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- LÓGICA DE INTERACCIÓN (CARRITO) ---
    btnAddCart.forEach(btn => {
        btn.addEventListener('click', () => {
            carritoCount++;
            
            // Actualizamos el contador del botón de compra
            if (countFinal) countFinal.textContent = carritoCount;
            if (btnFinalizar) btnFinalizar.style.display = 'block';

            // Feedback visual: El botón se pone verde un segundo
            const originalText = btn.textContent;
            btn.textContent = '¡LISTO!';
            btn.style.backgroundColor = '#28a745'; // Color verde
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = ''; // Vuelve al color del CSS (negro)
            }, 800);
        });
    });
});