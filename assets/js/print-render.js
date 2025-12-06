/**
 * Anacoluthe - Print Render
 * Page minimaliste pour Puppeteer (génération PDF)
 * 
 * Params URL:
 *   ?card=R1     ID de la carte
 *   &face=recto  recto ou verso
 * 
 * Dépendances : marked.js, twemoji
 */

/**
 * Auto-fit : réduit la taille de police si le contenu déborde
 * Détection simplifiée - vérification manuelle du PDF recommandée
 */
async function autoFit(cardEl, contentEl) {
    const MIN_SIZE = 5.5;   // pt
    const MAX_SIZE = 11;    // pt
    const STEP = 0.25;      // pt
    
    let currentSize = MAX_SIZE;
    
    // Mesurer overflow : height:auto temporaire pour obtenir la vraie hauteur
    const checkOverflow = () => {
        const savedHeight = contentEl.style.height;
        contentEl.style.height = 'auto';
        const contentHeight = contentEl.scrollHeight;
        const availableHeight = cardEl.clientHeight;
        contentEl.style.height = savedHeight;
        return contentHeight > availableHeight;
    };
    
    // Réduire jusqu'à ce que ça rentre (ou taille min atteinte)
    while (checkOverflow() && currentSize > MIN_SIZE) {
        currentSize -= STEP;
        contentEl.style.fontSize = `${currentSize}pt`;
        await new Promise(r => setTimeout(r, 10));
    }
    
    // Log
    if (currentSize < MAX_SIZE) {
        console.log(`Auto-fit: ${currentSize}pt`);
    }
}

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
        
        // 5. Extraire recto ou verso
        const flipMarker = '<!-- FLIP -->';
        let content;
        
        if (markdown.includes(flipMarker)) {
            const parts = markdown.split(flipMarker);
            if (face === 'recto') {
                content = parts[0].trim();
            } else {
                content = parts.slice(1).join(flipMarker).trim();
            }
        } else {
            // Pas de FLIP : tout est recto, verso vide
            if (face === 'recto') {
                content = markdown;
            } else {
                content = '*Pas de verso défini*';
            }
        }
        
        // 6. Retirer les marqueurs HEAD
        content = content.replace('<!-- HEAD -->', '');
        
        // 7. Retirer les blocs SKIP-PRINT
        // Pattern: marqueur + whitespace + optionnellement le H2 de section + contenu jusqu'au prochain délimiteur
        content = content.replace(
            /<!--\s*SKIP-PRINT\s*-->[\s\n]*(?:##[^\n]*\n)?[\s\S]*?(?=\n---\s*\n|\n## |$)/gi,
            ''
        );
        
        // 8. Retirer les marqueurs SKIP-WEB (garder le contenu pour print)
        content = content.replace(/<!--\s*SKIP-WEB\s*-->/gi, '');
        
        // 9. Parser le markdown
        contentEl.innerHTML = marked.parse(content);
        
        // 10. Twemoji
        twemoji.parse(contentEl, { folder: 'svg', ext: '.svg' });
        
        // 11. Attendre les fonts
        await document.fonts.ready;
        
        // 12. Auto-fit : réduire la taille si débordement
        await autoFit(cardEl, contentEl);
        
        // 13. Signaler que c'est prêt
        document.body.classList.add('card-ready');
        
    } catch (err) {
        console.error('Erreur:', err);
        contentEl.innerHTML = `<p class="error">${err.message}</p>`;
        document.body.classList.add('card-error');
    }
}

// Lancer au chargement
init();
