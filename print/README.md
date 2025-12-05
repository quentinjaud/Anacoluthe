# 🖨️ Print - PDFs imprimables Anacoluthe

Ce dossier contient les PDFs générés automatiquement pour l'impression des cartes.

## Structure

```
/print/
├── cartes/              ← PDFs A6 individuels (2 pages : recto + verso)
│   ├── R1_bosco.pdf
│   ├── R2_navigateurice.pdf
│   └── ...
├── livrets/             ← Livrets A4 assemblés (4-UP, recto-verso)
│   ├── livret-roles.pdf
│   ├── livret-moments.pdf
│   ├── livret-sos.pdf
│   └── kit-complet.pdf
└── README.md
```

## Comment déclencher la génération

### Option 1 : Déclenchement manuel
1. Aller sur GitHub > Actions > "📄 Generate Print PDFs"
2. Cliquer "Run workflow"
3. Choisir le target (all, roles, moments, sos)

### Option 2 : Via le message de commit
Ajouter `[print]` dans le message de commit :
```bash
git commit -m "Mise à jour carte R1 [print]"
```

> **Note :** Sans `[print]`, les modifications des sources ne déclenchent PAS la régénération des PDFs (économie de ressources).

## Instructions d'impression

### Livrets A4 (4-UP)

1. **Imprimer** le livret PDF souhaité
2. **Paramètres** :
   - Format : A4
   - Recto-verso : Bord long (flip on long edge)
   - Échelle : 100% (pas d'ajustement)
   - Marges : Aucune
3. **Découper** au centre (horizontal + vertical) - repères de coupe discrets inclus
4. **Plastifier** chaque carte A6 (80-125 microns recommandés)

### Résultat

Chaque feuille A4 donne 4 cartes A6 (105 × 148 mm) avec le bon verso au dos.

## Contenu des livrets

| Livret | Cartes | Feuilles A4 |
|--------|--------|-------------|
| `livret-roles.pdf` | R1-R4 (4 cartes) | 1 |
| `livret-moments.pdf` | M1-M7 (7 cartes + 1 blanche) | 2 |
| `livret-sos.pdf` | S1-S4 (4 cartes) | 1 |
| `kit-complet.pdf` | Tous | 4 |

## Développement local

```bash
# Installer les dépendances
npm install

# Générer tout
npm run print

# Générer uniquement les rôles
npm run print:roles
```

---

*Anacoluthe V5 - CC-BY-NC-SA*
