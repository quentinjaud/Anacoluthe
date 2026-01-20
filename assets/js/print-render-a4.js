/**
 * Anacoluthe - Print Render A4
 * Page minimaliste pour Puppeteer (génération PDF affiches A4 paysage)
 *
 * Params URL:
 *   ?affiche=A2    ID de l'affiche
 *
 * Dépendances : twemoji, markdown-utils.js (applyTwemoji), affiches-print.css
 */

// applyTwemoji est fourni par markdown-utils.js (chargé avant ce script)

/**
 * Initialisation : charge et rend l'affiche
 */
async function init() {
    const params = new URLSearchParams(window.location.search);
    const afficheId = params.get('affiche');

    const containerEl = document.getElementById('affiche-container');

    if (!afficheId) {
        containerEl.innerHTML = '<p class="error">Paramètre affiche manquant</p>';
        document.body.classList.add('affiche-error');
        return;
    }

    try {
        // 1. Charger l'index pour trouver le htmlPath
        const indexResponse = await fetch('assets/data/cards-index.json');
        if (!indexResponse.ok) throw new Error('Index non trouvé');
        const index = await indexResponse.json();

        // 2. Trouver l'affiche
        const allItems = [...(index.cards || []), ...(index.affiches || [])];
        const affiche = allItems.find(a => a.id === afficheId);
        if (!affiche) throw new Error(`Affiche ${afficheId} non trouvée`);

        // 3. Vérifier qu'on a un htmlPath
        if (!affiche.htmlPath) {
            throw new Error(`Pas de htmlPath pour l'affiche ${afficheId}`);
        }

        // 4. Charger le HTML de l'affiche
        const htmlResponse = await fetch(affiche.htmlPath);
        if (!htmlResponse.ok) throw new Error(`HTML non trouvé: ${affiche.htmlPath}`);
        const htmlText = await htmlResponse.text();

        // 5. Extraire le contenu du body (toutes les divs .affiche-a4 ou .affiche-a4-portrait)
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const affichePages = doc.querySelectorAll('.affiche-a4, .affiche-a4-portrait');

        if (!affichePages.length) {
            throw new Error('Pas de .affiche-a4 ou .affiche-a4-portrait trouvé dans le HTML');
        }

        // 6. Insérer le contenu (toutes les pages)
        containerEl.innerHTML = '';
        affichePages.forEach(page => containerEl.appendChild(page));

        // 6b. Détecter format et ajuster les dimensions (multi-pages si nécessaire)
        const pageCount = affichePages.length;
        if (affiche.format === 'A4-portrait') {
            document.documentElement.style.width = '210mm';
            document.documentElement.style.height = `${297 * pageCount}mm`;
            document.body.style.width = '210mm';
            document.body.style.height = `${297 * pageCount}mm`;
            document.body.style.overflow = 'visible';
        } else {
            // A4 landscape multi-pages
            if (pageCount > 1) {
                document.documentElement.style.height = `${210 * pageCount}mm`;
                document.body.style.height = `${210 * pageCount}mm`;
                document.body.style.overflow = 'visible';
            }
        }

        // 7. Twemoji
        applyTwemoji(containerEl);

        // 8. Attendre les fonts
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 100));

        // 9. Signaler que c'est prêt
        document.body.classList.add('affiche-ready');

    } catch (err) {
        console.error('Erreur:', err);
        containerEl.innerHTML = `<p class="error">${err.message}</p>`;
        document.body.classList.add('affiche-error');
    }
}

// Lancer au chargement
init();
