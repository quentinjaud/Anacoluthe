/**
 * Anacoluthe - Suivi Loader
 * Parse le fichier markdown sources/suivi/tableau_suivi_cartes.md et affiche la progression
 */

// Mapping type -> fichier notes
const NOTES_FILES = {
    role: 'sources/suivi/roles_notes.md',
    moment: 'sources/suivi/moments_notes.md',
    sos: 'sources/suivi/sos_notes.md',
    affiche: 'sources/suivi/affiches_notes.md'
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Charger le markdown
        const response = await fetch('sources/suivi/tableau_suivi_cartes.md');
        if (!response.ok) throw new Error('Fichier tableau non trouvé');
        const markdown = await response.text();

        // Parser les données
        const data = parseMarkdown(markdown);

        // Afficher
        renderProgress(data);
        renderSurLeFeu(data.surLeFeu);
        renderCooked(data.cooked);
        renderPasses();
        renderItems(data.items);
        renderAside(data.aside);

        // Charger les retours
        renderRetours();

        // Setup modale
        setupModal();

    } catch (error) {
        console.error('Erreur chargement suivi:', error);
        document.getElementById('progress-container').innerHTML =
            '<p class="error">Erreur de chargement des données</p>';
    }
});

/**
 * Parse le markdown et extrait les données structurées
 */
