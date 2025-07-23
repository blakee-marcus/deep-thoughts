const isLocalhost =
  location.hostname === 'localhost' ||
  location.hostname === '[::1]' ||
  /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(location.hostname);

export function register(config) {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;

      isLocalhost
        ? checkValidServiceWorker(swUrl, config)
        : registerValidSW(swUrl, config);
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const worker = registration.installing;
        if (!worker) return;

        worker.onstatechange = () => {
          if (worker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('[PWA] New content available, refresh when ready.');
              config?.onUpdate?.(registration);
            } else {
              console.log('[PWA] Content cached for offline use.');
              config?.onSuccess?.(registration);
            }
          }
        };
      };
    })
    .catch((err) => {
      console.error('[PWA] Failed to register service worker:', err);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((res) => {
      const isJS = res.headers.get('content-type')?.includes('javascript');
      if (res.status === 404 || !isJS) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.unregister().then(() => location.reload());
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('[PWA] App running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((reg) => reg.unregister())
      .catch((err) => console.error('[PWA] Unregister failed:', err));
  }
}
