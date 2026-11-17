(() => { const doc = document.querySelector('.m-art__doc'), box = document.querySelector('.m-ar__in'); if (!doc) return;
  const ls = [...document.querySelectorAll('.m-ar__toc a')], hs = ls.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean); let cur = '', raf = 0;
  const upd = () => { raf = 0; const r = doc.getBoundingClientRect(), vh = innerHeight, p = Math.max(0, Math.min(1, (vh * .35 - r.top) / Math.max(1, r.height - vh * .35)));
    box.style.setProperty('--p', p.toFixed(4)); let id = hs.length ? hs[0].id : ''; hs.forEach(h => { if (h.getBoundingClientRect().top < vh * .3) id = h.id; });
    if (id !== cur) { cur = id; ls.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + id)); } };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true }); upd(); })();