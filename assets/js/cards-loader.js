/**
 * Anacoluthe - Cards Loader
 * Charge et affiche les cartes depuis les fichiers markdown
 * Design V251204 - Style pastel avec emoji débordant
 */

// État de l'application
let cardsData = null;
let currentFilter = 'all';

/**
 * Pré-traitement du markdown pour les marqueurs SKIP-PRINT / SKIP-WEB
 * Transforme les blocs marqués en divs avec classes pour masquage conditionnel
 * 
 * Syntaxe : <!-- SKIP-PRINT --> ou <!-- SKIP-WEB -->
 * Le bloc s'étend jusqu'au prochain titre H2 (## ) ou jusqu'à la fin du fichier
 */
function preprocessSkipMarkers(markdown) {
    const skipPrintRegex = /<!--\s*SKIP-PRINT\s*-->/gi;
    const skipWebRegex = /<!--\s*SKIP-WEB\s*-->/gi;
    
    function processMarker(md, regex, className) {
        let result = md;
        let match;
        
        while ((match = regex.exec(md)) !== null) {
            const startPos = match.index;
            const markerEnd = startPos + match[0].length;
            
            const afterMarker = md.substring(markerEnd);
            const nextH2Match = afterMarker.match(/\n##\s/);
            
            let endPos;
            if (nextH2Match) {
                endPos = markerEnd + nextH2Match.index;
            } else {
                endPos = md.length;
            }
            
            const contentToWrap = md.substring(markerEnd, endPos);
            const wrapped = `<div class="${className}">\n${contentToWrap.trim()}\n</div>\n`;
            result = md.substring(0, startPos) + wrapped + md.substring(endPos);
            
            regex.lastIndex = 0;
            md = result;
        }
        
        return result;
    }
    
    let processed = markdown;
    processed = processMarker(processed, skipPrintRegex, 'skip-print');
    processed = processMarker(processed, skipWebRegex, 'skip-web');
    
    return processed;
}

// Initialisation
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Configurer marked pour autoriser le HTML brut (iframes vidéo, etc.)
    marked.setOptions({
        breaks: true,
        gfm: true
    });
    
    try {
        await loadCardsIndex();
        renderGallery();
        setupFilters();
        setupModalClose();
        
        // Vérifier si une carte est demandée dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const cardId = urlParams.get('card');
        if (cardId) {
            openCard(cardId);
        }
    } catch (error) {
        console.error('Erreur initialisation:', error);
        showError('Impossible de charger les cartes.');
    }
}

/**
 * Charge l'index des cartes
 */
async function loadCardsIndex() {
    const response = await fetch('assets/data/cards-index.json');
    if (!response.ok) throw new Error('Index non trouvé');
    cardsData = await response.json();
}

/**
 * Génère la galerie de cartes
 */
function renderGallery() {
    const gallery = document.getElementById('cards-gallery');
    if (!gallery || !cardsData) return;

    // Combiner affiches d'abord, puis cartes (affiches en premier)
    const allItems = [...(cardsData.affiches || []), ...cardsData.cards];
    
    const filteredCards = currentFilter === 'all' 
        ? allItems 
        : allItems.filter(card => card.type === currentFilter);

    if (filteredCards.length === 0) {
        gallery.innerHTML = '<p class="no-cards">Aucune carte dans cette catégorie.</p>';
        return;
    }

    gallery.innerHTML = filteredCards.map(card => createCardTile(card)).join('');

    // Ajouter les event listeners
    gallery.querySelectorAll('.card-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const cardId = tile.dataset.cardId;
            openCard(cardId);
        });
    });
}

/**
 * Crée le HTML d'une tuile de carte
 * Design V251204 : emoji débordant + description + tags
 */
