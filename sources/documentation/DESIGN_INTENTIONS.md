# DESIGN INTENTIONS - ANACOLUTHE

Référence unique pour toutes les décisions graphiques et techniques du projet, print et web.

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
- ❌ Iframes (YouTube, etc.) - problèmes de parsing, tracking, poids

### Médias externes (vidéos)

**Pas d'iframes** dans le markdown. Liens simples avec emoji 📺 :

```markdown
**Vidéo recommandée :**  
[📺 Titre de la vidéo](https://www.youtube.com/watch?v=XXX)
```

Raisons :
- Légèreté (0 KB de tracking externe)
- Parsing markdown fiable
- Fonctionne hors-ligne (le lien reste lisible)
- Print-friendly

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

### Import Google Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Merriweather+Sans:wght@400;600;700;800&display=swap');
```

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
| Site public (`index.html`, `anacoluthe.html`) | **Natifs** | Légèreté (0 KB) |
| Atelier (`afficheur-cartes.html`) | **Twemoji** | Rendu identique print |
| PDFs générés | **Twemoji** | Via Puppeteer |

**Coût Twemoji** : ~50-100KB + 20 requêtes par page. Acceptable pour les outils de production, pas pour le site public.

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

Position "badge" en haut à gauche, débordant du cadre.

```css
.card-emoji {
    position: absolute;
    top: -1.5rem;
    left: 1rem;
    font-size: 3.5rem;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.06));
}
```

---

## 📝 Marqueurs Markdown

Les fichiers cartes utilisent des commentaires HTML invisibles pour structurer le contenu.

### `<!-- HEAD -->` - Entête sticky

Sépare l'entête (H1 + H6) du corps.

```markdown
# 🔧 BOSCO
###### Le·la gardien·ne du bateau

<!-- HEAD -->

> Description...
```

- **Avant** = `nav-head` (sticky desktop, scroll mobile)
- **Après** = `card-content`
- Un seul par fichier

### `<!-- FLIP -->` - Recto/verso

Indique où couper pour le PDF A6.

```markdown
Contenu recto...

<!-- FLIP -->

## 🔧 TES MISSIONS
Contenu verso...
```

- **Avant** = recto (page 1)
- **Après** = verso (page 2)
- Un seul par fichier

### `<!-- SKIP-PRINT -->` - Masquer en impression

```markdown
<!-- SKIP-PRINT -->

## 📚 Pour aller plus loin
[Contenu web-only : vidéos, liens...]
```

**Portée** : jusqu'au prochain H2 (en sautant celui juste après), `---`, ou fin de fichier.

| Contexte | Visible ? |
|----------|----------|
| Web | ✅ |
| Print/PDF | ❌ |

### `<!-- SKIP-WEB -->` - Masquer sur le web

```markdown
<!-- SKIP-WEB -->

## 📱 QR Code
[Contenu print-only]
```

| Contexte | Visible ? |
|----------|----------|
| Web | ❌ |
| Print/PDF | ✅ |

---

## 📄 Spécifications par support

### Cartes A6 (105 × 148 mm)

- **Format** : Recto-verso, plastifié
- **Marges** : 5mm minimum
- **Densité** : ~900 caractères/face max
- **Footer** : `Anacoluthe !?` + `CC-BY-NC-SA`

### Affiches A4 (210 × 297 mm)

- **Format** : Plastifié, affichage permanent
- **Marges** : 10mm
- **Orientation** : Portrait ou paysage selon contenu

### Site web

- **Largeur max** : 1200px
- **Responsive** : Mobile-first, breakpoints 768px / 1024px
- **Fond** : `#FFFDF9`
- **Gap grille cartes** : 2.5rem (pour emoji débordant)

---

## 📁 Architecture fichiers

### Séparation site / outils

```
anacoluthe.html       → Consultation publique (léger)
afficheur-cartes.html → Production/preview (peut être lourd)
scripts/              → Node.js (pas chargé navigateur)
```

### Séparation contenu / présentation

```
sources/              → Markdown pur (contenu)
assets/css/           → Styles (présentation)
assets/data/          → JSON (métadonnées)
```

---

## 🖨️ Workflow print

**Principe** : WYSIWYG - ce qu'on voit dans `afficheur-cartes.html` = ce qu'on obtient en PDF.

| Étape | Outil | Fonction |
|-------|-------|----------|
| Preview | HTML/CSS | Contrôle visuel |
| Render | Puppeteer | Chrome headless → PDF A6 |
| Assemble | pdf-lib | Assemblage livrets A4 |

### Commandes

```bash
npm run print         # Génère tout
npm run render        # PDFs A6 uniquement
npm run assemble      # Livrets A4 uniquement
```

### Spécifications impression

- **Papier** : 200-250g/m² cartonné
- **Mode** : Recto-verso bord long, portrait, 100%
- **Découpe** : Coupe croisée au centre de l'A4
- **Finition** : Plastification 80-125 microns

---

## ✍️ Conventions

### Tirets

**UNIQUEMENT `-`** (tiret simple du clavier).

❌ Jamais `—` (cadratin) ni `–` (demi-cadratin)

### Titres Markdown

❌ Pas de `**bold**` dans les titres h1-h6

Les titres sont stylés en gras via CSS.

### Versionnage

| Type | Convention |
|------|------------|
| Docs fonctionnels | Footer `V_AAMMJJ` |
| Sources/cartes | Pas de version (Git) |

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

- [ ] Couleurs cohérentes avec le type (rôle/moment/SOS/affiche)
- [ ] Typographie correcte (Merriweather / Merriweather Sans)
- [ ] Emoji présent et bien positionné
- [ ] Densité texte respectée (~900 car/face pour A6)
- [ ] Marges suffisantes pour découpe
- [ ] Footer présent
- [ ] Contraste suffisant (lecture extérieure)
- [ ] Test impression avant série

---

*Dernière mise à jour : 5 décembre 2025*
*Anacoluthe !? - CC-BY-NC-SA*
