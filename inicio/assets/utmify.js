/* UTMify — mêmes codes que le produit SchnittAtlas allemand.
 * Source vérifiée : https://schnittatlas.vercel.app/assets/utmify.js
 * Activation après consentement uniquement. La version v2 ne réutilise pas
 * les choix enregistrés dans l'ancien aperçu sans suivi.
 */
(() => {
  if (window.__atlasCoupesFrConsentInitialized) return;
  const KEY = 'atlas_coupes_fr_marketing_consent_v2';
  const panel = document.getElementById('cookie-panel');
  if (!panel) return;
  window.__atlasCoupesFrConsentInitialized = true;
  let loaded = false;
  function choice() { try { return localStorage.getItem(KEY); } catch { return null; } }
  function save(value) { try { localStorage.setItem(KEY, value); } catch {} }
  function loadMarketing() {
    if (loaded) return;
    loaded = true;
    window.pixelId = '6adcf30e0a3295fab49502f5';
    for (const [id, src, utms] of [
      ['atlas-utmify-pixel', 'https://cdn.utmify.com.br/scripts/pixel/pixel.js', false],
      ['atlas-utmify-utms', 'https://cdn.utmify.com.br/scripts/utms/latest.js', true]
    ]) {
      if (document.getElementById(id)) continue;
      const script = document.createElement('script');
      script.id = id; script.src = src; script.async = true; script.defer = true;
      if (utms) script.setAttribute('data-utmify-prevent-subids', '');
      document.head.append(script);
    }
  }
  function openSettings() { panel.hidden = false; document.getElementById('cookie-title').focus(); }
  document.getElementById('cookie-accept').addEventListener('click', () => {
    save('accepted'); panel.hidden = true; loadMarketing();
  });
  document.getElementById('cookie-reject').addEventListener('click', () => {
    save('rejected'); panel.hidden = true;
    if (loaded) location.reload();
  });
  document.getElementById('cookie-settings').addEventListener('click', openSettings);
  window.addEventListener('storage', event => {
    if (event.key === KEY && loaded && event.newValue !== 'accepted') location.reload();
  });
  if (choice() === 'accepted') { panel.hidden = true; loadMarketing(); }
  else if (choice() === 'rejected') panel.hidden = true;
})();
