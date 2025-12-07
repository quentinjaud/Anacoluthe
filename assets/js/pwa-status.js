/**
 * Anacoluthe V5 - PWA Status Manager
 * Gère l'affichage de l'état online/offline et les mises à jour
 */

(function() {
  'use strict';

  // État global
  const state = {
    isOnline: navigator.onLine,
    swRegistration: null,
    lastSync: null,
    version: null,
    deferredInstallPrompt: null
  };

  // Clé localStorage pour la date de sync
  const SYNC_KEY = 'anacoluthe_last_sync';

  // Capturer le prompt d'installation avant le DOM
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredInstallPrompt = e;
    showInstallButton();
  });

  // Détecter si déjà installé
  window.addEventListener('appinstalled', () => {
    state.deferredInstallPrompt = null;
    hideInstallButton();
  });

  // Initialisation au chargement du DOM
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Charger la dernière date de sync
    state.lastSync = localStorage.getItem(SYNC_KEY);
    
    // Créer les éléments UI
    createStatusIndicator();
    createFooterStatus();
    createUpdateToast();
    setupInstallButton();
    
    // Écouter les changements de connexion
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Enregistrer le Service Worker
    registerServiceWorker();
    
    // Mise à jour initiale de l'UI
    updateUI();
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
        
        // Demander la version actuelle
        getVersion();
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
      }
      
      if (event.data.type === 'VERSION') {
        state.version = event.data.version;
        updateUI();
      }
      
      if (event.data.type === 'UPDATE_COMPLETE') {
        state.version = event.data.version;
        updateSyncTime();
        updateUI();
        hideUpdateToast();
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

  // === UI : Indicateur pastille (header) ===
  
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

  // === UI : Footer status ===
  
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

  // === Actions ===
  
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

  // === Bouton d'installation PWA ===

  function setupInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (!btn) return;
    
    btn.addEventListener('click', handleInstallClick);
    
    // Si le prompt est déjà disponible, afficher le bouton
    if (state.deferredInstallPrompt) {
      showInstallButton();
    }
    
    // Vérifier si déjà installé (mode standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      hideInstallButton();
    }
  }

  function showInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) {
      btn.style.display = 'flex';
    }
  }

  function hideInstallButton() {
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
    hideInstallButton();
  }

})();
