# ENTRETIEN CODE - ANACOLUTHE

Audit technique complet HTML/CSS/JS. Mise à jour : 2026-03-16.
Précédent audit : 2026-01-20 (phases 1-2 corrigées).

---

## Résumé exécutif

| Domaine | Score | Constats |
|---------|-------|----------|
| **HTML** | 6/10 | Footer dupliqué 9x, incohérences meta PWA, styles inline |
| **CSS** | 7/10 | ~55 !important, 290 couleurs hardcodées, cascade fragile |
| **JS Architecture** | 6/10 | Scope global pollué, collisions de noms, pas de modules ES |
| **JS Sécurité** | 7.5/10 | innerHTML partout, XSS potentiels sur données JSON |
| **Pipeline PDF** | 8/10 | Phases 1-2 corrigées, robuste |
| **Service Worker** | 7/10 | skipWaiting agressif, précache incomplet |

---

## 1. HTML - Anomalies structurelles

### 1.1 Critiques

| # | Problème | Fichiers | Action |
|---|----------|----------|--------|
| H1 | **Footer copié-collé dans 9 fichiers** avec variations (V5/pas V5, liens différents, "Dernier commit : décembre 2025" en dur). Impossible à maintenir. | Tous les .html | Extraire dans un composant JS ou un include côté build |
| H2 | **`decouvrir.html` a ~85 lignes de CSS inline** dans un `<style>` en `<head>`. Seule page avec ce pattern. | decouvrir.html | Extraire dans un fichier CSS dédié |
| H3 | **`marked.js` chargé de 2 sources différentes** : locale (`vendor/marked.min.js`) sur anacoluthe.html, fil-semaine.html, afficheur-cartes.html ; CDN (`cdn.jsdelivr.net`) sur suivi.html et print-render.html. Casse la PWA hors-ligne pour suivi.html. | suivi.html, print-render.html | Unifier vers la version locale |

### 1.2 Importants

| # | Problème | Fichiers | Action |
|---|----------|----------|--------|
| H4 | **Meta PWA incomplètes** : `decouvrir.html` et `suivi.html` n'ont pas `viewport-fit=cover`, `mobile-web-app-capable`, `manifest.json`, `apple-touch-icon`. | decouvrir.html, suivi.html | Harmoniser le `<head>` PWA |
| H5 | **Header structuré différemment** selon les pages : `h1 > a` (ensavoirplus.html), `a > h1` (anacoluthe.html, suivi.html), `h1` direct (index.html). Impact SEO et accessibilité. | Plusieurs | Adopter un seul pattern (ex: `a > h1`) |
| H6 | **`target="_blank"` sans `rel="noopener noreferrer"`** dans le HTML statique. C'est corrigé par external-links.js pour les liens http, mais les 26 liens `target="_blank"` internes de fil-semaine.html (vers anacoluthe.html?card=XX) ne bénéficient pas de ce fix car ce ne sont pas des liens externes. | fil-semaine.html | Retirer `target="_blank"` (la modale intercepte déjà les clics) |
| H7 | **Twemoji chargé de 2 façons** : CDN direct bloquant (`<script src="cdn...">`) dans afficheur-cartes.html et print-render.html ; lazy load non-bloquant (twemoji-init.js) dans les autres pages. | afficheur-cartes.html, print-render.html, print-render-a4.html | Acceptable pour print (Puppeteer doit attendre), mais documenter le pourquoi |
| H8 | **`onclick` inline** dans le HTML (4 occurrences) pour `closeModal()`. Mélange de paradigmes : le reste utilise addEventListener. | anacoluthe.html, fil-semaine.html | Migrer vers addEventListener dans cards-loader.js |

### 1.3 Mineurs

- `decouvrir.html` titre = "Présentations" mais le nom de fichier évoque "découvrir". Confusion possible.
- Attribut `<meta name="mobile-web-app-capable">` sur certaines pages, `apple-mobile-web-app-capable` sur d'autres (afficheur-cartes.html). Ce sont deux attributs différents.
- Espace dans le nom de fichier `Logo _anacoluthe_720.jpg` (espace + underscore).

### 1.4 Points positifs HTML

- DOCTYPE, lang, charset, viewport présents partout
- Bonne sémantique (header, main, footer, section, nav, article)
- Attributs `aria-label` sur les boutons de fermeture
- Structure claire et lisible

---

## 2. CSS - Anomalies

### 2.1 Critiques (restants du précédent audit)

| # | Problème | Fichiers | Action |
|---|----------|----------|--------|
| C4 | **Breakpoints convention documentée** (768/1024) mais pas systématiquement respectée dans fil-semaine.css (utilise 769px) | fil-semaine.css:73 | Harmoniser à 768px |

### 2.2 Importants

