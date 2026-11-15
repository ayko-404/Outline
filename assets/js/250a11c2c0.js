(() => { /* страница кейсов: обложки (3 варианта), лента карточек главной, липкая панель с фильтром */
  const K = window.__cases, R = window.__csvR; if (!K || !R) return;
  const { C, IMG, YA } = K, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const kind = c => c.was ? 'new' : 'up';
  /* лента */
  const list = document.querySelector('.m-cs__list'), seg = document.querySelector('.m-seg');
  list.innerHTML = C.map((c, k) => `<article class="m-cl" id="cs-${c.id}" data-k="${kind(c)}"><div class="csv"><div class="csv__card"><div class="csv__in">${R.body(c)}${R.phone(c).replace(/data-shot="\d+"/, `data-shot="${k}"`)}</div></div></div></article>`).join('');
  const cards = [...list.children], bs = [...seg.querySelectorAll('[data-f]')];
  bs.forEach(b => { const f = b.dataset.f; b.querySelector('b').textContent = f === 'all' ? C.length : C.filter(c => kind(c) === f).length; });
  const ind = () => { const a = seg.querySelector('[aria-selected="true"]'); seg.style.setProperty('--x', a.offsetLeft + 'px'); seg.style.setProperty('--w', a.offsetWidth + 'px'); };
  const pick = b => { bs.forEach(x => x.setAttribute('aria-selected', x === b)); ind(); const f = b.dataset.f;
    cards.forEach(el => { const on = f === 'all' || el.dataset.k === f; if (on && el.hidden) { el.hidden = false; if (!reduce) el.animate([{ opacity: 0, transform: 'translateY(1rem)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' }); } else if (!on) el.hidden = true; });
    const top = list.getBoundingClientRect().top + scrollY - 170; if (scrollY > top) scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' }); };
  seg.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) pick(b); });
  addEventListener('resize', ind); ind(); requestAnimationFrame(() => seg.classList.add('is-ready'));
  const bar = document.querySelector('.m-csbar'); new IntersectionObserver(([e]) => bar.classList.toggle('is-stuck', e.intersectionRatio < 1), { rootMargin: '-81px 0px 0px 0px', threshold: [1] }).observe(bar);
  document.addEventListener('click', e => { const sh = e.target.closest('.m-cs [data-shot], .m-cv [data-shot]'); if (sh && window.__csShot) { e.preventDefault(); window.__csShot(+sh.dataset.shot); } });

  /* обложка — папка «Кейсы» (13.11, выбрана Никитой из трёх «папок») */
  const N = C.length;
  /* C · папка «Кейсы»: из папки торчат телефоны с карточками клиентов и листы с результатами */
  const Cc = document.querySelector('.m-cv__c'), ph = [0, 3, 2], sh = [1, 4];
  Cc.innerHTML = `<div class="m-fc"><div class="m-fc__back"></div>
    ${ph.map((i, k) => `<div class="m-fc__ph" style="--k:${k}"><span class="csv__dev"><span class="mph"><span class="mph__scr"><span class="mph__view"><img loading="lazy" decoding="async" src="${YA[C[i].id]}" alt=""></span><span class="mph__home"></span></span></span></span></div>`).join('')}
    ${sh.map((i, k) => `<div class="m-fc__sh" style="--k:${k}"><span class="m-fc__shh"><img loading="lazy" decoding="async" src="${IMG[C[i].id]}" alt=""><b>${C[i].name}</b></span><span class="m-fa__top">${C[i].big.replace('ТОП-', '<i>ТОП</i>')}</span>${C[i].rows.slice(0, 2).map(r => `<span class="m-fa__row"><span>${r[0]}</span><b>${r[1]}</b></span>`).join('')}</div>`).join('')}
    <div class="m-fc__front"><span class="m-fc__lbl"><b>Кейсы</b><small>${N}&nbsp;проектов · ${[...new Set(C.map(c => c.niche))].length}&nbsp;ниш</small></span><span class="m-fc__av">${C.map(c => `<img loading="lazy" decoding="async" src="${IMG[c.id]}" alt="">`).join('')}</span></div></div>`;
})();