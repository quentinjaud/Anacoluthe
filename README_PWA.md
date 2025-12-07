# Installation PWA Anacoluthe

## Fichiers créés

- `manifest.json` - Métadonnées PWA
- `sw.js` - Service Worker (cache offline)
- `assets/js/pwa-status.js` - Gestion UI (pastille + footer)
- `assets/css/style.css` - Styles PWA ajoutés à la fin

## Actions à faire manuellement

### 1. Télécharger marked.js

```bash
# Option recommandée : via npm
npm install marked
cp node_modules/marked/marked.min.js assets/js/vendor/

# Ou via curl
curl -o assets/js/vendor/marked.min.js https://cdn.jsdelivr.net/npm/marked/marked.min.js
```

### 2. Créer les icônes PWA

Les icônes doivent être en PNG, carrées, sur fond opaque.

**Fichiers requis :**
- `assets/images/icon-192.png` (192×192 px)
- `assets/images/icon-512.png` (512×512 px)

**Option rapide avec le logo SVG existant :**

1. Ouvrir `assets/images/logo-anacoluthe.svg` dans un éditeur d'images (Figma, Inkscape, etc.)
2. Ajouter un fond (blanc ou couleur `#FFFBF5`)
3. Exporter en PNG aux deux tailles

**Option en ligne :**
- [PWA Asset Generator](https://pwabuilder.com/)
- [Real Favicon Generator](https://realfavicongenerator.net/)

### 3. Tester localement

```bash
# Serveur local (le SW ne fonctionne pas en file://)
npx serve .
# ou
python -m http.server 8000
```

Puis ouvrir http://localhost:8000

### 4. Vérifier l'installation PWA

1. Ouvrir les DevTools (F12)
2. Onglet "Application" > "Manifest" : vérifier que tout est vert
3. Onglet "Application" > "Service Workers" : vérifier l'enregistrement
4. Simuler offline : onglet "Network" > cocher "Offline", recharger

## Fonctionnement

### Indicateurs UI

**Pastille header :**
- 🟢 Vert = en ligne
- 🔴 Rouge = hors ligne

**Footer :**
- Date de dernière synchronisation
- Bouton 🔄 pour forcer le refresh du cache

**Toast :**
- Apparaît quand une nouvelle version est disponible
- Boutons "Rafraîchir" / "✕"

### Mise à jour du cache

Pour forcer une mise à jour des ressources cachées après modification :

1. Incrémenter `CACHE_VERSION` dans `sw.js`
2. Commit + push
3. Les utilisateurs verront le toast "Nouvelle version disponible"

## Compatibilité

- ✅ Chrome / Edge (desktop & mobile)
- ✅ Safari iOS 11.3+
- ✅ Firefox (PWA limitée mais cache OK)
- ✅ GitHub Pages

## Ressources cachées

Le service worker met en cache :
- Les 3 pages HTML
- Tous les CSS et JS
- Le JSON des cartes
- Tous les fichiers Markdown des cartes (15) et affiches (3)
- Les images et icônes

**Total estimé : ~200-300 KB** (très léger)
