# SUIVI DE PRODUCTION ANACOLUTHE V5
## État d'avancement après travail site web
*Dernière mise à jour : 251205d (5 décembre 2025)*

---

## 🎯 OBJECTIF PÉDAGOGIQUE GLOBAL

**Intention fondamentale** : Acquisition de **compétences d'organisation** (individuelles et collectives), de **compétences de coopération** et de **savoir-être** adaptées à la voile en équipage et **transposables à terre**.

**Indicateur de réussite J6** :  
Lors du débrief J6, les stagiaires disent avoir découvert des choses sur eux·elles et leur coopération, et sont capables de **nommer des compétences** qu'ils·elles ont travaillées et **comment les réutiliser à terre**.

**Progression moniteur·rice** :  
J1-J2 : Modélise l'usage des rôles → J5-J6 : Stagiaires s'approprient le système

**Note importante** : L'autonomie est un effet secondaire bienvenu, **pas l'objectif principal**.

---

## 📊 ARCHITECTURE VALIDÉE V5

### Vue d'ensemble

| Élément | Format | Quantité | Statut |
|---------|--------|----------|--------|
| **Cartes rôles** | A6 R/V | 4 | ✅ COMPLET |
| **Cartes moments-clés** | A6 R/V | 7 | 🟡 PROTOS CRÉÉS |
| **Cartes SOS coopératives** | A6 R/V | 4 | 🟠 PROTOS CRÉÉS |
| **Affiches permanentes** | A4 | 3 | ✅ COMPLET |
| **Mémos affiches** | A6 R/V | 3 | 🟠 PROTOS CRÉÉS |
| **Site web** | GitHub Pages | 1 | ✅ EN LIGNE |
| **Générateur PDF** | GitHub Actions | 1 | ✅ OPÉRATIONNEL |
| **Guide équipage** | À définir | ? | ⬜ À définir |
| **Guide mono** | À définir | ? | ⬜ À définir |

**TOTAL ÉLÉMENTS FIXES** : 21 (4+7+4+3+3)

---

## ✅ PRODUCTION COMPLÉTÉE

### 🧭 Cartes rôles (4/4) - COMPLET

**Version finalisée** : `sources/cartes/roles/`

| # | Rôle | Marin·e inspirant·e | Focus |
|---|------|---------------------|-------|
| R1 | 🔧 Bosco | Bernard Moitessier (H, 1925-1994) | Entretien bateau, autonomie technique |
| R2 | 🧭 Navigateurice | Capucine Trochet (F, 1981-) | Route, météo, vision d'ensemble |
| R3 | 🤲 Second soigneux | Isabelle Autissier (F, 1956-) | Bien-être équipage, régulation |
| R4 | 🍳 Cambusier·ère | Tracy Edwards (F, 1962-) | Repas, convivialité, observation |

**Parité** : 1H/3F (intentionnel)

---

### 📌 Affiches A4 permanentes (3/3) - COMPLET

**Version finalisée** : `sources/affiches/`

| # | Affiche | Contenu |
|---|---------|---------|
| A1 | Routines quotidiennes | 5 phases chrono (préparation → départ → navigation → approche → arrivée) |
| A2 | Tableau d'équipage | Météo perso + 6 compétences + rôles du jour + programme |
| A3 | Marque-page LDB | Recto: Beaufort/Douglas - Verso: 5 piliers coopératifs + guidance brief/débrief |

**Mémos d'accompagnement (protos)** : `sources/affiches/`

| # | Mémo | Contenu | Fichier |
|---|------|---------|----------|
| A1 | Routines quotidiennes | À quoi ça sert, où l'afficher, comment l'utiliser | `A1_routines_memo.md` |
| A2 | Tableau d'équipage | Mode d'emploi brief matin + fin de journée | `A2_tableau_memo.md` |
| A3 | Marque-page LDB | Utilisation échelles, 5 piliers, guidance brief/débrief | `A3_marque_page_memo.md` |

---

### 🖨️ Générateur PDF print - OPÉRATIONNEL

**Pipeline de génération** : Workflow automatisé en 3 étapes pour produire des PDFs imprimables.

**Architecture** :
1. **PREVIEW** (`afficheur-cartes.html`) : Prévisualisation WYSIWYG des cartes au format A6 réel
2. **RENDER** (`scripts/render-cards.js`) : Génération des PDFs A6 individuels via Puppeteer
3. **ASSEMBLER** (`scripts/assemble-booklets.js`) : Assemblage en livrets A4 4-UP via pdf-lib

