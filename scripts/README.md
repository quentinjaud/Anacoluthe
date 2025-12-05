# 🖨️ Générateur PDF Anacoluthe

Pipeline de génération des cartes A6 imprimables.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  afficheur-cartes.html                      │
│                 (source unique du rendu)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   render-cards.js                           │
│        Serveur local + Puppeteer → PDFs A6 individuels      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 assemble-booklets.js                        │
│           PDFs A6 → Livrets A4 (4-UP, recto-verso)          │
└─────────────────────────────────────────────────────────────┘
```

## Principe WYSIWYG

**Un seul fichier CSS** : `afficheur-cartes.html` contient tous les styles.

- Le preview dans le navigateur = exactement ce qui sera imprimé
- Puppeteer charge le même HTML → rendu identique
- Utiliser **Chrome** pour preview (même moteur que Puppeteer)

---

## Scripts

### render-cards.js

Génère les PDFs A6 individuels (2 pages : recto + verso).

```bash
node scripts/render-cards.js [target]
```

| Target | Cartes générées |
|--------|-----------------|
| `all` | Toutes (défaut) |
| `roles` | R1, R2, R3, R4 |
| `moments` | M1 à M7 |
| `sos` | S1, S2, S3, S4 |

**Output** : `print/cartes/{id}.pdf`

**Fonctionnement** :
1. Lance un serveur HTTP local (port 8765)
2. Pour chaque carte, navigue vers `afficheur-cartes.html?card=X&mode=print&face=Y`
3. Attend le signal `body.card-ready`
4. Capture le PDF via `page.pdf()`
5. Fusionne recto + verso avec pdf-lib

### assemble-booklets.js

Assemble les PDFs A6 en livrets A4 (4 cartes par feuille).

```bash
node scripts/assemble-booklets.js [target]
```

| Target | Livret généré |
|--------|---------------|
| `all` | Tous les livrets (défaut) |
| `roles` | `livret-roles.pdf` |
| `moments` | `livret-moments.pdf` |
| `sos` | `livret-sos.pdf` |

**Output** : `print/livrets/`

**Layout 4-UP** :
```
┌─────────┬─────────┐
│  Recto  │  Recto  │
│  Card 1 │  Card 2 │
├─────────┼─────────┤
│  Recto  │  Recto  │
│  Card 3 │  Card 4 │
└─────────┴─────────┘
     Page 1 (rectos)

┌─────────┬─────────┐
│  Verso  │  Verso  │
│  Card 2 │  Card 1 │  ← inversé pour impression recto-verso
├─────────┼─────────┤
│  Verso  │  Verso  │
│  Card 4 │  Card 3 │
└─────────┴─────────┘
     Page 2 (versos)
```

---

## Commandes npm

```bash
# Tout générer
npm run print

# Par type
npm run print:roles
npm run print:moments
npm run print:sos

# Étapes séparées
npm run render           # Seulement les A6
npm run render:roles
npm run assemble         # Seulement les livrets A4
npm run assemble:roles
```

---

## Afficheur cartes - Paramètres URL

### Paramètres disponibles

| Paramètre | Valeurs | Description |
|-----------|---------|-------------|
| `card` | `R1`, `M3`, `S2`... | ID de la carte à afficher |
| `mode` | `print` | Mode impression (masque contrôles, fond blanc) |
| `face` | `recto` / `verso` | Affiche une seule face |
| `autofit` | `true` / `false` | Active/désactive l'ajustement auto de taille |

### Exemples

```
# Preview normal (2 faces côte à côte)
afficheur-cartes.html?card=R1

# Mode print recto seul (ce que Puppeteer capture)
afficheur-cartes.html?card=R1&mode=print&face=recto

# Désactiver l'auto-fit
afficheur-cartes.html?card=R1&autofit=false
```

### Auto-fit du texte

L'afficheur ajuste automatiquement la taille de police pour éviter les débordements :

| Paramètre | Valeur |
|-----------|--------|
| Taille de base | 9pt |
| Taille minimum | 6.5pt |
| Pas de réduction | 0.25pt |

**Indicateurs visuels** (mode preview) :
- Taille actuelle affichée sous chaque face
- Indicateur **rouge** si la taille a été réduite
- Warning **⚠️ DÉBORDEMENT** si même à 6.5pt ça ne rentre pas

**En mode print** : les indicateurs sont masqués, seul le contenu ajusté est visible.

---

## GitHub Actions

### Déclenchement

**Automatique** : Commit avec `[print]` dans le message
```bash
git commit -m "fix: correction carte R2 [print]"
```

**Manuel** : Actions > "Generate Print PDFs" > Run workflow

### Workflow

1. Checkout du repo
2. Install Node.js 20 + dépendances npm
3. Install Chrome pour Puppeteer
4. `render-cards.js` → PDFs A6
5. `assemble-booklets.js` → Livrets A4
6. Commit + push des PDFs générés

**Fichier** : `.github/workflows/generate-print.yml`

---

## Dépendances

| Package | Version | Usage |
|---------|---------|-------|
| puppeteer | ^24.32.0 | Headless Chrome pour capture PDF |
| pdf-lib | ^1.17.1 | Fusion et assemblage des PDFs |
| marked | ^17.0.0 | Parser Markdown |

**Note** : pdf-lib n'est plus maintenu (4 ans) mais reste stable et est la seule lib gratuite permettant de manipuler des PDFs existants.

---

## Spécifications d'impression

| Paramètre | Valeur |
|-----------|--------|
| Format carte | A6 (105 × 148 mm) |
| Format livret | A4 (210 × 297 mm) |
| Papier recommandé | 200-250 g/m² cartonné |
| Impression | Recto-verso bord long |
| Échelle | 100%, sans marges |
| Découpe | Coupe croisée au centre |
| Finition | Plastification 80-125 µm |

---

## Arborescence générée

```
print/
├── cartes/                    # PDFs A6 individuels
│   ├── R1.pdf                 # 2 pages (recto + verso)
│   ├── R2.pdf
│   ├── R3.pdf
│   ├── R4.pdf
│   ├── M1.pdf
│   ├── ...
│   ├── S1.pdf
│   └── ...
└── livrets/                   # Livrets A4 assemblés
    ├── livret-roles.pdf       # 1 feuille A4 (4 cartes)
    ├── livret-moments.pdf     # 2 feuilles A4 (8 slots, 7 cartes + 1 vide)
    ├── livret-sos.pdf         # 1 feuille A4 (4 cartes)
    └── kit-complet.pdf        # Toutes les cartes
```

---

## Troubleshooting

### Les fonts ne se chargent pas

Puppeteer attend `document.fonts.ready`. Si les fonts Google ne se chargent pas :
- Vérifier la connexion réseau
- Le workflow GitHub Actions a accès à Internet

### Débordement malgré l'auto-fit

Le contenu dépasse même à 6.5pt → **réduire le texte source** dans le fichier Markdown.

### Rendu différent entre preview et PDF

- Utiliser **Chrome** pour le preview (même moteur que Puppeteer)
- Vérifier que l'auto-fit est activé des deux côtés

### GitHub Actions ne se déclenche pas

- Vérifier que le message de commit contient `[print]`
- Ou déclencher manuellement via l'interface Actions

---

*Anacoluthe V5 - CC-BY-NC-SA*
