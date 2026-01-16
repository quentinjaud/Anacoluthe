/**
 * Anacoluthe - Print Render
 * Page minimaliste pour Puppeteer (génération PDF)
 * 
 * Params URL:
 *   ?card=R1     ID de la carte
 *   &face=recto  recto ou verso
 * 
 * Dépendances : marked.js, twemoji, markdown-utils.js
 */

/**
 * Initialisation : charge et rend la carte
 */
async function init() {
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('card');
    const face = params.get('face') || 'recto';
    
    const cardEl = document.getElementById('card');
    const contentEl = document.getElementById('content');
    
    if (!cardId) {
        contentEl.innerHTML = '<p class="error">Paramètre card manquant</p>';
        document.body.classList.add('card-error');
        return;
    }
    
    try {
        // 1. Charger l'index
        const indexResponse = await fetch('assets/data/cards-index.json');
        if (!indexResponse.ok) throw new Error('Index non trouvé');
        const index = await indexResponse.json();
        
        // 2. Trouver la carte
        const allItems = [...index.cards, ...(index.affiches || [])];
        const card = allItems.find(c => c.id === cardId);
        if (!card) throw new Error(`Carte ${cardId} non trouvée`);
        
        // 3. Appliquer le type
        cardEl.className = 'print-card-face type-' + card.type;
        
        // 4. Charger le markdown
        if (!card.path) throw new Error('Pas de path pour cette carte');
        
        const mdResponse = await fetch(card.path);
        if (!mdResponse.ok) throw new Error(`Markdown non trouvé: ${card.path}`);
        let markdown = await mdResponse.text();
        
        // 5. Extraire recto ou verso (via module partagé)
        const { recto, verso } = splitByFlip(markdown);
        const content = prepareMarkdownForPrint(face === 'recto' ? recto : verso);

        // 6. Parser le markdown
        contentEl.innerHTML = marked.parse(content);

        // 7. Twemoji (via module partagé)
        applyTwemoji(contentEl);

        // 8. Attendre les fonts + délai layout
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 50));

        // 9. Auto-fit via module partagé
        autoFit(cardEl, contentEl);

        // 10. Signaler que c'est prêt
        document.body.classList.add('card-ready');
        
    } catch (err) {
        console.error('Erreur:', err);
        contentEl.innerHTML = `<p class="error">${err.message}</p>`;
        document.body.classList.add('card-error');
    }
}

// Lancer au chargement
init();
