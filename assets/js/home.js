/**
 * Anacoluthe - Home Page
 * Gère l'aperçu aléatoire des cartes sur la page d'accueil
 */

let cardsData = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        await loadCardsIndex();
        shuffleAllPreviews();
        setupShuffleButton();
    } catch (error) {
        console.error('Erreur initialisation home:', error);
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
 * Tire une carte au hasard pour chaque type et met à jour l'affichage
 */
function shuffleAllPreviews() {
    if (!cardsData) return;

    const types = ['role', 'moment', 'sos', 'affiche'];
    
    types.forEach(type => {
        const cards = type === 'affiche' 
            ? cardsData.affiches 
            : cardsData.cards.filter(c => c.type === type);
        
        if (cards && cards.length > 0) {
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            updatePreview(type, randomCard);
        }
    });
}

/**
 * Met à jour l'affichage d'une tuile avec une carte
 */
function updatePreview(type, card) {
    const preview = document.getElementById(`preview-${type}`);
    const emojiEl = document.getElementById(`emoji-${type}`);
    if (!preview) return;

    const title = preview.querySelector('.apercu-title');
    const subtitle = preview.querySelector('.apercu-subtitle');
    const description = preview.querySelector('.apercu-description');
    const tagsContainer = preview.querySelector('.apercu-tags');

    // Récupère le bouton "voir la carte" de la tuile parente
    const tile = preview.closest('.apercu-tile');
    const stack = preview.closest('.apercu-stack');
    const cardBtn = tile ? tile.querySelector('.apercu-btn-card') : null;

    // Animation de transition
    preview.classList.add('shuffling');
    if (emojiEl) emojiEl.classList.add('shuffling');
    
    setTimeout(() => {
        // Mise à jour du contenu
        if (emojiEl) emojiEl.textContent = card.emoji;
        title.textContent = card.title;
        subtitle.textContent = card.subtitle;
        if (description && card.description) {
            description.textContent = card.description;
        }
        
        // Mise à jour des tags
        if (tagsContainer && card.tags) {
            tagsContainer.innerHTML = card.tags
                .slice(0, 4) // Limite à 4 tags max
                .map(tag => `<span class="apercu-tag">${tag}</span>`)
                .join('');
        }
        
        // Mise à jour des liens (titre + bouton "voir la carte")
        const cardUrl = `anacoluthe.html?card=${card.id}`;
        
        if (title && title.tagName === 'A') {
            title.href = cardUrl;
        }
        
        if (cardBtn) {
            cardBtn.href = cardUrl;
            cardBtn.dataset.cardId = card.id;
        }
        
        preview.classList.remove('shuffling');
        if (emojiEl) emojiEl.classList.remove('shuffling');
    }, 150);
}

/**
 * Configure le bouton de mélange
 */
function setupShuffleButton() {
    const btn = document.getElementById('shuffle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        btn.classList.add('shuffling');
        shuffleAllPreviews();
        
        setTimeout(() => {
            btn.classList.remove('shuffling');
        }, 300);
    });
}
