/**
 * Anacoluthe - Lightbox pour affiches
 * Utilise GLightbox pour le zoom interactif
 */

document.addEventListener('DOMContentLoaded', () => {
    // Délégation d'événements pour les images chargées dynamiquement
    document.addEventListener('click', (e) => {
        const img = e.target.closest('.modal-affiche-preview img');
        if (img) {
            e.preventDefault();
            e.stopPropagation();

            // Créer une galerie temporaire avec toutes les images de la prévisualisation
            const container = img.closest('.modal-affiche-preview');
            const images = container.querySelectorAll('img');
            const clickedIndex = Array.from(images).indexOf(img);

            const elements = Array.from(images).map(image => ({
                href: image.src,
                type: 'image'
            }));

            const lightbox = GLightbox({
                elements: elements,
                startAt: clickedIndex,
                openEffect: 'zoom',
                closeEffect: 'zoom',
                zoomable: true,
                draggable: true,
                dragToleranceX: 40,
                dragToleranceY: 65
            });

            lightbox.open();
        }
    });
});
