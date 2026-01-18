# SUIVI DE PRODUCTION ANACOLUTHE V5
## Document de travail courant
*Dernière mise à jour : 260118*

*Historique détaillé et décisions passées → voir `ARCHIVES_PRODUCTION_V5.md`*

---

## 🔄 DERNIÈRES MODIFICATIONS (260118)

### Session 12 - Affiche A3 Marque-page LDB (A4 portrait recto-verso)

**Nouvelle affiche HTML recto-verso**
- Création `sources/affiches/A3_marque_page.html` (format A4 portrait 210×297mm, 2 pages)
- Recto : Pourquoi/Comment remplir le LDB + échelles Beaufort/Douglas + sidebar colonnes LDB
- Verso : 5 piliers coopératifs + brief matin + débrief soir + citation finale

**Améliorations tooling multi-pages**
- `print-render-a4.js` : support `querySelectorAll` pour extraire toutes les pages, hauteur dynamique `297 * pageCount`mm
- `render-cards.js` : détection pageCount, viewport ajusté, screenshot `fullPage: true`
- `cards-index.json` : ajout `format: "A4-portrait"` et `htmlPath` pour A3

**Styles CSS spécifiques A3**
- Section "Pourquoi LDB" : bullets brick-700, strong weight 700
- Section "Comment le remplir" : 3 items en colonnes flex, fond blanc, checkboxes brick-700
- Tables échelles : lignes alternées teintées (teal pour Beaufort, bleu mer pour Douglas)
- Sidebar : 16 champs LDB avec badges amber-100

**Travail restant verso**
- Ajouter infos sur les paquets du jeu
- Nettoyer la forme des 5 piliers

**Affinage affiche A1 Routines**
- Reformulation des tâches : minuscules, participes passés ("moteur et gréement vérifiés")
- Lignes collectives reformulées avec accent sur le "on" ("On sait où on va et qui fait quoi")
- Ajout tâches manquantes (ex: "grignotages disponibles" pour cambuse)
- Cohérence avec le ton du projet

---

## 🔄 DERNIÈRES MODIFICATIONS (260117)

### Session 11 - Affiche A1 Routines Quotidiennes (A4 portrait)

**Nouvelle affiche HTML**
- Création `sources/affiches/A1_routines.html` (format A4 portrait 210×297mm)
- 5 sections de routines : Préparation, Appareillage, Navigation, Avant atterrissage, Après atterrissage
- Section notes avec checkboxes vides par rôle
- Footer centré avec tagline

