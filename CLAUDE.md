# Consignes pour les agents - repo Anacoluthe

## Deck de soutenance (`soutenance.html`, `assets/css/soutenance.css`)

- **Format de projection unique : 1920 × 1080.** Vérifier le rendu à cette taille seulement. Ne pas tester ni ajuster d'autres tailles ou proportions (4:3, 1280 × 720, mobile), sauf demande explicite de Quentin.
- **Lisibilité** (retour de l'oral blanc n°1) : pas de texte sous `--t-petit`, contraste texte-fond d'au moins 7:1 pour les petits textes. Pour du texte coloré, utiliser `--teal-texte` et `--amber-texte`, pas `--teal-700` ni `--amber-700`.
- **Pas de texte d'explication ou de précaution à l'écran** (« portraits composites », « intentions formulées après coup », « ce qui les distingue… ») : il va dans les notes de présentation (`Dossier_UC12_anacoluthe/soutenance/notes-presentation.md`), dit à l'oral. L'écran porte le contenu, pas son mode d'emploi. Les sources courtes (extrait des statuts, date d'un vote) restent.
- **Ancres des écrans : `eNN-nom`** (`#e01-question`, `#e21-ecart`). Le numéro est celui de l'écran dans le deck. Le préfixe `e` garde des sélecteurs CSS valides (un identifiant CSS ne commence pas par un chiffre). Tout ajout, retrait ou déplacement d'écran renumérote les ancres suivantes, dans `soutenance.html` et dans `soutenance.css`.
- L'archive `archives/soutenance/soutenance-oral-blanc-1.html` est figée, avec sa propre copie du CSS. Ne pas la modifier.
- Les décisions sur le deck et l'oral se consignent dans le repo du dossier : `Dossier_UC12_anacoluthe/soutenance/DECISIONS_SOUTENANCE.md`. Le plan de refonte en cours est dans `Dossier_UC12_anacoluthe/soutenance/CHECKLIST_ORAL_BLANC_1.md`.
