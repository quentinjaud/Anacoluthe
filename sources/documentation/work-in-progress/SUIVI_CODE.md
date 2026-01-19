# SUIVI CODE ANACOLUTHE

Audit et suivi du code (HTML, JS, CSS) : écarts documentation/code, nettoyage, méthodes de vérification.

*Dernière mise à jour : 19 janvier 2026*

---

## MÉTHODES DE VÉRIFICATION

### 1. Inventaire des fichiers

```powershell
# Lister les fichiers JS avec tailles
Get-ChildItem -Path "C:\Users\quent\Documents\GitHub\Anacoluthe\assets\js" -Recurse | 
  Select-Object Name, Length | Format-Table

# Lister les fichiers CSS avec tailles
Get-ChildItem -Path "C:\Users\quent\Documents\GitHub\Anacoluthe\assets\css" | 
  Select-Object Name, Length | Format-Table

# Lister les images
Get-ChildItem -Path "C:\Users\quent\Documents\GitHub\Anacoluthe\assets\images" | 
  Select-Object Name, Length | Format-Table
```

### 2. Recherche de références (images, fichiers)

```powershell
# Chercher si un fichier est référencé dans le HTML
Select-String -Path "C:\Users\quent\Documents\GitHub\Anacoluthe\*.html" -Pattern "nom-fichier" -SimpleMatch

# Chercher dans JS et CSS
Select-String -Path "C:\Users\quent\Documents\GitHub\Anacoluthe\assets\js\*.js", "C:\Users\quent\Documents\GitHub\Anacoluthe\assets\css\*.css" -Pattern "nom-fichier" -SimpleMatch

# Chercher dans le service worker
Select-String -Path "C:\Users\quent\Documents\GitHub\Anacoluthe\sw.js" -Pattern "nom-fichier"
```

### 3. Vérification des scripts chargés par page

Méthode manuelle : ouvrir chaque fichier HTML et lister les `<script src="...">` en fin de body.

| Page | Scripts chargés |
|------|-----------------|
| index.html | home.js, pwa-status.js, external-links.js |
| anacoluthe.html | vendor/marked.min.js, markdown-utils.js, cards-loader.js, external-links.js, pwa-status.js |
| afficheur-cartes.html | vendor/marked.min.js, markdown-utils.js, afficheur-cartes.js, pwa-status.js |
| fil-semaine.html | fil-semaine.js, external-links.js |
| ensavoirplus.html | scroll-spy.js, external-links.js, pwa-status.js |
| print-render.html | markdown-utils.js, print-render.js |
| print-render-a4.html | print-render-a4.js, twemoji (CDN) |

### 4. Vérification des CSS chargés par page

| Page | CSS chargés |
|------|-------------|
| index.html | style.css |
| anacoluthe.html | style.css, cards.css |
| afficheur-cartes.html | style.css, cards.css, cards-print.css |
| fil-semaine.html | style.css, fil-semaine.css |
| ensavoirplus.html | style.css |
| print-render.html | cards-print.css |
| print-render-a4.html | affiches-print.css |

---

## ÉCARTS TECH_INTENTIONS.md vs CODE RÉEL

### Architecture JS documentée vs réelle

| Documenté dans TECH_INTENTIONS | Existe réellement | Statut |
|--------------------------------|-------------------|--------|
| `index.js` | ❌ Non | Supprimer de la doc |
| `cards-loader.js` | ✅ Oui | OK |
| `markdown-utils.js` | ✅ Oui | OK |
| `afficheur-cartes.js` | ✅ Oui | OK |
| `print-render.js` | ✅ Oui | OK |
| `pwa-status.js` | ✅ Oui | OK |
| - | `home.js` | Ajouter à la doc |
| - | `external-links.js` | Ajouter à la doc |
| - | `scroll-spy.js` | Ajouter à la doc |
| - | `fil-semaine.js` | Ajouter à la doc |
| - | `vendor/marked.min.js` | Documenter le dossier vendor |

### Architecture CSS documentée vs réelle

| Documenté | Existe | Statut |
|-----------|--------|--------|
| `style.css` | ✅ Oui | OK |
| `cards.css` | ✅ Oui | OK |
| `cards-print.css` | ✅ Oui | OK |
| - | `fil-semaine.css` | Ajouter à la doc |

### Métriques (décembre 2025)

