# TECH INTENTIONS - ANACOLUTHE

Référence unique pour les décisions techniques, l'architecture et les conventions du projet.

---

## 🎯 Philosophie technique

### Principe directeur

**Légèreté maximale** : le site doit fonctionner sur mobile en réseau dégradé (bateaux, zones côtières). Chaque KB compte.

### Ce qu'on privilégie

| Principe | Traduction |
|----------|------------|
| **Vanilla first** | JS/CSS natifs, pas de frameworks |
| **Statique** | GitHub Pages, pas de backend |
| **Cacheable** | Fichiers séparés, versions stables |
| **Maintenable** | Code lisible > code minifié |
| **Progressive** | Fonctionne sans JS (contenu lisible) |

### Ce qu'on évite

- ❌ Frameworks JS (React, Vue, etc.)
- ❌ Bundlers (webpack, vite, etc.)
- ❌ CSS-in-JS
- ❌ Dépendances npm côté client
- ❌ Backend / base de données
- ❌ Minification (gzip GitHub Pages suffit)

---

## 🧠 Méthode de développement

### Principes directeurs

Ces principes réduisent les erreurs courantes de développement et garantissent un code maintenable.

**Trade-off** : Ces règles favorisent la prudence sur la vitesse. Pour les tâches triviales, utiliser son jugement.

### 1. Réfléchir avant coder

**Ne pas supposer. Ne pas cacher la confusion. Exposer les arbitrages.**

| Avant d'implémenter | Action |
|---------------------|--------|
| **Assumptions** | Les énoncer explicitement. Si incertain, demander. |
| **Interprétations multiples** | Les présenter, ne pas choisir silencieusement. |
| **Approche plus simple** | La mentionner. Contester quand justifié. |
| **Quelque chose n'est pas clair** | S'arrêter. Nommer ce qui est confus. Demander. |

### 2. Simplicité d'abord

**Code minimum qui résout le problème. Rien de spéculatif.**

| Ce qu'on évite | Raison |
|----------------|--------|
| ❌ Fonctionnalités non demandées | YAGNI |
| ❌ Abstractions pour usage unique | Premature abstraction |
| ❌ Flexibilité non demandée | Configuration inutile |
| ❌ Gestion d'erreurs pour scénarios impossibles | Overhead inutile |

**Question test** : "Une personne senior dirait-elle que c'est sur-compliqué ?" Si oui, simplifier.

Si vous écrivez 200 lignes alors que 50 suffisent, réécrire.

### 3. Changements chirurgicaux

**Toucher uniquement ce qui est nécessaire. Nettoyer uniquement ses propres dégâts.**

#### En modifiant du code existant

| Action | Justification |
|--------|---------------|
| ✅ Modifier uniquement ce qui concerne la demande | Changements ciblés |
| ❌ "Améliorer" le code adjacent | Scope creep |
| ❌ Refactoriser ce qui fonctionne | Risque inutile |
| ✅ Respecter le style existant | Cohérence |
| ✅ Mentionner le dead code pré-existant | Ne pas le supprimer sauf demande |

#### Quand vos changements créent des orphelins

| Action | Exemple |
|--------|---------|
| ✅ Supprimer imports/variables/fonctions rendus inutiles PAR vos changements | `import X` non utilisé suite à votre refactor |
| ❌ Supprimer dead code pré-existant | Laisser ou mentionner |

**Test** : Chaque ligne modifiée doit tracer directement vers la demande de l'utilisateur.

### 4. Exécution orientée objectifs

**Définir critères de succès. Boucler jusqu'à vérification.**

#### Transformer tâches en objectifs vérifiables

| Tâche | Objectif vérifiable |
|-------|---------------------|
| "Ajouter validation" | Écrire tests pour inputs invalides, puis les faire passer |
| "Corriger le bug" | Écrire test qui reproduit, puis le faire passer |
| "Refactoriser X" | S'assurer que tests passent avant ET après |

#### Pour tâches multi-étapes

Énoncer plan bref avec vérifications :

```
1. [Étape] → vérifier : [check]
2. [Étape] → vérifier : [check]
3. [Étape] → vérifier : [check]
```

