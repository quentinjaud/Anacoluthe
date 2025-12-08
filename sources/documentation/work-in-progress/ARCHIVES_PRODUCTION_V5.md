# ARCHIVES PRODUCTION ANACOLUTHE V5
## Historique détaillé et décisions passées
*Pour le travail courant → voir `SUIVI_PRODUCTION_V5.md`*

---

## 📅 HISTORIQUE DES VERSIONS

| Version | Date | Contenu |
|---------|------|---------|
| v251208 | 8 déc. 2025 | Refonte page accueil : pile de cartes, footer paquets, easter egg shufflin' |
| v251207 | 7 déc. 2025 | PWA install button, fix meta mobile-web-app-capable |
| v251206 | 6 déc. 2025 | Extraction JS inline → fichiers séparés, création TECH_INTENTIONS.md |
| v251205e | 5 déc. 2025 | Print-render.html dédié Puppeteer, boutons vérifier rendu, auto-fit 6-10pt, support affiches mémos |
| v251205d | 5 déc. 2025 | Mémos affiches protos (A1-A3), simplification available, fusion DESIGN_INTENTIONS.md |
| v251205c | 5 déc. 2025 | Site web : bouton suggestion mailto dans footer modale (desktop + mobile) |
| v251205b | 5 déc. 2025 | Site web : CSS print autonomisé, fonds blancs, footers 2 colonnes, marqueurs SKIP-PRINT/SKIP-WEB |
| v251205 | 5 déc. 2025 | Générateur PDF print : workflow GitHub Actions, scripts render/assemble, dépendances npm |
| v251204d | 4 déc. 2025 | Refonte section contenu (grille tags), objectifs en 3 colonnes, badges alignés droite, subtitles humanisés |
| v251204c | 4 déc. 2025 | Nav bottom pills + scroll spy, CTA JOUER teal, paragraphe origine nom |
| v251204b | 4 déc. 2025 | Site web en ligne anacoluthe.org, design CSS finalisé |
| v251204 | 4 déc. 2025 | Création protos cartes SOS + moments |
| v251203 | 3 déc. 2025 | Intégration intentions cartes SOS |
| v251128 | 28 nov. 2025 | Intégration intentions cartes moments |
| v251114 | 14 nov. 2025 | Intégration affiches A4 |
| v251106 | 6 nov. 2025 | Cartes rôles complètes |
| v251105 | 5 nov. 2025 | Pivot majeur V4→V5 |

---

## ✅ JALONS ATTEINTS (ordre chronologique inverse)

### Décembre 2025

**8 déc - Refonte page d'accueil**
- Section Aperçu : effet pile de cartes (2 fake cards + tile)
- Structure : `.apercu-stack` > `.apercu-tile-wrapper` > fake cards + tile
- Footer sous chaque pile : "x cartes dans le paquet [badge]"
- Hover : carte se soulève, perd sa rotation
- Responsive tablette fiabilisé
- Easter egg bouton : "Everyday I'm shufflin' 🎶" + emoji 🕺 bounce
- Points d'interrogation rouge (accent-brick) sur titres sections

**7 déc - PWA Install Button**
- Bouton "Installer Anacoluthe" visible si installation PWA possible
- Fix meta tag `mobile-web-app-capable`
- Styles cartes CTA harmonisés

**6 déc - Architecture JS**
- Extraction JS inline → fichiers séparés (afficheur-cartes.js, print-render.js, index.js)
- Création TECH_INTENTIONS.md (architecture, conventions, workflow)
- Scission SUIVI_PRODUCTION / ARCHIVES_PRODUCTION