| # | Problème | Fichiers | Action |
|---|----------|----------|--------|
| I1 | **~55 `!important`** dans le code projet (hors vendor). Signe de cascade fragile. Concentrés dans : style.css (17), fil-semaine.css (12), afficheur-cartes.css (15), cards.css (9). | Plusieurs | Refactoriser la spécificité plutôt que forcer |
| I2 | **290 couleurs hex hardcodées** dans les CSS. Beaucoup sont des variantes de couleurs déjà en variables. Ex: `.accent-brick { color: #C62828 }` alors que `--brick-700: #C62828` existe. | style.css:139, cards.css passim | Utiliser systématiquement les variables |
| I3 | **`border: none !important; border-bottom: none !important;`** : doublon redondant toujours présent (I6 du précédent audit). `border: none` inclut déjà border-bottom. | style.css:1909-1917 | Supprimer les `border-bottom: none` redondants |
| I4 | **@import Google Fonts dans 4 fichiers CSS** avec des weight sets différents. Bloque le rendu (render-blocking). | style.css, cards-print.css, affiches-print.css, anacoluthe-theme.css | Unifier dans un seul `<link>` dans le HTML, supprimer les @import |
| I5 | **Font loading doublé** : afficheur-cartes.html charge les fonts via `<link>` en HTML ET via `@import` dans style.css. Double requête réseau. | afficheur-cartes.html:17-19 | Supprimer le `<link>` (style.css le fait déjà) |
| I6 | **Pas de variables pour les navy** : `#1E3A5F` et `#C9D5E3` apparaissent dans style.css mais ne sont pas des variables CSS. | style.css | Créer `--navy-700`, `--navy-100` |

### 2.3 Mineurs (restants + nouveaux)