function parseMarkdown(md) {
    const items = [];
    const aside = [];
    const surLeFeu = [];

    // Trouver la section "Sur le feu" (liste avec [] ou [x] ou - après ## 🔥Sur le feu)
    const surLeFeuMatch = md.match(/## 🔥\s*Sur le feu\s*\n([\s\S]*?)(?=\n##|\n---)/);
    if (surLeFeuMatch) {
        const lines = surLeFeuMatch[1].split('\n').filter(l => l.trim().match(/^(\[.?\]|-)/));
        for (const line of lines) {
            const done = line.includes('[x]') || line.includes('[X]');
            const text = line.replace(/^\[.?\]\s*/, '').replace(/^-\s*/, '').trim();
            if (text) {
                surLeFeu.push({ text, done });
            }
        }
    }

    // Trouver la section "Cooked" (tâches terminées)
    const cooked = [];
    const cookedMatch = md.match(/## 👌\s*Cooked\s*\n([\s\S]*?)(?=\n##|\n---)/);
    if (cookedMatch) {
        const lines = cookedMatch[1].split('\n').filter(l => l.trim().match(/^(\[.?\]|-)/));
        for (const line of lines) {
            const text = line.replace(/^\[.?\]\s*/, '').replace(/^-\s*/, '').trim();
            if (text) {
                cooked.push(text);
            }
        }
    }

    // Trouver le tableau d'avancement (après "### Tableau d'avancement")
    const tableMatch = md.match(/\| ID \| Titre \|[\s\S]*?(?=\n\n|\n###|\n---)/);
    if (tableMatch) {
        const lines = tableMatch[0].split('\n').filter(l => l.startsWith('|'));
        // Skip header et separator
        for (let i = 2; i < lines.length; i++) {
            const cols = lines[i].split('|').map(c => c.trim()).filter(c => c);
            if (cols.length >= 7) {
                items.push({
                    id: cols[0],
                    title: cols[1],
                    passes: {
                        fond: parseStatus(cols[2]),
                        forme: parseStatus(cols[3]),
                        design: parseStatus(cols[4]),
                        print: parseStatus(cols[5]),
                        site: parseStatus(cols[6])
                    },
                    comment: cols[7] || ''
                });
            }
        }
    }
    
    // Trouver le tableau "Diffusion du jeu"
    const asideMatch = md.match(/## 🔊\s*Diffusion du jeu[\s\S]*?\| Action \|[\s\S]*?(?=\n\n|\n---)/);
    if (asideMatch) {
        const lines = asideMatch[0].split('\n').filter(l => l.startsWith('|') && !l.includes('Action') && !l.includes('---'));
        for (const line of lines) {
            const cols = line.split('|').map(c => c.trim()).filter(c => c);
            if (cols.length >= 2) {
                aside.push({
                    label: cols[0],
                    done: cols[1].includes('✅'),
                    note: cols[2] || ''
                });
            }
        }
    }
    
    return { items, aside, surLeFeu, cooked };
}

/**
 * Convertit emoji en statut
 */
function parseStatus(cell) {
    if (cell.includes('✅')) return 'done';
    if (cell.includes('🔄')) return 'wip';
    return 'todo';
}

/**
 * Détermine le type depuis l'ID
 */
function getType(id) {
    if (id.startsWith('R')) return 'role';
    if (id.startsWith('M')) return 'moment';
    if (id.startsWith('S')) return 'sos';
    if (id.startsWith('A')) return 'affiche';
    return 'other';
}

/**
 * Affiche la section "Sur le feu"
 */
function renderSurLeFeu(surLeFeu) {
    const container = document.getElementById('surlefeu-container');
    if (!container) return;

    if (!surLeFeu || surLeFeu.length === 0) {
        container.innerHTML = '<p class="surlefeu-empty">Rien sur le feu pour le moment</p>';
        return;
    }

    container.innerHTML = `
        <ul class="surlefeu-list">
            ${surLeFeu.map(item => `
                <li class="surlefeu-item ${item.done ? 'done' : ''}">
                    <span class="surlefeu-checkbox">${item.done ? '✅' : '⬜'}</span>
                    <span class="surlefeu-text">${item.text}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

/**
 * Affiche la section "Cooked" (accordéon replié)
 */
function renderCooked(cooked) {
    const container = document.getElementById('cooked-container');
    if (!container) return;

    if (!cooked || cooked.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.innerHTML = `
        <div class="cooked-accordion">
            <div class="cooked-header" onclick="toggleCooked()">
                <span class="cooked-title">👌 Sorti des cuisines</span>
                <span class="cooked-count">(${cooked.length})</span>
                <span class="cooked-toggle">▶</span>
            </div>
            <div class="cooked-body">
                <ul class="cooked-list">
                    ${cooked.map(text => `
                        <li class="cooked-item">
                            <span class="cooked-checkbox">✅</span>
                            <span class="cooked-text">${text}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
}

/**
 * Toggle accordéon Cooked
 */
function toggleCooked() {
    const accordion = document.querySelector('.cooked-accordion');
    accordion.classList.toggle('open');
}

/**
 * Affiche la barre de progression globale
 */
function renderProgress(data) {
    const container = document.getElementById('progress-container');
    
    // Calculer les stats (5 passes par item)
    let done = 0, wip = 0, todo = 0;
    for (const item of data.items) {
        for (const pass of Object.values(item.passes)) {
            if (pass === 'done') done++;
            else if (pass === 'wip') wip++;
            else todo++;
        }
    }
    
    const total = done + wip + todo;
    const percent = Math.round((done / total) * 100);
    
    container.innerHTML = `
        <div class="progress-bar-wrapper">
            <div class="progress-bar" style="width: ${percent}%">
                <span class="progress-label">${percent}%</span>
            </div>
        </div>
        <div class="progress-stats">
            <div class="stat-item stat-done">
                <span class="stat-icon">✅</span>
                <span class="stat-value">${done}</span>
                <span class="stat-label">terminés</span>
            </div>
            <div class="stat-item stat-wip">
                <span class="stat-icon">🔄</span>
                <span class="stat-value">${wip}</span>
                <span class="stat-label">en cours</span>
            </div>
            <div class="stat-item stat-todo">
                <span class="stat-icon">⬜</span>
                <span class="stat-value">${todo}</span>
                <span class="stat-label">à faire</span>
            </div>
        </div>
    `;
}

/**
 * Affiche la légende des passes
 */
function renderPasses() {
    const container = document.getElementById('passes-legend');
    const passes = [
        { id: 'fond', label: 'Fond péda' },
        { id: 'forme', label: 'Forme' },
        { id: 'design', label: 'Design' },
        { id: 'print', label: 'Print' },
        { id: 'site', label: 'Site' }
    ];
    
    container.innerHTML = passes.map((p, i) => 
        `<span class="legend-item"><span class="legend-num">${i+1}.</span> <span class="legend-label">${p.label}</span></span>`
    ).join('');
}

/**
 * Affiche les items groupés par type
 */
function renderItems(items) {
    const container = document.getElementById('paquets-container');
    
    // Grouper par type
    const groups = {
        affiche: { emoji: '📌', label: 'Affiches & Mémos', items: [] },
        role: { emoji: '🧭', label: 'Cartes Rôles', items: [] },
        moment: { emoji: '📅', label: 'Cartes Moments', items: [] },
        sos: { emoji: '🆘', label: 'Cartes SOS', items: [] }
    };
    
    for (const item of items) {
        const type = getType(item.id);
        if (groups[type]) {
            groups[type].items.push(item);
        }
    }
    
    // Générer HTML
    let html = '';
    for (const [type, group] of Object.entries(groups)) {
        if (group.items.length === 0) continue;
        
        html += `
        <div class="paquet-card" data-type="${type}">
            <div class="paquet-header" onclick="togglePaquet(this)">
                <div class="paquet-title">
                    <span class="paquet-emoji">${group.emoji}</span>
                    <span>${group.label}</span>
                    <span class="paquet-count">(${group.items.length})</span>
                </div>
                <div class="paquet-actions">
                    <button class="paquet-notes-btn" onclick="event.stopPropagation(); openNotes('${type}')">📝 Notes</button>
                    <span class="paquet-toggle">▼</span>
                </div>
            </div>
            <div class="paquet-body">
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Élément</th>
                            <th>Fond</th>
                            <th>Forme</th>
                            <th>Design</th>
                            <th>Print</th>
                            <th>Site</th>
                            <th class="comment-col">Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${group.items.map(item => `
                        <tr>
                            <td>
                                <span class="item-title">${item.id}</span>
                                <span class="item-subtitle">${item.title}</span>
                            </td>
                            <td class="status-cell">${statusIcon(item.passes.fond)}</td>
                            <td class="status-cell">${statusIcon(item.passes.forme)}</td>
                            <td class="status-cell">${statusIcon(item.passes.design)}</td>
                            <td class="status-cell">${statusIcon(item.passes.print)}</td>
                            <td class="status-cell">${statusIcon(item.passes.site)}</td>
                            <td class="comment-cell">${item.comment}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    }
    
    container.innerHTML = html;
}

/**
 * Convertit statut en icône
 */
function statusIcon(status) {
    if (status === 'done') return '✅';
    if (status === 'wip') return '🔄';
    return '⬜';
}

/**
 * Affiche les actions hors-digital
 */
function renderAside(aside) {
    const container = document.getElementById('aside-list');
    
    container.innerHTML = aside.map(item => `
        <li class="aside-item">
            <span class="aside-checkbox">${item.done ? '✅' : '⬜'}</span>
            <span class="aside-label">${item.label}</span>
            ${item.note ? `<span class="aside-note">${item.note}</span>` : ''}
        </li>
    `).join('');
}

/**
 * Charge et affiche les retours & mémos
 */
async function renderRetours() {
    const container = document.getElementById('retours-container');
    
    try {
        const response = await fetch('sources/suivi/retours_et_memos.md');
        if (!response.ok) throw new Error('Fichier non trouvé');
        const md = await response.text();
        
        // Extraire la section "À traiter" (entre "## À traiter" et "## Traité")
        const aTraiterMatch = md.match(/## À traiter([\s\S]*?)(?=\n## Traité|$)/);
        const traiteMatch = md.match(/## Traité([\s\S]*?)(?=\n## |$)/);
        
        let aTraiterContent = aTraiterMatch ? aTraiterMatch[1].trim() : '';
        let traiteContent = traiteMatch ? traiteMatch[1].trim() : '';
        
        // Nettoyer les commentaires HTML
        aTraiterContent = aTraiterContent.replace(/<!--[\s\S]*?-->/g, '').trim();
        traiteContent = traiteContent.replace(/<!--[\s\S]*?-->/g, '').trim();
        
        // Si vide, afficher message
        const hasATraiter = aTraiterContent && !aTraiterContent.startsWith('---');
        const hasTraite = traiteContent && !traiteContent.startsWith('---');
        
        let html = '';
        
        if (hasATraiter) {
            html += `<div class="retours-section retours-a-traiter">
                <h3>📥 À traiter</h3>
                <div class="retours-content">${marked.parse(aTraiterContent)}</div>
            </div>`;
        }
        
        if (hasTraite) {
            html += `<div class="retours-section retours-traite">
                <h3>✅ Traité</h3>
                <div class="retours-content">${marked.parse(traiteContent)}</div>
            </div>`;
        }
        
        if (!hasATraiter && !hasTraite) {
            html = '<p class="retours-empty">Aucun retour en attente 🎉</p>';
        }
        
        container.innerHTML = html;
        
    } catch (error) {
        container.innerHTML = `<p class="error">Erreur : ${error.message}</p>`;
    }
}

/**
 * Toggle accordion paquet (un seul ouvert à la fois)
 */
function togglePaquet(el) {
    const card = el.closest('.paquet-card');
    const isOpen = card.classList.contains('open');
    
    // Fermer tous les autres
    document.querySelectorAll('.paquet-card.open').forEach(c => {
        c.classList.remove('open');
    });
    
    // Ouvrir celui-ci (sauf s'il était déjà ouvert)
    if (!isOpen) {
        card.classList.add('open');
    }
}

/**
 * Setup modale
 */
function setupModal() {
    const modal = document.getElementById('notes-modal');
    const backdrop = modal.querySelector('.modal-backdrop');
    const closeBtn = modal.querySelector('.modal-close');
    
    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/**
 * Ouvre la modale avec les notes d'un paquet
 */
async function openNotes(type) {
    const modal = document.getElementById('notes-modal');
    const body = document.getElementById('notes-modal-body');
    const file = NOTES_FILES[type];
    
    if (!file) return;
    
    modal.classList.add('open');
    body.innerHTML = '<p class="loading">Chargement...</p>';
    
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Fichier non trouvé');
        const md = await response.text();
        
        // Parser avec marked.js si disponible, sinon afficher brut
        if (typeof marked !== 'undefined') {
            body.innerHTML = marked.parse(md);
        } else {
            body.innerHTML = `<pre>${md}</pre>`;
        }
    } catch (error) {
        body.innerHTML = `<p class="error">Erreur : ${error.message}</p>`;
    }
}

/**
 * Ferme la modale
 */
function closeModal() {
    const modal = document.getElementById('notes-modal');
    modal.classList.remove('open');
}
