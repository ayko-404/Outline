
(() => {
  /* кейсы: данные из b06-cases (window.__cases); блок встаёт на место прежнего «Кейсы» */
  const K = window.__cases, old = document.getElementById('keysy'), sec = document.getElementById('keysy-v'), root = document.getElementById('csv');
  if (!K) return;
  const has = old && sec && root;   // 13.11: на /cases/ блока главной нет — функции отрисовки всё равно нужны (window.__csvR)
  if (has) { old.after(sec); old.remove(); sec.id = 'keysy'; }
  const { C, IMG, YA, RT } = K, N = C.length, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const plural = n => { n = +n; const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? 'оценка' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'оценки' : 'оценок'; };
  const ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const SB = '<span class="mph__sb"><span>9:41</span><i></i><span><svg viewBox="0 0 64 12" fill="#0b0b0c"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="6" width="3" height="6" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/><path d="M29 4.2a8.6 8.6 0 0 1 11.6 0l-1.3 1.4a6.7 6.7 0 0 0-9 0Zm2.6 2.9a4.8 4.8 0 0 1 6.4 0l-1.3 1.4a2.9 2.9 0 0 0-3.8 0Zm3.2 3.4-1.3-1.4a1.9 1.9 0 0 1 2.6 0Z"/><rect x="44.5" y=".5" width="17" height="11" rx="3" fill="none" stroke="#0b0b0c" opacity=".4"/><rect x="46" y="2" width="13" height="8" rx="1.8"/><rect x="62.5" y="4" width="1.5" height="4" rx=".75" opacity=".4"/></svg></span></span>';
  // иконки ниш для тега: 24×24, линия 1.8, как иконки площадок
  const ICO = {
    kamyshi: '<path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2ZM6.5 19l-1 2M17.5 19l1 2M6 12V6a2 2 0 0 1 4 0"/><path d="M14 9c-1-1 1-1.6 0-3.2M17.5 9c-1-1 1-1.6 0-3.2"/>',
    michurinsky: '<path d="M4 20 19 5M17 3l4 4"/><rect x="6.5" y="11.5" width="4" height="5" rx="1.2" transform="rotate(45 8.5 14)"/><rect x="10.5" y="7.5" width="4" height="5" rx="1.2" transform="rotate(45 12.5 10)"/><circle cx="3.5" cy="20.5" r="1.2"/>',
    baza: '<path d="M14.5 4.5l5 5-7.5 7.5h-5v-5Z"/><path d="M7 17l-3.5 3.5M10 9l5 5M17 2l5 5"/>',
    ucandles: '<rect x="8" y="10" width="8" height="11" rx="1.5"/><path d="M12 10V8M12 2.5c1.6 1.8 2 3 0 4.5-2-1.5-1.6-2.7 0-4.5Z"/>',
    avtodush: '<path d="M2 16V8h11v8M13 11h4l3 3v2M2 16h18"/><circle cx="6" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/><path d="M19 2.5c1 1.3 1.6 2.1 1.6 2.8a1.6 1.6 0 0 1-3.2 0c0-.7.6-1.5 1.6-2.8Z"/>',
    notarius: '<circle cx="12" cy="5" r="2.5"/><path d="M10.6 7.2 10 12h4l-.6-4.8M5 14a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5ZM5 20h14"/>',
    aviator: '<path d="M7.5 20v-3.2C5.4 15.7 4 13.6 4 11V9a5 5 0 0 1 5-5h4a6 6 0 0 1 6 6v3.5c0 1.6-.8 2.7-2 3.3V20Z"/><path d="M4.2 11.5c1.9-.6 3.9.2 4.8 2M7.5 17h9.5"/>',
  };
  const ico = id => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[id].replace(/<(path|circle|rect)/g, '<$1 pathLength="1"')}</svg>`;
  let cur = 0, tm = 0;

  const top = c => c.big.replace('ТОП-', '<span>ТОП</span> ');
  const row = (c, now) => now
    ? `<div class="csv__row"><span class="p">${c.pos}<small>сейчас</small></span><img loading="lazy" decoding="async" src="${IMG[c.id]}" alt=""><span><b>${c.name}</b><em>${c.niche}</em></span><span class="rt">${RT[c.id][0]} ★<small>${RT[c.id][1]} ${plural(RT[c.id][1])}</small></span></div>`
    : c.was || c.wasPos ? `<div class="csv__row was"><span class="p">${c.wasPos || '—'}<small>до</small></span><img loading="lazy" decoding="async" src="${IMG[c.id]}" alt=""><span><b>${c.name}</b><em>${c.was || 'позиция до начала работы'}</em></span></div>` : '';
  const tbl = c => `<table class="csv__tbl"><thead><tr><th>Показатели карточки</th><th class="b">Было</th><th class="a">Сейчас</th></tr></thead><tbody>${c.rows.map(r => `<tr><td>${r[0]}</td><td class="b">${r[2] ?? '—'}</td><td class="n">${r[1]}</td></tr>`).join('')}</tbody></table>`;
  const body = c => `<div class="csv__body"><div class="csv__tags"><span class="n">${ico(c.id)}${c.niche}</span><span>${c.city}</span><span class="q">${c.period}</span></div><p class="csv__top">${top(c)}</p><p class="csv__cap">${c.cap}</p><div class="csv__rows">${row(c, 1)}${row(c, 0)}</div>${tbl(c)}<div class="csv__ft"><a class="csv__more" href="#">Читать кейс ${ARR}</a></div></div>`;
  const phone = c => `<button type="button" class="csv__ph" data-shot="${cur}" aria-label="Карточка ${c.name} в Яндекс Картах — открыть крупно"><span class="csv__dev"><span class="mph"><span class="mph__scr">${SB}<span class="mph__view"><img loading="lazy" decoding="async" src="${YA[c.id]}" alt=""></span><span class="mph__home"></span></span></span></span><span class="cap">Карточка клиента в&nbsp;Яндекс Картах</span></button>`;
  const tab = (c, k) => `<button type="button" role="tab" class="csv__it" data-i="${k}" aria-selected="${k === cur}" aria-controls="csv-panel" tabindex="${k === cur ? 0 : -1}"><img loading="lazy" decoding="async" src="${IMG[c.id]}" alt=""><span><b>${c.name}</b><small>${c.niche} · ${c.city}</small></span></button>`;
  window.__csvR = { body, phone };   // 13.11: страница /cases/ строит сетку теми же карточками
  if (!has) return;
  root.innerHTML = `<div class="csv__list" role="tablist" aria-label="Кейсы" aria-orientation="vertical">${C.map(tab).join('')}</div><div class="csv__card"><div class="csv__in" role="tabpanel" id="csv-panel">${body(C[cur])}${phone(C[cur])}</div></div>`;

  /* смена кейса: список сразу, текст — короткий фейд, экран телефона — наплыв поверх прежнего */
  const go = (i, focus) => {
    i = (i + N) % N; if (i === cur) return; cur = i; const c = C[cur];
    root.querySelectorAll('[role="tab"]').forEach(t => { const on = +t.dataset.i === cur; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    const act = root.querySelector('[role="tab"][aria-selected="true"]'), L = act.parentElement;
    if (L.scrollWidth > L.clientWidth + 2) L.scrollTo({ left: act.offsetLeft - (L.clientWidth - act.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    root.querySelector('.csv__body').classList.add('is-out');
    clearTimeout(tm); tm = setTimeout(() => { const t = document.createElement('div'); t.innerHTML = body(c); const nb = t.firstElementChild;
      nb.classList.add('is-in'); root.querySelector('.csv__body').replaceWith(nb); }, reduce ? 0 : 130);
    const ph = root.querySelector('.csv__ph'), view = ph.querySelector('.mph__view'), img = new Image();
    ph.dataset.shot = cur; ph.setAttribute('aria-label', `Карточка ${c.name} в Яндекс Картах — открыть крупно`);
    img.alt = ''; img.src = YA[c.id];
    const done = () => { [...view.querySelectorAll('img')].filter(x => x !== img).forEach(x => x.remove()); img.classList.remove('is-new'); };
    if (reduce) { view.append(img); done(); } else { img.className = 'is-new'; img.addEventListener('animationend', done, { once: true }); view.append(img); }
  };

  root.addEventListener('click', e => { const t = e.target.closest('[data-i]'), sh = e.target.closest('[data-shot]');
    if (t) go(+t.dataset.i); else if (sh && window.__csShot) window.__csShot(+sh.dataset.shot); });
  root.addEventListener('keydown', e => { if (!e.target.closest('[role="tab"]')) return;
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (d) { e.preventDefault(); go(cur + d, true); } });
})();
