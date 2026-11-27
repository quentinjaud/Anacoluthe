/**
 * Anacoluthe V5 - Service Worker
 * Stratégie : Cache-first, network-fallback
 * 
 * Incrémenter CACHE_VERSION pour forcer une mise à jour
 */

const CACHE_VERSION = '1.7.1';
const CACHE_NAME = `anacoluthe-v${CACHE_VERSION}`;

/**
 * Mode travail sur la page de soutenance.
 *
 * Tant que cette constante est à true, /soutenance.html et son CSS ne sont
 * ni précachés, ni servis depuis le cache : chaque rechargement va chercher
 * la version en ligne, y compris en contournant le cache HTTP du navigateur.
 * Aucune incrémentation de version n'est nécessaire pendant les itérations.
 *
 * Pour retrouver la page hors-ligne avant la soutenance : passer à false,
 * remettre les URL commentées dans PRECACHE_URLS, et incrémenter
 * CACHE_VERSION.
 */
const DEV_NO_CACHE = false;
const DEV_URLS = ['/soutenance.html', '/assets/css/soutenance.css', '/assets/js/soutenance-lightbox.js',
  '/soutenance-notes.html', '/assets/data/soutenance-cartons.md'];

// Ressources essentielles à précacher
const PRECACHE_URLS = [
  // Pages
  '/',
  '/index.html',
  '/anacoluthe.html',
  '/afficheur-cartes.html',
  '/fil-semaine.html',
  '/ensavoirplus.html',
  '/soutenance.html',
  '/soutenance-notes.html',
  
  // CSS
  '/assets/css/style.css',
  '/assets/css/soutenance.css',
  '/assets/css/apercu-cartes.css',
  '/assets/css/vendor/glightbox.min.css',
  '/assets/css/cards.css',
  '/assets/css/cards-print.css',
  '/assets/css/fil-semaine.css',
  
  // JS
  '/assets/js/home.js',
  '/assets/js/cards-loader.js',
  '/assets/js/markdown-utils.js',
  '/assets/js/afficheur-cartes.js',
  '/assets/js/pwa-status.js',
  '/assets/js/fil-semaine.js',
  '/assets/js/external-links.js',
  '/assets/js/scroll-spy.js',
  '/assets/js/vendor/marked.min.js',
  '/assets/js/soutenance-lightbox.js',
  '/assets/js/vendor/glightbox.min.js',
  '/assets/js/vendor/twemoji.min.js',
  
  // Data
  '/assets/data/cards-index.json',
  '/assets/data/soutenance-cartons.md',
  
  // Polices embarquees pour la page de soutenance
  '/assets/fonts/merriweather.woff2',
  '/assets/fonts/merriweather-sans.woff2',
  '/assets/fonts/atkinson.woff2',

  // Images
  '/assets/images/logo-anacoluthe.svg',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/assets/images/affiche-tableau-equipage.png',

  // Emojis du deck (Twemoji embarque)
  '/assets/images/twemoji/1f30a.svg',
  '/assets/images/twemoji/1f331.svg',
  '/assets/images/twemoji/1f381.svg',
  '/assets/images/twemoji/1f393.svg',
  '/assets/images/twemoji/1f3af.svg',
  '/assets/images/twemoji/1f465.svg',
  '/assets/images/twemoji/1f4a1.svg',
  '/assets/images/twemoji/1f4aa.svg',
  '/assets/images/twemoji/1f4ac.svg',
  '/assets/images/twemoji/1f4c4.svg',
  '/assets/images/twemoji/1f4c6.svg',
  '/assets/images/twemoji/1f4c8.svg',
  '/assets/images/twemoji/1f4c9.svg',
  '/assets/images/twemoji/1f4ca.svg',
  '/assets/images/twemoji/1f4cb.svg',
  '/assets/images/twemoji/1f4dc.svg',
  '/assets/images/twemoji/1f4e2.svg',
  '/assets/images/twemoji/1f4e3.svg',
  '/assets/images/twemoji/1f4e6.svg',
  '/assets/images/twemoji/1f501.svg',
  '/assets/images/twemoji/1f502.svg',
  '/assets/images/twemoji/1f50e.svg',
  '/assets/images/twemoji/1f52d.svg',
  '/assets/images/twemoji/1f5e3.svg',
  '/assets/images/twemoji/1f5fa.svg',
  '/assets/images/twemoji/1f64b.svg',
  '/assets/images/twemoji/1f64f.svg',
  '/assets/images/twemoji/1f6df.svg',
  '/assets/images/twemoji/1f6e0.svg',
  '/assets/images/twemoji/1f6e4.svg',
  '/assets/images/twemoji/1f91d.svg',
  '/assets/images/twemoji/1f932.svg',
  '/assets/images/twemoji/1f9d1-200d-1f393.svg',
  '/assets/images/twemoji/1f9d1-200d-1f3eb.svg',
  '/assets/images/twemoji/1f9ea.svg',
  '/assets/images/twemoji/1f9ed.svg',
  '/assets/images/twemoji/1f9f0.svg',
  '/assets/images/twemoji/1f9f1.svg',
  '/assets/images/twemoji/1faa2.svg',
  '/assets/images/twemoji/2693.svg',
  '/assets/images/twemoji/26f5.svg',
  '/assets/images/twemoji/2702.svg',
  '/assets/images/twemoji/270f.svg',
  '/assets/images/twemoji/2753.svg',
  '/assets/images/twemoji/3030.svg',

  // Images de la soutenance
  '/assets/images/logo-glenans.svg',
  '/assets/images/affiche-A1-routines.png',
  '/assets/images/soutenance/affiche-a4-recto.webp',
  '/assets/images/soutenance/affiche-a4-verso-familles.webp',
  '/assets/images/soutenance/affiche-a4-verso.webp',
  '/assets/images/soutenance/affiche-com-haddock.webp',
  '/assets/images/soutenance/affiche-com-promo.webp',
  '/assets/images/soutenance/affiche-phases-a3-notes.webp',
  '/assets/images/soutenance/affiche-phases-a3.png',
  '/assets/images/soutenance/equipe-marseillan.webp',
  '/assets/images/soutenance/joker-demande-retour-recto.webp',
  '/assets/images/soutenance/joker-demande-retour-verso.webp',
  '/assets/images/soutenance/jolie-brise.webp',
  '/assets/images/soutenance/moment-accords-recto.webp',
  '/assets/images/soutenance/moment-accords-verso.webp',
  '/assets/images/soutenance/photo-atelier-baton.webp',
  '/assets/images/soutenance/photo-chenal-croiseurs.webp',
  '/assets/images/soutenance/photo-encadrement-benevole.webp',
  '/assets/images/soutenance/photo-formation-table.webp',
  '/assets/images/soutenance/photo-kit-v5.webp',
  '/assets/images/soutenance/photo-moniteurices-salle.webp',
  '/assets/images/soutenance/photo-phare-marseillan.webp',
  '/assets/images/soutenance/photo-quai-base.webp',
  '/assets/images/soutenance/photo-spi-glenans.webp',
  '/assets/images/soutenance/pile-diaporama-depart.webp',
  '/assets/images/soutenance/referentiels/cqp-rncp-discours-attitude.png',
  '/assets/images/soutenance/referentiels/cqp-rncp-integrite.png',
  '/assets/images/soutenance/referentiels/cqp-rncp-qualite-relationnelle.png',
  '/assets/images/soutenance/referentiels/ffvoile-ligne-niveau1.png',
  '/assets/images/soutenance/referentiels/ffvoile-lignes-niveau5.png',
  '/assets/images/soutenance/referentiels/ffvoile-tableau-organisation.webp',
  '/assets/images/soutenance/role-second-soigneux-recto.webp',
  '/assets/images/soutenance/role-second-soigneux-verso.webp',
  
  // Cartes Rôles
  '/sources/cartes/roles/R1_bosco.md',
  '/sources/cartes/roles/R2_navigateurice.md',
  '/sources/cartes/roles/R3_second_soigneux.md',
  '/sources/cartes/roles/R4_cambusiere.md',
  
  // Cartes Moments
  '/sources/cartes/moments/M1_accueil_presentations.md',
  '/sources/cartes/moments/M2_accords_equipage.md',
  '/sources/cartes/moments/M3_decouverte_roles.md',
  '/sources/cartes/moments/M4_brief_matin.md',
  '/sources/cartes/moments/M5_debrief_soir.md',
  '/sources/cartes/moments/M6_mi_parcours.md',
  '/sources/cartes/moments/M7_debrief_final.md',
  
  // Cartes Joker
  '/sources/cartes/joker/J1_desaccord_conflit.md',
  '/sources/cartes/joker/J2_temps_sans_navigation.md',
  '/sources/cartes/joker/J3_rediscuter_accords_programme.md',
  '/sources/cartes/joker/J4_demande_retour_mono.md',
  
  // Affiches (mémos)
  '/sources/affiches/A1_routines_memo.md',
  '/sources/affiches/A2_tableau_memo.md',
  '/sources/affiches/A3_marque_page_memo.md',
  '/sources/affiches/A4_decouverte_memo.md',
  
  // Manifest
  '/manifest.json'
];

