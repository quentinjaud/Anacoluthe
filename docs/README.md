# Site web Anacoluthe V5

Site web statique hébergé via GitHub Pages.

## Structure

```
/docs
├── index.html              ← Page d'accueil
├── /assets
│   ├── /css
│   │   └── style.css      ← Styles (Merriweather + couleurs Glénans)
│   └── /images            ← Images du site
└── /pdfs                  ← PDFs téléchargeables
```

## Activation GitHub Pages

1. Aller sur https://github.com/quentinjaud/Anacoluthe/settings/pages
2. **Build and deployment :**
   - Source : `Deploy from a branch`
   - Branch : `main`
   - Folder : `/docs`
3. Sauvegarder

Le site sera accessible à : `https://quentinjaud.github.io/Anacoluthe/`

## Modifications

Modifier les fichiers localement via Claude Desktop + Filesystem, puis commit via GitHub Desktop.
Le site se rebuild automatiquement (2-3 minutes).

## Design

**Inspirations :**
- Gauthier Roussilhe (typographie sobre, espaces généreux)
- Les Glénans (couleurs officielles)

**Polices :**
- Merriweather Sans (titres)
- Merriweather Serif (texte)

**Couleurs Glénans :**
- Bleu : #0066AD (titres, liens)
- Gris : #454545 (texte principal)
- Rouge : #F04839 (touches d'accent - bordures cards)
- Fond : #F9F9F9 (blanc cassé)
