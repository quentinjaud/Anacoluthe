/**
 * Anacoluthe V5 - PWA Status Manager
 * Gère l'affichage de l'état online/offline et les mises à jour
 * 
 * v2 - Pre-footer flottant (remplace pastille header)
 */

(function() {
  'use strict';

  // État global
  const state = {
    isOnline: navigator.onLine,
    isRefreshing: false,
    swRegistration: null,
    lastSync: null,
    version: null,
    deferredInstallPrompt: null,
    isInstalled: false,
    cacheReady: false
  };

  // Clé localStorage pour la date de sync
  const SYNC_KEY = 'anacoluthe_last_sync';

  // Capturer le prompt d'installation avant le DOM
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredInstallPrompt = e;
    updatePrefooterInstallBtn();
    showInstallButtonCTA(); // Bouton CTA sur index.html
  });

  // Détecter si déjà installé
  window.addEventListener('appinstalled', () => {
    state.deferredInstallPrompt = null;
    state.isInstalled = true;
    updatePrefooterInstallBtn();
    hideInstallButtonCTA(); // Bouton CTA sur index.html
  });

  // Vérifier si en mode standalone (déjà installé)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    state.isInstalled = true;
  }

  // Initialisation au chargement du DOM
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Charger la dernière date de sync
    state.lastSync = localStorage.getItem(SYNC_KEY);
    
    // Créer le pre-footer (nouveau composant principal)
    createPrefooter();
    
    // Bouton CTA d'installation sur index.html
    setupInstallButton();
    
    // Legacy : garder les anciens composants pour compatibilité
    // mais ils seront masqués par CSS si le pre-footer est présent
    createStatusIndicator();
    createFooterStatus();
    createUpdateToast();
    
    // Écouter les changements de connexion
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Enregistrer le Service Worker
    registerServiceWorker();
    
    // Mise à jour initiale de l'UI
    updateUI();
  }

  // === PRE-FOOTER (nouveau composant v2) ===
  
  function createPrefooter() {
    const main = document.querySelector('main');
    if (!main) return;
    
    // Marquer le body pour masquer les anciens composants
    document.body.classList.add('has-pwa-prefooter');
    
    // Créer le wrapper (pour le centrage sticky)
    const wrapper = document.createElement('div');
    wrapper.className = 'pwa-prefooter-wrapper';
    
    const prefooter = document.createElement('div');
    prefooter.id = 'pwa-prefooter';
    prefooter.className = 'pwa-prefooter';
    
    // Structure HTML
    prefooter.innerHTML = `
      <div class="pwa-prefooter-status">
        <span class="pwa-prefooter-dot online" id="prefooter-dot"></span>
        <span class="pwa-prefooter-text" id="prefooter-text">En ligne</span>
        <span class="pwa-prefooter-cache" id="prefooter-cache"></span>
      </div>
      <div class="pwa-prefooter-sep"></div>
      <button class="pwa-prefooter-btn btn-refresh" id="prefooter-refresh" title="Mettre à jour les cartes">
        <span class="btn-icon">🔄</span>
        <span class="btn-label">Mettre à jour</span>
      </button>
      <button class="pwa-prefooter-btn btn-install" id="prefooter-install" style="display: none;">
        <span class="btn-icon">📲</span>
        <span class="btn-label">Installer</span>
      </button>
    `;
    
    // Assembler et insérer à la fin du main
    wrapper.appendChild(prefooter);
    main.appendChild(wrapper);
    
    // Handlers
    document.getElementById('prefooter-refresh').addEventListener('click', handlePrefooterRefresh);
    document.getElementById('prefooter-install').addEventListener('click', handleInstallClick);
    
    // Initialiser l'état du bouton install
    updatePrefooterInstallBtn();
  }
  
  function updatePrefooterStatus() {
    const dot = document.getElementById('prefooter-dot');
    const text = document.getElementById('prefooter-text');
    const refreshBtn = document.getElementById('prefooter-refresh');
    
    if (!dot || !text) return;
    
    // État de la connexion
    if (state.isRefreshing) {
      dot.className = 'pwa-prefooter-dot refreshing';
      text.textContent = 'Mise à jour...';
    } else if (state.isOnline) {
      dot.className = 'pwa-prefooter-dot online';
      text.textContent = 'En ligne';
    } else {
      dot.className = 'pwa-prefooter-dot offline';
      text.textContent = 'Hors-ligne';
    }
    
    // Bouton refresh
    if (refreshBtn) {
      refreshBtn.disabled = !state.isOnline || state.isRefreshing;
      
      if (state.isRefreshing) {
        refreshBtn.classList.add('refreshing');
      } else {
        refreshBtn.classList.remove('refreshing');
      }
    }
  }
  
  function updatePrefooterInstallBtn() {
    const btn = document.getElementById('prefooter-install');
    if (!btn) return;
    
    const label = btn.querySelector('.btn-label');
    const icon = btn.querySelector('.btn-icon');
    
    if (state.isInstalled) {
      // Afficher "App installée"
      btn.style.display = 'flex';
      btn.classList.add('installed');
      btn.disabled = true;
      if (icon) icon.textContent = '✓';
      if (label) label.textContent = 'Installée';
    } else if (state.deferredInstallPrompt) {
      // Bouton d'installation disponible
      btn.style.display = 'flex';
      btn.classList.remove('installed');
      btn.disabled = false;
      if (icon) icon.textContent = '📲';
      if (label) label.textContent = 'Installer';
    } else {
      // Pas de prompt disponible, masquer
      btn.style.display = 'none';
    }
  }
  
  function handlePrefooterRefresh() {
    if (!state.isOnline || state.isRefreshing) return;
    
    state.isRefreshing = true;
    updatePrefooterStatus();
    
    // Forcer la mise à jour du SW
    if (state.swRegistration) {
      state.swRegistration.update()
        .then(() => {
          // Forcer le rechargement du cache
          if (navigator.serviceWorker.controller) {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              if (event.data.type === 'UPDATE_COMPLETE') {
                updateSyncTime();
                state.isRefreshing = false;
                updateUI();
                // Recharger la page pour appliquer
                window.location.reload();
              }
            };
            
            navigator.serviceWorker.controller.postMessage(
              { type: 'FORCE_UPDATE' },
              [messageChannel.port2]
            );
            
            // Timeout de sécurité (5s)
            setTimeout(() => {
              if (state.isRefreshing) {
                state.isRefreshing = false;
                updateUI();
                // Recharger quand même
                window.location.reload();
              }
            }, 5000);
          } else {
            // Pas de SW actif, recharger directement
            state.isRefreshing = false;
            window.location.reload();
          }
        })
        .catch(() => {
          state.isRefreshing = false;
          updateUI();
        });
    } else {
      // Pas de SW, recharger directement
      state.isRefreshing = false;
      window.location.reload();
    }
  }

  // === Cache status ===

  function checkCacheStatus() {
    if (!navigator.serviceWorker.controller) return;

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_STATUS') {
        state.cacheReady = event.data.complete;
        updatePrefooterCacheBadge();
      }
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'CHECK_CACHE' },
      [messageChannel.port2]
    );
  }

  function updatePrefooterCacheBadge() {
    const badge = document.getElementById('prefooter-cache');
    if (!badge) return;

    if (state.cacheReady) {
      badge.textContent = '✓ Prêt hors-ligne';
      badge.classList.add('ready');
    } else {
      badge.textContent = '';
      badge.classList.remove('ready');
    }
  }

  // === Service Worker ===

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Worker non supporté');
      return;
    }

    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker enregistré');
        state.swRegistration = registration;
        
        // Écouter les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              showUpdateToast();
            }
          });
        });
        
        // Demander la version actuelle et vérifier le cache
        getVersion();
        checkCacheStatus();
      })
      .catch((error) => {
        console.error('[PWA] Erreur enregistrement SW:', error);
      });

    // Écouter les messages du SW
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'SW_ACTIVATED') {
        state.version = event.data.version;
        updateSyncTime();
        updateUI();
        hideUpdateToast();
        checkCacheStatus();
      }
      
      if (event.data.type === 'VERSION') {
        state.version = event.data.version;
        updateUI();
      }
      
      if (event.data.type === 'UPDATE_COMPLETE') {
        state.version = event.data.version;
        state.isRefreshing = false;
        updateSyncTime();
        updateUI();
        hideUpdateToast();
        checkCacheStatus();
      }
    });
  }

  function getVersion() {
    if (!navigator.serviceWorker.controller) return;
    
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'VERSION') {
        state.version = event.data.version;
        updateUI();
      }
    };
    
    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_VERSION' },
      [messageChannel.port2]
    );
  }

  // === Gestion connexion ===
  
  function handleOnline() {
    state.isOnline = true;
    updateUI();
    
    // Tenter une mise à jour en arrière-plan
    if (state.swRegistration) {
      state.swRegistration.update();
    }
  }

  function handleOffline() {
    state.isOnline = false;
    updateUI();
  }

  // === UI Legacy : Indicateur pastille (header) ===
  
  function createStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'pwa-status-indicator';
    indicator.className = 'pwa-status-indicator';
    indicator.innerHTML = '<span class="pwa-status-dot"></span>';
    indicator.title = 'État de la connexion';
    
    // Insérer dans le header
    const header = document.querySelector('header');
    if (header) {
      header.style.position = 'relative';
      header.appendChild(indicator);
    }
  }

  // === UI Legacy : Footer status ===
  
  function createFooterStatus() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // Chercher ou créer le conteneur de métadonnées
    let footerMeta = footer.querySelector('.footer-meta');
    if (!footerMeta) {
      footerMeta = document.createElement('div');
      footerMeta.className = 'footer-meta';
      footer.querySelector('.footer-content')?.appendChild(footerMeta);
    }
    
    // Créer le conteneur de statut PWA
    const statusContainer = document.createElement('span');
    statusContainer.id = 'pwa-footer-status';
    statusContainer.className = 'pwa-footer-status';
    statusContainer.innerHTML = `
      <span class="pwa-sync-time">-</span>
      <button class="pwa-refresh-btn" title="Rafraîchir le cache">🔄</button>
    `;
    
    // Insérer au début du footer-meta
    footerMeta.insertBefore(statusContainer, footerMeta.firstChild);
    
    // Ajouter le handler du bouton refresh
    const refreshBtn = statusContainer.querySelector('.pwa-refresh-btn');
    refreshBtn.addEventListener('click', handleRefresh);
  }

  // === UI : Toast de mise à jour ===
  
  function createUpdateToast() {
    const toast = document.createElement('div');
    toast.id = 'pwa-update-toast';
    toast.className = 'pwa-update-toast hidden';
    toast.innerHTML = `
      <span class="pwa-toast-icon">🔄</span>
      <span class="pwa-toast-text">Nouvelle version disponible</span>
      <button class="pwa-toast-btn pwa-toast-refresh">Rafraîchir</button>
      <button class="pwa-toast-btn pwa-toast-dismiss">✕</button>
    `;
    
    document.body.appendChild(toast);
    
    // Handlers
    toast.querySelector('.pwa-toast-refresh').addEventListener('click', () => {
      applyUpdate();
    });
    
    toast.querySelector('.pwa-toast-dismiss').addEventListener('click', () => {
      hideUpdateToast();
    });
  }

  function showUpdateToast() {
    const toast = document.getElementById('pwa-update-toast');
    if (toast) {
      toast.classList.remove('hidden');
    }
  }

  function hideUpdateToast() {
    const toast = document.getElementById('pwa-update-toast');
    if (toast) {
      toast.classList.add('hidden');
    }
  }

  // === Actions Legacy ===
  
  function handleRefresh() {
    if (!state.isOnline) {
      alert('Impossible de rafraîchir hors ligne');
      return;
    }
    
    const btn = document.querySelector('.pwa-refresh-btn');
    if (btn) {
      btn.classList.add('spinning');
    }
    
    // Forcer la mise à jour du SW
    if (state.swRegistration) {
      state.swRegistration.update()
        .then(() => {
          // Forcer le rechargement du cache
          if (navigator.serviceWorker.controller) {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              if (event.data.type === 'UPDATE_COMPLETE') {
                updateSyncTime();
                updateUI();
                if (btn) btn.classList.remove('spinning');
                // Recharger la page pour appliquer
                window.location.reload();
              }
            };
            
            navigator.serviceWorker.controller.postMessage(
              { type: 'FORCE_UPDATE' },
              [messageChannel.port2]
            );
          }
        })
        .catch(() => {
          if (btn) btn.classList.remove('spinning');
        });
    }
  }

  function applyUpdate() {
    if (state.swRegistration && state.swRegistration.waiting) {
      state.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }

  // === Mise à jour UI ===
  
  function updateUI() {
    // Nouveau pre-footer
    updatePrefooterStatus();
    updatePrefooterInstallBtn();
    updatePrefooterCacheBadge();
    
    // Legacy (gardés pour compatibilité mais masqués par CSS)
    updateStatusIndicator();
    updateFooterStatus();
  }

  function updateStatusIndicator() {
    const indicator = document.getElementById('pwa-status-indicator');
    if (!indicator) return;
    
    const dot = indicator.querySelector('.pwa-status-dot');
    
    if (state.isOnline) {
      dot.className = 'pwa-status-dot online';
      indicator.title = 'En ligne';
    } else {
      dot.className = 'pwa-status-dot offline';
      indicator.title = 'Hors ligne - Mode cache';
    }
  }

  function updateFooterStatus() {
    const syncTimeEl = document.querySelector('.pwa-sync-time');
    if (!syncTimeEl) return;
    
    const syncText = state.lastSync 
      ? `Sync: ${formatDate(state.lastSync)}`
      : 'Sync: -';
    
    syncTimeEl.textContent = syncText;
    
    // Désactiver le bouton refresh si offline
    const refreshBtn = document.querySelector('.pwa-refresh-btn');
    if (refreshBtn) {
      refreshBtn.disabled = !state.isOnline;
      refreshBtn.style.opacity = state.isOnline ? '1' : '0.4';
    }
  }

  function updateSyncTime() {
    const now = new Date().toISOString();
    state.lastSync = now;
    localStorage.setItem(SYNC_KEY, now);
  }

  // === Utilitaires ===
  
  function formatDate(isoString) {
    try {
      const date = new Date(isoString);
      const day = date.getDate();
      const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 
                      'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
      const month = months[date.getMonth()];
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day} ${month} ${hours}h${minutes}`;
    } catch (e) {
      return '-';
    }
  }

  // === Bouton d'installation PWA (CTA sur index.html) ===

  function setupInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (!btn) return;
    
    btn.addEventListener('click', handleInstallClick);
    
    // Si le prompt est déjà disponible, afficher le bouton
    if (state.deferredInstallPrompt) {
      showInstallButtonCTA();
    }
    
    // Vérifier si déjà installé (mode standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      hideInstallButtonCTA();
    }
  }

  function showInstallButtonCTA() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) {
      btn.style.display = 'flex';
    }
  }

  function hideInstallButtonCTA() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) {
      btn.style.display = 'none';
    }
  }

  async function handleInstallClick() {
    if (!state.deferredInstallPrompt) {
      console.log('[PWA] Pas de prompt disponible');
      return;
    }
    
    // Afficher le prompt d'installation
    state.deferredInstallPrompt.prompt();
    
    // Attendre la réponse
    const { outcome } = await state.deferredInstallPrompt.userChoice;
    console.log('[PWA] Installation:', outcome);
    
    // Le prompt ne peut être utilisé qu'une fois
    state.deferredInstallPrompt = null;
    
    if (outcome === 'accepted') {
      state.isInstalled = true;
    }
    
    // Mettre à jour les deux UI (pre-footer + CTA)
    updatePrefooterInstallBtn();
    hideInstallButtonCTA();
  }

})();
