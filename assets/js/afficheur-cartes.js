/**
 * Anacoluthe - Afficheur Cartes
 * Interface de prévisualisation et génération PDF des cartes
 * 
 * Dépendances : marked.js, twemoji, markdown-utils.js
 */

// Lecture des valeurs CSS pour l'affichage (indicateurs, vue tech)
function getCssValue(prop, fallback) {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(prop)) || fallback;
}

// État global
let cardsIndex = null;
let autofitEnabled = true;
let currentMode = 'print';
let currentFace = 'both';

// Paramètres URL
const params = new URLSearchParams(window.location.search);
const paramCard = params.get('card');
const paramMode = params.get('mode');
const paramFace = params.get('face');
const paramAutofit = params.get('autofit');
const paramView = params.get('view');

// Mode Puppeteer
if (paramMode === 'print') {
    document.body.classList.add('mode-print');
}

// Face (pour Puppeteer)
if (paramFace === 'recto') {
    document.body.classList.add('face-recto');
    currentFace = 'recto';
} else if (paramFace === 'verso') {
    document.body.classList.add('face-verso');
    currentFace = 'verso';
}

// Vue initiale
if (paramView && ['print', 'web', 'mobile', 'tech'].includes(paramView)) {
    currentMode = paramView;
    document.body.className = document.body.className.replace(/view-\w+/, '');
    document.body.classList.add('view-' + paramView);
}

