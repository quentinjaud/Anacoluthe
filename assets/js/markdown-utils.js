/**
 * Anacoluthe - Markdown Utils
 * Fonctions partagées pour le parsing markdown des cartes
 * 
 * Utilisé par : cards-loader.js, afficheur-cartes.html, print-render.html
 */

/**
 * Configure marked.js avec les options standard Anacoluthe
 */
function configureMarked() {
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true
        });
    }
}

/**
 * Pré-traitement du markdown pour le marqueur FLIP uniquement
 * 
 * @param {string} markdown - Le markdown brut
 * @param {Object} options - Options de traitement
 * @param {boolean} options.keepFlip - Si true, garde le marqueur FLIP (pour print)
 * @returns {string} - Le markdown traité
 */
function preprocessMarkdownMarkers(markdown, options = {}) {
    const { keepFlip = false } = options;
    let processed = markdown;
    
    // Supprimer le marqueur FLIP pour les vues web/mobile
    if (!keepFlip) {
        processed = processed.replace(/<!--\s*FLIP\s*-->/gi, '');
    }
    
    return processed;
}

/**
 * Post-traitement du HTML pour wrapper les blocs SKIP
 * À appeler APRÈS marked.parse()
 * 
 * Les commentaires <!-- SKIP-PRINT --> et <!-- SKIP-WEB --> sont préservés par marked.
 * Cette fonction les transforme en divs avec les classes appropriées.
 * 
 * Le bloc s'étend jusqu'au prochain <h2> ou <hr> ou fin du contenu.
 * 
 * @param {string} html - Le HTML généré par marked.parse()
 * @returns {string} - Le HTML avec les blocs SKIP wrappés
 */
function wrapSkipBlocks(html) {
    let result = html;
    
    // Traiter SKIP-PRINT
    result = wrapSkipMarker(result, 'SKIP-PRINT', 'skip-print');
    
    // Traiter SKIP-WEB
    result = wrapSkipMarker(result, 'SKIP-WEB', 'skip-web');
    
    return result;
}

/**
 * Wrapper un type de marqueur SKIP
 */
function wrapSkipMarker(html, markerName, className) {
    const markerRegex = new RegExp(`<!--\\s*${markerName}\\s*-->`, 'gi');
    let result = html;
    let match;
    
    while ((match = markerRegex.exec(result)) !== null) {
        const startPos = match.index;
        const markerEnd = startPos + match[0].length;
        
        const afterMarker = result.substring(markerEnd);
        
        // Chercher la fin du bloc : prochain <h2 ou <hr ou fin
        const h2Match = afterMarker.match(/<h2[\s>]/i);
        const hrMatch = afterMarker.match(/<hr[\s>/]/i);
        
        let endOffset = afterMarker.length; // Par défaut : jusqu'à la fin
        
        if (h2Match && hrMatch) {
            endOffset = Math.min(h2Match.index, hrMatch.index);
        } else if (h2Match) {
            endOffset = h2Match.index;
        } else if (hrMatch) {
            endOffset = hrMatch.index;
        }
        
        const contentToWrap = afterMarker.substring(0, endOffset);
        const afterContent = afterMarker.substring(endOffset);
        
        // Reconstruire avec le wrapper
        result = result.substring(0, startPos) + 
                 `<div class="${className}">${contentToWrap}</div>` + 
                 afterContent;
        
        // Reset regex pour la prochaine itération
        markerRegex.lastIndex = 0;
    }
    
    return result;
}

/**
 * Parse le contenu d'une carte en séparant le header (nav-head) du body
 * 
 * @param {string} markdown - Le markdown prétraité
 * @returns {Object} - { headHtml, bodyHtml, hasHead }
 */
function parseCardContent(markdown) {
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
    
    // Parser le body
    let bodyHtml = marked.parse(bodyMarkdown);
    
    // Wrapper les blocs SKIP
    bodyHtml = wrapSkipBlocks(bodyHtml);
    
    return {
        headHtml,
        bodyHtml,
        hasHead: headHtml.length > 0
    };
}

/**
 * Génère la navigation entre sections H2 avec scroll spy
 * 
 * @param {HTMLElement} modalBody - Le conteneur du contenu (avec .card-content)
 * @param {HTMLElement} containerEl - Le conteneur parent où ajouter la nav
 * @param {string} cardType - Le type de carte (role, moment, sos, affiche)
 * @param {string} idPrefix - Préfixe pour les IDs (évite les conflits si plusieurs viewers)
 */
function generateSectionNav(modalBody, containerEl, cardType, idPrefix = '') {
    // Nettoyer la nav existante
    const existingNav = containerEl.querySelector('.card-section-nav');
    if (existingNav) existingNav.remove();
    
    const h2Elements = modalBody.querySelectorAll('.card-content h2');
    
    if (h2Elements.length < 2) return; // Pas de nav si moins de 2 sections
    
    // Ajouter des IDs aux H2
    const sections = [];
    h2Elements.forEach((h2, index) => {
        const id = 'section-' + index + (idPrefix ? '-' + idPrefix : '');
        h2.id = id;
        // Extraire le texte sans l'emoji du début
        const text = h2.textContent.replace(/^[\u{1F300}-\u{1F9FF}\s]+/u, '').trim();
        // Raccourcir si trop long
        const shortText = text.length > 20 ? text.substring(0, 18) + '...' : text;
        sections.push({ 
            id, 
            text: shortText, 
            emoji: h2.textContent.match(/^[\u{1F300}-\u{1F9FF}]/u)?.[0] || '' 
        });
    });
    
    // Créer la barre de navigation
    const nav = document.createElement('nav');
    nav.className = 'card-section-nav nav-' + cardType;
    nav.innerHTML = `
        <div class="section-nav-inner">
            ${sections.map(s => `<a href="#${s.id}" class="section-nav-link" data-section="${s.id}">${s.emoji ? s.emoji + ' ' : ''}${s.text}</a>`).join('')}
        </div>
    `;
    
    // Ajouter la nav au container
    containerEl.appendChild(nav);
    
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
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                nav.querySelectorAll('.section-nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                const activeLink = nav.querySelector(`[data-section="${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        });
    }, observerOptions);
    
    h2Elements.forEach(h2 => observer.observe(h2));
    
    // Activer le premier par défaut
    const firstLink = nav.querySelector('.section-nav-link');
    if (firstLink) firstLink.classList.add('active');
}

/**
 * Applique Twemoji sur un élément
 * 
 * @param {HTMLElement} element - L'élément à traiter
 */
function applyTwemoji(element) {
    if (typeof twemoji !== 'undefined') {
        twemoji.parse(element, { folder: 'svg', ext: '.svg' });
    }
}

// Export pour utilisation en module ES6 ou en script classique
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        configureMarked,
        preprocessMarkdownMarkers,
        wrapSkipBlocks,
        parseCardContent,
        generateSectionNav,
        applyTwemoji
    };
}
