# ⚓ Anacoluthe

**Apprendre l'organisation collective et le vivre ensemble par la voile habitable.**

Anacoluthe transforme l'apprentissage accidentel du "vivre-ensemble" en apprentissage structuré. Le dispositif se greffe sur les routines existantes des stages de voile pour développer des compétences de coopération transposables à terre.

🌐 **Site web** : [anacoluthe.org](https://anacoluthe.org)

---

## 🌊 Un contexte d'apprentissage exceptionnel

Un voilier est un espace singulier : quelques mètres carrés où six personnes qui ne se connaissent pas vont vivre ensemble pendant six jours. Ce contexte est **ambivalent** :

**➕ Terrain d'apprentissage extraordinaire**
- Entouré·es d'inconnu·es dans un milieu différent du quotidien
- Opportunité d'expérimenter d'autres façons d'être
- Sortir de ses habitudes comportementales

**➖ Environnement cognitivement et émotionnellement exigeant**
- Fatigue physique et promiscuité constante
- Apprentissage technique dense
- Adaptation à un milieu parfois hostile

**Anacoluthe fait de cette exigence une opportunité** : transformer l'intensité du contexte embarqué en apprentissage profond du vivre-ensemble.

---

## 🎯 Objectifs pédagogiques

Acquisition de **compétences d'organisation, de coopération et de savoir-être** adaptées à la voile en équipage et **transposables dans le quotidien à terre** (travail, famille, associations).

**Au jour 6 du stage** : Les stagiaires sont capables de nommer les compétences qu'ils·elles ont travaillées et d'expliquer comment les réutiliser dans leurs vies.

Ces compétences ne sont pas un "plus" sympathique de la voile habitable. Ce sont des **compétences fondamentales** pour naviguer en sécurité, mais aussi des **compétences citoyennes** nécessaires pour vivre ensemble dans un contexte socio-politique et économique de plus en plus tendu.

---

## 📦 Contenu du dispositif (V5)

| Élément | Quantité | Format | Fonction |
|---------|----------|--------|----------|
| **Cartes Rôles** | 4 | A6 R/V plastifié | Rôles techniques quotidiens |
| **Cartes Moments-clés** | 7 | A6 R/V plastifié | Animation temps forts J1→J6 |
| **Cartes Joker** | 4 | A6 R/V plastifié | Régulation tensions |
| **Mémos affiches** | 4 | A6 R/V plastifié | Résumés des affiches, à garder sur soi |
| **Affiches permanentes** | 4 | A4 plastifié | Routines, tableau, livre de bord, découverte |
| **Guides moniteurice** | 2 | Markdown | Mémo testeur + brief moniteurices |
| **Présentations** | 1 | HTML reveal.js | Atelier découverte promo BP |

### Les 4 rôles quotidiens

Chaque rôle est incarné par un·e marin·e inspirant·e du monde nautique réel :

| Rôle | Marin·e inspirant·e | Focus |
|------|---------------------|-------|
| 🔧 **Bosco** | Bernard Moitessier | Entretien bateau, anticipation matérielle |
| 🧭 **Navigateurice** | Capucine Trochet | Route, météo, vision d'ensemble |
| 🤲 **Second soigneux** | Isabelle Autissier | Bien-être équipage, régulation |
| 🍳 **Cambusier·ère** | Tracy Edwards | Repas, convivialité, observation |

### Les 4 affiches A4 permanentes

- **Routines quotidiennes** : 5 phases de navigation avec actions collectives et responsabilités par rôle
- **Tableau d'équipage** : support effaçable pour le rituel quotidien (météo perso, rôles, compétences, programme)
- **Marque-page livre de bord** : échelles Beaufort/Douglas + 5 piliers du "faire équipage"
- **Découverte du dispositif** : vue d'ensemble du jeu complet, paquets, QR code

---

## 📁 Structure du dépôt

```
Anacoluthe/
├── index.html               # 🌐 Page d'accueil du site
├── anacoluthe.html          # 🃏 Afficheur de cartes interactif
├── afficheur-cartes.html    # 🖨️ Atelier à cartes (preview multi-vues)
├── ensavoirplus.html        # 📚 Page "En savoir plus"
├── fil-semaine.html         # 📅 Fil de la semaine J1→J6
├── suivi.html               # 🚧 Tableau de bord suivi de conception
├── decouvrir.html           # 🎤 Hub des présentations
├── print-render.html        # 🖨️ Render PDF A6 (Puppeteer)
├── print-render-a4.html     # 🖨️ Render PDF A4 (Puppeteer)
├── assets/                  # 🎨 Ressources web
│   ├── css/                 # Styles (style.css, cards.css, affiches-print.css, fil-semaine.css, suivi.css...)
│   ├── js/                  # Scripts (cards-loader.js, markdown-utils.js, afficheur-cartes.js, suivi-loader.js...)
│   ├── data/                # Données JSON (cards-index.json)
│   └── images/              # Images
├── scripts/                 # ⚙️ Scripts de génération
│   ├── render-cards.js      # Markdown → PDFs A6/A4 (Puppeteer)
│   └── assemble-booklets.js # PDFs A6 → Livrets A4 (pdf-lib)
├── sources/                 # 📝 Fichiers sources
│   ├── cartes/
│   │   ├── roles/           # R1-R4
│   │   ├── moments/         # M1-M7
│   │   └── joker/           # J1-J4
│   ├── affiches/            # Mémos A6 (A1-A4) + Affiches A4 (HTML)
│   ├── documentation/       # Synthèses, intentions
│   │   └── work-in-progress/
│   ├── guides-seances-topos/ # Guides d'animation, briefs moniteurice
│   ├── presentations/       # Decks reveal.js + thème CSS
│   └── suivi/               # Tableau d'avancement, retours terrain, notes
├── print/                   # 📄 PDFs générés
│   ├── cartes/              # PDFs A6 individuels
│   └── livrets/             # Livrets A4 assemblés (4-UP)
├── archives/                # 📦 Versions V1-V4
└── README.md
```

---

## 🖨️ Générer et imprimer les cartes

### PDFs prêts à l'emploi

Les PDFs sont générés automatiquement et disponibles dans le dossier `print/` :

| Fichier | Contenu | Format |
|---------|---------|--------|
| `livret-roles.pdf` | 4 cartes rôles (R1-R4) | 1 feuille A4 |
| `livret-moments.pdf` | 7 cartes moments (M1-M7) | 2 feuilles A4 |
| `livret-joker.pdf` | 4 cartes Joker (J1-J4) | 1 feuille A4 |
| `livret-memos.pdf` | 4 mémos affiches (A1-A4) | 1 feuille A4 |
| `kit-complet.pdf` | Toutes les cartes + mémos | 5 feuilles A4 |

### Générer localement

```bash
# Installation des dépendances
npm install

# Générer tous les PDFs
npm run print

# Ou par type
npm run print:roles
npm run print:moments
npm run print:joker
```

### Spécifications d'impression

- **Papier** : 200-250g/m² cartonné
- **Impression** : Recto-verso bord long, portrait, 100%, sans marges
- **Découpe** : Coupe croisée unique au centre de la feuille A4
- **Finition** : Plastification 80-125 microns recommandée pour usage maritime

> **Auto-fit** : Le texte est automatiquement ajusté entre 6pt et 10pt pour éviter les débordements.

### Stack technique

| Composant | Technologie |
|-----------|-------------|
| Preview | HTML/CSS + Twemoji + marked.js |
| Render | Puppeteer (headless Chrome) |
| Assembler | pdf-lib |
| Présentations | reveal.js 5.2.1 (CDN) |
| Automation | GitHub Actions (trigger `[print]`) |

---

## 🏫 Contexte de création

Anacoluthe est un projet-support d'apprentissage développé dans le cadre d'une formation **BPJEPS spécialité « Educateur Sportif » mention « Voile croisière jusqu'à 200 milles nautiques d'un abri »**, réalisée en apprentissage sur la base des [Glénans](https://www.glenans.asso.fr/) de Marseillan.

Le dispositif a été co-conçu avec l'équipe pédagogique de la base et enrichi par les contributions de collectifs au-delà des Glénans : praticien·nes de l'éducation populaire, formateur·ices en coopération, chercheur·ses en pédagogie des groupes.

**Ancrage dans la mission des Glénans** : Dans ses statuts, l'association se décrit comme une *"École de formation à la mer, et, par elle, à la vie collective"*. Anacoluthe contribue à cette mission historique.

---

## 📚 Fondements pédagogiques

- **Éducation populaire** (Freire, hooks, Freeman) : émancipation par acquisition de compétences
- **Communication NonViolente** : sentiments/besoins, dépersonnalisation des tensions
- **Modèle ICE** (Isolated, Confined, Extreme - Palinkas & Suedfeld) : phases prévisibles de la vie de groupe
- **Transfert d'apprentissage** (Tardif) : Contextualisation → Décontextualisation → Recontextualisation
- **Coopération** : horizontalité progressive, décision à zéro objection

---

## 🤝 Contribuer

Les contributions sont bienvenues :

- Retours d'expérience terrain (moniteur·ices, stagiaires)
- Adaptations à d'autres contextes (colocs, équipes projet, camps, résidences...)
- Améliorations graphiques et ergonomiques
- Enrichissements pédagogiques

**Pour contribuer** : Ouvrez une issue sur GitHub ou contactez moi directement !

---

## 📄 Licence

Ce projet est sous licence **Creative Commons BY-NC-SA 4.0**.

[![CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Vous êtes libres de :
- **Partager** : copier, distribuer et communiquer le matériel
- **Adapter** : remixer, transformer et créer à partir du matériel

Selon les conditions suivantes :
- **Attribution** : vous devez créditer l'œuvre (Quentin Jaud)
- **Pas d'utilisation commerciale** : OK dans des contextes associatifs et collectifs, mais pas sans demande dans un contexte "entreprise"
- **Partage dans les mêmes conditions** : redistribution sous même licence

Ce partage ouvert s'inscrit dans la volonté des Glénans de contribuer à la construction de **savoirs ouverts autour de la voile**.

---

## 👤 Auteur & Contact

**Quentin Jaud**
- Designer & animateur éducation populaire et sportive
- Animateur d'[Origami Aventures](https://origami-aventures.org)

---

## 📜 Historique des versions

- **V5** (nov. 2025 → mars 2026) → **Version actuelle** : 19 cartes + 4 affiches (23 éléments), greffe sur routines existantes, 4 marins·ères inspirant·es réel·les, présentations reveal.js, page suivi de conception
- **V4** (oct. 2025) → 19 cartes en 5 paquets thématiques, 6 archétypes fictifs
- **V1-V3** (2024-2025) → Explorations initiales, variation des supports des animations collectives et des personnages/archetypes.

---

*Faire équipage, ça s'apprend, ça se travaille, ensemble* 🌊