// Installation : précache des ressources
self.addEventListener('install', (event) => {
  console.log('[SW] Installation, version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Précache des ressources...');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Forcer l'activation immédiate
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Erreur précache:', error);
      })
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation, version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('anacoluthe-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Suppression ancien cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Prendre le contrôle immédiatement
        return self.clients.claim();
      })
      .then(() => {
        // Notifier les clients de la mise à jour
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SW_ACTIVATED',
              version: CACHE_VERSION
            });
          });
        });
      })
  );
});

// Fetch : stratégie cache-first avec fallback réseau
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Ignorer les requêtes externes (CDN, API, etc.)
  if (url.origin !== self.location.origin) {
    // Pour les CDN (fonts, twemoji), tenter le réseau d'abord
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Fallback silencieux pour les ressources externes
          return new Response('', { status: 499, statusText: 'Offline' });
        })
    );
    return;
  }
  
  // Mode travail : ces URL ne sont jamais servies depuis le cache.
  if (DEV_NO_CACHE && DEV_URLS.indexOf(url.pathname) !== -1) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => caches.match(event.request).then((r) => r || new Response(
          'Hors ligne et absent du cache', { status: 503, statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' } })))
    );
    return;
  }

  // soutenance-notes.html?integre=1 (vue integree du deck) : meme fichier en cache
  const ignoreSearch = url.pathname === '/soutenance-notes.html';

  event.respondWith(
    caches.match(event.request, { ignoreSearch })
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Ressource en cache trouvée
          // En arrière-plan, vérifier s'il y a une mise à jour
          fetchAndCache(event.request);
          return cachedResponse;
        }
        
        // Pas en cache, récupérer depuis le réseau
        return fetchAndCache(event.request);
      })
      .catch(() => {
        // Offline et pas en cache
        return new Response('Contenu non disponible hors ligne', {
          status: 503,
          statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});

// Fonction utilitaire : fetch + mise en cache
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      // Ne cacher que les réponses valides
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      
      // Cloner la réponse (elle ne peut être lue qu'une fois)
      const responseToCache = response.clone();
      
      caches.open(CACHE_NAME)
        .then((cache) => {
          cache.put(request, responseToCache);
        });
      
      return response;
    });
}

// Écouter les messages des clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_VERSION
    });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_CACHE') {
    caches.open(CACHE_NAME).then((cache) => {
      Promise.all(
        PRECACHE_URLS.map((url) => cache.match(url).then((r) => !!r))
      ).then((results) => {
        const cached = results.filter(Boolean).length;
        event.ports[0].postMessage({
          type: 'CACHE_STATUS',
          total: PRECACHE_URLS.length,
          cached: cached,
          complete: cached === PRECACHE_URLS.length
        });
      });
    });
  }

  if (event.data && event.data.type === 'FORCE_UPDATE') {
    // Forcer la mise à jour du cache en bypassant le cache HTTP
    caches.delete(CACHE_NAME).then(() => {
      caches.open(CACHE_NAME).then((cache) => {
        Promise.all(
          PRECACHE_URLS.map((url) =>
            fetch(url, { cache: 'reload' }).then((response) => {
              if (response.ok) {
                return cache.put(url, response);
              }
            })
          )
        ).then(() => {
          event.ports[0].postMessage({
            type: 'UPDATE_COMPLETE',
            version: CACHE_VERSION
          });
        });
      });
    });
  }
});
