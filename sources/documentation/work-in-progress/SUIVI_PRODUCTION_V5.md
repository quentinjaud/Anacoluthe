# SUIVI DE PRODUCTION ANACOLUTHE V5
## Document de travail courant
*Dernière mise à jour : 251208*

*Historique détaillé et décisions passées → voir `ARCHIVES_PRODUCTION_V5.md`*

---

## 🔄 DERNIÈRES MODIFICATIONS (251208)

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
| Mémos affiches | 3 | 🟠 PROTOS À VALIDER |
| Site web | 1 | ✅ EN LIGNE |
| Générateur PDF | 1 | ✅ OPÉRATIONNEL (debug + overflow) |
| Guides | ? | ⬜ À DÉFINIR |

**Total éléments fixes** : 21 (hors guides)

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
