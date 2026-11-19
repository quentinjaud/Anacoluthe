/**
 * Soutenance - Lightbox : un clic sur une image de la soutenance l'agrandit.
 * Utilise GLightbox (déjà embarqué pour les affiches de anacoluthe.html).
 *
 * - Toutes les images des écrans sont zoomables, sauf celles marquées data-no-zoom.
 * - Une galerie par écran : les flèches passent d'une image à l'autre du même écran.
 * - Pendant que la lightbox est ouverte, la navigation de la soutenance est suspendue
 *   (garde-fou dans le script de navigation de soutenance.html).
 */
(function () {
  if (typeof GLightbox !== 'function') return;

  var SELECTEUR = '.ecran img:not([data-no-zoom])';
  var lightbox = null;

  document.addEventListener('click', function (e) {
    var img = e.target.closest(SELECTEUR);
    if (!img) return;
    e.preventDefault();

    var ecran = img.closest('.ecran');
    var images = Array.prototype.slice.call(ecran.querySelectorAll(SELECTEUR));

    if (lightbox) lightbox.destroy();
    lightbox = GLightbox({
      elements: images.map(function (image) {
        return { href: image.currentSrc || image.src, type: 'image' };
      }),
      startAt: images.indexOf(img),
      openEffect: 'zoom',
      closeEffect: 'zoom',
      zoomable: true,
      draggable: true,
      loop: false
    });
    lightbox.open();
  });
})();