| Catégorie | Documenté | Réel | Écart |
|-----------|-----------|------|-------|
| CSS | ~56 KB | ~111 KB | +55 KB |
| JS (hors vendor) | ~48 KB | ~71 KB | +23 KB |
| JS vendor | - | ~39 KB | - |
| Total statique | ~200 KB | ~290 KB | +90 KB |

**Détail CSS :**
- style.css : 51.57 KB
- cards.css : 27.51 KB
- cards-print.css : 10.39 KB
- fil-semaine.css : 21.39 KB

**Détail JS (hors vendor) :**
- afficheur-cartes.js : 22.16 KB
- pwa-status.js : 17.03 KB
- markdown-utils.js : 10.00 KB
- cards-loader.js : 9.19 KB
- fil-semaine.js : 4.04 KB
- home.js : 3.46 KB
- print-render.js : 3.45 KB
- scroll-spy.js : 1.02 KB
- external-links.js : 0.66 KB

---

## SERVICE WORKER - ERREURS DÉTECTÉES

### Fichier inexistant référencé

```javascript
// sw.js ligne ~24
'/assets/js/index.js',  // ❌ CE FICHIER N'EXISTE PAS
```

**Correction :** Remplacer par `/assets/js/home.js`

### Ressources manquantes dans le précache

**Pages HTML manquantes :**
```javascript
'/fil-semaine.html',
'/ensavoirplus.html',
```

**CSS manquant :**
```javascript
'/assets/css/fil-semaine.css',
```

**JS manquants :**
```javascript
'/assets/js/home.js',
'/assets/js/fil-semaine.js',
'/assets/js/external-links.js',
'/assets/js/scroll-spy.js',
```

---

## IMAGES - ANALYSE CODE MORT

### Méthode de vérification

Recherche dans tous les fichiers HTML, JS, CSS, manifest.json, sw.js :

```powershell
# Pour chaque image suspecte
Select-String -Path "C:\Users\quent\Documents\GitHub\Anacoluthe\**\*" -Include "*.html","*.js","*.css","*.json" -Pattern "nom-image" -SimpleMatch
```

### Résultats

| Fichier | Référencé dans | Action |
|---------|----------------|--------|
| `logo-anacoluthe.svg` | HTML (plusieurs pages), manifest implicite | ✅ Garder |
| `icon-192.png` | manifest.json, HTML (apple-touch-icon), sw.js | ✅ Garder |
| `icon-512.png` | manifest.json, sw.js | ✅ Garder |
| `.gitkeep` | Nulle part (fichier Git) | ⚠️ Supprimer (dossier non vide) |
| `icon-pwa.svg` | Nulle part | ❌ Supprimer |
| `Logo _anacoluthe_720.jpg` | Nulle part | ❌ Supprimer |
| `shufflin.png` | Nulle part | ❌ Supprimer |
| `affiche-tableau-equipage.png` | fil-semaine.html (7 occurrences) | ✅ Garder |

---

## PLAN D'ACTION

### Priorité 1 - Corrections critiques (impacte PWA)

- [ ] **sw.js** : Corriger les chemins erronés et ajouter les ressources manquantes

### Priorité 2 - Documentation

- [ ] **TECH_INTENTIONS.md** : Mettre à jour l'architecture et les métriques

### Priorité 3 - Nettoyage

- [ ] Supprimer les images non utilisées (après confirmation)
- [ ] Supprimer `.gitkeep` du dossier images

---

## 🔍 PROCHAINES ENQUÊTES

Pistes d'analyse pour alléger et nettoyer le code.

### Service Worker

| Enquête | Description | Priorité |
|---------|-------------|----------|
| Image manquante précache | `affiche-tableau-equipage.png` utilisée dans fil-semaine.html mais absente du sw.js | ✅ Corrigé |
| Audit complétude précache | Vérifier que toutes les ressources nécessaires hors-ligne sont listées | Moyenne |

### CSS (~111 KB)

| Enquête | Description | Priorité |
|---------|-------------|----------|
| Règles non utilisées | Auditer avec DevTools Coverage les sélecteurs CSS jamais appliqués | Moyenne |
| Duplication style.css / fil-semaine.css | Vérifier si des règles sont dupliquées entre les fichiers | Basse |
| Variables CSS inutilisées | Lister les `--var` définies mais jamais référencées | Basse |

### JavaScript (~71 KB)