function createCardTile(card) {
    const typeInfo = cardsData.types[card.type];
    const protoBadge = card.proto ? '<span class="badge-proto">🛠️ PROTO</span>' : '';
    
    // Générer les tags
    const tagsHtml = card.tags && card.tags.length > 0 
        ? `<div class="card-tile-tags">
            <div class="card-tile-tags-title">${typeInfo.tagsIcon || '🌱'} ${card.tagsTitle || 'Compétences'}</div>
            <div class="card-tile-tags-list">
                ${card.tags.map(tag => `<span class="card-tile-tag">${tag}</span>`).join('')}
            </div>
           </div>`
        : '';
    
    return `
        <article class="card-tile" data-card-id="${card.id}" data-type="${card.type}">
            <span class="card-emoji">${card.emoji}</span>
            <div class="card-badges">
                ${protoBadge}
                <span class="card-type-badge">${typeInfo.label}</span>
            </div>
            <div class="card-tile-header">
                <h3 class="card-tile-title">${card.title}</h3>
            </div>
            <div class="card-tile-body">
                <p class="card-tile-subtitle">${card.subtitle}</p>
                ${card.description ? `<p class="card-tile-description">${card.description}</p>` : ''}
                ${tagsHtml}
            </div>
        </article>
    `;
}

/**
 * Configure les filtres
 */
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mettre à jour l'état actif
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrer
            currentFilter = btn.dataset.filter;
            renderGallery();
        });
    });
}

/**
 * Ouvre une carte dans la modale
 */
async function openCard(cardId) {
    // Chercher dans cartes ET affiches
    const allItems = [...cardsData.cards, ...(cardsData.affiches || [])];
    const card = allItems.find(c => c.id === cardId);
    if (!card) {
        console.error('Carte non trouvée:', cardId);
        return;
    }

    const modal = document.getElementById('card-modal');
    const modalBody = document.getElementById('card-modal-body');
    
    // Afficher la modale avec un état de chargement
    modal.classList.add('open');
    
    // Ajouter la classe de type pour la couleur de fond
    modalBody.className = 'card-modal-body modal-' + card.type;
    modalBody.innerHTML = '<p class="loading">Chargement de la carte...</p>';
    document.body.style.overflow = 'hidden';

    try {
        // Déterminer le chemin (path pour cartes, memoPath pour affiches)
        const contentPath = card.memoPath || card.path;
        
        // Charger le markdown
        let markdown = await fetchCardMarkdown(contentPath);
        
        // Pré-traiter les marqueurs SKIP-PRINT / SKIP-WEB
        markdown = preprocessSkipMarkers(markdown);
        
        // Séparer le head du reste du contenu (si marqueur présent)
        const headMarker = '<!-- HEAD -->';
        let headHtml = '';
        let bodyMarkdown = markdown;
        
        if (markdown.includes(headMarker)) {
            const parts = markdown.split(headMarker);
            if (parts.length >= 2) {
                headHtml = marked.parse(parts[0].trim());
                bodyMarkdown = parts.slice(1).join(headMarker).trim();
            }
        }
        
        // Parser et afficher le body
        const bodyHtml = marked.parse(bodyMarkdown);
        
        // Bouton vers l'atelier (desktop uniquement, masqué en mobile via CSS)
        const atelierButton = `<a href="afficheur-cartes.html?card=${card.id}&view=print" class="atelier-link-btn" target="_blank">
                🪄 Voir dans l'atelier à cartes
            </a>`;
        
        // Bouton suggestion (visible desktop ET mobile)
        const mailSubject = encodeURIComponent(`Suggestion de modification de la carte ${card.title}`);
        const suggestionButton = `<a href="mailto:contact@anacoluthe.org?subject=${mailSubject}" class="suggestion-link-btn">
                💌 Suggérer une modification
            </a>`;
        
        const actionsSection = `<div class="card-actions-section">${atelierButton}${suggestionButton}</div>`;
        
        // Construire le HTML final avec nav-head si présent
        const navHeadHtml = headHtml 
            ? `<div class="nav-head">${headHtml}</div>` 
            : '';
        
        modalBody.innerHTML = `${navHeadHtml}<div class="card-content">${bodyHtml}</div>${actionsSection}`;
        
        // Ajouter classe si nav-head présent
        if (headHtml) {
            modalBody.classList.add('has-nav-head');
        }
        
        // Forcer les liens externes à s'ouvrir dans un nouvel onglet
        modalBody.querySelectorAll('a[href^="http"]').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
        
        // Ajouter les IDs aux H2 et générer la navigation
        generateSectionNav(modalBody, card.type);
        
        // Mettre à jour l'URL sans recharger
        history.pushState({cardId}, '', `?card=${cardId}`);
        
    } catch (error) {
        console.error('Erreur chargement carte:', error);
        modalBody.innerHTML = '<p class="error">Impossible de charger cette carte.</p>';
    }
}

