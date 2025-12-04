/**
 * Anacoluthe - Cards Loader
 * Charge et affiche les cartes depuis les fichiers markdown
 * Design V251204 - Style pastel avec emoji débordant
 */

// Configuration
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/quentinjaud/Anacoluthe/main/';
const LOCAL_BASE = '../'; // Pour test local

// État de l'application
let cardsData = null;
let currentFilter = 'all';

// Initialisation
document.addEventListener('DOMContentLoaded', init);

async function init() {
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

    const filteredCards = currentFilter === 'all' 
        ? cardsData.cards 
        : cardsData.cards.filter(card => card.type === currentFilter);

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
 * Design V251204 : emoji débordant en haut à gauche
 */
function createCardTile(card) {
    const typeInfo = cardsData.types[card.type];
    const availableClass = card.available ? '' : 'card-unavailable';
    const unavailableBadge = card.available ? '' : '<span class="badge-unavailable">À venir</span>';
    const protoBadge = card.proto ? '<span class="badge-proto">🛠️ PROTO</span>' : '';
    
    return `
        <article class="card-tile ${availableClass}" data-card-id="${card.id}" data-type="${card.type}">
            <span class="card-emoji">${card.emoji}</span>
            <div class="card-tile-header">
                <div class="card-badges">
                    <span class="card-type-badge">${typeInfo.label}</span>
                    ${protoBadge}
                </div>
            </div>
            <div class="card-tile-body">
                <h3 class="card-tile-title">${card.title}</h3>
                <p class="card-tile-subtitle">${card.subtitle}</p>
                ${card.marin ? `<p class="card-tile-marin">Inspiré·e de ${card.marin}</p>` : ''}
            </div>
            ${unavailableBadge}
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
    const card = cardsData.cards.find(c => c.id === cardId);
    if (!card) {
        console.error('Carte non trouvée:', cardId);
        return;
    }

    if (!card.available) {
        showModalMessage('Cette carte est en cours de production. Revenez bientôt !', card.type);
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
        // Charger le markdown
        const markdown = await fetchCardMarkdown(card.path);
        
        // Parser et afficher
        const html = marked.parse(markdown);
        modalBody.innerHTML = `<div class="card-content">${html}</div>`;
        
        // Mettre à jour l'URL sans recharger
        history.pushState({cardId}, '', `?card=${cardId}`);
        
    } catch (error) {
        console.error('Erreur chargement carte:', error);
        modalBody.innerHTML = '<p class="error">Impossible de charger cette carte.</p>';
    }
}

/**
 * Récupère le markdown d'une carte
 */
async function fetchCardMarkdown(path) {
    // Essayer d'abord GitHub raw
    const url = GITHUB_RAW_BASE + path;
    
    const response = await fetch(url);
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
    // Réinitialiser les classes du modal body
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