- Patterns `.footer-nav-link.accent-*` très répétitifs (8 déclinaisons, ~80 lignes) : utiliser une custom property `--accent-color`
- Variables `--shadow-*` pour les magic numbers de box-shadow toujours manquantes
- `.badge-proto` possiblement obsolète (aucune carte n'est en proto dans cards-index.json actuellement)
- `cards.css` header commentaire date "V251204" obsolète

### 2.4 Points positifs CSS

- Variables CSS bien structurées dans `:root`
- Sections commentées clairement avec des blocs `=====`
- Convention de breakpoints documentée en tête de style.css
- Fichiers print autonomes et bien isolés
- Support PWA avec safe-area-inset
- Fallbacks dvh/vh corrects

---

## 3. JavaScript - Architecture et qualité

### 3.1 Critiques

| # | Problème | Fichiers | Action |
|---|----------|----------|--------|
| J1 | **Collisions de noms globaux** : `cardsData` est déclaré en global dans home.js ET cards-loader.js. `closeModal()` existe dans cards-loader.js ET suivi-loader.js. `init()` dans afficheur-cartes.js, print-render.js, print-render-a4.js. Si deux scripts sont chargés ensemble, l'un écrase l'autre silencieusement. | home.js, cards-loader.js, suivi-loader.js | Encapsuler chaque fichier dans une IIFE ou migrer vers des modules ES |
| J2 | **Scope global pollué** : 30+ fonctions et 10+ variables déclarées directement dans le scope global. Aucun script n'utilise `type="module"`. | Tous les JS | Migrer progressivement vers des modules ES (`type="module"` dans le HTML) |

### 3.2 Importants - Sécurité

| # | Problème | Fichiers | Action |
|---|----------|----------|--------|
| J3 | **innerHTML avec données JSON non échappées** : `createCardTile()` et `updatePreview()` injectent `card.title`, `card.subtitle`, `card.tags[]` directement dans innerHTML via template literals. Si le JSON est compromis (ex: contribution malveillante), c'est un vecteur XSS. | cards-loader.js:120-136, home.js:82-85 | Utiliser textContent ou échapper le HTML |
| J4 | **`showError(message)` injecte directement dans innerHTML** sans échappement dans 2 fichiers. | cards-loader.js:363, afficheur-cartes.js:923 | Utiliser textContent |
| J5 | **`renderRetours()` et `openNotes()` injectent du markdown parsé** (`marked.parse(md)`) dans innerHTML. Le markdown vient de fichiers du repo (faible risque) mais la surface d'attaque existe si le repo est forké. | suivi-loader.js:402, 478 | Acceptable pour l'instant (source de confiance), documenter le risque |

### 3.3 Importants - Qualité

| # | Problème | Fichiers | Action |
|---|----------|----------|--------|
| J6 | **IntersectionObserver jamais déconnecté** dans `generateSectionNav()`. A chaque ouverture de modale, un nouvel observer est créé mais jamais `disconnect()`. Fuite mémoire progressive. | markdown-utils.js:263-278 | Stocker la ref de l'observer, le disconnect quand la modale ferme |
| J7 | **Event listeners dupliqués** : `setupModeButtons()` ajoute des `addEventListener('click')` à chaque appel. Elle est rappelée à chaque changement de carte via `onCardChange()`. Les handlers s'accumulent. | afficheur-cartes.js:146, 276 | Ajouter les listeners une seule fois dans init(), ou retirer les anciens |
| J8 | **`async` inutile** sur `renderWebView()` et `renderMobileView()` qui n'utilisent pas `await`. Suggère une intention non terminée ou un oubli. | afficheur-cartes.js:721, 733 | Retirer `async` ou ajouter le `await` manquant |
| J9 | **`@latest` dans les CDN Twemoji** : `twemoji.min.js` est chargé sans version pinée. Un breaking change upstream peut casser la prod sans prévenir. | twemoji-init.js:11, afficheur-cartes.html:33, print-render.html:12, print-render-a4.html:12 | Piner une version spécifique |
| J10 | **Regex O(n²) dans `wrapSkipMarker()`** : la boucle `while (match)` avec `lastIndex = 0` reconstruit la string à chaque itération et recommence le scan depuis le début. | markdown-utils.js:127-164 | Remplacer par un algorithme en un seul pass |

### 3.4 Mineurs

- `home.js` ne gère pas le cas où le fetch échoue de façon visible (console.error seulement, pas de fallback UI)
- `external-links.js` ne gère que les liens présents au DOMContentLoaded, pas ceux ajoutés dynamiquement (les modales sont gérées séparément dans cards-loader.js:267)
- `scroll-spy.js` utilise `window.addEventListener('scroll')` sans throttle/debounce (performance sur mobile)
- `twemoji-init.js` utilise `var` au lieu de `const/let` (mineur, dans une IIFE)

### 3.5 Points positifs JS

- Try-catch systématique dans les fonctions async
- IIFE pour pwa-status.js (bon pattern d'isolation)
- Module markdown-utils.js bien conçu avec export conditionnel (browser/node)
- Auto-détection du mode dans cards-loader.js (galerie vs modal-only)
- Cache-busting disponible dans l'afficheur
- Fallback gracieux partout (erreurs affichées, pas de crash silencieux)

---

## 4. Service Worker

### 4.1 Importants

| # | Problème | Action |
|---|----------|--------|
| SW1 | **`self.skipWaiting()` dans l'event install** : force l'activation immédiate. Si la nouvelle version du SW est incompatible avec le cache existant, les pages ouvertes peuvent casser. | Retirer skipWaiting de install, le garder uniquement sur message SKIP_WAITING |
| SW2 | **Pages manquantes dans le précache** : `decouvrir.html`, `suivi.html`, `print-render.html`, `print-render-a4.html`, `suivi.css`, `afficheur-cartes.css`, `affiches-print.css`, `lightbox.js`, `twemoji-init.js` ne sont pas dans PRECACHE_URLS. | Ajouter les ressources manquantes |
| SW3 | **suivi.html charge marked.js depuis le CDN** (pas le vendor local). Hors-ligne, la page de suivi ne fonctionnera pas car le CDN sera inaccessible et le fichier n'est pas précaché. | Utiliser la version locale |
| SW4 | **Pas de versioning des assets** : si un fichier CSS/JS change mais que CACHE_VERSION n'est pas incrémenté, l'ancien cache est servi (stale-while-revalidate met à jour en background, mais la première visite post-déploiement montre l'ancien). | Documenter la procédure de bump de CACHE_VERSION dans TECH_INTENTIONS |

### 4.2 Points positifs Service Worker

- Stratégie cache-first cohérente pour une PWA utilisée en mer
- Nettoyage des anciens caches à l'activation
- Messages bidirectionnels (GET_VERSION, FORCE_UPDATE, UPDATE_COMPLETE)
- Fallback réseau pour les CDN externes
- Gestion propre de FORCE_UPDATE avec cache-busting

---

## 5. Correctifs du précédent audit (260120)

### Phase 1 - Critique ✅ Fait

1. [x] C1 : Remplacer --amber-500 par --amber-700 (suivi.css)
2. [x] J1-ancien : Corriger XSS suivi-loader.js (textContent)
3. [x] P1 : Try-catch JSON.parse render-cards.js
4. [x] P2 : Timeout puppeteer.launch (60s)

### Phase 2 - Important ✅ Fait

5. [x] C2 : Supprimer doublon .video-embed (cards.css)
6. [x] C3 : Déjà corrigé (.modal-affiche blockquote existait)
7. [x] P3 : Try-catch fs.readFileSync assemble-booklets.js
8. [x] P4 : Validation PDFs dans workflow (taille + header)
9. [x] J2-ancien : Centraliser applyTwemoji (print-render-a4 → markdown-utils)

### Phase 3 - Restants du précédent audit

10. [ ] I1-ancien : Variables CSS shadows (magic numbers)
11. [ ] I3-ancien : Réduire !important (le nombre a augmenté de 8 à ~55)
12. [ ] C4 : Harmoniser breakpoints (769px → 768px)
13. [ ] J3-ancien/J10 : Optimiser regex wrapSkipMarker (toujours O(n²))
14. [ ] J4-ancien : Paralléliser rendu cartes (render-cards.js)

---

## 6. Nouvelles priorités de correction

### Phase A - Sécurité et stabilité

| # | Quoi | Impact | Effort |
|---|------|--------|--------|
| J1 | Encapsuler les scripts dans des IIFE (home.js, suivi-loader.js, cards-loader.js, afficheur-cartes.js) pour éviter les collisions | Stabilité | ~1h |
| J3 | Échapper les données JSON avant injection innerHTML dans createCardTile() et updatePreview() | Sécurité | ~30min |
| J6 | Disconnect les IntersectionObserver à la fermeture des modales | Mémoire | ~20min |
| SW1 | Retirer skipWaiting de l'install du SW | Stabilité | ~5min |

### Phase B - Cohérence et maintenabilité

| # | Quoi | Impact | Effort |
|---|------|--------|--------|
| H3 | Unifier marked.js vers la version locale (suivi.html, print-render.html) | PWA offline | ~10min |
| H4 | Harmoniser le `<head>` PWA sur decouvrir.html et suivi.html | PWA | ~15min |
| SW2 | Ajouter les ressources manquantes au précache du SW | PWA offline | ~15min |
| I4 | Remplacer les @import Google Fonts par des `<link>` | Performance | ~30min |
| H1 | Extraire le footer dans un JS partagé (ou template) | Maintenabilité | ~1h |
| J7 | Corriger les event listeners dupliqués dans setupModeButtons | Bug | ~20min |

### Phase C - Qualité de code (quand le temps le permet)

| # | Quoi |
|---|------|
| I1 | Réduire les ~55 !important par refactoring de la cascade |
| I2 | Remplacer les couleurs hex hardcodées par des variables CSS |
| I6 | Créer --navy-700, --navy-100 |
| H8 | Migrer les onclick inline vers addEventListener |
| J8 | Retirer les async inutiles |
| J9 | Piner les versions CDN Twemoji |
| J10 | Réécrire wrapSkipMarker en un seul pass |

---

## 7. Fichiers audités

### HTML (9 pages + 4 templates affiches + 1 présentation)

- index.html (301 lignes)
- anacoluthe.html (91 lignes)
- decouvrir.html (151 lignes)
- ensavoirplus.html (327 lignes)
- fil-semaine.html (440 lignes)
- afficheur-cartes.html (307 lignes)
- suivi.html (122 lignes)
- print-render.html (79 lignes)
- print-render-a4.html (73 lignes)

### CSS (7 fichiers projet, ~8000 lignes + 1 vendor + 1 thème)

- style.css (~2500 lignes)
- cards.css (~1300 lignes)
- cards-print.css (~380 lignes)
- suivi.css (~720 lignes)
- affiches-print.css (~1400 lignes)
- fil-semaine.css (~1100 lignes)
- afficheur-cartes.css (~840 lignes)

### JavaScript (13 fichiers projet, ~3500 lignes + 2 vendor + 1 SW)

- home.js (121 lignes)
- cards-loader.js (365 lignes)
- markdown-utils.js (357 lignes)
- afficheur-cartes.js (926 lignes)
- fil-semaine.js (127 lignes)
- suivi-loader.js (497 lignes)
- pwa-status.js (587 lignes)
- external-links.js (17 lignes)
- scroll-spy.js (32 lignes)
- twemoji-init.js (20 lignes)
- lightbox.js (38 lignes)
- print-render.js (78 lignes)
- print-render-a4.js (97 lignes)
- sw.js (232 lignes)

### Build (Node.js)

- scripts/render-cards.js (~391 lignes)
- scripts/assemble-booklets.js (~307 lignes)
- .github/workflows/generate-print.yml (124 lignes)

---

## 8. Tests de validation

```bash
# Test index JSON manquant
mv assets/data/cards-index.json cards-index.json.bak
node scripts/render-cards.js roles  # Doit fail proprement

# Test markdown manquant
rm sources/cartes/roles/R1_bosco.md
node scripts/render-cards.js roles  # Doit skip R1, générer les autres

# Test workflow
git commit -m "test sans [print]"  # Doit skip
git commit -m "test avec [print]"  # Doit exécuter

# Test PWA hors-ligne
# 1. Charger le site en ligne
# 2. Ouvrir DevTools > Application > Service Workers
# 3. Cocher "Offline"
# 4. Naviguer : index, anacoluthe, fil-semaine, suivi doivent fonctionner
# 5. suivi.html : vérifier que marked.js est bien chargé (sinon = H3 non corrigé)
```

---

V_260316