**5 déc - Générateur PDF et CSS print**
- Générateur PDF print opérationnel
- Workflow GitHub Actions avec trigger `[print]`
- Scripts render-cards.js + assemble-booklets.js
- Dépendances à jour : marked 17.x, puppeteer 24.32.x
- CSS print autonomisé pour Puppeteer
- Fonds print blancs pour économie d'encre
- Footers harmonisés : 2 colonnes + pills colorées
- Navigation flottante dans l'atelier à cartes
- Marqueurs SKIP-PRINT / SKIP-WEB implémentés
- Bouton suggestion "💌 Suggérer une modification" dans modale
- Mémos affiches protos créés avec marqueur FLIP
- Gestion statut proto via cards-index.json
- Suppression logique `available` dans cards-loader.js
- Fusion DESIGN_NOTES + CHARTE_GRAPHIQUE → DESIGN_INTENTIONS.md
- Page print-render.html dédiée pour Puppeteer
- Support affiches mémos (A1-A3) dans render-cards.js
- Boutons "🖨️ Vérifier rendu" dans l'atelier
- Auto-fit élargi : 6pt-10pt (était 6.5pt-9pt)

**4 déc - Site web et protos**
- Site web en ligne - anacoluthe.org
- Design CSS finalisé
- Nav bottom pills + scroll spy sur index.html
- CTA "JOUER" accentué teal
- Paragraphe origine du nom (juron Haddock)
- Refonte section contenu index.html : grille tags colorés
- Section objectifs pédagogiques en 3 colonnes
- Badges galerie repositionnés : tous alignés droite en débordement
- Subtitles moments humanisés : "Le premier soir", "Tous les matins"...
- Renommages : "Retour moniteurice", "Marque-page livre de bord"
- Protos cartes SOS créés
- Protos cartes moments créés

**3 déc - Intentions SOS**
- Intentions cartes SOS validées

### Novembre 2025

**28 nov - Intentions moments**
- Intentions cartes moments validées
- Séquencement J1 défini
- Décisions clés : cartes pour équipage entier, M2 = accords relationnels, rotation rôles à discrétion mono

**14 nov - Affiches**
- Affiches A4 complètes (3/3)

**6 nov - Cartes rôles**
- Cartes rôles complètes (4/4)
- 4 marins inspirants sélectionnés et documentés
- Parité 1H/3F validée

**5 nov - Pivot V5**
- Architecture V5 stabilisée
- Abandon archétypes fictifs V4
- Greffe sur routines existantes

---

## 🖨️ GÉNÉRATEUR PDF - DÉTAILS TECHNIQUES

### Pipeline de génération

1. **PREVIEW** (`afficheur-cartes.html`) : Prévisualisation WYSIWYG des cartes au format A6 réel
2. **RENDER** (`scripts/render-cards.js`) : Génération des PDFs A6 individuels via Puppeteer
3. **ASSEMBLER** (`scripts/assemble-booklets.js`) : Assemblage en livrets A4 4-UP via pdf-lib

### Commandes

```bash
npm run print            # Génère tout (render + assemble)
npm run print:roles      # Seulement les cartes rôles
npm run render           # PDFs A6 individuels uniquement
npm run assemble         # Livrets A4 uniquement
```

### Déclenchement GitHub Actions

- Commit avec tag `[print]` dans le message → génération automatique
- Ou déclenchement manuel via Actions > "Generate Print PDFs"

### Fichiers générés

```
print/
├── cartes/              # PDFs A6 individuels (2 pages : recto + verso)
│   ├── R1.pdf ... R4.pdf
│   ├── M1.pdf ... M7.pdf
│   └── S1.pdf ... S4.pdf
└── livrets/             # PDFs A4 assemblés (4-UP, recto-verso bord long)
    ├── livret-roles.pdf
    ├── livret-moments.pdf
    ├── livret-sos.pdf
    └── kit-complet.pdf
```

### Spécifications impression

- Papier : 200-250g/m² cartonné
- Impression : Recto-verso bord long, portrait, 100%, sans marges
- Découpe : Coupe croisée unique au centre de l'A4
- Finition : Plastification 80-125 microns pour usage maritime

### Auto-fit texte

- Taille de base : 10pt (max)
- Taille minimale : 6pt
- Pas de réduction : 0.25pt
- Le contenu est automatiquement réduit si débordement détecté

