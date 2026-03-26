# Affiche promotionnelle Anacoluthe

## Contexte

Créer une **affiche A4 portrait** affichée sur les murs de la base, destinée aux moniteur·ices des Glénans. Objectif principal : **remplir les ateliers-formation du vendredi** sur le thème "Faire équipage, ça s'apprend, ça s'anime !". Le jeu et la communauté sont des arguments de soutien qui donnent de la crédibilité et montrent que la démarche est outillée et vivante.

Ce n'est PAS un outil du jeu (pas dans `cards-index.json`, pas dans `sources/affiches/`). Fichier HTML autonome, rendu en PDF via le pipeline Puppeteer existant.

---

## Structure de l'affiche (de haut en bas)

1. **Titre** : `¿¡ Anacoluthe !?` (accents colorés amber/teal/brick/navy)
2. **Tagline** : "Faire équipage, ça s'apprend, et ça s'anime !"
3. **Texte intro** : pain point moniteur·ice → la démarche comme réponse
4. **QR code** vers `decouvrir.html` + URL `anacoluthe.org`
5. **3 piliers** (pills arrondies, légèrement rotées) — du POV moniteur·ice :
   - **APPRENDRE** : les formations du vendredi (CTA principal, visuellement mis en avant)
   - **EXPÉRIMENTER** : le jeu en stage
   - **ÉCHANGER** : la communauté WhatsApp
6. **4 types de cartes** (mini-cartes rotées avec emoji) :
   - Rôles (R1-R4) / Moments (M1-M7) / Affiches (A1-A3) / Joker (J1-J4)
7. **4 cartes promesses** (orientées mono, dépassant au-dessus de la timeline) :
   - "Vos stagiaires apprennent les uns des autres"
   - "Ils·elles savent gérer un désaccord"
   - "L'équipage se répartit les tâches"
   - "Tout le monde s'éveille et s'émancipe collectivement"
8. **Timeline en bas** : hybride Tuckman / fil-semaine
   - Message : "Votre fil rouge, c'est le déroulé de la semaine"
   - SVG avec courbe + étapes du fil (Cadre, Outils, Rythme, Joker, Ancrer)

---

## Fichiers à créer / modifier

### Créer : `promo/affiche-promo.html`
- HTML autonome, format A4 portrait (210mm × 297mm)
- CSS : `../assets/css/affiches-print.css` + styles inline spécifiques
- Conteneur : `.affiche-a4-portrait`
- Body class : `affiche-ready`
- Twemoji init : `../assets/js/twemoji-init.js`

### Créer : `promo/` (dossier)
- Sépare le contenu promo du contenu du jeu

### Supprimer : `affiche-promo.html` (racine)
- Brouillon web remplacé par la vraie affiche print dans `promo/`

### Modifier : `scripts/render-cards.js`
- Ajouter un target `promo` qui rend `promo/affiche-promo.html` en A4 portrait
- Output vers `print/promo/affiche-promo.pdf`
- Sans toucher à `cards-index.json`

### Modifier : `package.json`
- Ajouter script `"render:promo": "node scripts/render-cards.js promo"`

---

## Styles réutilisés de `affiches-print.css`

- `.affiche-a4-portrait` : 210mm × 297mm, padding 8mm
- `.affiche-header` + variantes colorées : titre uppercase
- `.section-intro` / `.intro-text` : bloc intro, texte justifié 9.5pt
- `.kit-url-bloc` : bloc QR code + URL (logo, texte, QR)
- `.affiche-footer` : crédit 7pt italic
- Variables couleurs, typographie Merriweather Sans / Merriweather

### Styles inline spécifiques à créer

- Pills piliers (border-radius 99mm, rotations légères, verbe en gras + description)
- Mini-cartes types (reprendre `.fil-tool-card` adapté print : 8pt, rotations)
- Cartes promesses (white bg, border-radius 3mm, margin-bottom négatif pour dépasser)
- Timeline SVG hybride (courbe + labels fil-semaine)
- Mise en avant visuelle du pilier APPRENDRE (taille, couleur, ou encadré)

---

## Texte d'intro (proposition)

> Marre de porter seul·e la charge du vivre-ensemble à bord ? **Anacoluthe** outille vos stagiaires pour qu'ils apprennent eux-mêmes à coopérer. 15 cartes, 3 affiches, des routines simples greffées sur ce que vous faites déjà : brief, nav, débrief. Moins de charge mentale pour vous, plus d'autonomie pour l'équipage.

---

## Vérification

1. Ouvrir `promo/affiche-promo.html` dans un navigateur → rendu visuel A4
2. `npm run render:promo` → PDF
3. Ouvrir `print/promo/affiche-promo.pdf` → fidélité
4. `npm run render` (all) → pas cassé
5. Emojis bien rendus en Twemoji