| Enquête | Description | Priorité |
|---------|-------------|----------|
| Fonctions non utilisées | Vérifier que toutes les fonctions exportées de markdown-utils.js sont appelées | Basse |
| Code mort pwa-status.js | Ce fichier est gros (17 KB) - vérifier si tout est utilisé | Basse |
| marked.js CDN vs local | print-render.html charge marked.js depuis CDN alors qu'il est en local (vendor/) | Basse |

### HTML

| Enquête | Description | Priorité |
|---------|-------------|----------|
| Inline CSS dans afficheur-cartes.html | ~200 lignes de CSS inline - candidat à extraction | Basse |
| Balises inutilisées | Vérifier les éléments HTML avec IDs jamais référencés en JS | Basse |

### Images

| Enquête | Description | Priorité |
|---------|-------------|----------|
| Compression PNG | Vérifier si icon-192.png, icon-512.png, affiche-tableau-equipage.png sont optimisés | Basse |
| Format WebP | Évaluer conversion en WebP pour les vignettes | Basse |

### Fonts

| Enquête | Description | Priorité |
|---------|-------------|----------|
| Graisses chargées vs utilisées | Vérifier qu'on ne charge pas de font-weight inutiles depuis Google Fonts | Basse |

---

## HISTORIQUE DES CORRECTIONS

| Date | Action | Fichier(s) | Statut |
|------|--------|------------|--------|
| 251212 | Audit initial | - | ✅ Fait |
| 251212 | Corriger sw.js (actions 1-4) | sw.js | ✅ Fait |
| 251212 | Mettre à jour TECH_INTENTIONS (actions 5-8) | TECH_INTENTIONS.md | ✅ Fait |
| 251212 | Supprimer shufflin.png (action 12) | assets/images/ | ✅ Fait |
| 251212 | Ajouter affiche-tableau-equipage.png au précache | sw.js | ✅ Fait |
| - | Images conservées volontairement | .gitkeep, icon-pwa.svg, Logo*.jpg, affiche*.png | ✅ Gardé |
| 260116 | Refacto afficheur/print-render | markdown-utils.js, afficheur-cartes.js, print-render.js, cards-print.css | ✅ Fait |
| 260117 | Support format A4 paysage affiches | render-cards.js, affiches-print.css | ✅ Fait |
| 260117 | Support format A4 portrait affiches | render-cards.js, affiches-print.css, print-render-a4.html, print-render-a4.js | ✅ Fait |
| 260117 | Création affiche A1 Routines | A1_routines.html | ✅ Fait |
| 260117 | Import Merriweather serif | affiches-print.css | ✅ Fait |
| 260118 | Support multi-pages A4 portrait (recto-verso) | print-render-a4.js, render-cards.js | ✅ Fait |
| 260118 | Création affiche A3 Marque-page LDB (2 pages) | A3_marque_page.html | ✅ Fait |
| 260118 | Screenshots par page pour affiches multi-pages | render-cards.js | ✅ Fait |
| 260118 | Mise à jour liens affiches fil-semaine | fil-semaine.html, fil-semaine.css | ✅ Fait |
| 260118 | Audit technique complet (CSS, JS, Pipeline) | ENTRETIEN_CODE.md | ✅ Fait |
| 260119 | Preview images affiches dans modale | cards-loader.js, cards-index.json, cards.css | ✅ Fait |
| 260119 | Lightbox GLightbox pour zoom affiches | lightbox.js, glightbox.min.*, anacoluthe.html | ✅ Fait |
| 260119 | Refonte A1 Routines (section-wrapper, emojis) | A1_routines.html, affiches-print.css | ✅ Fait |
| 260119 | Refonte A3 verso (rôles, paquets, mémos) | A3_marque_page.html, affiches-print.css | ✅ Fait |
| 260119 | Twemoji lazy load affiches | twemoji-init.js, A1/A2/A3.html | ✅ Fait |
| 260119 | Renommage M1 Accueil & Présentations | docs, M1_accueil_presentations.md | ✅ Fait |

---

## REFACTO 16 JANVIER 2026

### Contexte
Nettoyage du code de l'afficheur de cartes et du moteur de rendu markdown-to-print.

### Modifications

#### 1. Variable CSS redondante supprimée
- **Fichier** : `cards-print.css`
- **Avant** : `--print-base-font-size` et `--print-font-size-max` (redondantes, même valeur 11pt)
- **Après** : uniquement `--print-font-size-max`
- **Impact** : `afficheur-cartes.js` mis à jour pour utiliser `--print-font-size-max`

