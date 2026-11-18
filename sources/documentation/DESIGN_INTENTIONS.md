# DESIGN INTENTIONS - ANACOLUTHE

Référence pour les décisions **visuelles** : couleurs, typographie, emojis, supports print.

Pour l'architecture code et les conventions techniques → voir `TECH_INTENTIONS.md`

**Le CSS fait foi.** Les valeurs ci-dessous recopient `assets/css/style.css` et `assets/data/cards-index.json`. En cas d'écart, c'est le code qui a raison, et ce fichier qui se corrige. Dernier alignement : novembre 2026.

---

## 🎯 Philosophie

### Intention générale

Un design **léger, accessible et chaleureux** qui reflète l'esprit du projet : coopération bienveillante, pas d'injonction, permission d'explorer.

### Principes directeurs

| Principe | Traduction |
|----------|------------|
| **Légèreté** | Couleurs pastel, ombres très légères, site web minimal |
| **Lisibilité** | Contraste suffisant, hiérarchie claire |
| **Chaleur** | Tons chauds (ambre, corail), coins arrondis, emojis |
| **Simplicité** | Peu d'éléments décoratifs, mise en page aérée |
| **Praticité** | Lisible en conditions réelles (bateau, soleil, mobile) |

### Ce qu'on évite

- ❌ Ombres marquées (au-delà des valeurs listées en « Éléments graphiques »)
- ❌ Dégradés complexes
- ❌ Typographies fantaisie
- ❌ Surcharge graphique
- ❌ Couleurs trop saturées
- ❌ Iframes (YouTube, etc.)

### Médias externes (vidéos)

Liens simples avec emoji 📺, pas d'iframes :

```markdown
**Vidéo recommandée :**  
[📺 Titre de la vidéo](https://www.youtube.com/watch?v=XXX)
```

---

## 🎨 Palette de couleurs

### Couleurs officielles

| Nom | Hex | Usage |
|-----|-----|-------|
| **Bleu Glénans** | `#0066ad` | Référence institutionnelle |
| **Rouge Glénans** | `#F04839` | Slash des titres, sous-titre d'en-tête |
| **Teal Anacoluthe** | `#3d8b87` | Signature moments-clés |
| **Corail Anacoluthe** | `#ff8a5b` | Ancienne signature Joker, remplacée par la brique. Variable conservée, plus utilisée |

### Système par type de carte

Chaque type a 3 niveaux : fond (50), accent (100), texte (700).

| Type | Fond | Accent | Texte |
|------|------|--------|-------|
| **Rôles** (R1-R4) | `#fff8f0` | `#ffe8d4` | `#c96a30` |
| **Moments** (M1-M7) | `#e8f4f3` | `#c5e4e2` | `#3d8b87` |
| **Joker** (J1-J4) | `#FFEBEE` | `#FFCDD2` | `#C62828` (brique) |
| **Affiches** (A1-A4) | `#E8EDF4` | `#C9D5E3` | `#1E3A5F` (navy) |

### Couleurs utilitaires

| Nom | Hex | Usage |
|-----|-----|-------|
| **Fond crème** | `#FFFDF9` | Fond général |
| **Texte principal** | `#2D3748` | Corps de texte |
| **Texte secondaire** | `#718096` | Légendes |
| **Bordure légère** | `#D1D5DB` | Séparation cartes |

---

## 🔤 Typographie

### Polices

| Usage | Police | Graisse |
|-------|--------|---------|
| **Titres** | Merriweather Sans | 800 |
| **Sous-titres** | Merriweather Sans | 600 |
| **Corps** | Merriweather (serif) | 300 |
| **Labels/Tags** | Merriweather Sans | 600 |
| **Sous-titre d'en-tête** | Merriweather Sans italique, rouge Glénans | 300 |
| **Légendes sous un objet** | Merriweather italique, texte secondaire | 300 |

### Tailles

| Contexte | Titre | Sous-titre | Corps | Tags |
|----------|-------|------------|-------|------|
| **Web** | 1.25rem | 0.875rem | 0.9rem | 0.75rem |
| **Print A6** | 14pt | 10pt | 9pt | 8pt |
| **Print A4** | 24pt | 14pt | 11pt | - |

---

## 😀 Emojis

### Par carte

Source de vérité : le champ `emoji` de `assets/data/cards-index.json`, que le site affiche partout où il montre une carte.

**Rôles :**
| Carte | Emoji | Nom |
|-------|-------|-----|
| R1 | 🔧 | Bosco |
| R2 | 🧭 | Navigateurice |
| R3 | 🤲 | Second soigneux |
| R4 | 🍳 | Cambusier·ère |

**Moments :**
| Carte | Emoji | Nom |
|-------|-------|-----|
| M1 | 🌅 | Accueil & Attentes |
| M2 | 🤝 | Accords d'équipage |
| M3 | 👥 | Découverte des rôles |
| M4 | ☀️ | Brief matin |
| M5 | 🌙 | Débrief soir |
| M6 | ⚓ | Mi-parcours |
| M7 | 🎯 | Débrief final |

**Joker :**
| Carte | Emoji | Nom |
|-------|-------|-----|
| J1 | ⚡ | Gérer un désaccord-conflit |
| J2 | ⏸️ | Temps sans navigation |
| J3 | 🔄 | Rediscuter le cadre |
| J4 | 💬 | Demande-retour moniteurice |

**Affiches et mémos :**
| Pièce | Emoji | Nom |
|-------|-------|-----|
| A1 | 🔂 | Routines quotidiennes |
| A2 | 📋 | Tableau d'équipage |
| A3 | 📖 | Marque-page Livre de bord |
| A4 | 🧭 | Découverte du dispositif (mémo de présentation, non affiché à bord) |

