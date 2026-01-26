# SUIVI DE PRODUCTION ANACOLUTHE V5
## Document de travail courant
*Dernière mise à jour : 260126*

*Historique détaillé et décisions passées → voir `ARCHIVES_PRODUCTION_V5.md`*

---

## 🔄 DERNIÈRES MODIFICATIONS (260126)

### Session 20 - Production M5 Débrief soir

**Réécriture complète de M5 en miroir de M4**

La carte M5 a été restructurée selon le même pattern que M4 : structure en temps clairs + ANCRAGE.

**Structure VERSO en 4 sections**
1. **DÉBRIEF TECHNIQUE** : Lae moniteurice anime. Retour sur séances du jour, ce qui a marché, difficultés, ce qu'on travaille demain.
2. **DÉBRIEF COOPÉRATION** : Lae second soigneux anime (dès J2, sauf si iel ne le sent pas). 5 petits tours :
   - Ressenti (un mot)
   - Rôle (ce que j'ai appris)
   - Réussite (bon souvenir humain)
   - Caillou ("Pour que ce soit parfait, j'aurais aimé...")
   - Leçon (ce qu'on retient collectivement)
3. **AJUSTEMENTS** : Si caillou "lourd" → proposer J1 Conflit ou J3 Rediscuter accords. Ce qu'on ajuste pour demain.
4. **⚓ ANCRAGE** : LDB ligne technique + ligne coopération. Lien vers M4 Brief matin.

**Décisions prises**
- Second soigneux anime dès J2 (pas de progression J2-J3 → J4+)
- 5 tours de parole structurés pour le débrief coop (forcer l'expression du négatif avec le tour "caillou")
- Tip enrichi : fonctionnement collectif pas individus + faire court, pas répéter, transformer commentaires en ajustements
- Suppression VARIANTE J5-J6 (devenu inutile)
- Suppression section "Questions pour t'aider" (intégré dans les tours)

**RECTO simplifié**
- Contexte direct : "Ce débrief fait le point sur le technique et sur l'humain"
- Enjeu simple : "comprendre ce qu'on retient, célébrer, nommer ce qui coince"
- Pas de pattern négatif/positif (trop didactique)

**Fichiers modifiés**
- `sources/cartes/moments/M5_debrief_soir.md` - réécriture (renommé depuis _proto)
- `assets/data/cards-index.json` - path, proto:false supprimé
- `sw.js` - chemin mis à jour
- `sources/suivi/tableau_suivi_cartes.md` - M5 marqué ✅ Passe Fond

---

## 🔄 DERNIÈRES MODIFICATIONS (260125)

### Session 19 - Correction génération mémos A6 affiches

**Problème identifié**
Le script `render-cards.js` ne générait que l'affiche A4 pour les entrées avec `format: A4-*`, ignorant le `path` markdown vers le mémo A6.

**Solution implémentée**
1. Modification `render-cards.js` : quand une affiche A4 a aussi un `path` markdown, génère les deux PDFs (affiche A4 + mémo A6)
2. Restructuration `cards-index.json` :
   - `pdfPath` = chemin mémo A6 (cohérent avec afficheur-cartes.js bouton "Télécharger le mémo")
   - `affichePath` = chemin affiche A4 (cohérent avec bouton "Télécharger l'affiche A4")
3. Ajout couleurs navy pour `type-affiche` dans `cards-print.css` (h1, h2, h3, h4, h6, hr)

**Fichiers modifiés**
- `scripts/render-cards.js` - génération mémo A6 après affiche A4
- `assets/data/cards-index.json` - champs pdfPath/affichePath corrigés
- `assets/css/cards-print.css` - couleurs navy type-affiche

**Couleurs ajoutées type-affiche**
- h1, h2 : `#1E3A5F` (navy-700)
- h3, h4, h6 : `#4A6A8A` (navy-500)
- h2 border-top : `#C9D5E3` (navy-100)
- hr : `#7A9CC6` (navy-300)

---

### Session 18 - Production M4 Brief matin

**Réécriture complète de M4 selon nouvelle structure en 3 temps**

La carte M4 a été entièrement repensée. Au lieu d'un brief linéaire de 5-10 min, c'est maintenant un rituel en sandwich :

1. **Lancement** : tableau rempli (météo perso + intentions) → tour de table pour clarifier → lae moniteurice propose les rôles → chacun·e part préparer
2. **Préparation par rôle** : nav prépare le plan, bosco prépare le bateau, cambuse anticipe les repas. Lae second soigneux et les autres aident.
3. **Briefing partagé** : lae second soigneux anime. Chaque rôle briefe (nav, bosco, cambuse, moniteurice).

**Décisions prises**
- Emoji : ☀️ (pas 🌅, plus clair pour "matin")
- Timing : "Tous les matins" sans durée fixe (dépend de la journée)
- Météo perso : pas de tour verbal, déjà sur le tableau d'équipage
- Rôles : proposés par lae moniteurice (pas décision collective)
- Brief technique : intégré comme phase 3 (chaque rôle briefe), pas un signal léger

**Recto enrichi**
- Quote : "Fin du petit-déjeuner, début de la journée. Passer du mode individu au mode équipage..."
- Contexte : explicite le lien avec le tableau d'équipage rempli pendant le petit-déj
- Enjeu : version négative (démarre à froid) + version positive (appareille aligné)

**Convention d'écriture ajoutée**
- "mono" → toujours "moniteurice" (jamais l'abréviation) - ajouté dans CLAUDE.md

**Fichiers modifiés**
- `sources/cartes/moments/M4_brief_matin.md` - réécriture complète
- `sources/documentation/DESIGN_INTENTIONS.md` - emoji 🌅 → ☀️
- `assets/data/cards-index.json` - mise à jour M4 (path, description, tags, proto:false)
- `sources/suivi/tableau_suivi_cartes.md` - M4 marqué ✅ Passe Fond
- `sources/affiches/A2_tableau_memo.md` - emoji corrigé
- `sources/documentation/CARTES_MOMENTS_INTENTIONS.md` - timing + statut
- `sw.js` - chemin mis à jour
- `.claude/CLAUDE.md` - règle mono → moniteurice

**Apprentissages pour M5-M7**
- Identifier les idées clefs de fond AVANT de rédiger (pas juste la forme)
- Vérifier la cohérence avec les outils complémentaires (tableau d'équipage, LDB)
- Enjeu = négatif + positif pour remplir le recto
- La structure du moment peut évoluer significativement vs le proto initial

---

## 🔄 DERNIÈRES MODIFICATIONS (260123)

### Session 17 - Plan d'évaluation cartes moments M4-M7

**Création du plan de travail PLAN_MOMENTS.md**
- Analyse des patterns de raffinement appliqués à M1, M2, M3 (quote engageante, contexte concret, enjeu explicite, tip permission, déroulé actionnable, ANCRAGE, transition)
- Grille d'audit 15 critères pour évaluer chaque proto
- Diagnostic complet des 4 protos restants (M4, M5, M6, M7)
- Identification des écarts par critère (emoji, quote, cohérence intentions, ANCRAGE, progression mono)
- Ordre de traitement proposé : M4 → M5 → M6 → M7 (du plus léger au plus lourd)
- 4 questions à trancher avant production (emojis M4/M7, brief technique M4, feedbacks croisés M7)

**Diagnostic résumé**
- M4 Brief matin : écarts légers (ANCRAGE absent, enjeu implicite)
- M5 Débrief soir : écarts légers (renommage ANCRAGE, précisions déroulé)
- M6 Mi-parcours : écarts moyens (ordre inversé célébration/tensions, retour M1 absent)
- M7 Débrief final : écarts forts (redondance quote/contexte, cohérence intentions, emoji, écriture inclusive)

**Fichiers créés**
- `sources/documentation/work-in-progress/PLAN_MOMENTS.md`

---

## 🔄 DERNIÈRES MODIFICATIONS (260122)

### Session 16 - Passe Fond M2 Accords d'équipage

**Travail de fond sur M2**
- Transformation des thèmes passifs en questions-guides actives
- Nouveau format "pop-corn" au lieu du tour de table par question
- Ajout thème entraide/apprentissage : "Quel cadre pour s'entraider sans prendre la place ?"
- Fusion fatigue/repos/solitude → "Comment on respecte les rythmes de chacun·e ?"
- Sous-thèmes ajoutés sous chaque question pour stimuler la réflexion
- Ajout notion "opposables" dans le tip's (accords invocables si non respectés)
- Consignes meta déplacées au recto (feuille vierge, équilibre temps de parole)
- Logique recto/verso de la feuille d'accords : recto=brainstorm, verso=accords signés
- Phase exploration séparée de reformulation (divergent puis convergent)

**Amélioration SKIP-PRINT**
- Support marqueur de fin explicite `<!-- /SKIP-PRINT -->` dans `markdown-utils.js`
- Permet de masquer uniquement un élément précis (ex: H2 de verso) sans affecter la suite
- Appliqué aux 7 cartes moments (M1-M7) pour masquer le titre de verso en print
- CSS `h4:first-child { margin-top: 0 }` pour le cas où H2 est masqué

**Changement de statut M2**
- Renommage `M2_accords_equipage_proto.md` → `M2_accords_equipage.md`
- Mise à jour références dans : sw.js, cards-index.json, tableau_suivi_cartes.md, SUIVI_PRODUCTION_V5.md

**Fichiers modifiés**
- `sources/cartes/moments/M2_accords_equipage.md` - contenu refondu
- `sources/cartes/moments/M1-M7` - marqueurs SKIP-PRINT ajoutés
- `assets/js/markdown-utils.js` - support `/SKIP-PRINT`
- `assets/css/cards-print.css` - règle h4:first-child

---

### Session 15 - Affinage A1 Routines POV stagiaire

**Synchronisation MD/HTML**
- Le fichier `A1_Routines.md` était désynchronisé du HTML, mise à jour complète

**Affinage des tâches (test utilisateur POV stagiaire)**
- Analyse complète des formulations de tâches
- Vocabulaire maritime (LDB, carré, défenses, brassières) considéré comme acquis en stage

**Améliorations validées dans le HTML**
- Lignes collectives plus concrètes ("On part ensemble, chacun·e à son poste, un poste pour chacun·e")
- Section Navigation : verbes d'action clairs + symbole rotation 🔄 pour tâches continues
- "brassières portées" > "brassières vérifiées" (actionnable)
- "ligne de conclusion au LDB" > "ligne inscrite" (plus parlant)
- Second soigneux : "A aborder : technique, ressentis, coopération" (aide-mémoire débrief)
- Cambuse : "avitaillement" au lieu de "avito'" (mot complet)

**Points restants identifiés (non traités)**
- "matos sécu prêt" et "sécu de base rappelée" : vagues, pourraient être précisés
- "BoatOn" : outil spécifique Glénans, pas universel si le jeu s'ouvre
- "rythme/repos-repas respecté" : intention plus que tâche cochable

**Fichiers modifiés**
- `sources/affiches/A1_Routines.md` - sync complète avec HTML
- `sources/suivi/tableau_suivi_cartes.md` - mise à jour "Cooked"

---

## 🔄 DERNIÈRES MODIFICATIONS (260120)

### Session 14 - Réécriture mémo A2 Tableau d'équipage

**Réécriture complète A2_tableau_memo.md**
- Nouveau format "guide de facilitation" (cohérent avec A1m)
- Bloc quote étoffé : lien coopération/technique
- Section "📌 En pratique" : qui anime + quand (pattern harmonisé sur A1/A2/A3)
- Déroulé en 4 étapes avec durées (météos, intentions, rôles, programme)
- Tableau des 6 intentions avec questions/comportements d'aide :
  - 🧘 Patience : Laisser le temps aux autres avant d'intervenir
  - 🗣️ Parole : Est-ce que j'ose dire quand je ne comprends pas ?
  - ⚡ Énergie : M'engager dans les tâches sans attendre qu'on m'assigne
  - 👂 Écoute : Est-ce que je laisse les autres finir avant de répondre ?
  - 🎯 Précision : Finir proprement ce que je commence
  - 🤝 Coopération : Est-ce que je fais avec les autres ou à côté ?
- Rappel des 4 rôles (descriptions courtes)
- Section "En fin de journée" + "Voir aussi"

**Harmonisation affiche/mémo A2**
- "Dessine ton icône" → "Dessine tes initiales" (affiche HTML)
- "Navigateur·ice" → "Navigateurice" (affiche HTML)
- "Second·e Soigneux·se" → "Second soigneux" (affiche HTML)

**Harmonisation écriture inclusive (3 mémos)**
- "Le·la" → "Lae" partout (A1m, A2m)
- Règle ajoutée dans CLAUDE.md

**Pattern "📌 En pratique" harmonisé**
- A1m : Qui anime + Quand l'utiliser
- A2m : Qui anime + Quand
- A3m : À quoi ça sert + Où le ranger

**Réécriture complète A3_marque_page_memo.md**
- Titre simplifié : "Marque-page" (sans "livre de bord")
- Bloc quote : pont entre technique (LDB) et coopération
- Section "📌 En pratique" : À quoi ça sert + Où le ranger
- Recto : explication complémentarité Beaufort/Douglas (houle résiduelle)
- Recto : aide-mémoire 16 colonnes du LDB
- Verso focalisé : tableau "Quand s'y référer" par pilier
- Lien LDB/coopération (colonne Observations)

**Harmonisation affiche A3 HTML**
- "Second·e soigneux·se" → "Second soigneux"
- "Second·e" → "Second soigneux" (dans les paquets)

**Fichiers modifiés**
- `sources/affiches/A2_tableau_memo.md` - réécriture complète
- `sources/affiches/A2_tableau_equipage.html` - harmonisation vocabulaire
- `sources/affiches/A3_marque_page_memo.md` - réécriture complète
- `sources/affiches/A3_marque_page.html` - harmonisation "Second soigneux"
- `sources/affiches/A1_routines_memo.md` - "lae", section En pratique
- `.claude/CLAUDE.md` - règle "le·la" → "lae"

---

## 🔄 DERNIÈRES MODIFICATIONS (260119)

### Session 13 - Refonte affiches A1/A3 + Renommage M1

**Refonte A1 Routines**
- Restructuration HTML avec `section-wrapper` pour meilleur contrôle CSS print
- Nouveaux emojis : 🔁 (titre principal), 🛬 (avant atterrissage au lieu de 🌴)
- Titres ajustés : "Avant l'atterrissage", "Après l'arrivée"
- Textes collectifs reformulés (ex: "On part ensemble, chacun·e à son poste, un poste pour chacun·e")
- Suppression du footer (redondant)

**Refonte A3 Marque-page verso (COMPLÉTÉ)**
- Section "Les 4 rôles" ajoutée : descriptions courtes + inspirations (Moitessier, Trochet, Autissier, Edwards)
- Section "Les paquets du jeu" ajoutée : 3 affiches, 4 rôles, 7 moments, 4 Joker
- Zone "Mémos" (notes effaçables) ajoutée
- Rituels matin/soir restructurés en 2 colonnes
- Piliers coopératifs condensés (textes raccourcis)

**Twemoji lazy load**
- Nouveau fichier `assets/js/twemoji-init.js` (chargement non-bloquant)
- Intégré aux 3 affiches (A1, A2, A3) via `<script defer>`
- Fallback gracieux : emojis natifs si CDN indisponible

**Renommage M1**
- "Accueil & attentes" → "Accueil & Présentations"
- Mis à jour dans : CARTES_MOMENTS_INTENTIONS.md, DESIGN_INTENTIONS.md, PRESENTATION_V5.md, tableau_suivi_cartes.md
- Fichier renommé : `M1_ACCUEIL_ATTENTES.md` → `M1_accueil_presentations.md`

**Mémos A1 et A2 enrichis**
- Corrections "mono" → "moniteurice" (cohérence écriture inclusive)
- A1_routines_memo.md : intro enrichie sur l'importance des routines
- A2_tableau_memo.md : reformulations diverses

**CSS print ajusté**
- Support `.sections-container` pour répartition verticale A1
- Suppression bordures sur `.role-card` (allègement visuel)
- Ajustements espacement sections A3

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
- Accordéons par paquet (Affiches, Rôles, Moments, Joker)
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
├── joker_notes.md            ← Notes détaillées Joker
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

**Cartes Joker - cohérence visuelle**
- Fond des cartes Joker changé de rose (`#FFEBEE`) à blanc (`var(--blanc)`)
- Bordure corail conservée (`#FFCDD2`) pour maintenir l'identité visuelle Joker
- Alignement avec les cartes moments qui ont déjà fond blanc

**Fichier modifié**
- `assets/css/fil-semaine.css` - `.fil-tool-joker .fil-tool-card`

---

## 🔄 MODIFICATIONS PRÉCÉDENTES (251208)

### Session 5 - Refonte page d'accueil (index.html)

**Section Aperçu des cartes - nouveau design pile de cartes**
- Effet "pile de cartes" avec 2 fake cards derrière chaque tuile (rotations légères)
- Structure HTML : `.apercu-stack` > `.apercu-tile-wrapper` > fake cards + tile
- Emoji repositionné dans le header de chaque tuile
- Footer sous chaque pile : "x cartes dans le paquet [badge type]"
- Badges colorés par type (Rôles, Moments, Joker, Affiches)
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
| Cartes Joker | 4 | 🟠 PROTOS À VALIDER |
| Affiches A4 | 3 | ✅ COMPLET |
| Mémos affiches A6 | 3 | ✅ COMPLET |
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
| M1 | Accueil & Présentations | J1 après-midi | `M1_accueil_presentations.md` |
| M2 | Accords d'équipage | J1 soir | `M2_accords_equipage.md` ✅ |
| M3 | Introduction rôles | J1 soir | `M3_introduction_roles_proto.md` |
| M4 | Brief matin | J2-J6 | `M4_brief_matin_proto.md` |
| M5 | Débrief soir | J2-J6 | `M5_debrief_soir_proto.md` |
| M6 | Mi-parcours | J3-J4 | `M6_mi_parcours_proto.md` |
| M7 | Débrief final | J6 | `M7_debrief_final_proto.md` |

### Cartes Joker (4)

| # | Carte | Fichier |
|---|-------|---------|
| J1 | Gérer un conflit/désaccord | `sources/cartes/joker/J1_conflit_ouvert_proto.md` |
| J2 | Temps sans navigation | `J2_temps_sans_navigation_proto.md` |
| J3 | Rediscuter accords/programme | `J3_rediscuter_accords_programme_proto.md` |
| J4 | Demande/feedback mono | `J4_demande_feedback_mono_proto.md` |

### Mémos affiches (3)

| # | Mémo | Fichier | Statut |
|---|------|---------|--------|
| A1m | Routines quotidiennes | `sources/affiches/A1_routines_memo.md` | ✅ Forme validée |
| A2m | Tableau d'équipage | `A2_tableau_memo.md` | ✅ Forme validée |
| A3m | Marque-page LDB | `A3_marque_page_memo.md` | ✅ Forme validée |

---

## 🔜 PROCHAINES ÉTAPES

### Priorité haute
- [ ] Relecture/validation des 11 protos (7 moments + 4 Joker)

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
| `CARTES_JOKER_INTENTIONS.md` | Intentions pédagogiques Joker |
| `ARCHIVES_PRODUCTION_V5.md` | Historique, décisions passées, chemins fichiers |

---

## 🔧 RAPPELS CRITIQUES

- **Tirets** : uniquement `-` (jamais — ni –)
- **Titres MD** : pas de `**bold**` dans h1-h6
- **Écriture inclusive** : navigateurice, iel, chacun·e
- **Densité A6** : ~900 car/face

---

## 📋 PROCÉDURE CHANGEMENT DE STATUT

Quand une carte passe de proto à validée (passe Fond terminée) :

### 1. Renommer le fichier source
```bash
git mv sources/cartes/xxx/Xx_nom_proto.md sources/cartes/xxx/Xx_nom.md
```

### 2. Mettre à jour les références (4 fichiers)

| Fichier | Modification |
|---------|--------------|
| `assets/data/cards-index.json` | `path`, `pdfPath` (sans _proto), `"proto": false` |
| `sw.js` | Chemin dans le tableau de cache |
| `sources/suivi/tableau_suivi_cartes.md` | Lien MD + colonne Fond → ✅ |
| `SUIVI_PRODUCTION_V5.md` | Tableau "Protos à valider" (optionnel) |

### 3. Commit

### Automatique au prochain build
- **PDF** : `render-cards.js` dérive le nom du PDF depuis `path.basename(card.path, '.md')` → nouveau PDF généré automatiquement
- **Badge PROTO** : disparaît dans l'UI (cards-loader.js lit `proto: false`)
- **Ancien PDF** : reste dans `print/cartes/` → supprimé au prochain CI ou manuellement

### Anomalies connues
- M1 : PDF `M1_ACCUEIL_ATTENTES.pdf` désynchronisé du source `M1_accueil_presentations.md`
- `pdfPath` dans cards-index.json est déclaratif mais non utilisé par le générateur (redondance)

---

## 🌊 PHILOSOPHIE V5

**N'est PAS** : test personnalité, méthode management, obligation, activité "en plus"

**EST** : greffe sur routines existantes, 4 rôles techniques, marins réels comme inspirations, compétences transposables, permission d'explorer, langage commun

---

*Anacoluthe V5 - CC-BY-NC-SA*
