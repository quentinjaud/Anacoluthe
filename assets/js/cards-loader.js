/**
 * Anacoluthe - Cards Loader
 * Charge et affiche les cartes depuis les fichiers markdown
 * 
 * Dépend de : markdown-utils.js (doit être chargé avant)
 */

// État de l'application
let cardsData = null;
let currentFilter = 'all';

// Initialisation
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Configurer marked via le module partagé
    configureMarked();
    
    try {
        await loadCardsIndex();
        
        // Vérifier si un type est demandé dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const typeParam = urlParams.get('type');
        if (typeParam && ['role', 'moment', 'joker', 'affiche'].includes(typeParam)) {
            currentFilter = typeParam;
            // Activer le bouton filtre correspondant
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === typeParam);
            });
        }
        
        renderGallery();
        setupFilters();
        setupModalClose();
        
        // Vérifier si une carte est demandée dans l'URL
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
    
    // Grille 4 colonnes pour les rôles et Joker (exactement 4 cartes)
    if ((currentFilter === 'role' || currentFilter === 'joker') && filteredCards.length === 4) {
        gallery.classList.add('gallery-4cols');
    } else {
        gallery.classList.remove('gallery-4cols');
    }

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
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGallery();
            
            // Mettre à jour l'URL
            const url = new URL(window.location);
            if (currentFilter === 'all') {
                url.searchParams.delete('type');
            } else {
                url.searchParams.set('type', currentFilter);
            }
            // Supprimer ?card si présent (on change de contexte)
            url.searchParams.delete('card');
            window.history.replaceState({}, '', url);
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
    const modalContent = modalBody.parentElement;
    
    // Afficher la modale avec un état de chargement
    modal.classList.add('open');
    modalBody.className = 'card-modal-body modal-' + card.type;
    modalBody.innerHTML = '<p class="loading">Chargement de la carte...</p>';
    document.body.style.overflow = 'hidden';

    try {
        // Déterminer le chemin (path pour cartes, memoPath pour affiches)
        const contentPath = card.memoPath || card.path;
        
        // Charger le markdown
        const response = await fetch(contentPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        let markdown = await response.text();
        
        // Pré-traiter les marqueurs (FLIP supprimé, SKIP wrappés)
        markdown = preprocessMarkdownMarkers(markdown);
        
        // Parser le contenu (sépare HEAD du body)
        const { headHtml, bodyHtml, hasHead } = parseCardContent(markdown);
        
        // Boutons d'action
        const atelierButton = `<a href="afficheur-cartes.html?card=${card.id}&view=print" class="atelier-link-btn" target="_blank">
                🪄 Voir dans l'atelier à cartes
            </a>`;
        
        const mailSubject = encodeURIComponent(`Suggestion de modification de la carte ${card.title}`);
        const suggestionButton = `<a href="mailto:contact@anacoluthe.org?subject=${mailSubject}" class="suggestion-link-btn">
                💌 Suggérer une modification
            </a>`;
        
        const actionsSection = `<div class="card-actions-section">${atelierButton}${suggestionButton}</div>`;
        
        // Construire le HTML final
        const navHeadHtml = hasHead ? `<div class="nav-head">${headHtml}</div>` : '';

        // Ajouter l'image de prévisualisation pour les affiches
        let previewHtml = '';
        if (card.type === 'affiche' && card.previewImages && card.previewImages.length > 0) {
            if (card.previewImages.length === 1) {
                // Une seule image (A1, A2)
                previewHtml = `
                    <div class="modal-affiche-preview">
                        <img src="${card.previewImages[0]}" alt="${card.title}">
                    </div>`;
            } else {
                // Plusieurs images côte à côte (A3)
                const imagesHtml = card.previewImages
                    .map(src => `<img src="${src}" alt="${card.title}">`)
                    .join('');
                previewHtml = `
                    <div class="modal-affiche-preview modal-affiche-preview-dual">
                        ${imagesHtml}
                    </div>`;
            }
        }

        modalBody.innerHTML = `${navHeadHtml}${previewHtml}<div class="card-content">${bodyHtml}</div>${actionsSection}`;
        
        if (hasHead) {
            modalBody.classList.add('has-nav-head');
        }
        
        // Forcer les liens externes à s'ouvrir dans un nouvel onglet
        modalBody.querySelectorAll('a[href^="http"]').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
        
        // Générer la navigation sections (fonction du module partagé)
        generateSectionNav(modalBody, modalContent, card.type);
        
        // Mettre à jour l'URL sans recharger
        history.pushState({cardId}, '', `?card=${cardId}`);
        
    } catch (error) {
        console.error('Erreur chargement carte:', error);
        modalBody.innerHTML = '<p class="error">Impossible de charger cette carte.</p>';
    }
}

/**
 * Ferme la modale
 */
function closeModal() {
    const modal = document.getElementById('card-modal');
    const modalBody = document.getElementById('card-modal-body');
    
    // Nettoyer la nav si présente
    const nav = modal.querySelector('.card-section-nav');
    if (nav) nav.remove();
    
    modal.classList.remove('open');
    modalBody.className = 'card-modal-body';
    document.body.style.overflow = '';
    
    history.pushState({}, '', window.location.pathname);
}

/**
 * Configure la fermeture de modale
 */
function setupModalClose() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    window.addEventListener('popstate', (e) => {
        if (!e.state || !e.state.cardId) {
            closeModal();
        } else {
            openCard(e.state.cardId);
        }
    });
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