#### 2. Ratios de tailles corrigés
- **Fichier** : `afficheur-cartes.js` (fonction `renderTechView`)
- **Avant** : ratios incohérents `{ h1: 1.556, h2: 1.111, h3: 1, h6: 1 }`
- **Après** : ratios alignés sur CSS `{ h1: 1.8, h2: 1.25, h3: 1.05, h6: 1 }`

#### 3. Fonction `splitByFlip` factorisée
- **Fichier** : `markdown-utils.js`
- **Nouvelle fonction** : `splitByFlip(markdown)` retourne `{ recto, verso }`
- **Utilisée par** : `afficheur-cartes.js` et `print-render.js`
- **Avant** : logique dupliquée dans les deux fichiers

#### 4. Fonction `prepareMarkdownForPrint` factorisée
- **Fichier** : `markdown-utils.js`
- **Nouvelle fonction** : `prepareMarkdownForPrint(markdown)` gère HEAD, SKIP-PRINT, SKIP-WEB
- **Utilisée par** : `afficheur-cartes.js` et `print-render.js`
- **Avant** : regex dupliquées dans les deux fichiers

#### 5. Fonction `renderModalViewer` factorisée
- **Fichier** : `afficheur-cartes.js`
- **Nouvelle fonction** : `renderModalViewer(config, card, markdown)`
- **Utilisée par** : `renderWebView` et `renderMobileView`
- **Avant** : ~40 lignes de code dupliquées entre les deux fonctions

#### 6. Cache-busting ajouté
- **Fichier** : `print-render.html`
- **Scripts** : `?v=2` ajouté aux imports JS pour forcer le rechargement

### Bilan

| Métrique | Avant | Après |
|----------|-------|-------|
| Lignes dupliquées supprimées | ~80 | 0 |
| Fonctions partagées ajoutées | 0 | 3 |
| Variables CSS redondantes | 1 | 0 |
| Bugs potentiels corrigés | 1 (ratios) | 0 |

---

## SUPPORT FORMAT A4 PAYSAGE (17 JANVIER 2026)

### Contexte
Migration de l'affiche A2 Tableau d'équipage depuis Google Docs vers le pipeline HTML/Puppeteer.

### Modifications

#### 1. Nouveau CSS affiches-print.css
- **Fichier** : `assets/css/affiches-print.css`
- **Contenu** : styles dédiés format A4 paysage (297×210mm)
- **Classes principales** : `.affiche-a4`, `.section`, `.bloc`, `.grid-6`, `.grid-4`, `.meteo-slider`
- **Variables** : `--anacoluthe-bleu`, `--bloc-bg`, couleurs accent intentions

#### 2. Extension render-cards.js
- **Fichier** : `scripts/render-cards.js`
- **Ajout** : format `A4-landscape` dans `FORMATS` (297×210mm)
- **Ajout** : entrée A2 dans `cardsIndex` avec `format: 'A4-landscape'`
- **Fix** : retrait `landscape: true` de Puppeteer (dimensions explicites suffisent)

#### 3. Vérification scripts/CSS par page

| Page | CSS chargés |
|------|-------------|
| print-render-a4.html | affiches-print.css |

### Choix techniques

| Problème | Solution |
|----------|----------|
| PDF rendu en portrait au lieu de paysage | Retirer `landscape: true`, dimensions 297×210 suffisent |
| Espacement supplémentaire avec `<br>` dans flexbox | Utiliser `<span class="emoji-line">` + `display: block` |
| Emoji inconsistants entre OS | Twemoji via CDN |

---

## SUPPORT FORMAT A4 PORTRAIT (17 JANVIER 2026)

### Contexte
Création de l'affiche A1 Routines Quotidiennes en format A4 portrait (210×297mm).

### Modifications

#### 1. Extension render-cards.js
- **Fichier** : `scripts/render-cards.js`
- **Ajout** : format `A4-portrait` dans `FORMATS` (210×297mm)
- **Ajout** : entrée A1 dans `cardsIndex` avec `format: 'A4-portrait'`

#### 2. Nouveau rendu print-render-a4.html
- **Fichier** : `print-render-a4.html`
- **Contenu** : page de rendu pour affiches A4 (portrait et paysage)
- **Script** : `print-render-a4.js` pour charger les HTML d'affiches

