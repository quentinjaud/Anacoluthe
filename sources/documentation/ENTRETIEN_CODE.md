# ENTRETIEN CODE - ANACOLUTHE

Audit technique et liste des anomalies à corriger. Mise à jour : 2026-01-18.

---

## Résumé exécutif

| Domaine | Score | Problèmes |
|---------|-------|-----------|
| **CSS** | 7.5/10 | 47 anomalies, 4 critiques |
| **JS Sécurité** | 8/10 | 1 XSS potentiel, 0 vuln npm |
| **Pipeline PDF** | 7/10 | 4 failles robustesse |

**Dépendances** : 0 vulnérabilité npm (audit clean)

---

## 1. CSS - Anomalies

### 1.1 Critiques

| # | Problème | Fichier | Ligne | Action |
|---|----------|---------|-------|--------|
| C1 | Variable `--amber-500` utilisée mais non définie | suivi.css | 103 | Définir dans :root de style.css |
| C2 | `.video-embed` définie 2 fois (doublon) | cards.css | 1115, 1188 | Supprimer le doublon |
| C3 | `.modal-affiche blockquote` manque `border-left-color` | cards.css | 612-620 | Ajouter la règle |
| C4 | Breakpoints incohérents (768/600px mobile, 1024/1025px desktop) | Plusieurs | - | Harmoniser |

### 1.2 Importants

| # | Problème | Fichier | Action |
|---|----------|---------|--------|
| I1 | Magic numbers répétés (rgba shadows) | style.css, cards.css | Créer variables --shadow-* |
| I2 | Couleurs navy hard-codées (#1E3A5F, #C9D5E3) | Plusieurs | Créer --navy-50/100/700 |
| I3 | Excès de `!important` (8+ occurrences) | cards.css | Refactoriser cascade |
| I4 | Patterns `.footer-nav-link.accent-*` très répétitifs | style.css | Utiliser custom properties |
| I5 | `aspect-ratio` sans fallback (74% support) | affiches-print.css | Ajouter padding-bottom hack |
| I6 | Duplication `border: none; border-bottom: none;` | style.css | 322-331 | Fusionner |

### 1.3 Mineurs

- Classes `.badge-proto`, `.badge-unavailable` possiblement obsolètes
- Sélecteurs nth-child rotations répétitifs (fil-semaine.css)
- Commentaire media query incorrect ("SNAP SCROLL" sans rapport)
- `--text-base` utilisée dans suivi.css mais non définie (devrait être --text-dark)

### 1.4 Points positifs CSS

- Variables CSS bien structurées dans :root
- Sections commentées clairement
- Support PWA complet (safe-area-inset)
- Fallbacks dvh/vh corrects
- Fichiers print autonomes

---

## 2. JavaScript - Sécurité et qualité

### 2.1 Critique

| # | Problème | Fichier | Ligne | Action |
|---|----------|---------|-------|--------|
| J1 | XSS potentiel : `body.innerHTML = \`<pre>${md}</pre>\`` | suivi-loader.js | 480 | Utiliser textContent |

### 2.2 Importants

| # | Problème | Fichier | Action |
|---|----------|---------|--------|
| J2 | `applyTwemoji()` dupliquée | markdown-utils.js + print-render-a4.js | Centraliser dans utils |
| J3 | Regex O(n²) dans `wrapSkipMarker()` | markdown-utils.js:118 | Remplacer par split() |
| J4 | Rendu cartes séquentiel | render-cards.js:368 | Paralléliser avec Promise.all |

### 2.3 Points positifs JS

- 0 vulnérabilité npm
- Try-catch présent partout
- IIFE pour isolation scope (pwa-status.js)
- URLs validées par whitelist
- Pas de variables globales non intentionnelles

---

## 3. Pipeline PDF - Robustesse

### 3.1 Critiques

| # | Problème | Fichier | Ligne | Action |
|---|----------|---------|-------|--------|
| P1 | `JSON.parse()` sans try-catch | render-cards.js | 119 | Ajouter gestion erreur |
| P2 | Pas de timeout sur `puppeteer.launch()` | render-cards.js | 362 | Ajouter `timeout: 60000` |
| P3 | `fs.readFileSync()` sans try-catch | assemble-booklets.js | 151 | Ajouter gestion erreur |
| P4 | Pas de validation PDFs avant commit | generate-print.yml | - | Ajouter vérif taille/header |

### 3.2 Importants

| # | Problème | Action |
|---|----------|--------|
| P5 | Pas de `set -e` dans workflow | Ajouter pour fail-fast |
| P6 | Twemoji CDN sans fallback local | Copier assets ou ignorer |
| P7 | Pas de vérif `fs.existsSync(CONFIG.indexPath)` | Ajouter avant read |

### 3.3 Points positifs Pipeline

- Gestion erreurs page.on('pageerror')
- Stats tracking avec exit codes corrects
- Fallback gracieux cartes manquantes (page blanche)
- Dépendances à jour (puppeteer 24.32, pdf-lib 1.17, marked 17.0)

---

## 4. Fichiers audités

### CSS (6 fichiers, ~6900 lignes)
- style.css (2466 lignes)
- cards.css (1207 lignes)
- cards-print.css (380 lignes)
- suivi.css (719 lignes)
- affiches-print.css (1118 lignes)
- fil-semaine.css (1037 lignes)

### JavaScript (15 fichiers, ~4000 lignes)
- assets/js/*.js (13 fichiers)
- scripts/render-cards.js (391 lignes)
- scripts/assemble-booklets.js (307 lignes)

### Workflow
- .github/workflows/generate-print.yml (124 lignes)

---

## 5. Priorités de correction

### Phase 1 - Critique (~30 min)
1. [ ] C1 : Définir --amber-500
2. [ ] J1 : Corriger XSS suivi-loader.js
3. [ ] P1 : Try-catch JSON.parse render-cards.js
4. [ ] P2 : Timeout puppeteer.launch

### Phase 2 - Important (~2h)
5. [ ] C2 : Supprimer doublon .video-embed
6. [ ] C3 : Ajouter .modal-affiche blockquote
7. [ ] P3 : Try-catch fs.readFileSync assemble-booklets
8. [ ] P4 : Validation PDFs dans workflow
9. [ ] J2 : Centraliser applyTwemoji

### Phase 3 - Amélioration (~1 jour)
10. [ ] I1-I2 : Variables CSS shadows et navy
11. [ ] I3 : Réduire !important
12. [ ] C4 : Harmoniser breakpoints
13. [ ] J3 : Optimiser regex wrapSkipMarker
14. [ ] J4 : Paralléliser rendu cartes

---

## 6. Tests de validation

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
```

---

V_260118
