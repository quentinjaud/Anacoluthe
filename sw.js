/**
 * Anacoluthe V5 - Service Worker
 * Stratégie : Cache-first, network-fallback
 * 
 * Incrémenter CACHE_VERSION pour forcer une mise à jour
 */

const CACHE_VERSION = '1.2.0';
const CACHE_NAME = `anacoluthe-v${CACHE_VERSION}`;

// Ressources essentielles à précacher
const PRECACHE_URLS = [
  // Pages
  '/',
  '/index.html',
  '/anacoluthe.html',
  '/afficheur-cartes.html',
  '/fil-semaine.html',
  '/ensavoirplus.html',
  
  // CSS
  '/assets/css/style.css',
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
  
  // Data
  '/assets/data/cards-index.json',
  
  // Images
  '/assets/images/logo-anacoluthe.svg',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/assets/images/affiche-tableau-equipage.png',
  
  // Cartes Rôles
  '/sources/cartes/roles/R1_bosco.md',
  '/sources/cartes/roles/R2_navigateurice.md',
  '/sources/cartes/roles/R3_second_soigneux.md',
  '/sources/cartes/roles/R4_cambusiere.md',
  
  // Cartes Moments
  '/sources/cartes/moments/M1_ACCUEIL_ATTENTES.md',
  '/sources/cartes/moments/M2_accords_equipage_proto.md',
  '/sources/cartes/moments/M3_introduction_roles_proto.md',
  '/sources/cartes/moments/M4_brief_matin_proto.md',
  '/sources/cartes/moments/M5_debrief_soir_proto.md',
  '/sources/cartes/moments/M6_mi_parcours_proto.md',
  '/sources/cartes/moments/M7_debrief_final_proto.md',
  
  // Cartes SOS
  '/sources/cartes/sos/S1_conflit_ouvert_proto.md',
  '/sources/cartes/sos/S2_temps_sans_navigation_proto.md',
  '/sources/cartes/sos/S3_rediscuter_accords_programme_proto.md',
  '/sources/cartes/sos/S4_demande_feedback_mono_proto.md',
  
  // Affiches (mémos)
  '/sources/affiches/A1_routines_memo.md',
  '/sources/affiches/A2_tableau_memo.md',
  '/sources/affiches/A3_marque_page_memo.md',
  
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
  
  event.respondWith(
    caches.match(event.request)
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
  
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    // Forcer la mise à jour du cache
    caches.delete(CACHE_NAME).then(() => {
      caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(PRECACHE_URLS).then(() => {
          event.ports[0].postMessage({
            type: 'UPDATE_COMPLETE',
            version: CACHE_VERSION
          });
        });
      });
    });
  }
});
