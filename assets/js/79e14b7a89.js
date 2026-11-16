(() => { /* оглавление: активный раздел, прогресс чтения, лента сверху (C), всплывающий CTA (C) */
  const doc = document.querySelector('.m-art__doc'), box = document.querySelector('.m-ar__in'); if (!doc) return;
  const ls = [...document.querySelectorAll('.m-ar__toc a, .m-ar__chips a')], hs = [...new Set(ls.map(a => a.getAttribute('href')))].map(h => document.querySelector(h)).filter(Boolean);
  const pct = document.querySelector('.m-ar__pct'), chips = document.querySelector('.m-ar__chips'), raz = document.getElementById('razbor'); let cur = '', raf = 0;
  const upd = () => { raf = 0; const r = doc.getBoundingClientRect(), vh = innerHeight, p = Math.max(0, Math.min(1, (vh * .35 - r.top) / Math.max(1, r.height - vh * .35)));
    box.style.setProperty('--p', p.toFixed(4)); if (pct) pct.textContent = Math.round(p * 100) + '%';
    let id = hs.length ? hs[0].id : ''; hs.forEach(h => { if (h.getBoundingClientRect().top < vh * .3) id = h.id; });
    if (id !== cur) { cur = id; ls.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + id));
      const c = chips && chips.querySelector('.is-on'); if (c && box.dataset.v === 'c') chips.scrollTo({ left: c.offsetLeft - 16, behavior: 'smooth' }); }
    const rz = raz ? raz.getBoundingClientRect().top : 1e9; box.classList.toggle('is-read', r.top < vh * .2 && rz > vh * .9); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true }); addEventListener('resize', upd); upd();
  document.addEventListener('click', e => { if (e.target.closest('.p-vsw [data-vg="nav"]')) setTimeout(upd, 50); }); })();