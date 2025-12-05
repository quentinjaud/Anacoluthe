# Notes de design technique - Anacoluthe

Principes et décisions techniques guidant le développement du projet.

---

## 🎯 Principe fondamental : légèreté

**Le site public (anacoluthe.html, index.html) doit rester le plus léger possible.**

Raisons :
- Cible = moniteur·ices et stagiaires sur mobile, parfois avec réseau limité (bateaux, zones côtières)
- Accessibilité = pas d'exclusion par la technique
- Simplicité = moins de dépendances = moins de maintenance

### Implications concrètes

| Composant | Site public | Outils de production |
|-----------|-------------|---------------------|
| Emojis | **Natifs** (0 KB) | Twemoji (contrôle précis) |
| Framework JS | Aucun (vanilla) | OK si nécessaire |
| Fonts | Google Fonts (cachées) | Idem |
| Images | Optimisées, lazy-load | Moins critique |

---

## 📁 Architecture des fichiers

### Séparation site / outils

```
anacoluthe.html     → Consultation publique (léger)
afficheur-cartes.html → Production/preview (peut être lourd)
scripts/            → Node.js, pas chargé par le navigateur
```

### Séparation contenu / présentation

```
sources/            → Markdown pur (contenu)
assets/css/         → Styles (présentation)
assets/data/        → JSON (métadonnées)
```

Le contenu Markdown reste lisible et éditable sans tooling.

---

## 🖨️ Workflow print : WYSIWYG

**Principe** : Ce qu'on voit dans `afficheur-cartes.html` = ce qu'on obtient en PDF.

### Stack choisie

| Étape | Outil | Raison |
|-------|-------|--------|
| Preview | HTML/CSS | Contrôle total du rendu |
| Render | Puppeteer | Chrome headless = rendu identique |
| Assemble | pdf-lib | Manipulation PDF pure JS |

### Pourquoi pas LaTeX/Pandoc ?

- Complexité de setup pour les contributeurs
- Moins de contrôle sur le design graphique
- Debug plus difficile (pas de preview live)

---

## 🎨 Twemoji : usage ciblé

**Problème** : Les emojis natifs varient selon OS/navigateur. Pour l'impression, on veut un rendu identique partout.

**Solution** : Twemoji uniquement dans les outils de production.

| Contexte | Emojis |
|----------|--------|
| `anacoluthe.html` | Natifs |
| `index.html` | Natifs |
| `afficheur-cartes.html` | Twemoji |
| PDFs générés | Twemoji (via Puppeteer) |

### Coût Twemoji

- Script : ~47KB gzippé (1 requête, cache)
- Chaque emoji : ~1-3KB SVG (1 requête par emoji unique)
- Page typique : +50-100KB et +20 requêtes

---

## 📝 Marqueurs Markdown

Les fichiers cartes utilisent des commentaires HTML comme marqueurs de structure. Invisibles au rendu standard, ils permettent à l'afficheur web et au générateur PDF de parser les différentes sections.

### `<!-- HEAD -->` - Entête sticky

Sépare l'entête (H1 titre + H6 sous-titre) du corps de la carte.

```markdown
# 🔧 BOSCO
###### Le·la gardien·ne du bateau

<!-- HEAD -->

> Description de la carte...

## ✨ Section suivante
```

- **Avant** le marqueur = `nav-head` (sticky sur desktop, scroll sur mobile)
- **Après** le marqueur = `card-content` (corps scrollable)
- Un seul par fichier

---

### `<!-- FLIP -->` - Recto/verso

Indique où couper entre les faces pour la génération PDF A6.

```markdown
<!-- HEAD -->

Contenu recto...

<!-- FLIP -->

## 🔧 TES MISSIONS

Contenu verso...
```

- **Avant** = recto (page 1)
- **Après** = verso (page 2)
- Un seul par fichier

---

### `<!-- SKIP-PRINT -->` - Masquer en impression

Masque une section dans le PDF, mais l'affiche sur le web.

```markdown
## 💡 Transposable à terre

**Au travail, en famille...**

<!-- SKIP-PRINT -->

## 📚 Pour aller plus loin

**Livre** : *La Longue Route* - Bernard Moitessier

---

*Anacoluthe - CC-BY-NC-SA*
```

**Portée** : Du marqueur jusqu'au premier rencontré parmi :
- Prochain H2 (`## `) - en sautant celui immédiatement après le marqueur
- Divider (`---`)
- Fin de fichier

| Contexte | Visible ? |
|----------|----------|
| Web (anacoluthe.html) | ✅ Oui |
| Atelier vue Web/Mobile | ✅ Oui |
| Atelier vue Print | ❌ Non |
| PDF Puppeteer | ❌ Non |

**Cas d'usage** : vidéos YouTube, liens externes, contenus enrichis web-only.

---

### `<!-- SKIP-WEB -->` - Masquer sur le web

Masque une section sur le web, mais l'affiche en PDF.

```markdown
## 💡 Transposable à terre

**Au travail, en famille...**

<!-- SKIP-WEB -->

## 📱 Version numérique

*Scannez le QR code pour la version interactive avec vidéos.*

---

*Anacoluthe - CC-BY-NC-SA*
```

**Portée** : Du marqueur jusqu'au premier rencontré parmi :
- Prochain H2 (`## `) - en sautant celui immédiatement après le marqueur
- Divider (`---`)
- Fin de fichier

| Contexte | Visible ? |
|----------|----------|
| Web (anacoluthe.html) | ❌ Non |
| Atelier vue Web/Mobile | ❌ Non |
| Atelier vue Print | ✅ Oui |
| PDF Puppeteer | ✅ Oui |

**Cas d'usage** : instructions print-only, QR codes, mentions "voir en ligne".

---

### Ordre typique dans un fichier

```markdown
# 🔧 TITRE
###### Sous-titre

<!-- HEAD -->

Intro recto...

<!-- SKIP-PRINT -->
[Vidéo web-only]

<!-- FLIP -->

## Verso
Contenu verso...

<!-- SKIP-PRINT -->
## 📚 Pour aller plus loin
[Ressources web-only]
```

**Notes** :
- `HEAD` et `FLIP` : un seul de chaque par fichier
- `SKIP-*` : plusieurs possibles, chacun s'étend jusqu'au prochain H2

---

## 🔤 Conventions typographiques

### Tirets

**UNIQUEMENT le tiret simple `-`** (tiret du clavier).

❌ Jamais de tiret cadratin `—` ni demi-cadratin `–`

Raison : compatibilité maximale, pas de confusion dans le Markdown.

### Titres Markdown

❌ Jamais de `**bold**` dans les titres (h1 à h6)

Les titres sont stylés en gras via CSS, pas besoin de markup supplémentaire.

---

## 📊 Versionnage

| Type de fichier | Convention |
|-----------------|------------|
| Documents fonctionnels | Footer `V_AAMMJJ` |
| Sources/cartes | Pas de version (historique Git) |
| Ce fichier | Date de dernière mise à jour |

---

*Dernière mise à jour : 5 décembre 2025*