#### 3. Extension affiches-print.css
- **Fichier** : `assets/css/affiches-print.css`
- **Ajout** : import Google Fonts Merriweather (serif) + Merriweather Sans
- **Ajout** : classe `.affiche-a4-portrait` (210×297mm)
- **Ajout** : grille `.grid-4-roles` pour layout 4 colonnes
- **Ajout** : classes `.role-bosco`, `.role-nav`, `.role-second`, `.role-cambuse`
- **Ajout** : styles `.section-routine`, `.section-header`, `.collectif-line`
- **Ajout** : checkboxes (`.task-checkbox`) et icône rotation SVG (`.task-rotation`)
- **Ajout** : section notes (`.section-notes-routines`)

#### 4. Vérification scripts/CSS par page

| Page | CSS chargés |
|------|-------------|
| print-render-a4.html | affiches-print.css |

| Page | Scripts chargés |
|------|-----------------|
| print-render-a4.html | print-render-a4.js |

### Choix techniques

| Problème | Solution |
|----------|----------|
| Typographie lisible en petit format | Merriweather serif pour corps de texte (7-8.5pt) |
| Distinction tâches ponctuelles vs récurrentes | Checkbox carrée vs icône SVG rotation |
| Layout 4 rôles équilibré | CSS Grid avec `grid-template-columns: repeat(4, 1fr)` |
| Couleurs par rôle | Variables CSS existantes (teal, amber, brick, bleu) |

---

## SUPPORT MULTI-PAGES A4 PORTRAIT (18 JANVIER 2026)

### Contexte
Extension du pipeline de rendu pour supporter les documents A4 portrait recto-verso (ex: A3 Marque-page LDB).

### Modifications

#### 1. Extension print-render-a4.js
- **Fichier** : `assets/js/print-render-a4.js`
- **Avant** : `querySelector` récupérait uniquement la première page
- **Après** : `querySelectorAll('.affiche-a4, .affiche-a4-portrait')` récupère toutes les pages
- **Ajout** : hauteur dynamique `297 * pageCount`mm pour A4 portrait multi-pages
- **Ajout** : `overflow: visible` sur body pour permettre le défilement

#### 2. Extension render-cards.js
- **Fichier** : `scripts/render-cards.js`
- **Ajout** : détection du nombre de pages via `page.evaluate()`
- **Ajout** : ajustement viewport pour multi-pages (`height * pageCount`)
- **Ajout** : option `fullPage: true` pour les screenshots multi-pages

### Code clé

**print-render-a4.js :**
```javascript
const affichePages = doc.querySelectorAll('.affiche-a4, .affiche-a4-portrait');
containerEl.innerHTML = '';
affichePages.forEach(page => containerEl.appendChild(page));

const pageCount = affichePages.length;
if (affiche.format === 'A4-portrait') {
    document.documentElement.style.height = `${297 * pageCount}mm`;
    document.body.style.height = `${297 * pageCount}mm`;
    document.body.style.overflow = 'visible';
}
```

**render-cards.js :**
```javascript
const pageCount = await page.evaluate(() => {
  return document.querySelectorAll('.affiche-a4, .affiche-a4-portrait').length;
});

if (pageCount > 1) {
  const viewportHeight = Math.round(formatConfig.height * pageCount * 96 / 25.4);
  await page.setViewport({ width: viewportWidth, height: viewportHeight, ... });
}
```

### Choix techniques

| Problème | Solution |
|----------|----------|
| PDF ne rendait que la première page | `querySelectorAll` au lieu de `querySelector` |
| Viewport trop petit pour multi-pages | Calcul dynamique `height * pageCount` |
| Body coupait le contenu | `overflow: visible` |

---

## LIMITATIONS PUPPETEER/CHROME PDF (17 JANVIER 2026)

### Bordures fines - Minimum 1px

**Problème découvert** : Les bordures CSS inférieures à 1px ne sont pas respectées dans le PDF généré par Puppeteer/Chrome.

