# SUIVI CODE ANACOLUTHE

Audit et suivi du code (HTML, JS, CSS) : écarts documentation/code, nettoyage, méthodes de vérification.

*Dernière mise à jour : 16 janvier 2026*

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

### 4. Vérification des CSS chargés par page

| Page | CSS chargés |
|------|-------------|
| index.html | style.css |
| anacoluthe.html | style.css, cards.css |
| afficheur-cartes.html | style.css, cards.css, cards-print.css |
| fil-semaine.html | style.css, fil-semaine.css |
| ensavoirplus.html | style.css |
| print-render.html | cards-print.css |

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

*Document de travail - Anacoluthe V5*