**Commandes locales** :
```bash
npm run print            # Génère tout (render + assemble)
npm run print:roles      # Seulement les cartes rôles
npm run render           # PDFs A6 individuels uniquement
npm run assemble         # Livrets A4 uniquement
```

**Déclenchement GitHub Actions** :
- Commit avec tag `[print]` dans le message → génération automatique
- Ou déclenchement manuel via Actions > "Generate Print PDFs"

**Fichiers générés** :
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

**Spécifications impression** :
- Papier : 200-250g/m² cartonné
- Impression : Recto-verso bord long, portrait, 100%, sans marges
- Découpe : Coupe croisée unique au centre de l'A4
- Finition : Plastification 80-125 microns pour usage maritime

**Stack technique** :
| Composant | Technologie | Version |
|-----------|-------------|----------|
| Preview | HTML/CSS + Twemoji + marked.js | - |
| Render | Puppeteer (headless Chrome) | ^24.32.0 |
| Assembler | pdf-lib | ^1.17.1 |
| Markdown | marked | ^17.0.0 |
| Automation | GitHub Actions | Node 20 |

**Décisions clés** :
- Layout 4-UP : 4 × A6 par feuille A4 (2×2), découpe simple
- Trigger opt-in `[print]` : évite les runs inutiles de GitHub Actions
- pdf-lib maintenu malgré inactivité : seule lib gratuite pour manipulation PDF

---

### 🌐 Site web - EN LIGNE

