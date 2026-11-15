
(() => {
  /* общий переключатель вариантов: [data-vg=ключ][data-v=буква]; планка встаёт перед первым блоком группы */
  window.__vbar = window.__vbar || ((bar) => {
    const key = bar.dataset.for, all = () => [...document.querySelectorAll(`[data-vg="${key}"]`)];
    const first = all()[0]; if (first && first.previousElementSibling !== bar) first.before(bar);
    bar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      all().forEach(el => el.hidden = el.dataset.v !== b.dataset.v);
      dispatchEvent(new Event('resize')); dispatchEvent(new Event('scroll'));
    }));
  });
  /* варианты встают сразу после исходного блока; исходный — вариант «а» */
  const place = (key, orig) => { if (!orig) return; orig.dataset.vg = key; orig.dataset.v = 'a';
    const vs = [...document.querySelectorAll(`[data-vg="${key}"]:not([data-v="a"])`)]; let at = orig; vs.forEach(v => { at.after(v); at = v; });
    const bar = document.getElementById('vbar-' + key); if (bar) window.__vbar(bar); };
  { const o = document.getElementById('otzyvy'), b = document.getElementById('otzyvy-b'); if (o && b) { o.after(b); o.remove(); b.id = 'otzyvy'; } }
  place('faq', document.getElementById('faq'));
  place('cta', document.getElementById('razbor'));
  place('foot', document.querySelector('footer.ft'));

  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
  const R = window.__revs;
  if (R) {
    const url = r => `https://rutube.ru/shorts/${r.v}/`;
    const rt = document.getElementById('rvb-track');
    rt.innerHTML = R.map(r => `<a class="rvb__v" href="${url(r)}" target="_blank" rel="noopener"><img src="${r.img}" alt="" loading="lazy"><i>${PLAY}</i><div><b>${r.res}</b><small>${r.name} · ${r.biz}</small></div></a>`).join('');
  }
  { const rt = document.getElementById('rvb-track'), [p, n] = document.querySelectorAll('.rvb__bar button');
    const st = () => { const c = rt.children; return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : rt.clientWidth; };
    const sync = () => { p.disabled = rt.scrollLeft < 4; n.disabled = rt.scrollLeft + rt.clientWidth >= rt.scrollWidth - 4; };
    p.addEventListener('click', () => rt.scrollBy({ left: -st() * 2, behavior: 'smooth' })); n.addEventListener('click', () => rt.scrollBy({ left: st() * 2, behavior: 'smooth' }));
    rt.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true }); addEventListener('resize', sync); sync(); }
})();
