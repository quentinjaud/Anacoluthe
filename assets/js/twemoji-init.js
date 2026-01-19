/**
 * Twemoji Lazy Loader
 * Charge Twemoji après le rendu de la page (non-bloquant)
 * Fallback gracieux : si offline/erreur, les emojis natifs restent visibles
 */
(function() {
    window.addEventListener('load', function() {
        // Délai supplémentaire pour ne pas impacter le First Contentful Paint
        setTimeout(function() {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js';
            script.onload = function() {
                twemoji.parse(document.body, { folder: 'svg', ext: '.svg' });
            };
            // Silencieux en cas d'erreur (offline, CDN down) - emojis natifs restent
            script.onerror = function() {};
            document.head.appendChild(script);
        }, 100);
    });
})();