**Structure HTML par section**
- Titre h2 avec emoji + nom de section
- Ligne collectif (texte commun à toute l'équipe)
- Grille 4 colonnes avec les 4 rôles (bosco, nav, second, cambuse)
- Chaque rôle : emoji + liste de tâches avec checkboxes

**Choix typographiques**
- Import Merriweather serif (weights 300, 400, 700)
- Titres sections : Merriweather Sans, 11pt, bold 700, uppercase, teal
- Collectif-line : Merriweather serif, 8.5pt, light 300
- Tâches rôles : Merriweather serif, 7pt, light 300
- Footer : Merriweather Sans, centré

**Styles testés et rejetés**
- "Section-wrapped" (bloc gris englobant avec titre débordant) → trop lourd visuellement
- Fond coloré sur collectif-line → préféré transparent

**Particularité section Navigation**
- Icône SVG rotation (flèche circulaire) au lieu des checkboxes classiques
- Symbolise les tâches récurrentes/tournantes pendant la nav

**Fichiers créés**
- `sources/affiches/A1_routines.html`
- `assets/js/print-render-a4.js`
- `print-render-a4.html`

**Fichiers modifiés**
- `assets/css/affiches-print.css` - styles A4 portrait, Merriweather serif, grilles rôles
- `scripts/render-cards.js` - format A4-portrait (210×297mm)
- `assets/data/cards-index.json` - entrée A1 mise à jour

---

### Session 10 - Migration A2 Tableau d'équipage vers HTML/Puppeteer

**Migration complète de l'affiche A2**
- Nouveau fichier `sources/affiches/A2_tableau_equipage.html` (remplace le Google Doc)
- CSS dédié `assets/css/affiches-print.css` pour format A4 paysage
- Intégration au script `render-cards.js` avec format A4-landscape (297×210mm)

**Structure HTML**
- 4 sections : Météos Perso, Intentions (6 col), Rôles (4 col), Programme (6 col)
- Grilles CSS avec `grid-template-columns`
- Classes `.bloc`, `.editable`, `.inline`, `.accent-*` pour les blocs

**Ajustements visuels finaux**
- Titre principal : bleu anacoluthe (#1E3A5F), 28pt
- Titres de section : gris doux (#718096)
- Blocs : fond gris léger (#f5f5f5), coins arrondis 3mm
- Intentions : emoji ligne 1, "ma/mon" (light 400) + mot-clé (bold 700) ligne 2
- Rôles/Programme : emoji + titre sur même ligne, aligné centre-haut
- Slider météo : padding réduit (2mm vertical)
- Marges : 15mm

**Fichiers créés**
- `sources/affiches/A2_tableau_equipage.html`
- `assets/css/affiches-print.css`

**Fichiers modifiés**
- `scripts/render-cards.js` - support format A4-landscape
- `sources/suivi/tableau_suivi_cartes.md` - lien A2a mis à jour

---

## 🔄 DERNIÈRES MODIFICATIONS (260116)

### Session 9 - Amélioration page suivi.html

**Nouvelles sections dynamiques**
- Section "🧑‍🍳 En cuisine en ce moment..." (todo list depuis markdown)
- Section "👌 Sorti des cuisines" (accordéon replié par défaut pour tâches terminées)
- Parsing dynamique des sections `## 🔥Sur le feu` et `## 👌 Cooked` du markdown

**Renommages sections**
- "Phase 1 : Cartes & Affiches" → "🎨 Affinage des Cartes & Affiches"
- "Actions hors-digital" → "🔊 Diffusion du jeu"
- "Phases futures" → "👐 Appropriation du jeu"

**Corrections**
- Favicon : correction lien cassé (`favicon.svg` → `logo-anacoluthe.svg`)
- CSS : espacement h2 corrigé (spécificité `.suivi-page section h2`)

**Fichiers modifiés**
- `suivi.html` - structure HTML mise à jour
- `assets/css/suivi.css` - styles accordéon "Cooked", espacement h2
- `assets/js/suivi-loader.js` - parsing sections "Sur le feu" et "Cooked"
- `sources/suivi/tableau_suivi_cartes.md` - ajout sections 🔥 et 👌

---

### Session 8 - Refactorisation code afficheur/print

**Nettoyage CSS**
- Suppression variable redondante `--print-base-font-size` (même valeur que `--print-font-size-max`)
- Fichier : `cards-print.css`

**Factorisation JS**
- Nouvelle fonction `splitByFlip()` dans `markdown-utils.js` - séparation recto/verso
- Nouvelle fonction `prepareMarkdownForPrint()` dans `markdown-utils.js` - nettoyage HEAD/SKIP-PRINT/SKIP-WEB
- Nouvelle fonction `renderModalViewer()` dans `afficheur-cartes.js` - code partagé web/mobile
- Correction ratios tailles dans `renderTechView()` (alignement CSS)

**Fichiers modifiés**
- `assets/css/cards-print.css` - variable supprimée
- `assets/js/markdown-utils.js` - 2 fonctions ajoutées
- `assets/js/afficheur-cartes.js` - refacto + fonction partagée
- `assets/js/print-render.js` - utilise fonctions partagées
- `print-render.html` - cache-busting `?v=2`

**Bilan**
- ~80 lignes dupliquées supprimées
- 3 fonctions partagées créées
- 1 bug potentiel corrigé (ratios)

---

## 🔄 DERNIÈRES MODIFICATIONS (251220)

### Session 7 - Page de suivi de conception (suivi.html)

**Nouvelle page web de suivi**
- Création `suivi.html` - tableau de bord visuel du projet
- Barre de progression globale (% d'avancement calculé sur 5 passes x 21 éléments)
- Stats en temps réel : terminés / en cours / à faire
- Accordéons par paquet (Affiches, Rôles, Moments, SOS)
- Tableau d'avancement par élément avec 5 passes (Fond, Forme, Design, Print, Site)
- Bouton "Notes" par paquet ouvrant une modale avec le fichier markdown
- Section "Retours & mémos" (inbox terrain)
- Section "Actions hors-digital" (impressions, tests terrain, formations)
- Section "Phases futures" (placeholder)

**Architecture fichiers suivi de conception**
```
sources/suivi/
├── tableau_suivi_cartes.md   ← Source unique (éditable)
├── retours_et_memos.md       ← Inbox retours terrain
├── roles_notes.md            ← Notes détaillées rôles
├── moments_notes.md          ← Notes détaillées moments
├── sos_notes.md              ← Notes détaillées SOS
└── affiches_notes.md         ← Notes détaillées affiches
```

**Comportement accordéons**
- Fermés au chargement
- Un seul ouvert à la fois (les autres se ferment)
- Clic sur tout le header (pas juste la flèche)
- Couleurs d'accent par type de paquet (navy/amber/teal/brick)

**Mise à jour footers**
- Ajout lien "🚧 Suivre le travail en cours" dans tous les footers publics
- Pages concernées : index.html, anacoluthe.html, ensavoirplus.html, fil-semaine.html, suivi.html

**Fichiers créés**
- `suivi.html`
- `assets/css/suivi.css`
- `assets/js/suivi-loader.js`
- `sources/suivi/tableau_suivi_cartes.md`
- `sources/suivi/retours_et_memos.md`
- `sources/suivi/*_notes.md` (4 fichiers)

**Fichiers modifiés**
- `index.html`, `anacoluthe.html`, `ensavoirplus.html`, `fil-semaine.html` - footer

**À supprimer**
- `assets/data/suivi-index.json` (remplacé par markdown)

**Renommage**
- "Suivi de production" → "Suivi de conception" (distingue du journal de sessions)

---

## 🔄 DERNIÈRES MODIFICATIONS (251212)

### Session 6 - Corrections CSS fil-semaine

**Cartes SOS - cohérence visuelle**
- Fond des cartes SOS changé de rose (`#FFEBEE`) à blanc (`var(--blanc)`)
- Bordure corail conservée (`#FFCDD2`) pour maintenir l'identité visuelle SOS
- Alignement avec les cartes moments qui ont déjà fond blanc

**Fichier modifié**
- `assets/css/fil-semaine.css` - `.fil-tool-sos .fil-tool-card`

---

## 🔄 MODIFICATIONS PRÉCÉDENTES (251208)

### Session 5 - Refonte page d'accueil (index.html)

**Section Aperçu des cartes - nouveau design pile de cartes**
- Effet "pile de cartes" avec 2 fake cards derrière chaque tuile (rotations légères)
- Structure HTML : `.apercu-stack` > `.apercu-tile-wrapper` > fake cards + tile
- Emoji repositionné dans le header de chaque tuile
- Footer sous chaque pile : "x cartes dans le paquet [badge type]"
- Badges colorés par type (Rôles, Moments, SOS, Affiches)
- Pour affiches : "3 affiches A4 et leur carte mémo" (sans badge)
- Hover : carte se soulève et perd sa rotation
- Responsive fiabilisé (tablette/desktop avec `align-items: start`)

**Bouton Mélanger - Easter egg LMFAO**
- Texte normal : "🎲 Mélanger les cartes 🔀"
- Texte hover : "Everyday I'm shufflin' 🎶" (via `data-hover` + CSS `::after`)
- Emoji 🕺 qui bounce vers le haut au hover (`.shufflin-emoji`)
- Transition fluide cubic-bezier entre les deux états

**Titres de sections**
- Point d'interrogation rouge (`accent-brick`) sur "Un aperçu ?" et "Pourquoi Anacoluthe ?"

**Fichiers modifiés**
- `index.html` - structure HTML complète des tuiles
- `assets/css/style.css` - styles apercu-stack, fake cards, footer, easter egg

**À supprimer (inutilisé)**
- `assets/images/shufflin.png` (remplacé par emoji)

---

## 🔄 MODIFICATIONS PRÉCÉDENTES (251207)

### Session 4 - PWA Install Button
- Ajout bouton "Installer Anacoluthe" à côté du CTA "Utiliser" (section #utiliser)
- Bouton visible uniquement quand installation PWA possible (Chrome/Edge)
- Capture événement `beforeinstallprompt` dans `pwa-status.js`
- Styles harmonisés entre les deux cartes CTA (flex column, line-height communs)
- Carte install : thème navy (#E8EDF4 bg, #1E3A5F border), hover inverse
- Fix meta tag : ajout `mobile-web-app-capable` (standard) en plus de `apple-mobile-web-app-capable`
- Correction hover subtitle `.card-cta` (contraste insuffisant)

**Comportement navigateurs** :
- Chrome/Edge : événement `beforeinstallprompt` → bouton visible → prompt natif au clic
- Firefox/Safari : événement jamais déclenché → bouton masqué (install via menu navigateur)

---

## 🔄 MODIFICATIONS PRÉCÉDENTES (251206)

### Session 3 - Refactoring JS
- Centralisation `autoFit()` dans `markdown-utils.js` (source unique de vérité)
- Suppression code dupliqué entre `afficheur-cartes.js` et `print-render.js`
- Fix compatibilité navigateur : remplacement `??` par syntaxe ternaire
- CSS : suppression margin-bottom dernier élément (espace perdu en auto-fit)
- Réduction step auto-fit : 0.25pt → 0.1pt (meilleur remplissage)

### Session 2 - Générateur PDF
- Ajout suffixe `_overflow` pour cartes dont le contenu déborde même à 6pt
- Amélioration auto-fit : marge sécurité conditionnelle (≥3 steps)
- Mode DEBUG enrichi : dimensions, typographie, screenshots, stats
- Documentation complète dans TECH_INTENTIONS.md (section "🖨️ Génération PDF")

### Session 1 - Architecture
- Extraction JS inline → fichiers séparés (`afficheur-cartes.js`, `print-render.js`, `index.js`)
- Création `TECH_INTENTIONS.md` (architecture, conventions, workflow)
- Nettoyage `DESIGN_INTENTIONS.md` (suppression doublons techniques)
- Scission suivi : `SUIVI_PRODUCTION_V5.md` (travail courant) + `ARCHIVES_PRODUCTION_V5.md` (historique)
- Mise à jour instructions projet (format compact optimisé tokens)

---

## 🎯 OBJECTIF PÉDAGOGIQUE

**Intention** : Acquisition de compétences d'organisation, coopération et savoir-être **transposables à terre**.

**Indicateur J6** : Stagiaires nomment compétences travaillées + comment les réutiliser à terre.

**Progression mono** : J1-J2 modélise → J5-J6 stagiaires s'approprient

---

## 📊 ÉTAT ACTUEL

| Élément | Qté | Statut |
|---------|-----|--------|
| Cartes rôles | 4 | ✅ COMPLET |
| Cartes moments-clés | 7 | 🟡 PROTOS À VALIDER |
| Cartes SOS | 4 | 🟠 PROTOS À VALIDER |
| Affiches A4 | 3 | ✅ COMPLET |
| Mémos affiches A6 | 3 | 🟠 PROTOS À VALIDER |
| Site web | 1 | ✅ EN LIGNE |
| Page suivi | 1 | ✅ EN LIGNE |
| Générateur PDF | 1 | ✅ OPÉRATIONNEL |
| Guides | ? | ⬜ À DÉFINIR |

**Total éléments fixes** : 21 (hors guides)

**Progression** : ~49% (voir suivi.html)

---

## 🟡 PROTOS À VALIDER

### Cartes moments-clés (7)

| # | Moment | Timing | Fichier |
|---|--------|--------|---------|
| M1 | Accueil & attentes | J1 après-midi | `sources/cartes/moments/M1_accueil_attentes_proto.md` |
| M2 | Accords d'équipage | J1 soir | `M2_accords_equipage_proto.md` |
| M3 | Introduction rôles | J1 soir | `M3_introduction_roles_proto.md` |
| M4 | Brief matin | J2-J6 | `M4_brief_matin_proto.md` |
| M5 | Débrief soir | J2-J6 | `M5_debrief_soir_proto.md` |
| M6 | Mi-parcours | J3-J4 | `M6_mi_parcours_proto.md` |
| M7 | Débrief final | J6 | `M7_debrief_final_proto.md` |

### Cartes SOS (4)

| # | Carte | Fichier |
|---|-------|---------|
| S1 | Gérer un conflit/désaccord | `sources/cartes/sos/S1_conflit_ouvert_proto.md` |
| S2 | Temps sans navigation | `S2_temps_sans_navigation_proto.md` |
| S3 | Rediscuter accords/programme | `S3_rediscuter_accords_programme_proto.md` |
| S4 | Demande/feedback mono | `S4_demande_feedback_mono_proto.md` |

### Mémos affiches (3)

| # | Mémo | Fichier |
|---|------|---------|
| A1 | Routines quotidiennes | `sources/affiches/A1_routines_memo.md` |
| A2 | Tableau d'équipage | `A2_tableau_memo.md` |
| A3 | Marque-page LDB | `A3_marque_page_memo.md` |

---

## 🔜 PROCHAINES ÉTAPES

### Priorité haute
- [ ] Relecture/validation des 14 protos (7 moments + 4 SOS + 3 mémos)

**Critères** : densité ~900 car/face, écriture inclusive, ton bienveillant, actions concrètes

### Priorité basse
- [ ] Définir format guides (mono + équipage)
- [ ] Notice livret pour impression

---

## 📚 DOCUMENTATION

| Fichier | Contenu |
|---------|---------|
| `SUIVI_CODE.md` | Audit code, écarts doc/code, méthodes vérification, nettoyage |
| `DESIGN_INTENTIONS.md` | Couleurs, typo, emojis, marqueurs MD, specs print |
| `TECH_INTENTIONS.md` | Architecture JS/CSS, conventions code, workflow Git |
| `CARTES_MOMENTS_INTENTIONS.md` | Intentions pédagogiques moments |
| `CARTES_SOS_INTENTIONS.md` | Intentions pédagogiques SOS |
| `ARCHIVES_PRODUCTION_V5.md` | Historique, décisions passées, chemins fichiers |

---

## 🔧 RAPPELS CRITIQUES

- **Tirets** : uniquement `-` (jamais — ni –)
- **Titres MD** : pas de `**bold**` dans h1-h6
- **Écriture inclusive** : navigateurice, iel, chacun·e
- **Densité A6** : ~900 car/face

---

## 🌊 PHILOSOPHIE V5

**N'est PAS** : test personnalité, méthode management, obligation, activité "en plus"

**EST** : greffe sur routines existantes, 4 rôles techniques, marins réels comme inspirations, compétences transposables, permission d'explorer, langage commun

---

*Anacoluthe V5 - CC-BY-NC-SA*