**Bons critères** : permettent de boucler en autonomie.
**Mauvais critères** : "faire marcher" → nécessitent clarifications constantes.

### Indicateurs de succès

Ces guidelines fonctionnent si :
- Moins de changements inutiles dans les diffs
- Moins de réécriture due à sur-complication
- Questions de clarification AVANT implémentation (pas après erreurs)

---

## 🏗️ Stack technique

### Hébergement

| Élément | Choix | Raison |
|---------|-------|--------|
| **Hosting** | GitHub Pages | Gratuit, CDN, HTTPS auto |
| **Domaine** | github.io (pour l'instant) | Simplicité |
| **CI/CD** | Aucun | Déploiement = push sur main |

### Frontend

| Élément | Choix | Raison |
|---------|-------|--------|
| **JS** | Vanilla ES6+ | Pas de build, cacheable |
| **CSS** | Vanilla + variables CSS | Maintenable, pas de préprocesseur |
| **HTML** | Statique | SEO, accessibilité |
| **Fonts** | Google Fonts (Merriweather) | CDN, cache longue durée |

### Dépendances externes (CDN)

| Lib | Version | Usage | Taille |
|-----|---------|-------|--------|
| **marked.js** | latest | Parsing markdown → HTML | ~30 KB |
| **Twemoji** | latest | Emojis SVG (print uniquement) | ~10 KB |

### Outils de développement (hors site)

| Outil | Usage |
|-------|-------|
| **Puppeteer** | Génération PDF (local) |
| **pdf-lib** | Fusion pages PDF |
| **GitHub Desktop** | Commits (Quentin) |

---

## 🖨️ Génération PDF

### Script principal

`scripts/render-cards.js` - Génère les PDFs A6 individuels via Puppeteer.

**Principe** : Utilise `print-render.html` comme source unique de vérité (WYSIWYG). Ce qui est affiché dans le navigateur = ce qui est imprimé.

### Commandes

```bash
# Générer toutes les cartes
npm run render

# Filtrer par type
npm run render -- roles
npm run render -- moments
npm run render -- joker
npm run render -- affiches

# Mode debug (screenshots + logs détaillés)
DEBUG=true npm run render
```

### Output

```
print/cartes/
├── R1_bosco.pdf              # Carte normale
├── A2_tableau_memo_overflow.pdf  # Contenu trop long
└── ...
```

### Suffixe `_overflow`

Quand le contenu déborde même à la taille de police minimum (6pt), le PDF est renommé avec le suffixe `_overflow`. Cela signale que **le contenu markdown doit être raccourci** - ce n'est pas un problème technique.

| Cas | Nom fichier | Action |
|-----|-------------|--------|
| Contenu OK | `R1_bosco.pdf` | ✅ Rien |
| Contenu trop long | `A2_tableau_memo_overflow.pdf` | ✏️ Raccourcir le .md |

### Auto-fit

Le système ajuste automatiquement la taille de police pour faire tenir le contenu :

| Paramètre | Valeur | Variable CSS |
|-----------|--------|---------------|
| **Taille max** | 11pt | `--print-font-size-max` |
| **Taille min** | 5.5pt | `--print-font-size-min` |
| **Pas** | 0.1pt | `--print-font-size-step` |

Logique centralisée dans `markdown-utils.js` → fonction `autoFit()` utilisée par `afficheur-cartes.js` et `print-render.js`.

Si le contenu déborde encore à 5.5pt → suffixe `_overflow`.

### Mode DEBUG

Activé via `DEBUG=true`, affiche pour chaque carte :

- Dimensions (body, card, content)
- Typographie (font-size, line-height, fonts chargées)
- Détection overflow (avec pixels de dépassement)
- Screenshots dans `print/debug-{cardId}-{face}.png`
- Logs console de la page
- Temps de rendu

Résumé final :
```
🔍 ===== DEBUG: RÉSUMÉ =====
   Cartes traitées: 18
   ✅ Succès: 17
   ⚠️  Overflow: 1
   ❌ Échecs: 0
   
   🚨 Cartes avec overflow persistant (1):
      - A2_tableau_memo_overflow.pdf
```

---

## 📁 Architecture des fichiers

```
Anacoluthe/
├── index.html              # Page d'accueil
├── anacoluthe.html         # Galerie des cartes (jeu)
├── fil-semaine.html        # Déroulé de la semaine
├── ensavoirplus.html       # Contexte et objectifs
├── afficheur-cartes.html   # Atelier prévisualisation/PDF
├── print-render.html       # Page Puppeteer (génération PDF)
├── manifest.json           # PWA : métadonnées app
├── sw.js                   # PWA : service worker (cache)
│
├── assets/
│   ├── css/
│   │   ├── style.css           # Variables + styles communs
│   │   ├── cards.css           # Tuiles + modales (web)
│   │   ├── cards-print.css     # Styles impression A6
│   │   └── fil-semaine.css     # Page fil de la semaine
│   │
│   ├── js/
│   │   ├── markdown-utils.js   # Fonctions partagées parsing MD
│   │   ├── cards-loader.js     # Galerie anacoluthe.html
│   │   ├── afficheur-cartes.js # Atelier prévisualisation
│   │   ├── print-render.js     # Rendu Puppeteer
│   │   ├── pwa-status.js       # PWA : status, install button
│   │   ├── home.js             # Aperçu aléatoire cartes accueil
│   │   ├── fil-semaine.js      # Navigation slider fil-semaine
│   │   ├── scroll-spy.js       # Scroll spy ensavoirplus
│   │   ├── external-links.js   # Liens externes nouvel onglet
│   │   └── vendor/
│   │       └── marked.min.js   # Parser markdown (local PWA)
│   │
│   ├── data/
│   │   └── cards-index.json    # Index des cartes (métadonnées)
│   │
│   └── images/
│       └── logo-anacoluthe.svg
│
├── sources/
│   ├── cartes/                 # Contenu markdown des cartes
│   │   ├── roles/
│   │   ├── moments/
│   │   ├── joker/
│   │   └── affiches/
│   │
│   └── documentation/          # Docs projet
│       ├── DESIGN_INTENTIONS.md
│       ├── TECH_INTENTIONS.md      # ← Ce fichier
│       ├── CARTES_*_INTENTIONS.md
│       └── work-in-progress/
│
├── print/                      # PDFs générés (hors Git)
│
└── archives/                   # Versions obsolètes (V4, etc.)
```

---

## 🔧 Architecture JavaScript

### Principe : modules séparés, pas de bundling

Chaque fichier JS a une responsabilité claire. Pas de bundling = cache navigateur optimal.

### Fichiers et responsabilités

| Fichier | Responsabilité | Dépendances |
|---------|----------------|-------------|
| `markdown-utils.js` | Parsing MD, marqueurs, nav sections, auto-fit | marked.js |
| `cards-loader.js` | Galerie, filtres, modale | markdown-utils.js |
| `afficheur-cartes.js` | Prévisualisation multi-vues | markdown-utils.js |
| `print-render.js` | Rendu minimaliste Puppeteer | markdown-utils.js |
| `pwa-status.js` | PWA : status online/offline, install button | - |
| `home.js` | Aperçu aléatoire cartes page accueil | - |
| `fil-semaine.js` | Navigation slider + scroll spy fil-semaine | - |
| `scroll-spy.js` | Scroll spy page ensavoirplus | - |
| `external-links.js` | Liens externes en nouvel onglet | - |

### Fonctions partagées (markdown-utils.js)

```javascript
configureMarked()           // Config marked.js standard
preprocessMarkdownMarkers() // Traite FLIP pour web/print
wrapSkipBlocks()           // Wrappe SKIP-PRINT/SKIP-WEB en divs
parseCardContent()         // Sépare HEAD du body
generateSectionNav()       // Nav H2 + scroll spy
applyTwemoji()             // Conversion emojis → SVG
autoFit()                  // Ajustement auto taille police (print)
```

### Chargement des scripts

```html
<!-- Ordre : dépendances externes → utils → logique page -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="assets/js/markdown-utils.js"></script>
<script src="assets/js/cards-loader.js"></script>
```

Pas de `type="module"` pour l'instant (compatibilité), mais architecture prête pour ES6 modules si besoin.

---

## 📝 Conventions de code

### JavaScript

| Convention | Exemple |
|------------|---------|
| **Nommage** | camelCase pour fonctions/variables |
| **Fonctions** | Verbes (`loadCard`, `renderView`) |
| **Async** | async/await (pas de callbacks) |
| **DOM** | getElementById, querySelector |
| **Commentaires** | JSDoc pour fonctions exportées |

### CSS

| Convention | Exemple |
|------------|---------|
| **Nommage** | kebab-case (`.card-tile-header`) |
| **Variables** | `--nom-semantique` (`--teal-700`) |
| **Organisation** | Par composant, commentaires sections |
| **Unités** | `rem`/`em` web, `mm`/`pt` print |

### HTML

| Convention | Exemple |
|------------|---------|
| **IDs** | kebab-case (`card-select`) |
| **Classes** | BEM-like (`card-tile-tags-title`) |
| **Attributs data** | `data-card-id`, `data-type` |

### Markdown (contenu cartes)

Voir DESIGN_INTENTIONS.md pour les marqueurs (`<!-- HEAD -->`, `<!-- FLIP -->`, etc.)

---

## ✍️ Conventions d'écriture

### Tirets - CRITIQUE

```
❌ Jamais : — (cadratin) ou – (demi-cadratin)
✅ Toujours : - (tiret simple, touche clavier)
Tirets seulement pour lancer une liste à points. Sinon, si des tirets sont utilisés, le texte semble écrit avec IA, même quand c'est pas le cas.
```

Raison : accessibilité clavier, cohérence, parsing fiable.

### Écriture inclusive

| Forme | Exemple |
|-------|---------|
| **Point médian** | `le·la mono`, `chacun·e` |
| **Néologismes** | `navigateurice`, `moniteurice` |
| **Pronom neutre** | `iel` |

Tiret simple pour le point médian : `·` (pas `•`).

### Titres markdown

```markdown
❌ # **Titre en gras**
✅ # Titre simple
```

Le CSS gère le gras des titres.

---

## 🔄 Workflow Git

### Branches

| Branche | Usage |
|---------|-------|
| `main` | Production (GitHub Pages) |
| `dev` | Développement (si besoin) |

Pour l'instant, travail direct sur `main` (projet solo).

### Commits

| Type | Format |
|------|--------|
| **Feature** | `feat: description` |
| **Fix** | `fix: description` |
| **Refactor** | `refactor: description` |
| **Docs** | `docs: description` |
| **Style** | `style: description` |

Exemple : `refactor: extraction JS inline vers fichiers séparés`

### Workflow quotidien

1. Modifications locales (VS Code / Claude)
2. Test navigateur local
3. Commit via GitHub Desktop (Quentin)
4. Push → déploiement auto GitHub Pages

---

## 🏷️ Versionnage

### Documents fonctionnels (cartes, affiches)

Footer avec date : `V_AAMMJJ`

```markdown
---
*Version : V_251206*
```

### Fichiers sources (code, docs techniques)

Pas de version dans le fichier. Git fait foi.

### Format date

`AAMMJJ` ou `AAMMJJH` si plusieurs versions/jour.

Exemple : `251206` = 6 décembre 2025

---

## 📊 Métriques de référence

### Tailles fichiers (décembre 2025)

| Catégorie | Fichiers | Total |
|-----------|----------|-------|
| **CSS** | 4 fichiers | ~111 KB |
| **JS** | 9 fichiers | ~71 KB |
| **JS vendor** | 1 fichier | ~39 KB |
| **HTML** | 6 pages | ~100 KB |
| **Total statique** | - | ~320 KB |

Avec gzip GitHub Pages : ~80 KB transférés.

### Performance cible

| Métrique | Cible |
|----------|-------|
| **First paint** | < 1s (3G) |
| **Interactive** | < 2s (3G) |
| **Lighthouse perf** | > 90 |

---

## 🧭 Décisions et raisons

### Pourquoi pas de framework JS ?

- Taille : React = 40+ KB, Vue = 30+ KB (avant le code app)
- Complexité : build step, node_modules
- Durabilité : vanilla JS fonctionne dans 10 ans
- Contexte : site de contenu, pas d'app complexe

### Pourquoi pas de minification ?

- Gzip GitHub Pages compresse déjà à ~75%
- Gain minif+gzip vs gzip seul : ~8 KB sur 72 KB
- Code lisible = debug et maintenance plus faciles
- Pas de build step = workflow simple

### Pourquoi Twemoji seulement en print ?

- **Web** : emojis natifs (0 KB, rendu OS)
- **Print** : Twemoji SVG (rendu identique cross-platform pour PDF)

### Pourquoi marked.js ?

- Léger (~30 KB)
- Pas de dépendances
- Extensible (custom renderers si besoin)
- Bien maintenu

### Pourquoi pas de localStorage ?

- Contenu public, pas de personnalisation
- Pas de compte utilisateur
- Stateless = simple

---

## 🔮 Évolutions possibles

### Si le projet grossit

| Besoin | Solution envisagée |
|--------|-------------------|
| **Plus de JS** | ES6 modules natifs (`type="module"`) |
| **Tests** | Playwright pour tests E2E |
| **PWA** | ✅ Implémenté (voir section dédiée) |
| **i18n** | Fichiers JSON par langue |

### Ce qu'on ne fera probablement pas

- Migration vers framework JS
- Backend / API
- Base de données
- Authentification

---

## 📱 PWA (Progressive Web App)

### Objectif

Permettre l'utilisation hors-ligne en mer. Les utilisateurs installent l'app au port (avec réseau), puis l'utilisent toute la semaine sans connexion.

### Fichiers

| Fichier | Rôle |
|---------|------|
| `manifest.json` | Métadonnées app (nom, icônes, couleurs) |
| `sw.js` | Service Worker (cache, offline) |
| `assets/js/pwa-status.js` | UI status (online/offline, install button) |

### Stratégie de cache

**Cache-first** : le service worker sert le cache en priorité, puis met à jour en arrière-plan.

```javascript
// Ressources cachées au premier chargement
const CACHE_FILES = [
    '/',
    '/index.html',
    '/anacoluthe.html',
    '/assets/css/style.css',
    '/assets/css/cards.css',
    '/assets/js/*.js',
    '/assets/data/cards-index.json',
    '/sources/cartes/**/*.md',
    // etc.
];
```

### Bouton d'installation

Deux approches combinées :

| Méthode | Comportement |
|---------|-------------|
| **Passive** | Le navigateur propose automatiquement l'installation |
| **Active** | Bouton "Installer Anacoluthe" déclenchant le prompt |

**Implémentation du bouton** :

```javascript
// Capture du prompt (avant qu'il s'affiche)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredInstallPrompt = e;
    showInstallButton();  // Affiche notre bouton custom
});

// Clic sur le bouton
async function handleInstallClick() {
    state.deferredInstallPrompt.prompt();  // Déclenche le prompt natif
    const { outcome } = await state.deferredInstallPrompt.userChoice;
    state.deferredInstallPrompt = null;
    hideInstallButton();
}
```

### Compatibilité navigateurs

| Navigateur | `beforeinstallprompt` | Installation |
|------------|----------------------|---------------|
| **Chrome/Edge** | ✅ Oui | Bouton custom + prompt |
| **Firefox** | ❌ Non | Menu navigateur (manuel) |
| **Safari iOS** | ❌ Non | Partager → "Sur l'écran d'accueil" |

Le bouton reste masqué sur Firefox/Safari (graceful degradation).

### Meta tags PWA

```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#0B4F6C">
<meta name="mobile-web-app-capable" content="yes">         <!-- Standard -->
<meta name="apple-mobile-web-app-capable" content="yes">   <!-- Safari iOS -->
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Anacoluthe">
<link rel="apple-touch-icon" href="assets/images/icon-192.png">
```

### UI Status

- **Indicateur online/offline** : pastille colorée dans le header
- **Toast mise à jour** : notification quand nouveau contenu disponible
- **Bouton refresh** : force la mise à jour du cache

---

*Document créé le 6 décembre 2025 - Mis à jour le 30 janvier 2026*
*Anacoluthe V5 - CC-BY-NC-SA*