/**
 * Génère la navigation entre sections H2 avec scroll spy
 */
function generateSectionNav(modalBody, cardType) {
    // Nettoyer la nav existante
    const existingNav = document.querySelector('.card-section-nav');
    if (existingNav) existingNav.remove();
    
    const h2Elements = modalBody.querySelectorAll('.card-content h2');
    
    if (h2Elements.length < 2) return; // Pas de nav si moins de 2 sections
    
    // Ajouter des IDs aux H2
    const sections = [];
    h2Elements.forEach((h2, index) => {
        const id = 'section-' + index;
        h2.id = id;
        // Extraire le texte sans l'emoji du début
        const text = h2.textContent.replace(/^[\u{1F300}-\u{1F9FF}\s]+/u, '').trim();
        // Raccourcir si trop long
        const shortText = text.length > 20 ? text.substring(0, 18) + '...' : text;
        sections.push({ id, text: shortText, emoji: h2.textContent.match(/^[\u{1F300}-\u{1F9FF}]/u)?.[0] || '' });
    });
    
    // Créer la barre de navigation
    const nav = document.createElement('nav');
    nav.className = 'card-section-nav nav-' + cardType;
    nav.innerHTML = `
        <div class="section-nav-inner">
            ${sections.map(s => `<a href="#${s.id}" class="section-nav-link" data-section="${s.id}">${s.emoji ? s.emoji + ' ' : ''}${s.text}</a>`).join('')}
        </div>
    `;
    
    // Ajouter la nav au modal-content (parent du modalBody) pour qu'elle soit hors du scroll
    const modalContent = modalBody.parentElement;
    modalContent.appendChild(nav);
    
    // Scroll smooth vers la section au clic
    nav.querySelectorAll('.section-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Scroll spy avec Intersection Observer
    const observerOptions = {
        root: modalBody,
        rootMargin: '-20% 0px -70% 0px', // Zone de détection en haut
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Retirer la classe active de tous les liens
                nav.querySelectorAll('.section-nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                // Ajouter la classe active au lien correspondant
                const activeLink = nav.querySelector(`[data-section="${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    // Scroll horizontal pour voir le lien actif
                    activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        });
    }, observerOptions);
    
    // Observer tous les H2
    h2Elements.forEach(h2 => observer.observe(h2));
    
    // Activer le premier par défaut
    const firstLink = nav.querySelector('.section-nav-link');
    if (firstLink) firstLink.classList.add('active');
}

/**
 * Récupère le markdown d'une carte
 */
async function fetchCardMarkdown(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
}

/**
 * Ferme la modale
 */
function closeModal() {
    const modal = document.getElementById('card-modal');
    const modalBody = document.getElementById('card-modal-body');
    
    modal.classList.remove('open');
    // Réinitialiser les classes du modal body (dont has-nav-head)
    modalBody.className = 'card-modal-body';
    document.body.style.overflow = '';
    
    // Retirer le paramètre de l'URL
    history.pushState({}, '', window.location.pathname);
}

/**
 * Configure la fermeture de modale
 */
function setupModalClose() {
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Gérer le retour arrière
    window.addEventListener('popstate', (e) => {
        if (!e.state || !e.state.cardId) {
            closeModal();
        } else {
            openCard(e.state.cardId);
        }
    });
}

/**
 * Affiche un message dans la modale
 */
function showModalMessage(message, cardType) {
    const modal = document.getElementById('card-modal');
    const modalBody = document.getElementById('card-modal-body');
    
    modal.classList.add('open');
    // Ajouter la classe de type si fournie
    modalBody.className = 'card-modal-body' + (cardType ? ' modal-' + cardType : '');
    modalBody.innerHTML = `<p class="modal-message">${message}</p>`;
    document.body.style.overflow = 'hidden';
}

/**
 * Affiche une erreur dans la galerie
 */
function showError(message) {
    const gallery = document.getElementById('cards-gallery');
    if (gallery) {
        gallery.innerHTML = `<p class="error">${message}</p>`;
    }
}