**Variantes connues, à arbitrer** : `fil-semaine.html` illustre certaines cartes avec d'autres emojis (M1 🎯, M2 📜, M3 🎭, M6 ⚖️, J2 🌧️), et les titres markdown de deux affiches en portent d'autres (`A1_routines_memo.md` 🔁, `A2_tableau_memo.md` 🌊).

### Natifs vs Twemoji

| Contexte | Emojis | Raison |
|----------|--------|--------|
| Site public | **Twemoji** depuis le CDN, chargé après le rendu par `assets/js/twemoji-init.js`, emojis natifs en repli hors ligne | Rendu identique d'un appareil à l'autre, sans retarder l'affichage |
| Atelier / PDFs | **Twemoji** | Rendu identique cross-platform |

---

## 📐 Éléments graphiques

### Titres de section

La signature du site, sur l'accueil, « En savoir plus », « Se former » et la soutenance :

```html
<h2><span class="slash">/</span> Qu'est-ce qu'on <span class="highlight">y gagne</span><span class="accent-brick"> ?</span></h2>
```

- **Slash** : rouge Glénans, graisse 900, en tête du titre.
- **Mot porté** : un seul par titre, en blanc sur bleu Glénans (`.highlight`).
- **Question** : un titre interrogatif se ferme sur un point d'interrogation brique, précédé d'une espace.
- **Nom** : `¿¡ Anacoluthe !?`, les quatre signes en ambre, teal, brique et navy.

### Coins arrondis

| Élément | Web | Print |
|---------|-----|-------|
| Cartes | 16px | 4mm |
| Sections | 8px | 2mm |
| Tags/badges | pill (999px) | pill |

### Bordures

- Épaisseur : 1px
- Couleur : `#D1D5DB`

### Ombres

Uniquement légères, sur ce qui flotte ou se pose (en-tête, pastilles, mini-cartes, affiches posées) :
- Repos : `0 2px 8px rgba(0,0,0,0.04)` à `0.1`
- Survol : `0 4px 12px rgba(0,0,0,0.12)`

### Mini-cartes (fil de la semaine)

Représentation d'une carte du kit dans une page (`.fil-tool-card`) : 90 × 120 px, fond blanc, coins de 8 px, bord d'1 px à la couleur 100 de la famille, ombre de repos. Dans la carte, l'emoji et le code (M1, R1, J1) ; sous la carte, le nom en Merriweather Sans 700 à la couleur 700 de la famille, puis une légende en Merriweather italique. Rotations : -3°, +3°, -1,5°.

### Emoji débordant (cartes)

Position "badge" en haut à gauche, débordant du cadre :
- Taille : 3.5rem
- Position : `top: -1.5rem`, `left: 1rem`
- Ombre très légère

---

## 📝 Marqueurs Markdown

Les fichiers cartes utilisent des commentaires HTML invisibles pour structurer le contenu.

### `<!-- HEAD -->` - Entête sticky

Sépare l'entête (H1 + H6) du corps.

- **Avant** = `nav-head` (sticky desktop)
- **Après** = `card-content` (scrollable)
- Un seul par fichier

### `<!-- FLIP -->` - Recto/verso

Indique où couper pour le PDF A6.

- **Avant** = recto (page 1)
- **Après** = verso (page 2)
- Un seul par fichier

### `<!-- SKIP-PRINT -->` - Masquer en impression

Contenu visible sur web, masqué en PDF.

**Portée** : jusqu'au prochain H2, `---`, ou fin de fichier.

### `<!-- SKIP-WEB -->` - Masquer sur le web

Contenu visible en PDF, masqué sur web (ex: QR codes).

---

## 📄 Spécifications supports

### Cartes A6 (105 × 148 mm)

- **Format** : Recto-verso, plastifié
- **Marges** : 5mm minimum
- **Densité** : ~900 caractères/face max
- **Footer** : `Anacoluthe !?` + `CC-BY-NC-SA`

### Affiches A4 (210 × 297 mm)

- **Format** : Plastifié, affichage permanent
- **Marges** : 10mm

### Site web

- **Largeur max** : 1200px
- **Responsive** : Mobile-first
- **Fond** : `#FFFDF9`
- **Gap grille cartes** : 2.5rem (pour emoji débordant)

### Soutenance (`soutenance.html`)

- Même charte que le site, à l'échelle d'un vidéoprojecteur (tailles en vh)
- Polices Merriweather et Merriweather Sans embarquées dans `assets/fonts/`
- Images propres au deck dans `assets/images/soutenance/`

---

## 🖨️ Workflow print

**Principe** : WYSIWYG - ce qu'on voit dans `afficheur-cartes.html` = ce qu'on obtient en PDF.

| Étape | Outil |
|-------|-------|
| Preview | afficheur-cartes.html |
| Render | Puppeteer → PDF A6 |
| Assemble | pdf-lib → livrets A4 |

### Spécifications impression

- **Papier** : 200-250g/m² cartonné
- **Mode** : Recto-verso bord long
- **Découpe** : Coupe croisée au centre A4
- **Finition** : Plastification 80-125 microns

---

## 🏷️ Marque

### Nom

**Anacoluthe !?** (avec ponctuation)

### Footer type

```
Anacoluthe !?                           CC-BY-NC-SA
```

### Mentions

- Licence : CC-BY-NC-SA 4.0
- Auteur : Quentin Jaud
- Contexte : Base des Glénans de Marseillan

---

## ✅ Checklist validation

Avant de finaliser un support :

- [ ] Couleurs cohérentes avec le type
- [ ] Typographie correcte
- [ ] Emoji présent et bien positionné
- [ ] Densité texte respectée
- [ ] Marges suffisantes
- [ ] Footer présent
- [ ] Contraste suffisant

---

*Anacoluthe !? - CC-BY-NC-SA*
