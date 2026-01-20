# Plan de travail - Mémos des affiches

> Dernière mise à jour : 20 janvier 2026

---

## Contexte

Les 3 affiches A4 (A1, A2, A3) sont finalisées en HTML/PDF. Chaque affiche a un **mémo A6 R/V** associé qui doit guider son usage.

### Intention du mémo

> **Un guide de facilitation** pour le·la stagiaire qui anime l'usage de l'affiche (souvent le second soigneux). L'affiche est visible - le mémo dit **quand**, **comment** et **avec quelles précautions** l'utiliser.

### Qui lit le mémo ?

- Les stagiaires, principalement le·la second soigneux du jour
- Lu **avec l'affiche sous les yeux** (pas en autonomie)
- But : guider le remplissage et l'animation

---

## Structure type d'un mémo

### RECTO (HEAD)

| Section | Contenu |
|---------|---------|
| **Bloc quote** | Le "pourquoi" - intention pédagogique (éducation populaire) |
| **Description** | Ce que montre l'affiche (structure, sections) |
| **Qui anime** | Second soigneux en priorité, ou n'importe qui |
| **Quand l'utiliser** | Moments précis (brief matin, transitions, etc.) |
| **Déroulé** | Étapes numérotées, concrètes, actionnables |

### VERSO (FLIP)

| Section | Contenu |
|---------|---------|
| **Explications** | Éléments de l'affiche qui nécessitent clarification |
| **Tips / Vigilances** | Pièges courants, astuces terrain |
| **Voir aussi** | Liens vers autres outils (cartes, autres affiches) |

### Ce qu'un mémo ne contient PAS

- ❌ Répétition du contenu visible sur l'affiche
- ❌ Description exhaustive de chaque section de l'affiche

### Ce qu'un mémo DOIT contenir

- ✅ Le "pourquoi" (bloc quote) - seul endroit où ce message pédagogique existe
- ✅ Guidance concrète pour animer/remplir

---

## Grille d'audit

Avant de réécrire, vérifier pour chaque mémo :

| Critère | Question |
|---------|----------|
| **Sections couvertes** | Chaque zone remplissable de l'affiche a-t-elle sa guidance ? |
| **Vocabulaire aligné** | Les termes du mémo = exactement ceux de l'affiche ? |
| **Déroulé clair** | Un stagiaire peut-il animer sans hésiter ? |
| **Tips utiles** | Les pièges courants sont-ils anticipés ? |
| **Densité OK** | < 900 car/face (A6) ? |
| **Ton** | Permission, pas injonction ? |
| **Pourquoi présent** | Bloc quote avec intention pédagogique ? |

---

## État des mémos

### A1m - Routines quotidiennes ✅ FAIT

**Fichier** : `sources/affiches/A1_routines_memo.md`  
**Affiche associée** : `sources/affiches/A1_routines.html`

**Statut** : ✅ Forme finalisée (20 janvier 2026)

**Travail réalisé** :
- Réécriture complète en format "guide de facilitation"
- Ajout bloc quote avec intention pédagogique
- Liste des 6 phases avec emojis pour repérage
- Explication du symbole rotation
- Guidance sur la zone "Actions spécifiques"
- Densité vérifiée : recto 9.2pt, verso 8.5pt (OK)

---

### A2m - Tableau d'équipage

**Fichier** : `sources/affiches/A2_tableau_memo.md`  
**Affiche associée** : `sources/affiches/A2_tableau_equipage.html`

**Statut** : 🔄 À réécrire - PRIORITÉ HAUTE

**Tâche en cours** (tableau de suivi) : *"Compacter FORT le mémo A2 : rajouter des infos sur les postures des 'intentions'"*

**Écarts identifiés** :
- [ ] Les 6 "intentions" sont des postures (patience, écoute...) - le mémo les appelle "compétences"
- [ ] Le mémo mélange usage et explication sans suivre l'ordre des 4 sections de l'affiche
- [ ] Manque de guidance sur les postures : que signifie "travailler ma patience" concrètement ?

**Sections de l'affiche à couvrir** :
1. Météos perso (curseur ☀️→🌧️)
2. Intentions (6 postures : patience, parole, énergie, écoute, précision, coopération)
3. Rôles du jour (4 rôles)
4. Programme (météo, sécu, séances, escales)

**Prochaines étapes** :
1. Définir ce que chaque posture signifie concrètement sur le bateau
2. Réécriture compacte en mode "déroulé du brief"
3. Validation densité (< 900 car/face)

---

### A3m - Marque-page LDB

**Fichier** : `sources/affiches/A3_marque_page_memo.md`  
**Affiche associée** : `sources/affiches/A3_marque_page.html`

**Statut** : ⚠️ OBSOLÈTE - Réécriture nécessaire

**Écarts identifiés** :
- [ ] L'affiche a été totalement refaite (recto + verso enrichis)
- [ ] Le mémo ne reflète plus le contenu réel

**Contenu actuel de l'affiche (à couvrir)** :

**RECTO - Comment remplir le LDB** :
- Section "Pourquoi remplir le livre de bord ?" (4 raisons)
- Échelle de Beaufort (tableau)
- Échelle Douglas (tableau)
- Section "Comment le remplir ?" (3 règles)
- Sidebar : 16 champs d'une ligne LDB expliqués

**VERSO - Faire équipage** :
- 5 piliers coopératifs (parler/écouter, entraide, vigilance, autonomie, sollicitude)
- Brief du matin (3 checkboxes)
- Débrief du soir (2 checkboxes + exemples)
- Mémo des 4 rôles (résumé)
- Mémo des 4 paquets du jeu
- Zone notes effaçables

**Prochaines étapes** :
1. Audit complet : lister ce qui doit être guidé vs ce qui est auto-explicatif
2. Réécriture complète du mémo
3. Validation densité (< 900 car/face)

---

## Ordre de traitement

| Priorité | Mémo | Statut | Raison |
|----------|------|--------|--------|
| ~~1~~ | ~~A1m~~ | ✅ FAIT | ~~Servira de modèle~~ |
| 2 | **A2m** | 🔄 À faire | Tâche "sur le feu" dans le tableau de suivi |
| 3 | **A3m** | 🔄 À faire | Obsolète, bloquant |

---

## Contraintes de forme (rappel)

- **Format** : A6 recto-verso (~900 car/face max)
- **Marqueurs** : `<!-- HEAD -->` et `<!-- FLIP -->`
- **Écriture inclusive** : systématique (iel, chacun·e, etc.)
- **Tirets** : uniquement `-` (jamais — ni –)
- **Ton** : permission d'explorer, pas injonction
- **Bloc quote** : obligatoire pour le "pourquoi" pédagogique

---

## Références

- Affiches HTML : `sources/affiches/A*.html`
- Mémos : `sources/affiches/A*_memo.md`
- Standards design : `sources/documentation/DESIGN_INTENTIONS.md`
- Tableau de suivi : `sources/suivi/tableau_suivi_cartes.md`

---

*Plan créé le 20 janvier 2026*
