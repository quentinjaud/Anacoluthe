/**
 * Anacoluthe - External Links Handler
 * Ouvre automatiquement les liens externes dans un nouvel onglet
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les liens
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        
        // Vérifier si c'est un lien externe (commence par http et ne pointe pas vers le même domaine)
        if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});