### Stack technique

| Composant | Technologie | Version |
|-----------|-------------|----------|
| Preview | HTML/CSS + Twemoji + marked.js | - |
| Render | Puppeteer (headless Chrome) | ^24.32.0 |
| Assembler | pdf-lib | ^1.17.1 |
| Markdown | marked | ^17.0.0 |
| Automation | GitHub Actions | Node 20 |

### Décisions clés

- Layout 4-UP : 4 × A6 par feuille A4 (2×2), découpe simple
- Trigger opt-in `[print]` : évite les runs inutiles de GitHub Actions
- pdf-lib maintenu malgré inactivité : seule lib gratuite pour manipulation PDF

---

## 🌐 SITE WEB - ÉVOLUTIONS DÉTAILLÉES

### Structure actuelle

- `index.html` : Page d'accueil (présentation du projet, origine du nom)
- `anacoluthe.html` : Afficheur de cartes interactif
- `afficheur-cartes.html` : Atelier à cartes (preview multi-vues)
- `print-render.html` : Page minimaliste pour Puppeteer

### Design

Style pastel doux, typographie Merriweather (serif) + Merriweather Sans.
Couleurs par type de carte : ambre (rôles), teal (moments), corail (SOS), slate (affiches).

### Navigation

- Nav bottom pills sur index.html (scroll spy, camaïeu rouge Glénans)
- CTA "JOUER" accentué en teal
- Nav bottom pills sur anacoluthe.html (filtres par type de carte)

### Évolutions 251205