if (paramAutofit === 'false') {
    autofitEnabled = false;
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', init);

/**
 * Initialisation principale
 */
async function init() {
    // Configurer marked via le module partagé
    configureMarked();
    
    try {
        const response = await fetch('assets/data/cards-index.json');
        cardsIndex = await response.json();
        
        if (paramMode !== 'print') {
            populateSelect();
            document.getElementById('card-select').addEventListener('change', onCardChange);
            
            const autofitToggle = document.getElementById('autofit-toggle');
            autofitToggle.checked = autofitEnabled;
            autofitToggle.addEventListener('change', (e) => {
                autofitEnabled = e.target.checked;
                const cardId = document.getElementById('card-select').value;
                if (cardId) loadCard(cardId);
            });
            
            setupModeButtons();
            setupReloadButton();
            
            // Désactiver les boutons PDF par défaut
            document.getElementById('pdf-card-btn').classList.add('disabled');
            document.getElementById('pdf-livret-btn').classList.add('disabled');
            document.getElementById('pdf-affiche-btn').classList.add('disabled');
        }
        
        if (paramCard) {
            if (paramMode !== 'print') {
                document.getElementById('card-select').value = paramCard;
            }
            await loadCard(paramCard);
        }
    } catch (error) {
        console.error('Erreur init:', error);
        document.body.classList.add('card-error');
    }
}

/**
 * Configure les boutons de changement de mode (print/web/mobile/tech)
 */
function setupModeButtons() {
    const buttons = document.querySelectorAll('#mode-buttons .view-btn');
    
    buttons.forEach(btn => {
        if (btn.dataset.mode === currentMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        btn.addEventListener('click', () => {
            currentMode = btn.dataset.mode;
            document.body.className = document.body.className.replace(/view-\w+/, '');
            document.body.classList.add('view-' + currentMode);
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateUrl();
        });
    });
}

/**
 * Configure le bouton de rechargement (cache-busting)
 */
function setupReloadButton() {
    const btn = document.getElementById('reload-btn');
    btn.addEventListener('click', async () => {
        const cardId = document.getElementById('card-select').value;
        if (!cardId) return;
        
        // Animation de rotation
        btn.classList.add('spinning');
        
        // Recharger avec cache-busting
        await loadCard(cardId, true);
        
        // Retirer l'animation après un délai
        setTimeout(() => btn.classList.remove('spinning'), 500);
    });
}

/**
 * Met à jour l'URL avec les paramètres actuels
 */
function updateUrl() {
    const cardId = document.getElementById('card-select').value;
    if (!cardId) return;
    
    let url = `?card=${cardId}`;
    if (currentMode !== 'print') {
        url += `&view=${currentMode}`;
    }
    
    history.replaceState({}, '', url);
}

/**
 * Remplit le select avec les cartes groupées par type
 */
function populateSelect() {
    const select = document.getElementById('card-select');
    
    const groups = {
        affiche: { label: '📋 Mémos des Affiches', cards: [] },
        role: { label: '🔧 Rôles', cards: [] },
        moment: { label: '📅 Moments', cards: [] },
        joker: { label: '🃏 Joker', cards: [] }
    };
    
    // Ajouter les affiches
    if (cardsIndex.affiches) {
        cardsIndex.affiches.forEach(card => {
            groups.affiche.cards.push(card);
        });
    }
    
    // Ajouter les cartes
    cardsIndex.cards.forEach(card => {
        if (groups[card.type]) {
            groups[card.type].cards.push(card);
        }
    });
    
    Object.values(groups).forEach(group => {
        if (group.cards.length === 0) return;
        
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.label;
        
        group.cards.forEach(card => {
            const option = document.createElement('option');
            option.value = card.id;
            option.textContent = `${card.id} - ${card.title}`;
            if (card.proto) option.textContent += ' (proto)';
            optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
    });
}

/**
 * Handler du changement de carte
 */
function onCardChange(e) {
    const cardId = e.target.value;
    if (cardId) {
        updateUrl();
        loadCard(cardId);
    }
}

/**
 * Met à jour les boutons de vérification du rendu Puppeteer
 */
function updateVerifyButtons(cardId) {
    const verifyRectoBtn = document.getElementById('verify-recto-btn');
    const verifyVersoBtn = document.getElementById('verify-verso-btn');
    
    if (cardId) {
        verifyRectoBtn.href = `print-render.html?card=${cardId}&face=recto`;
        verifyVersoBtn.href = `print-render.html?card=${cardId}&face=verso`;
        verifyRectoBtn.classList.remove('disabled');
        verifyVersoBtn.classList.remove('disabled');
    } else {
        verifyRectoBtn.href = '#';
        verifyVersoBtn.href = '#';
        verifyRectoBtn.classList.add('disabled');
        verifyVersoBtn.classList.add('disabled');
    }
}

/**
 * Met à jour les boutons PDF en fonction de la carte sélectionnée
 */
function updatePdfButtons(card) {
    const pdfCardBtn = document.getElementById('pdf-card-btn');
    const pdfLivretBtn = document.getElementById('pdf-livret-btn');
    const pdfAfficheBtn = document.getElementById('pdf-affiche-btn');
    
    const isAffiche = card.type === 'affiche';
    
    // Adapter le texte du premier bouton selon le type
    if (isAffiche) {
        pdfCardBtn.innerHTML = '📥 Télécharger le mémo';
        pdfCardBtn.title = 'Télécharger le mémo A6 de cette affiche';
    } else {
        pdfCardBtn.innerHTML = '📥 Télécharger la carte';
        pdfCardBtn.title = 'Télécharger le PDF de cette carte';
    }
    
    // PDF carte/mémo individuel
    if (card.pdfPath) {
        pdfCardBtn.href = card.pdfPath;
        pdfCardBtn.classList.remove('disabled');
    } else {
        pdfCardBtn.href = '#';
        pdfCardBtn.classList.add('disabled');
    }
    
    // PDF livret par type
    const livretPaths = {
        'role': 'print/livrets/livret-roles.pdf',
        'moment': 'print/livrets/livret-moments.pdf',
        'joker': 'print/livrets/livret-joker.pdf',
        'affiche': 'print/livrets/livret-divers.pdf'
    };
    
    const livretPath = livretPaths[card.type];
    if (livretPath) {
        pdfLivretBtn.href = livretPath;
        pdfLivretBtn.classList.remove('disabled');
    } else {
        pdfLivretBtn.href = '#';
        pdfLivretBtn.classList.add('disabled');
    }
    
    // PDF affiche A4 (uniquement pour les affiches)
    if (isAffiche && card.affichePath) {
        pdfAfficheBtn.href = card.affichePath;
        pdfAfficheBtn.classList.remove('disabled');
        pdfAfficheBtn.style.display = '';
    } else if (isAffiche) {
        pdfAfficheBtn.href = '#';
        pdfAfficheBtn.classList.add('disabled');
        pdfAfficheBtn.style.display = '';
    } else {
        pdfAfficheBtn.style.display = 'none';
    }
}

/**
 * Charge et affiche une carte dans toutes les vues
 */
async function loadCard(cardId, forceReload = false) {
    // Chercher dans cartes ET affiches
    const allItems = [...cardsIndex.cards, ...(cardsIndex.affiches || [])];
    const card = allItems.find(c => c.id === cardId);
    if (!card) {
        showError('Carte non trouvée');
        return;
    }
    
    // Mettre à jour les boutons PDF et vérification
    updatePdfButtons(card);
    updateVerifyButtons(cardId);
    
    // Charger le markdown original (non prétraité)
    let markdownRaw = '';
    let contentPath = card.path;
    let lastModified = null;

    if (contentPath) {
        // Cache-busting si forceReload
        if (forceReload) {
            const separator = contentPath.includes('?') ? '&' : '?';
            contentPath += separator + '_t=' + Date.now();
        }

        try {
            const response = await fetch(contentPath);
            if (response.ok) {
                markdownRaw = await response.text();
                lastModified = response.headers.get('Last-Modified');
            }
        } catch (error) {
            console.error('Erreur chargement:', error);
        }
    }

    // Rendre toutes les vues
    await renderPrintView(card, markdownRaw);
    await renderWebView(card, markdownRaw);
    await renderMobileView(card, markdownRaw);
    renderTechView(card, lastModified);
    
    document.body.classList.add('card-ready');
}

/**
 * Rendu de la vue Print (A6 recto/verso)
 */
async function renderPrintView(card, markdown) {
    const rectoEl = document.getElementById('card-recto');
    const versoEl = document.getElementById('card-verso');

    rectoEl.className = 'print-card-face type-' + card.type;
    versoEl.className = 'print-card-face type-' + card.type;
    rectoEl.setAttribute('data-label', 'RECTO');
    rectoEl.setAttribute('data-face', 'recto');
    versoEl.setAttribute('data-label', 'VERSO');
    versoEl.setAttribute('data-face', 'verso');

    if (!markdown || !card.path) {
        rectoEl.querySelector('.print-card-content').innerHTML = '<p class="error">Pas de version print</p>';
        versoEl.querySelector('.print-card-content').innerHTML = '';
        return;
    }

    // Split par FLIP puis préparer pour print (via module partagé)
    const { recto, verso } = splitByFlip(markdown);
    const rectoMd = prepareMarkdownForPrint(recto);
    const versoMd = prepareMarkdownForPrint(verso);

    const rectoContent = rectoEl.querySelector('.print-card-content');
    const versoContent = versoEl.querySelector('.print-card-content');

    // Parser le markdown
    rectoContent.innerHTML = marked.parse(rectoMd);
    versoContent.innerHTML = marked.parse(versoMd);

    applyTwemoji(rectoContent);
    applyTwemoji(versoContent);

    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 50));

    if (autofitEnabled) {
        autoFitContent(rectoEl, 'recto');
        autoFitContent(versoEl, 'verso');
    } else {
        rectoContent.style.fontSize = '';
        versoContent.style.fontSize = '';
        checkOverflow(rectoEl);
        checkOverflow(versoEl);
        const baseSize = getCssValue('--print-font-size-max', 11);
        updateFontIndicator('recto', baseSize, false);
        updateFontIndicator('verso', baseSize, false);
    }

    // Mettre à jour les sources
    const sourceRecto = document.getElementById('caption-source-recto');
    const sourceVerso = document.getElementById('caption-source-verso');
    if (sourceRecto) sourceRecto.textContent = card.path || '-';
    if (sourceVerso) sourceVerso.textContent = card.path || '-';
}

/**
 * Rendu d'un viewer modal (partagé entre Web et Mobile)
 *
 * @param {Object} config - Configuration du viewer
 * @param {string} config.viewerId - ID de l'élément viewer
 * @param {string} config.modalBodyId - ID de l'élément modal-body
 * @param {string} config.viewerClass - Classe CSS du viewer (ex: 'web-viewer', 'mobile-viewer')
 * @param {string} config.sourceId - ID de l'élément caption-source (optionnel)
 * @param {Object} card - Données de la carte
 * @param {string} markdown - Contenu markdown
 */
function renderModalViewer(config, card, markdown) {
    const { viewerId, modalBodyId, viewerClass, sourceId } = config;
    const viewer = document.getElementById(viewerId);
    const modalBody = document.getElementById(modalBodyId);

    // Retirer l'ancienne nav si présente
    const oldNav = viewer.querySelector('.card-section-nav');
    if (oldNav) oldNav.remove();

    // Appliquer les classes de type
    viewer.className = `${viewerClass} modal-${card.type}`;

    if (!markdown) {
        modalBody.innerHTML = '<p class="error">Fichier non disponible</p>';
        return;
    }

    // Parser le contenu (via module partagé)
    const processed = preprocessMarkdownMarkers(markdown);
    const { headHtml, bodyHtml, hasHead } = parseCardContent(processed);

    // Construire le HTML
    const navHeadHtml = hasHead ? `<div class="nav-head">${headHtml}</div>` : '';
    modalBody.innerHTML = `${navHeadHtml}<div class="card-content">${bodyHtml}</div>`;

    // Classe has-nav-head
    modalBody.classList.toggle('has-nav-head', hasHead);

    applyTwemoji(modalBody);

    // Générer la navigation sections
    generateSectionNav(modalBody, viewer, card.type, viewerId);

    // Mettre à jour la source
    if (sourceId) {
        const sourceEl = document.getElementById(sourceId);
        if (sourceEl) sourceEl.textContent = card.path || '-';
    }
}

/**
 * Rendu de la vue Web (modale desktop 700px)
 */
async function renderWebView(card, markdown) {
    renderModalViewer({
        viewerId: 'web-viewer',
        modalBodyId: 'web-modal-body',
        viewerClass: 'web-viewer',
        sourceId: 'caption-source-web'
    }, card, markdown);
}

/**
 * Rendu de la vue Mobile (tuile 300px + modale 360px)
 */
async function renderMobileView(card, markdown) {
    // === Mini tuile ===
    const tile = document.getElementById('mini-tile');
    const typeInfo = cardsIndex.types ? cardsIndex.types[card.type] : { label: card.type.toUpperCase() };

    tile.setAttribute('data-card-id', card.id);
    tile.setAttribute('data-type', card.type);
    tile.className = 'card-tile';

    const protoBadge = card.proto ? '<span class="badge-proto">🛠️ PROTO</span>' : '';

    const tagsHtml = card.tags && card.tags.length > 0
        ? `<div class="card-tile-tags">
            <div class="card-tile-tags-title">${typeInfo.tagsIcon || '🌱'} ${card.tagsTitle || 'Compétences'}</div>
            <div class="card-tile-tags-list">
                ${card.tags.map(tag => `<span class="card-tile-tag">${tag}</span>`).join('')}
            </div>
           </div>`
        : '';

    tile.innerHTML = `
        <span class="card-emoji">${card.emoji || '🎴'}</span>
        <div class="card-badges">
            ${protoBadge}
            <span class="card-type-badge">${typeInfo.label}</span>
        </div>
        <div class="card-tile-header">
            <h3 class="card-tile-title">${card.title}</h3>
        </div>
        <div class="card-tile-body">
            <p class="card-tile-subtitle">${card.subtitle || ''}</p>
            ${card.description ? `<p class="card-tile-description">${card.description}</p>` : ''}
            ${tagsHtml}
        </div>
    `;

    applyTwemoji(tile);

    // === Mobile viewer (utilise la fonction partagée) ===
    renderModalViewer({
        viewerId: 'mobile-viewer',
        modalBodyId: 'mobile-modal-body',
        viewerClass: 'mobile-viewer',
        sourceId: 'caption-source-mobile'
    }, card, markdown);
}

/**
 * Rendu de la vue Technique (infos debug)
 */
function renderTechView(card, lastModified = null) {
    // Récupérer la taille de base actuelle (après auto-fit)
    const rectoContent = document.querySelector('#card-recto .print-card-content');
    const defaultBaseSize = getCssValue('--print-font-size-max', 11);
    let baseSize = defaultBaseSize;
    
    if (rectoContent && rectoContent.style.fontSize) {
        baseSize = parseFloat(rectoContent.style.fontSize);
    }
    
    // Calculer les tailles des headings (doit correspondre à cards-print.css)
    const ratios = {
        h1: 1.8,    // --print-h1-size
        h2: 1.25,   // --print-h2-size
        h3: 1.05,   // --print-h3-size
        h6: 1,      // --print-h6-size
        body: 1
    };
    
    Object.keys(ratios).forEach(key => {
        const el = document.getElementById(`tech-${key}-size`);
        if (el) {
            const size = (baseSize * ratios[key]).toFixed(2);
            el.textContent = `${size}pt`;
            if (baseSize < defaultBaseSize) {
                el.style.color = 'var(--rouge-glenans)';
                el.style.fontWeight = '600';
            } else {
                el.style.color = '';
                el.style.fontWeight = '';
            }
        }
    });
    
    // Afficher les infos de la carte
    const infoEl = document.getElementById('tech-card-info');
    if (infoEl) {
        const typeInfo = cardsIndex.types ? cardsIndex.types[card.type] : { label: card.type };
        infoEl.innerHTML = `
            <table class="tech-table">
                <tr><th>ID</th><td><code>${card.id}</code></td></tr>
                <tr><th>Type</th><td>${typeInfo.label} (<code>${card.type}</code>)</td></tr>
                <tr><th>Titre</th><td>${card.title}</td></tr>
                <tr><th>Sous-titre</th><td>${card.subtitle || '-'}</td></tr>
                <tr><th>Emoji</th><td>${card.emoji || '-'}</td></tr>
                
                <tr><th>Proto</th><td>${card.proto ? '🛠️ Oui' : 'Non'}</td></tr>
                <tr><th>Path</th><td><code>${card.path || '-'}</code></td></tr>
                <tr><th>Modifié</th><td>${lastModified ? new Date(lastModified).toLocaleString('fr-FR') : '-'}</td></tr>
                ${card.pdfPath ? `<tr><th>PDF</th><td><code>${card.pdfPath}</code></td></tr>` : ''}
                <tr><th>Tags</th><td>${card.tags ? card.tags.join(', ') : '-'}</td></tr>
            </table>
        `;
    }
}

/**
 * Auto-fit wrapper : utilise le module partagé et gère l'UI
 */
function autoFitContent(faceEl, faceId) {
    const content = faceEl.querySelector('.print-card-content');
    const warning = faceEl.querySelector('.overflow-warning');
    
    // Appeler la fonction centralisée du module partagé
    const { finalSize, wasReduced } = autoFit(faceEl, content);
    
    // Vérifier si ça déborde encore (taille min atteinte)
    const prevOverflow = content.style.overflow;
    content.style.overflow = 'visible';
    const stillOverflows = content.scrollHeight > content.clientHeight;
    content.style.overflow = prevOverflow || 'hidden';
    
    // Gérer l'UI : warning
    if (stillOverflows) {
        warning.classList.remove('hidden');
    } else {
        warning.classList.add('hidden');
    }
    
    // Gérer l'UI : indicateur de taille
    updateFontIndicator(faceId, finalSize, wasReduced, stillOverflows);
}

/**
 * Met à jour l'indicateur de taille de police
 */
function updateFontIndicator(faceId, size, reduced, isOverflow = false) {
    const indicator = document.getElementById(`font-indicator-${faceId}`);
    if (!indicator) return;
    
    const maxSize = getCssValue('--print-font-size-max', 11);
    
    // Reset classes
    indicator.classList.remove('reduced', 'overflow');
    
    if (isOverflow) {
        indicator.textContent = `Texte: ${size.toFixed(2)}pt (réduit de ${maxSize}pt) - DÉBORDEMENT`;
        indicator.classList.add('overflow');
    } else if (reduced) {
        indicator.textContent = `Texte: ${size.toFixed(2)}pt (réduit de ${maxSize}pt)`;
        indicator.classList.add('reduced');
    } else {
        indicator.textContent = `Texte: ${size}pt`;
    }
}

/**
 * Vérifie si le contenu déborde
 */
function checkOverflow(faceEl) {
    const content = faceEl.querySelector('.print-card-content');
    const warning = faceEl.querySelector('.overflow-warning');
    
    content.style.overflow = 'visible';
    const isOverflowing = content.scrollHeight > content.clientHeight;
    content.style.overflow = 'hidden';
    
    if (isOverflowing) {
        warning.classList.remove('hidden');
    } else {
        warning.classList.add('hidden');
    }
}

/**
 * Affiche une erreur dans tous les viewers
 */
function showError(message) {
    document.querySelectorAll('.print-card-content, .card-content').forEach(el => {
        el.innerHTML = `<p class="error">${message}</p>`;
    });
}
