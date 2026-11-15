
(() => {
  const tray = document.querySelector('#kak-nachinaem .rm6'); if (!tray) return;
  const cards = [...tray.querySelectorAll('.rm6__card')]; if (cards.length !== 3) return;
  /* А · маршрут. viewBox 300×100: линия по высоте 60, у первой карточки начинается в центре метки-старта, у третьей заканчивается петлёй */
  const pin = (x, n, d) => `<g class="pin" style="--d:${d}s"><path d="M${x} 58c0-10-13-17-13-30a13 13 0 0 1 26 0c0 13-13 20-13 30Z" fill="#0f151d"/><text x="${x}" y="33" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="Golos Text, sans-serif">${n}</text></g>`;
  const streets = '';   /* 03.11: серые «улицы» убраны — выглядели как грязные штрихи и спорили с маршрутом */
  const A = [
    `<svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">${streets}<path class="rt-bg" d="M40 60 H300"/><path class="rt" pathLength="1" style="--d:0s" d="M40 60 H300"/>${pin(40, 1, 0)}</svg>`,
    `<svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">${streets}<path class="rt-bg" d="M0 60 H300"/><path class="rt" pathLength="1" style="--d:.9s" d="M0 60 H300"/>${pin(150, 2, .7)}</svg>`,
    `<svg viewBox="0 0 300 100" aria-hidden="true" preserveAspectRatio="xMinYMid meet">${streets}<path class="rt-bg" d="M0 60 H170 a32 32 0 1 1 0.1 0"/><path class="rt" pathLength="1" style="--d:1.8s" d="M0 60 H170 a32 32 0 1 1 0.1 0"/>${pin(80, 3, 1.6)}
      <text class="lp-txt" style="--d:1.8s" x="250" y="24">КАЖДЫЙ</text><text class="lp-txt" style="--d:1.8s" x="250" y="38">МЕСЯЦ</text></svg>`,
  ];
  /* Б · что получите */
  const li = (k, t, e, d) => `<li style="--d:${d}s"><i class="${k}">${k === 'ok' ? '✓' : '✕'}</i>${t}${e ? `<em>${e}</em>` : ''}</li>`;
  const cal = (() => { const W = [2, 5, 9, 12, 16, 19, 23, 26]; return [...Array(30)].map((_, k) => `<i class="${k === 29 ? 'r' : W.includes(k) ? 'w' : ''}" style="--d:${(1.6 + k * .02).toFixed(2)}s"></i>`).join(''); })();
  const B = [
    `<div class="rmb"><div class="rmb__h"><span class="rmv__mono">Разбор карточки</span></div><ul>${li('ok', 'Категории и описание', '', .2)}${li('no', 'Нет часов работы', '', .35)}${li('no', 'Отзывы без ответов', '', .5)}${li('ok', 'Конкуренты рядом', '', .65)}</ul></div>`,
    `<div class="rmb"><div class="rmb__h"><span class="rmv__mono">План работы</span></div><div class="rmb__chips"><span style="--c:#ff4433">Яндекс Карты</span><span style="--c:#1ba136">2ГИС</span><span style="--c:#4285f4">Google</span></div>
      <ul style="margin-top:.625rem">${li('ok', 'Приоритеты', 'по разбору', 1)}${li('ok', 'Показатели', 'звонки, маршруты', 1.15)}</ul></div>`,
    `<div class="rmb"><div class="rmb__h"><span class="rmv__mono">Каждый месяц</span></div><div class="rmb__cal">${cal}</div>
      <div class="rmb__leg"><span style="--c:rgb(255 100 20 / .75)">работы по карточке</span><span style="--c:#2878ee">отчёт</span></div></div>`,
  ];
  /* В · шкала: проценты ширины — только порядок шагов, не сроки */
  /* В · шкала v2 (03.11, Никита: «нравится В, сделай покрасивее»): рельс через три карточки, старт — тёмные «таблетки» с иконкой,
     дальше — месяцы со значком отчёта в конце каждого, продолжение растворяется. Ширины — порядок шагов, не сроки. */
  const IC = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
    plan: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/></svg>',
  };
  const st = (l, w, ic, t, d) => `<span class="rmc__bar s" style="left:${l}%;width:${w}%;--d:${d}s"><i>${IC[ic]}</i>${t}</span>`;
  const mo = (l, w, t, d) => `<span class="rmc__bar m" style="left:${l}%;width:${w}%;--d:${d}s">${t}<b style="--d:${(d + .3).toFixed(2)}s">${IC.doc}</b></span>`;
  const C = [
    `<span class="rmc__cap rmc__start"><em class="rmc__pin" aria-hidden="true"><svg viewBox="0 0 24 30"><ellipse class="rmc__pin-r" cx="12" cy="27" rx="7" ry="2.2"/><ellipse cx="12" cy="27" rx="4" ry="1.3" fill="rgb(15 21 29 / .22)"/><path class="rmc__pin-b" d="M12 1.5C6.2 1.5 1.8 5.9 1.8 11.4c0 6.9 8.2 13.6 9.4 14.6.5.4 1.1.4 1.6 0 1.2-1 9.4-7.7 9.4-14.6C22.2 5.9 17.8 1.5 12 1.5Z"/><circle cx="12" cy="11.2" r="3.9" fill="#fff"/></svg></em><span>Старт</span></span><div class="rmc"><span class="rmc__ax"></span>${st(0, 76, 'search', 'Разбор', .1)}</div>`,
    `<div class="rmc"><span class="rmc__ax"></span>${st(0, 84, 'plan', 'План и условия', .45)}</div>`,
    `<span class="rmc__cap r rmc__hand"><svg viewBox="0 0 60 56" aria-hidden="true"><path pathLength="1" d="M58.5 8.6C46.2 3.9 31.4 6.6 27.6 15.8c-2.6 6.3 4.9 9.8 8.3 4.7 3.9-5.9-5.6-11.5-14.2-3.4-6.6 6.2-9.9 18.9-10.6 31.6"/><path class="hd" pathLength="1" d="M5.2 42.6c2.3 2.7 4.3 5.4 6 8.4 1.9-3 4-5.5 6.6-7.6"/></svg><span>Дальше&nbsp;— каждый месяц, с&nbsp;отчётом</span></span><div class="rmc"><span class="rmc__ax"></span>${mo(0, 28, '1 мес', .8)}${mo(31, 28, '2 мес', .95)}${mo(62, 28, '3 мес', 1.1)}<span class="rmc__more" style="--d:1.4s"><i></i><i></i><i></i></span></div>
`,
  ];
  cards.forEach((c, i) => { const r = c.querySelector('.rm6__ruler');
    r.insertAdjacentHTML('afterend', `<div class="rmv rmv--a" aria-hidden="true">${A[i]}</div><div class="rmv rmv--b" aria-hidden="true">${B[i]}</div><div class="rmv rmv--c" aria-hidden="true">${C[i]}</div>`); });

  const V = { now: 'Как сейчас', a: 'А · Маршрут', b: 'Б · Что получите', c: 'В · Шкала' };
  tray.insertAdjacentHTML('beforebegin', `<div class="rmsw"><div class="rmsw__in"><small>Иллюстрации</small>${Object.entries(V).map(([k, t]) => `<button type="button" data-v="${k}" aria-pressed="${k === 'c'}">${t}</button>`).join('')}</div></div>`);
  tray.dataset.v = 'c';   /* 03.11: выбран В — переключатель скрыт (.rmsw), варианты А и Б остаются в коде */
  const sw = tray.previousElementSibling, sec = document.getElementById('kak-nachinaem');
  sw.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    sw.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); tray.dataset.v = b.dataset.v;
    /* перезапуск появления, чтобы было видно движение варианта */
    if (sec.classList.contains('is-in')) { sec.classList.remove('is-in'); tray.offsetWidth; requestAnimationFrame(() => sec.classList.add('is-in')); }
  }));
})();