**Source** : [Issue #4768 puppeteer/puppeteer](https://github.com/GoogleChrome/puppeteer/issues/4768)

**Cause** : Chrome convertit les bordures en rectangles remplis et applique un minimum d'environ 1px, indépendamment de la valeur CSS spécifiée.

**Équivalences** :
| Valeur | Résultat réel |
|--------|---------------|
| `0.1mm` | Arrondi à ~1px |
| `0.2mm` | Arrondi à ~1px |
| `0.25pt` | Arrondi à ~1px |
| `0.5pt` | Arrondi à ~1px |
| `1px` | Minimum fiable (~0.26mm, ~0.75pt) |

**Recommandation** : Utiliser `1px` comme épaisseur de bordure fine dans les CSS print. Toute valeur inférieure sera de toute façon rendue à ~1px.

**Workarounds possibles** (non recommandés) :
1. `scale: 0.8` dans options PDF - réduit tout le contenu de 20%
2. Post-traitement du PDF avec outil vectoriel (Inkscape)
3. Changement de renderer (wkhtmltopdf, Prince)

### Impact sur le code

**Fichier** : `assets/css/affiches-print.css`

```css
/* Bordures blocs éditables - 1px = minimum fiable Puppeteer */
.bloc.editable.border-amber {
    border: 1px solid var(--amber-700);
}

.bloc.editable.border-teal {
    border: 1px solid var(--teal-700);
}
```

### Twemoji - Fonctionnel dans Puppeteer

**Vérification** : Twemoji fonctionne correctement dans le rendu PDF via Puppeteer.

**Pipeline** :
1. `print-render-a4.html` charge Twemoji depuis CDN
2. `print-render-a4.js` appelle `applyTwemoji(containerEl)` après chargement HTML
3. Les emojis Unicode sont convertis en `<img>` SVG Twemoji
4. Puppeteer attend `networkidle0` + `body.affiche-ready` avant rendu

**Attention** : En visualisation directe des fichiers HTML sources (sans passer par le renderer), les emojis apparaissent en style système natif car Twemoji n'est pas chargé.

---

## AUDIT TECHNIQUE COMPLET (18 JANVIER 2026)

### Contexte
Audit exhaustif du codebase (CSS, JS, Pipeline PDF) avec rapport détaillé.

### Résultats

| Domaine | Score | Problèmes |
|---------|-------|-----------|
| CSS | 7.5/10 | 47 anomalies, 4 critiques |
| JS Sécurité | 8/10 | 1 XSS potentiel, 0 vuln npm |
| Pipeline PDF | 7/10 | 4 failles robustesse |

### Rapport détaillé
Voir `sources/documentation/ENTRETIEN_CODE.md` pour :
- Liste complète des anomalies CSS
- Vulnérabilités JS identifiées
- Faiblesses pipeline PDF
- Plan d'action priorisé (14 corrections)

### Modifications effectuées

1. **render-cards.js** - Screenshots par page pour affiches multi-pages
   - Génère `debug-A3-page1.png` et `debug-A3-page2.png` pour A3

2. **fil-semaine.css** - CSS dual-image
   - `.fil-tool-image-dual` et `.fil-boucle-outil-image-dual` pour affichage recto/verso

3. **fil-semaine.html** - 6 blocs affiches corrigés
   - Liens : `affiche-ldb` → `A3`, `affiche-tableau` → `A2`, `affiche-routines` → `A1`
   - Classes `fil-tool-pending` retirées
   - Emojis overlay retirés

4. **assets/images/** - Nouvelles images
   - `affiche-A1-routines.png`
   - `affiche-A3-recto.png`
   - `affiche-A3-verso.png`

---

## PREVIEW AFFICHES + LIGHTBOX (19 JANVIER 2026)

### Contexte
Ajout d'une prévisualisation des affiches dans la modale carte, avec lightbox zoom.

### Fonctionnalités

1. **Preview dans modale** - Les affiches (A1, A2, A3) affichent leur image PNG au-dessus du mémo
2. **Lightbox GLightbox** - Au clic sur l'image, ouverture en plein écran avec zoom
3. **Support multi-images** - A3 affiche recto/verso côte à côte, navigation entre les deux

### Fichiers modifiés

| Fichier | Modification |
|---------|--------------|
| `cards-index.json` | Ajout champ `previewImages` pour chaque affiche |
| `cards-loader.js` | Génération HTML preview dans `openCard()` |
| `cards.css` | Styles `.modal-affiche-preview` (300px hauteur, centré) |
| `lightbox.js` | Wrapper GLightbox pour images dynamiques |
| `anacoluthe.html` | Import GLightbox CSS + JS |

### Fichiers ajoutés

| Fichier | Taille |
|---------|--------|
| `assets/js/vendor/glightbox.min.js` | 56kb |
| `assets/css/vendor/glightbox.min.css` | 14kb |

### GLightbox

Bibliothèque choisie pour :
- Vanilla JS (pas de dépendance jQuery)
- Support pinch-to-zoom mobile natif
- Navigation flèches entre images
- Animations fluides
- Accessibilité (keyboard, aria)

---

*Document de travail - Anacoluthe V5*
