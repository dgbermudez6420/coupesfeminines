(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gallery = document.querySelector('.compact-gallery');
  const track = gallery.querySelector('.compact-track');
  const originals = [...track.querySelectorAll('.compact-card')];
  const pause = gallery.querySelector('.compact-pause');
  let paused = false;
  function copyCard(card) {
    const copy = card.cloneNode(true);
    copy.dataset.clone = 'true';
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelector('button').tabIndex = -1;
    return copy;
  }
  function fillTrack() {
    const group = document.createElement('div');
    group.className = 'compact-group';
    originals.forEach(card => group.append(card));
    const cardWidth = window.innerWidth <= 600 ? 160 : 190;
    const gap = window.innerWidth <= 600 ? 16 : 20;
    const sets = Math.max(1, Math.ceil((window.innerWidth + cardWidth) / (originals.length * (cardWidth + gap))));
    for (let set = 1; set < sets; set++) originals.forEach(card => group.append(copyCard(card)));
    const duplicate = group.cloneNode(true);
    duplicate.classList.add('compact-duplicate');
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.querySelectorAll('button').forEach(button => button.tabIndex = -1);
    track.replaceChildren(group, duplicate);
  }
  fillTrack();
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fillTrack, 120); });
  pause.addEventListener('click', () => {
    paused = !paused;
    gallery.classList.toggle('is-paused', paused);
    pause.textContent = paused ? 'Reprendre la galerie' : 'Mettre la galerie en pause';
    pause.setAttribute('aria-pressed', String(paused));
  });
  gallery.addEventListener('focusin', event => { if (event.target.matches(':focus-visible')) gallery.classList.add('is-keyboard'); });
  gallery.addEventListener('focusout', () => { setTimeout(() => { if (!gallery.contains(document.activeElement)) gallery.classList.remove('is-keyboard'); }, 0); });
  document.addEventListener('visibilitychange', () => gallery.classList.toggle('is-hidden', document.hidden));
  const dialog = document.querySelector('.lightbox');
  let opener;
  gallery.addEventListener('click', event => {
    const button = event.target.closest('.image-button');
    if (!button) return;
    opener = button;
    dialog.querySelector('img').src = button.dataset.image;
    dialog.querySelector('img').alt = button.dataset.title;
    dialog.querySelector('.full-image').href = button.dataset.image;
    document.querySelector('#lightbox-title').textContent = button.dataset.title;
    gallery.classList.add('is-modal-open');
    dialog.showModal();
  });
  dialog.querySelector('.close-lightbox').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { gallery.classList.remove('is-modal-open'); if (opener && opener.isConnected) opener.focus(); });
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: .08 });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));
})();
