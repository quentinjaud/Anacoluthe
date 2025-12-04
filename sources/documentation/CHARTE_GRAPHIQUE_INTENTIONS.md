# CHARTE GRAPHIQUE ANACOLUTHE - INTENTIONS
*Document de travail - V251204*

---

## 🎯 PHILOSOPHIE VISUELLE

### Intention générale
Un design **léger, accessible et chaleureux** qui reflète l'esprit du projet : coopération bienveillante, pas d'injonction, permission d'explorer.

### Principes directeurs

| Principe | Traduction graphique |
|----------|---------------------|
| **Légèreté** | Couleurs pastel, peu de saturation, pas d'ombres portées |
| **Lisibilité** | Contraste suffisant, hiérarchie claire, typographie lisible |
| **Chaleur** | Tons chauds (ambre, corail), coins arrondis, emojis expressifs |
| **Simplicité** | Peu d'éléments décoratifs, mise en page aérée |
| **Praticité** | Facile à imprimer en couleur, lisible en conditions réelles (bateau, soleil) |

### Ce qu'on évite
- ❌ Ombres portées (alourdissent, compliquent l'impression)
- ❌ Dégradés complexes
- ❌ Typographies fantaisie
- ❌ Surcharge d'éléments graphiques
- ❌ Couleurs trop vives/saturées (fatigue visuelle)

---

## 🎨 PALETTE DE COULEURS

### Couleurs officielles du projet

| Nom | Hex | Usage |
|-----|-----|-------|
| **Bleu Glénans** | `#0066ad` | Référence institutionnelle (usage ponctuel) |
| **Rouge Glénans** | `#e03121` | Référence institutionnelle (usage ponctuel) |
| **Teal Anacoluthe** | `#3d8b87` | Couleur signature moments-clés |
| **Corail Anacoluthe** | `#ff8a5b` | Couleur signature SOS |

### Système de couleurs par type de carte

Chaque type de carte a une déclinaison en 3 niveaux :
- **Fond (50)** : très clair, pour le fond de carte
- **Accent (100)** : clair, pour les sections et tags
- **Texte (700)** : foncé, pour les titres et textes importants

| Type | Fond (50) | Accent (100) | Texte (700) |
|------|-----------|--------------|-------------|
| **Rôles** (R1-R4) | `#fff8f0` | `#ffe8d4` | `#c96a30` |
| **Moments** (M1-M7) | `#e8f4f3` | `#c5e4e2` | `#3d8b87` |
| **SOS** (S1-S4) | `#fff5f2` | `#ffe4db` | `#d9634a` |

### Couleurs utilitaires

| Nom | Hex | Usage |
|-----|-----|-------|
| **Fond crème** | `#FFFDF9` | Fond général (web, affiches) |
| **Texte principal** | `#2D3748` | Corps de texte |
| **Texte secondaire** | `#718096` | Légendes, annotations |
| **Bordure légère** | `#D1D5DB` | Séparation de cartes, encadrés |

---

## 🔤 TYPOGRAPHIE

### Polices

| Usage | Police | Graisse | Exemple |
|-------|--------|---------|---------|
| **Titres** | Merriweather Sans | 800 (extra-bold) | BOSCO |
| **Sous-titres** | Merriweather Sans | 600 (semi-bold) | Le·la gardien·ne du bateau |
| **Corps de texte** | Merriweather (serif) | 300 (light) | Texte descriptif |
| **Labels/Tags** | Merriweather Sans | 600 | Compétences, rôles |

### Import web (Google Fonts)
```css
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Merriweather+Sans:wght@400;600;700;800&display=swap');
```

### Tailles recommandées

**Web :**
- Titre carte : 1.25rem
- Sous-titre : 0.875rem
- Corps : 0.9rem
- Tags : 0.75rem

**Print A6 :**
- Titre carte : 14pt
- Sous-titre : 10pt
- Corps : 9pt
- Tags : 8pt

**Print A4 (affiches) :**
- Titre principal : 24pt
- Sous-titres : 14pt
- Corps : 11pt

---

## 📐 ÉLÉMENTS GRAPHIQUES

### Coins arrondis
- **Cartes** : 16px (web) / 4mm (print)
- **Sections internes** : 8px (web) / 2mm (print)
- **Tags/badges** : pill (999px / très arrondi)

### Bordures
- Épaisseur : 1px
- Couleur : `#D1D5DB` (gris clair)
- Usage : contour des cartes, séparation de sections

### Emojis
- **Fonction** : identification visuelle rapide du type/rôle
- **Position sur cartes** : débordant en haut à gauche (effet "badge")
- **Taille web** : 3.5rem, position absolute `top: -1.5rem; left: 1rem`
- **Taille print** : environ 12mm, débordant du cadre supérieur
- **Ombre très légère** : `drop-shadow(0 1px 2px rgba(0,0,0,0.06))`

### Emojis par carte

**Rôles :**
| Carte | Emoji |
|-------|-------|
| R1 Bosco | 🔧 |
| R2 Navigateurice | 🧭 |
| R3 Second soigneux | 🤲 |
| R4 Cambusier·ère | 🍳 |

**Moments :**
| Carte | Emoji |
|-------|-------|
| M1 Accueil & attentes | 👋 |
| M2 Accords d'équipage | 🤝 |
| M3 Introduction rôles | 🎭 |
| M4 Brief matin | 🌅 |
| M5 Débrief soir | 🌙 |
| M6 Mi-parcours | ⚓ |
| M7 Débrief final | 🏁 |

**SOS :**
| Carte | Emoji |
|-------|-------|
| S1 Conflit/désaccord | 🆘 |
| S2 Temps sans navigation | ⏸️ |
| S3 Rediscuter accords | 🔄 |
| S4 Demande/feedback mono | 💬 |

---

## 📄 SPÉCIFICATIONS PAR SUPPORT

### Cartes A6 (105 × 148 mm)

**Format :** Recto-verso, plastifié

**Structure recto :**
```
┌─────────────────────────────┐
│ 🔧 (emoji débordant)        │
│                             │
│ TITRE                       │
│ Sous-titre                  │
│                             │
│ Description / bio marin·e   │
│                             │
│ ┌─────────────────────────┐ │
│ │ Section compétences     │ │
│ │ ou intentions           │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Structure verso :**
```
┌─────────────────────────────┐
│ MISSIONS / DÉROULÉ         │
│                             │
│ • Le matin / Étape 1        │
│ • En navigation / Étape 2   │
│ • Le soir / Étape 3         │
│                             │
│ ┌─────────────────────────┐ │
│ │ Questions pour t'aider  │ │
│ └─────────────────────────┘ │
│                             │
│ 💡 Transposable à terre     │
│ ou Ancrage                  │
│                             │
│ ─────────────────────────── │
│ Anacoluthe !?    [footer]   │
└─────────────────────────────┘
```

**Marges print :** 5mm minimum (sécurité découpe)

**Densité texte :** ~900 caractères/face max

---

### Affiches A4 (210 × 297 mm)

**Format :** Plastifié, affichage permanent au carré

**Marges :** 10mm

**Orientation :** Portrait (A1 Routines, A2 Tableau) ou Paysage selon contenu

**Footer :** `Anacoluthe !?` + `CC-BY-NC-SA`

---

### Site web

**Largeur max contenu :** 1200px

**Responsive :** Mobile-first, breakpoints à 768px et 1024px

**Espacement grille cartes :** 2.5rem (pour accommoder emoji débordant)

**Fond page :** `#FFFDF9` (crème)

---

## 🏷️ MARQUE

### Nom du projet
**Anacoluthe !?**

- Toujours avec le point d'exclamation et le point d'interrogation
- Pas de logo graphique pour l'instant
- Typographie : Merriweather Sans, weight 800

### Mentions légales
- **Licence :** CC-BY-NC-SA 4.0
- **Auteur :** Quentin Jaud
- **Contexte :** Développé sur la base des Glénans de Marseillan

### Footer type (cartes et affiches)
```
Anacoluthe !?                           CC-BY-NC-SA
```

---

## 🖨️ CONTRAINTES TECHNIQUES PRINT

### Production actuelle (minimaliste)
- Impression couleur maison (jet d'encre ou laser)
- Découpe manuelle
- Plastification pochettes A6/A4

### Recommandations
- **Papier :** 160-200g/m² minimum avant plastification
- **Marges de sécurité :** 5mm pour les cartes, 10mm pour les affiches
- **Pas de fonds perdus** (découpe manuelle)
- **Éviter les aplats de couleur** qui consomment beaucoup d'encre
- **Tester la lisibilité** en conditions réelles (lumière extérieure, reflets plastique)

### Évolutions possibles
Si passage à impression pro : prévoir fichiers avec fonds perdus 3mm et traits de coupe.

---

## 📋 CHECKLIST VALIDATION GRAPHIQUE

Avant de finaliser un support, vérifier :

- [ ] Couleurs cohérentes avec le type de carte (rôle/moment/SOS)
- [ ] Typographie correcte (Merriweather / Merriweather Sans)
- [ ] Emoji présent et bien positionné
- [ ] Densité texte respectée (~900 car/face pour A6)
- [ ] Marges suffisantes pour découpe
- [ ] Footer présent (Anacoluthe !? + licence)
- [ ] Contraste suffisant pour lecture en extérieur
- [ ] Test impression avant production en série

---

## 🔄 ÉVOLUTIONS PRÉVUES

- [ ] Templates InDesign/Canva pour production en série
- [ ] Déclinaison affiches grand format (A3, A2) si besoin
- [ ] Version noir & blanc / économie d'encre si demandée
- [ ] Pictogrammes personnalisés (remplacement emojis) si besoin de cohérence cross-platform

---

*Document d'intentions - À enrichir au fil de la production*
*Anacoluthe !? - CC-BY-NC-SA*
