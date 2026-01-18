# SUIVI CODE - ANACOLUTHE

Journal de maintenance technique et nettoyage du code.

---

## 2026-01-18 - Audit complet + mise à jour affiches

### Contexte
Mise à jour des liens vers les affiches A1/A2/A3 dans fil-semaine.html + audit technique complet du codebase.

### Modifications effectuées

**1. render-cards.js** - Screenshots par page pour affiches multi-pages
- Ajout génération `debug-A3-page1.png` et `debug-A3-page2.png` pour A3 (2 pages)
- Scope limité à `renderAfficheA4()`, cartes A6 non impactées

**2. fil-semaine.css** - CSS dual-image
- Ajout `.fil-tool-image-dual` pour affichage recto/verso côte à côte
- Ajout `.fil-boucle-outil-image-dual` pour version boucle

**3. fil-semaine.html** - 6 blocs affiches corrigés
- Liens corrigés : `affiche-ldb` → `A3`, `affiche-tableau` → `A2`, `affiche-routines` → `A1`
- Classes `fil-tool-pending` retirées
- Emojis overlay retirés
- Images mises à jour vers vraies affiches

**4. assets/images/** - Nouvelles images
- `affiche-A1-routines.png` (copie de print/debug-A1.png)
- `affiche-A3-recto.png` (copie de print/debug-A3-page1.png)
- `affiche-A3-verso.png` (copie de print/debug-A3-page2.png)

### Audit technique
Rapport complet créé : `sources/documentation/ENTRETIEN_CODE.md`

Résumé :
- **CSS** : 47 anomalies, 4 critiques (--amber-500 non définie, .video-embed dupliquée)
- **JS** : 1 XSS potentiel (suivi-loader.js:480), 0 vulnérabilité npm
- **Pipeline** : 4 failles robustesse (JSON.parse sans try-catch, pas de timeout puppeteer)

### À faire (backlog)
Voir `ENTRETIEN_CODE.md` section 5 pour la liste priorisée.

---

## Convention de suivi

Format des entrées :
```
## AAAA-MM-JJ - Titre court

### Contexte
Pourquoi cette intervention.

### Modifications effectuées
Liste des fichiers modifiés et nature des changements.

### Tests
Comment vérifier que ça marche.

### À faire
Ce qui reste à faire suite à cette intervention.
```

---

V_260118