**URL** : [anacoluthe.org](https://anacoluthe.org)

**Structure** :
- `index.html` : Page d'accueil (présentation du projet, origine du nom)
- `anacoluthe.html` : Afficheur de cartes interactif
- `assets/css/` : Styles (style.css, cards.css)
- `assets/js/` : Scripts (cards-loader.js)
- `assets/data/` : Index des cartes (cards-index.json)

**Design** : Style pastel doux, typographie Merriweather (serif) + Merriweather Sans.
Couleurs par type de carte : ambre (rôles), teal (moments), corail (SOS), slate (affiches).

**Navigation** :
- Nav bottom pills sur index.html (scroll spy, camaïeu rouge Glénans)
- CTA "JOUER" accenté en teal
- Nav bottom pills sur anacoluthe.html (filtres par type de carte)

**Évolutions 251205** :
- CSS print autonomisé (`cards-print.css`) : imports fonts, variables couleurs, resets - utilisable seul par Puppeteer
- Fonds de cartes print = blanc (économie d'encre), seuls les titres gardent les couleurs d'accent
- Footers harmonisés sur toutes les pages : 2 colonnes (crédits + nav)
- Pills de navigation colorées : bleu (Accueil), teal (Jeu), rouge (Atelier), noir (GitHub)
- Navigation flottante dans l'atelier à cartes (position absolute, masquée en mode print)
- Renommage "L'atelier" → "L'atelier à cartes"
- Footer credits complet : description + projet BPJEPS + licence + dernier commit
- **Marqueurs SKIP-PRINT / SKIP-WEB** : masquage conditionnel de sections selon le contexte de rendu
- **Bouton suggestion** : bouton "💌 Suggérer une modification" dans le footer des modales (visible desktop + mobile), ouvre un mailto:contact@anacoluthe.org avec sujet pré-rempli

**Évolutions 251204 soir** :
- Section "Contenu du jeu" : format texte court + tags colorés, affiches en premier
- Section "Objectifs pédagogiques" : grille 3 colonnes (Technique, Dysfonctionnements, Émancipation)
- Galerie cartes : badges (PROTO, À VENIR, type) tous alignés à droite en débordement
- Subtitles humanisés : "Le premier soir", "Tous les matins", "À mi-semaine"...
- Renommages : "Retour moniteurice" (ex-Feedback), "Marque-page livre de bord" (ex-LDB)
- Emoji routines : 🔂
- Bold stratégiques dans "Genèse et partage"
- Nav : MISSION (ex-ANCRAGE), OBJECTIFS ajouté

**Référence design** : `sources/documentation/DESIGN_INTENTIONS.md`

---

## 🟡 PROTOS CRÉÉS - À VALIDER

### 📋 Cartes moments-clés (7/7 protos créés)

**Fichiers** : `sources/cartes/moments/`

| # | Moment | Timing | Durée | Fichier |
|---|--------|--------|-------|---------|
| M1 | Accueil & attentes | J1 après-midi | 20-30 min | `M1_accueil_attentes_proto.md` |
| M2 | Accords d'équipage | J1 soir | 30-45 min | `M2_accords_equipage_proto.md` |
| M3 | Introduction rôles | J1 soir (après M2) | 15-20 min | `M3_introduction_roles_proto.md` |
| M4 | Brief matin | J2-J6 quotidien | 5-10 min | `M4_brief_matin_proto.md` |
| M5 | Débrief soir | J2-J6 quotidien | 10-20 min | `M5_debrief_soir_proto.md` |
| M6 | Mi-parcours | J3 ou J4 | 20-30 min | `M6_mi_parcours_proto.md` |
| M7 | Débrief final | J6 après-midi | 45 min | `M7_debrief_final_proto.md` |

**Séquencement J1 validé** :
1. Administratif (accueil base)
2. M1 Accueil & attentes
3. Menu + Avitaillement
4. Topo sécurité (mono)
5. M2 Accords d'équipage (apéro pré-repas)
6. Premier repas ensemble
7. M3 Introduction rôles + tableau d'équipage

**Décisions clés (28 nov)** :
- Cartes destinées à l'équipage entier (pas juste mono)
- M2 = accords relationnels uniquement (orga quotidienne = routines séparées)
- Rotation des rôles = à la discrétion du·de la mono
- 2 brise-glaces proposés dans M1 (prénom+inattendu, bout qui relie)

---

### 🆘 Cartes SOS coopératives (4/4 protos créés)

**Fichiers** : `sources/cartes/sos/`

**Nature** : Outils **curatifs** - interviennent quand les cartes moments n'ont pas suffi.

**Déclencheur** : Équipage ou mono, souvent à l'initiative d'un stagiaire (parfois le second soigneux du jour).

| # | Carte SOS | Situation | Fichier |
|---|-----------|-----------|---------|
| S1 | Gérer un conflit/désaccord | Tension interpersonnelle ou collective | `S1_conflit_ouvert_proto.md` |
| S2 | Organiser un temps sans navigation | Pétole ou temps trop fort | `S2_temps_sans_navigation_proto.md` |
| S3 | Rediscuter accords/programme | Accord non respecté ou frustration technique | `S3_rediscuter_accords_programme_proto.md` |
| S4 | Faire une demande/feedback au mono | Feedback positif / ajustement / inconfort | `S4_demande_feedback_mono_proto.md` |

**Décisions clés (3-4 déc)** :
- Une seule carte S1 couvre conflits interpersonnels ET collectifs
- S2 couvre pétole ET temps trop fort (même dynamique émotionnelle)
- S3 couvre accords d'équipage ET programme (même constat : rediscuter ce qui nous lie)
- S4 garde les 3 cas (positif/ajustement/inconfort) + "formule magique"
- Pas de méthode de décision formelle dans les SOS (trop lourd en crise)
- Triptyque S2 maintenu : collectif obligatoire / collectif optionnel / solo respecté

**Statut protos (4 déc)** : Créés, à relire pour validation densité texte et pertinence

---

## 🔜 PRODUCTION À VENIR

### Sprint 1 : Validation protos cartes - PRIORITÉ HAUTE

**Prochaine étape** : Relecture et validation des 11 protos (7 moments + 4 SOS)

**Critères de validation** :
- Densité ~900 car/face respectée
- Écriture inclusive systématique
- Ton bienveillant, non injonctif
- Actions concrètes et réalistes

---

### Sprint 2 : Guides - PRIORITÉ BASSE

- Guide mono : format à définir
- Guide équipage : format à définir

---

## 🔮 DÉVELOPPEMENTS FUTURS

### Notice livret pour impression

**Objectif** : Intégrer au PDF des livrets une page pleine de notice.

**Contenu prévu** :
- Crédits (auteur, licence CC-BY-NC-SA, URL projet)
- Consignes pour une impression de qualité (grammage papier, recto-verso bord long, plastification)

**Fichier à créer** : `sources/notice_livret.md`

**Implémentation** : Modifier `scripts/assemble-booklets.js` pour insérer la notice en première ou dernière page des livrets.

---

## 📈 STATISTIQUES & PROGRESSION

### Complétion globale V5

| Catégorie | Fait | Total | % | Statut |
|-----------|------|-------|---|--------|
| Cartes rôles | 4 | 4 | 100% | ✅ COMPLET |
| Cartes moments-clés | 7* | 7 | 100%* | 🟡 Protos OK |
| Cartes SOS | 4* | 4 | 100%* | 🟠 Protos OK |
| Affiches A4 | 3 | 3 | 100% | ✅ COMPLET |
| Mémos affiches | 3* | 3 | 100%* | 🟠 Protos OK |
| Site web | 1 | 1 | 100% | ✅ EN LIGNE |
| Guide équipage | 0 | ? | 0% | ⬜ À définir |
| Guide mono | 0 | ? | 0% | ⬜ À définir |
| **TOTAL ÉLÉMENTS FIXES** | **21*** | **21** | **100%*** | 🔄 Protos à valider |

*\* Protos créés - relecture/validation à faire*

### Avancement qualitatif

- ✅ Architecture V5 stabilisée
- ✅ 4 marins inspirants sélectionnés et documentés
- ✅ Parité 1H/3F validée
- ✅ Affiches A4 complètes
- ✅ Intentions cartes moments validées (28 nov)
- ✅ Intentions cartes SOS validées (3 déc)
- ✅ Protos cartes SOS créés (4 déc)
- ✅ Protos cartes moments créés (4 déc)
- ✅ Site web en ligne - anacoluthe.org (4 déc)
- ✅ Design CSS finalisé (4 déc)
- ✅ Nav bottom pills + scroll spy sur index.html (4 déc)
- ✅ CTA "JOUER" accenté teal (4 déc)
- ✅ Paragraphe origine du nom (juron Haddock) (4 déc)
- ✅ Refonte section contenu index.html : grille tags colorés (4 déc)
- ✅ Section objectifs pédagogiques en 3 colonnes (4 déc)
- ✅ Badges galerie repositionnés : tous alignés droite en débordement (4 déc)
- ✅ Subtitles moments humanisés : "Le premier soir", "Tous les matins"... (4 déc)
- ✅ Renommages : "Retour moniteurice", "Marque-page livre de bord" (4 déc)
- ✅ Générateur PDF print opérationnel (5 déc)
- ✅ Workflow GitHub Actions avec trigger `[print]` (5 déc)
- ✅ Scripts render-cards.js + assemble-booklets.js (5 déc)
- ✅ Dépendances à jour : marked 17.x, puppeteer 24.32.x (5 déc)
- ✅ CSS print autonomisé pour Puppeteer (5 déc)
- ✅ Fonds print blancs pour économie d'encre (5 déc)
- ✅ Footers harmonisés : 2 colonnes + pills colorées (5 déc)
- ✅ Navigation flottante dans l'atelier à cartes (5 déc)
- ✅ Marqueurs SKIP-PRINT / SKIP-WEB implémentés (5 déc)
- ✅ Bouton suggestion "💌 Suggérer une modification" dans modale (5 déc)
- ✅ Mémos affiches protos créés avec marqueur FLIP (5 déc)
- ✅ Gestion statut proto via cards-index.json (pas de suffixe _proto dans noms fichiers)
- ✅ Suppression logique `available` dans cards-loader.js : si dans JSON = disponible (5 déc)
- ✅ Fusion DESIGN_NOTES + CHARTE_GRAPHIQUE → DESIGN_INTENTIONS.md (5 déc)
- 🟡 Relecture/validation protos à faire
- ⬜ Guides à définir

---

## 📅 HISTORIQUE DES VERSIONS

| Version | Date | Contenu |
|---------|------|---------|
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

## 📚 DOCUMENTS DE RÉFÉRENCE

### Production V5 (dans ce repo)

**Cartes rôles**
- `sources/cartes/roles/R1_bosco.md`
- `sources/cartes/roles/R2_navigateurice.md`
- `sources/cartes/roles/R3_second_soigneux.md`
- `sources/cartes/roles/R4_cambusiere.md`

**Cartes moments (protos)**
- `sources/cartes/moments/M1_accueil_attentes_proto.md`
- `sources/cartes/moments/M2_accords_equipage_proto.md`
- `sources/cartes/moments/M3_introduction_roles_proto.md`
- `sources/cartes/moments/M4_brief_matin_proto.md`
- `sources/cartes/moments/M5_debrief_soir_proto.md`
- `sources/cartes/moments/M6_mi_parcours_proto.md`
- `sources/cartes/moments/M7_debrief_final_proto.md`

**Cartes SOS (protos)**
- `sources/cartes/sos/S1_conflit_ouvert_proto.md`
- `sources/cartes/sos/S2_temps_sans_navigation_proto.md`
- `sources/cartes/sos/S3_rediscuter_accords_programme_proto.md`
- `sources/cartes/sos/S4_demande_feedback_mono_proto.md`

**Affiches**
- `sources/affiches/AFFICHE_A1_ROUTINES_QUOTIDIENNES_V251110.md`
- `sources/affiches/AFFICHE_A2_TABLEAU_EQUIPAGE_V251110.md`
- `sources/affiches/AFFICHE_A3_MARQUE_PAGE_LDB_V251110.md`

**Mémos affiches (protos)**
- `sources/affiches/A1_routines_memo.md`
- `sources/affiches/A2_tableau_memo.md`
- `sources/affiches/A3_marque_page_memo.md`

**Référence design**
- `sources/documentation/DESIGN_INTENTIONS.md` ← **Référence unique (couleurs, typo, emojis, marqueurs MD, workflow print)**

**Documentation**
- `sources/documentation/CARTES_MOMENTS_INTENTIONS.md`
- `sources/documentation/CARTES_SOS_INTENTIONS.md`
- `sources/documentation/SYNTHESE_REFONTE_V5.md`
- `sources/documentation/PRESENTATION_V5.md`

**Site web**
- `index.html` - Page d'accueil
- `anacoluthe.html` - Afficheur de cartes
- `afficheur-cartes.html` - Preview print A6
- `assets/css/style.css` - Styles généraux
- `assets/css/cards.css` - Styles des cartes
- `assets/js/cards-loader.js` - Chargement dynamique des cartes
- `assets/data/cards-index.json` - Index des cartes

**Générateur PDF**
- `scripts/render-cards.js` - Génération PDFs A6 (Puppeteer)
- `scripts/assemble-booklets.js` - Assemblage livrets A4 (pdf-lib)
- `.github/workflows/generate-print.yml` - Workflow GitHub Actions
- `package.json` - Dépendances npm (marked, pdf-lib, puppeteer)
- `print/cartes/` - PDFs A6 générés
- `print/livrets/` - Livrets A4 assemblés

### Archives V4
- `archives/v4/` (guides, cartes, personnages)

---

## 🔧 CONVENTIONS TECHNIQUES

### Marqueurs de structure dans les fichiers markdown

**Contexte** : Les fichiers markdown des cartes utilisent des commentaires HTML invisibles pour structurer le contenu. Ces marqueurs permettent à l'afficheur web et aux outils de génération PDF de parser correctement les différentes sections.

#### Marqueur `<!-- HEAD -->` - Entête de carte

**Usage** : Sépare l'entête (H1 titre + H6 sous-titre) du corps de la carte.

```markdown
# 🔧 BOSCO
###### Le·la gardien·ne du bateau

<!-- HEAD -->

> Description de la carte...

## ✨ Section suivante
```

**Règles** :
- Un seul marqueur par fichier
- Tout avant `<!-- HEAD -->` = nav-head (affiché en sticky sur desktop)
- Tout après `<!-- HEAD -->` = card-content (corps scrollable)
- Format attendu avant le marqueur : H1 avec emoji + H6 sous-titre

**Comportement afficheur** :
- Desktop (>1024px) : nav-head reste fixe en haut, fond coloré selon type
- Mobile/tablette : nav-head scroll avec le contenu

#### Marqueur `<!-- FLIP -->` - Recto/verso pour impression

**Usage** : Indique où couper entre les faces recto et verso pour la génération PDF.

```markdown
# 🔧 BOSCO
###### Le·la gardien·ne du bateau

<!-- HEAD -->

Contenu recto...

<!-- FLIP -->

## 🔧 TES MISSIONS DE BOSCO

Contenu verso...
```

**Règles** :
- Un seul marqueur par fichier carte
- Tout avant `<!-- FLIP -->` = recto
- Tout après `<!-- FLIP -->` = verso
- Le commentaire est invisible au rendu markdown standard

**Applicable à** : Cartes rôles (R1-R4), cartes moments (M1-M7), cartes SOS (S1-S4), mémos affiches (A1-A3)

### Formatage markdown des titres

**Règle** : Pas de `**bold**` dans les titres markdown (h1 à h6)

**Raison** : Le bold dans les titres (`## **Titre**`) génère un `<strong>` qui bloque l'héritage de couleur CSS. Les titres ont déjà `font-weight: 700` dans le CSS, le bold est donc redondant et problématique.

**Exemples** :
- ❌ `## 🤝 **ACCORDS D'ÉQUIPAGE**`
- ✅ `## 🤝 ACCORDS D'ÉQUIPAGE`

---

## 🌊 PHILOSOPHIE V5 (rappel)

### Ce que V5 N'est PAS
❌ Test de personnalité  
❌ Méthode de management  
❌ Obligation/contrainte  
❌ Système de notation  
❌ Activité "en plus" de la voile  

### Ce que V5 EST
✅ Greffe sur routines existantes  
✅ 4 rôles quotidiens techniques  
✅ Marins·ères réel·les comme inspirations  
✅ Compétences transposables à terre  
✅ Permission d'explorer (pas injonction)  
✅ Langage commun pour coopération  

---

*Document vivant - Mis à jour à chaque avancement significatif*  
*Anacoluthe V5 - CC-BY-NC-SA*
