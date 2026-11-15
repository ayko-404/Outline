
(() => {
  const R = window.__revs, dlg = document.getElementById('rvs'), track = document.getElementById('rvb-track');
  if (!R || !dlg || !track) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = [...track.querySelectorAll('.rvb__v')];
  const ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  /* метка на карточке ленты: внутри есть кейс */
  cards.forEach((a, i) => { a.dataset.i = i; a.setAttribute('role', 'button'); a.setAttribute('aria-label', `${R[i].name}, ${R[i].biz}: видео и кейс`);
    a.insertAdjacentHTML('afterbegin', '<span class="rvb__chip"><s><em></em><em></em></s>Было → стало</span>');
    a.addEventListener('click', e => { e.preventDefault(); open(i, a); }); });

  const mock = (r, full) => full
    ? `<div class="ycm is-full"><div class="ycm__ph"><i></i><i></i><i></i></div><b>${r.biz}</b><div class="ycm__st"><span>★★★★★</span>Открыто</div>
       <ul><li>Фото и описание</li><li>Услуги и цены</li><li>Ответы на отзывы</li></ul><div class="ycm__bt"><i></i><i></i><i></i></div></div>`
    : `<div class="ycm is-empty"><div class="ycm__ph">Нет фото</div><b>${r.biz}</b><div class="ycm__st"><span>★★★★★</span>мало оценок</div>
       <ul><li>Часы работы не указаны</li><li>Нет услуг и цен</li><li>Отзывы без ответов</li></ul><div class="ycm__bt"><i></i><i></i><i></i></div></div>`;

  let cur = -1, opener = null, sweep = 0;
  const render = i => {
    const r = R[i], real = r.before && r.after;
    document.getElementById('rvs-seg').innerHTML = R.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('');
    const vid = document.getElementById('rvs-vid');
    vid.innerHTML = `<img loading="lazy" decoding="async" src="${r.img}" alt=""><iframe title="Видеоотзыв: ${r.name}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"
      src="https://rutube.ru/play/embed/${r.v}/"></iframe>`;
    const fr = vid.querySelector('iframe'); fr.addEventListener('load', () => fr.classList.add('is-ready'));
    document.getElementById('rvs-body').innerHTML = `<div class="rvs__swap">
      <div class="rvs__who"><img loading="lazy" decoding="async" src="${r.img}" alt=""><span><b>${r.name}</b><small>${r.biz}</small></span></div>
      <h3 class="rvs__h" id="rvs-h">${r.res}</h3>
      <p class="rvs__cap">Карточка в Яндекс Картах<em>${real ? 'до и после работы с Outline' : 'Иллюстрация — скриншоты карточки добавим'}</em></p>
      <div class="rvs__cmp" id="rvs-cmp" role="slider" aria-label="Было и стало" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
        <div class="is-before">${real ? `<img loading="lazy" decoding="async" src="${r.before}" alt="Карточка до">` : mock(r, false)}</div>
        <div class="is-after">${real ? `<img loading="lazy" decoding="async" src="${r.after}" alt="Карточка после">` : mock(r, true)}</div>
        <span class="rvs__lbl l">Было</span><span class="rvs__lbl r">Стало</span><span class="rvs__knob"></span>
      </div>
      <a class="rvs__rt" href="https://rutube.ru/shorts/${r.v}/" target="_blank" rel="noopener">Смотреть на Rutube ↗</a>
    </div>
    <div class="rvs__foot"><a class="rvs__cta" href="#razbor">Хочу так же ${ARR}</a>
      <span class="rvs__nav"><button type="button" data-d="-1" aria-label="Предыдущий отзыв" ${i ? '' : 'disabled'}><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button><button type="button" data-d="1" aria-label="Следующий отзыв" ${i < R.length - 1 ? '' : 'disabled'}><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></span></div>`;
    bindCmp();
  };
  /* шторка: тянуть мышью или пальцем, стрелки на клавиатуре; при открытии — короткий проход, чтобы было видно, что её можно двигать */
  const bindCmp = () => {
    const c = document.getElementById('rvs-cmp'); let drag = false;
    const set = p => { p = Math.max(4, Math.min(96, p)); c.style.setProperty('--x', p + '%'); c.setAttribute('aria-valuenow', Math.round(p)); };
    const at = e => { const b = c.getBoundingClientRect(); set((e.clientX - b.left) / b.width * 100); };
    c.addEventListener('pointerdown', e => { drag = true; cancelAnimationFrame(sweep); c.setPointerCapture(e.pointerId); at(e); });
    c.addEventListener('pointermove', e => drag && at(e));
    c.addEventListener('pointerup', () => drag = false); c.addEventListener('pointercancel', () => drag = false);
    c.addEventListener('keydown', e => { const v = parseFloat(c.style.getPropertyValue('--x')) || 50; if (e.key === 'ArrowLeft') set(v - 5); if (e.key === 'ArrowRight') set(v + 5); });
    if (reduce) return set(50);
    const t0 = performance.now(); cancelAnimationFrame(sweep);
    const run = now => { const k = Math.min(1, (now - t0 - 500) / 1600); if (k < 0) { set(88); sweep = requestAnimationFrame(run); return; }
      const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; set(88 - 38 * e); if (k < 1) sweep = requestAnimationFrame(run); };
    sweep = requestAnimationFrame(run);
  };
  const open = (i, from) => { opener = from || opener; cur = i; render(i); dlg.hidden = false; document.documentElement.classList.add('rvs-lock');
    requestAnimationFrame(() => dlg.classList.add('is-open')); dlg.querySelector('.rvs__x').focus({ preventScroll: true }); };
  const close = () => { dlg.classList.remove('is-open'); document.documentElement.classList.remove('rvs-lock'); cancelAnimationFrame(sweep);
    setTimeout(() => { dlg.hidden = true; document.getElementById('rvs-vid').innerHTML = ''; }, reduce ? 0 : 300); opener && opener.focus({ preventScroll: true }); };
  const go = d => { const n = cur + d; if (n < 0 || n >= R.length) return; cur = n; render(n); };
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('.rvs__x')) return close();
    const b = e.target.closest('.rvs__nav button'); if (b) return go(+b.dataset.d);
    if (e.target.closest('.rvs__cta')) close();
  });
  addEventListener('keydown', e => { if (dlg.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight' && !e.target.closest('#rvs-cmp')) go(1); if (e.key === 'ArrowLeft' && !e.target.closest('#rvs-cmp')) go(-1); });
})();
