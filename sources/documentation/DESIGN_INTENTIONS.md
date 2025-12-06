# DESIGN INTENTIONS - ANACOLUTHE

Référence pour les décisions **visuelles** : couleurs, typographie, emojis, supports print.

Pour l'architecture code et les conventions techniques → voir `TECH_INTENTIONS.md`

---

## 🎯 Philosophie

### Intention générale

Un design **léger, accessible et chaleureux** qui reflète l'esprit du projet : coopération bienveillante, pas d'injonction, permission d'explorer.

### Principes directeurs

| Principe | Traduction |
|----------|------------|
| **Légèreté** | Couleurs pastel, pas d'ombres, site web minimal |
| **Lisibilité** | Contraste suffisant, hiérarchie claire |
| **Chaleur** | Tons chauds (ambre, corail), coins arrondis, emojis |
| **Simplicité** | Peu d'éléments décoratifs, mise en page aérée |
| **Praticité** | Lisible en conditions réelles (bateau, soleil, mobile) |

### Ce qu'on évite

- ❌ Ombres portées
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
| **Rouge Glénans** | `#e03121` | Référence institutionnelle |
| **Teal Anacoluthe** | `#3d8b87` | Signature moments-clés |
| **Corail Anacoluthe** | `#ff8a5b` | Signature SOS |

### Système par type de carte

Chaque type a 3 niveaux : fond (50), accent (100), texte (700).

| Type | Fond | Accent | Texte |
|------|------|--------|-------|
| **Rôles** (R1-R4) | `#fff8f0` | `#ffe8d4` | `#c96a30` |
| **Moments** (M1-M7) | `#e8f4f3` | `#c5e4e2` | `#3d8b87` |
| **SOS** (S1-S4) | `#fff5f2` | `#ffe4db` | `#d9634a` |
| **Affiches** (A1-A3) | `#f8fafc` | `#e2e8f0` | `#475569` |

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

### Tailles

| Contexte | Titre | Sous-titre | Corps | Tags |
|----------|-------|------------|-------|------|
| **Web** | 1.25rem | 0.875rem | 0.9rem | 0.75rem |
| **Print A6** | 14pt | 10pt | 9pt | 8pt |
| **Print A4** | 24pt | 14pt | 11pt | - |

---

## 😀 Emojis

### Par carte

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
| M1 | 👋 | Accueil & attentes |
| M2 | 🤝 | Accords d'équipage |
| M3 | 🎭 | Introduction rôles |
| M4 | 🌅 | Brief matin |
| M5 | 🌙 | Débrief soir |
| M6 | ⚓ | Mi-parcours |
| M7 | 🏁 | Débrief final |

**SOS :**
| Carte | Emoji | Nom |
|-------|-------|-----|
| S1 | 🆘 | Conflit/désaccord |
| S2 | ⏸️ | Temps sans navigation |
| S3 | 🔄 | Rediscuter accords |
| S4 | 💬 | Demande/feedback mono |

**Affiches :**
| Affiche | Emoji | Nom |
|---------|-------|-----|
| A1 | 🔂 | Routines quotidiennes |
| A2 | 📋 | Tableau d'équipage |
| A3 | 📖 | Marque-page LDB |

### Natifs vs Twemoji

| Contexte | Emojis | Raison |
|----------|--------|--------|
| Site public | **Natifs** | Légèreté (0 KB) |
| Atelier / PDFs | **Twemoji** | Rendu identique cross-platform |

---

## 📐 Éléments graphiques

### Coins arrondis

| Élément | Web | Print |
|---------|-----|-------|
| Cartes | 16px | 4mm |
| Sections | 8px | 2mm |
| Tags/badges | pill (999px) | pill |

### Bordures

- Épaisseur : 1px
- Couleur : `#D1D5DB`

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
