
(() => {
  const flos = [...document.querySelectorAll('.flo')];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = 0, mx = 0, my = 0;
  addEventListener('pointermove', e => {
    mx = e.clientX - innerWidth / 2; my = e.clientY - innerHeight / 2;
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; flos.forEach(f => { const k = +f.dataset.k; f.style.setProperty('--mx', (-mx * k).toFixed(1) + 'px'); f.style.setProperty('--my', (-my * k).toFixed(1) + 'px'); }); });
  }, { passive: true });
})();