- CSS print autonomisé (`cards-print.css`) : imports fonts, variables couleurs, resets - utilisable seul par Puppeteer
- Fonds de cartes print = blanc (économie d'encre), seuls les titres gardent les couleurs d'accent
- Footers harmonisés sur toutes les pages : 2 colonnes (crédits + nav)
- Pills de navigation colorées : bleu (Accueil), teal (Jeu), rouge (Atelier), noir (GitHub)
- Navigation flottante dans l'atelier à cartes (position absolute, masquée en mode print)
- Renommage "L'atelier" → "L'atelier à cartes"
- Footer credits complet : description + projet BPJEPS + licence + dernier commit
- **Marqueurs SKIP-PRINT / SKIP-WEB** : masquage conditionnel de sections selon le contexte de rendu
- **Bouton suggestion** : bouton "💌 Suggérer une modification" dans le footer des modales

### Évolutions 251204

- Section "Contenu du jeu" : format texte court + tags colorés, affiches en premier
- Section "Objectifs pédagogiques" : grille 3 colonnes (Technique, Dysfonctionnements, Émancipation)
- Galerie cartes : badges (PROTO, À VENIR, type) tous alignés à droite en débordement
- Subtitles humanisés : "Le premier soir", "Tous les matins", "À mi-semaine"...
- Renommages : "Retour moniteurice" (ex-Feedback), "Marque-page livre de bord" (ex-LDB)
- Emoji routines : 🔂
- Bold stratégiques dans "Genèse et partage"
- Nav : MISSION (ex-ANCRAGE), OBJECTIFS ajouté

---

## 📚 CHEMINS FICHIERS

### Cartes rôles
- `sources/cartes/roles/R1_bosco.md`
- `sources/cartes/roles/R2_navigateurice.md`
- `sources/cartes/roles/R3_second_soigneux.md`
- `sources/cartes/roles/R4_cambusiere.md`

### Cartes moments (protos)
- `sources/cartes/moments/M1_accueil_attentes_proto.md`
- `sources/cartes/moments/M2_accords_equipage_proto.md`
- `sources/cartes/moments/M3_introduction_roles_proto.md`
- `sources/cartes/moments/M4_brief_matin_proto.md`
- `sources/cartes/moments/M5_debrief_soir_proto.md`
- `sources/cartes/moments/M6_mi_parcours_proto.md`
- `sources/cartes/moments/M7_debrief_final_proto.md`

### Cartes SOS (protos)
- `sources/cartes/sos/S1_conflit_ouvert_proto.md`
- `sources/cartes/sos/S2_temps_sans_navigation_proto.md`
- `sources/cartes/sos/S3_rediscuter_accords_programme_proto.md`
- `sources/cartes/sos/S4_demande_feedback_mono_proto.md`

### Affiches
- `sources/affiches/AFFICHE_A1_ROUTINES_QUOTIDIENNES_V251110.md`
- `sources/affiches/AFFICHE_A2_TABLEAU_EQUIPAGE_V251110.md`
- `sources/affiches/AFFICHE_A3_MARQUE_PAGE_LDB_V251110.md`

### Mémos affiches (protos)
- `sources/affiches/A1_routines_memo.md`
- `sources/affiches/A2_tableau_memo.md`
- `sources/affiches/A3_marque_page_memo.md`

### Site web
- `index.html` - Page d'accueil
- `anacoluthe.html` - Afficheur de cartes
- `afficheur-cartes.html` - Atelier à cartes
- `print-render.html` - Page Puppeteer
- `assets/css/style.css` - Styles généraux
- `assets/css/cards.css` - Styles des cartes
- `assets/css/cards-print.css` - Styles print
- `assets/js/markdown-utils.js` - Fonctions partagées
- `assets/js/cards-loader.js` - Galerie
- `assets/js/afficheur-cartes.js` - Atelier
- `assets/js/print-render.js` - Rendu Puppeteer
- `assets/js/index.js` - Scroll spy accueil
- `assets/data/cards-index.json` - Index des cartes

### Générateur PDF
- `scripts/render-cards.js` - Génération PDFs A6
- `scripts/assemble-booklets.js` - Assemblage livrets A4
- `.github/workflows/generate-print.yml` - Workflow GitHub Actions

### Archives V4
- `archives/v4/` (guides, cartes, personnages)

---

## 🔮 DÉVELOPPEMENTS FUTURS (idées)

### Notice livret pour impression

**Objectif** : Intégrer au PDF des livrets une page pleine de notice.

**Contenu prévu** :
- Crédits (auteur, licence CC-BY-NC-SA, URL projet)
- Consignes pour une impression de qualité (grammage papier, recto-verso bord long, plastification)

**Fichier à créer** : `sources/notice_livret.md`

**Implémentation** : Modifier `scripts/assemble-booklets.js` pour insérer la notice en première ou dernière page des livrets.

---

## 📋 DÉCISIONS PÉDAGOGIQUES CLÉS

### Cartes moments (28 nov)
- Cartes destinées à l'équipage entier (pas juste mono)
- M2 = accords relationnels uniquement (orga quotidienne = routines séparées)
- Rotation des rôles = à la discrétion du·de la mono
- 2 brise-glaces proposés dans M1 (prénom+inattendu, bout qui relie)

### Cartes SOS (3-4 déc)
- Une seule carte S1 couvre conflits interpersonnels ET collectifs
- S2 couvre pétole ET temps trop fort (même dynamique émotionnelle)
- S3 couvre accords d'équipage ET programme (même constat : rediscuter ce qui nous lie)
- S4 garde les 3 cas (positif/ajustement/inconfort) + "formule magique"
- Pas de méthode de décision formelle dans les SOS (trop lourd en crise)
- Triptyque S2 maintenu : collectif obligatoire / collectif optionnel / solo respecté

### Séquencement J1
1. Administratif (accueil base)
2. M1 Accueil & attentes
3. Menu + Avitaillement
4. Topo sécurité (mono)
5. M2 Accords d'équipage (apéro pré-repas)
6. Premier repas ensemble
7. M3 Introduction rôles + tableau d'équipage

---

*Document d'archive - Consulter pour enquêter sur l'origine d'un concept ou d'une fonction*
*Anacoluthe V5 - CC-BY-NC-SA*
