(() => { /* бирки тарифов: верёвка от верха страницы (под шапкой) к правому краю, бирки висят на ней */
  const w = document.querySelector('.m-tgw'); if (!w) return;
  const sec = w.closest('section'), vis = w.parentElement, ts = [...w.querySelectorAll('.m-tgw__t')];
  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'); svg.classList.add('m-tgw__rope'); svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path'); path.setAttribute('pathLength', '1'); const sh = path.cloneNode(); sh.classList.add('m-tgw__sh'); svg.append(sh, path);
  const top = document.createElement('i'), side = document.createElement('i'); top.className = 'm-tgw__mount m-tgw__mount--top'; side.className = 'm-tgw__mount m-tgw__mount--side';
  sec.append(svg, top, side); ts.forEach(t => sec.append(t));
  const F = [.18, .515, .85], DROP = [.42, .12, .3];
  const lay = () => {
    const S = sec.getBoundingClientRect(), V = vis.getBoundingClientRect(), W = S.width, Hh = S.height, mob = innerWidth <= 1000;
    const hdr = document.querySelector('.hdr, header');
    /* 14.11 баг: при открытом поп-апе ниже обложки пересчёт брал низ прилипшего меню относительно уехавшей вверх секции — крепление улетало вниз. Теперь — высота меню минус положение секции в документе, от прокрутки не зависит */
    let docTop = 0; for (let e = sec; e; e = e.offsetParent) docTop += e.offsetTop;
    const hb = hdr ? Math.max(0, hdr.offsetHeight - docTop) : 0;
    const A = mob ? [14, V.top - S.top + 14] : [V.left - S.left - V.width * .06, hb + 14];
    const B = mob ? [W - 14, V.top - S.top + 40] : [W - 16, V.top - S.top + V.height * .42];
    const sag = mob ? 70 : Math.max(120, (B[1] - A[1]) * .9), Cx = (A[0] + B[0]) / 2, Cy = Math.max(A[1], B[1]) + sag;
    const at = t => [(1 - t) ** 2 * A[0] + 2 * (1 - t) * t * Cx + t * t * B[0], (1 - t) ** 2 * A[1] + 2 * (1 - t) * t * Cy + t * t * B[1]];
    svg.setAttribute('viewBox', `0 0 ${W} ${Hh}`); svg.style.width = W + 'px'; svg.style.height = Hh + 'px';
    path.setAttribute('d', `M${A[0]} ${A[1]} Q${Cx} ${Cy} ${B[0]} ${B[1]}`); sh.setAttribute('d', path.getAttribute('d'));
    top.style.left = A[0] + 'px'; top.style.top = A[1] + 'px'; side.style.left = B[0] + 'px'; side.style.top = B[1] + 'px';
    const tAt = x => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (at(m)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };   // бирки — равномерно по ширине верёвки
    const T = (mob ? [.18, .5, .82] : F).map(f => tAt(A[0] + (B[0] - A[0]) * f));
    const room = Math.max(40, V.bottom - S.top - Math.max(...T.map(t => at(t)[1])) - (ts[0].querySelector('.m-tgw__tag').offsetHeight) - 24);
    ts.forEach((el, k) => { const [x, y] = at(T[k]); el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.setProperty('--len', (24 + room * DROP[k]) + 'px'); });
  };
  lay(); addEventListener('resize', lay); new ResizeObserver(lay).observe(sec);
  /* 14.11 (Никита: «криво появляются»): до раскладки бирки скрыты; после шрифтов — верёвка протягивается, крепления встают, бирки по очереди «навешиваются» */
  const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(r => addEventListener('load', r, { once: true }));   // старт после загрузки страницы — главный поток свободен, кадры не теряются
  Promise.race([Promise.all([document.fonts ? document.fonts.ready : null, loaded]), new Promise(r => setTimeout(r, 2500))]).then(() => { lay(); requestAnimationFrame(() => requestAnimationFrame(() => sec.classList.add('is-tg'))); });
})();
(() => { /* сравнение тарифов: вкладки на телефоне + появление строк по прокрутке */
  const w = document.querySelector('.m-sx'); if (!w) return;
  w.addEventListener('click', e => { const b = e.target.closest('.m-sx__tabs [data-k]'); if (!b || b.dataset.k === w.dataset.k) return; w.dataset.k = b.dataset.k; w.querySelectorAll('.m-sx__tabs [data-k]').forEach(x => x.setAttribute('aria-selected', x === b)); });
  /* 14.11 (Никита: «криво по скроллу»): шапка прилипла к меню — плотный фон, линия снизу, бейдж внутрь рамки */
  const hr = w.querySelector('.m-sx__r--h'); const stick = () => { const top = parseFloat(getComputedStyle(hr).top) || 0, r = hr.getBoundingClientRect(); hr.classList.toggle('is-stuck', r.top <= top + .5 && hr.parentElement.getBoundingClientRect().top < r.top - 1); };
  addEventListener('scroll', stick, { passive: true }); addEventListener('resize', stick); stick();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  w.classList.add('is-anim');
  const io = new IntersectionObserver(es => es.filter(e => e.isIntersecting).forEach((e, n) => { e.target.style.setProperty('--i', n); e.target.classList.add('is-in'); io.unobserve(e.target); }), { rootMargin: '0px 0px -8% 0px' });
  w.querySelectorAll('.m-sx__r').forEach(r => io.observe(r));
})();
(() => { /* обложка: чек печатается сразу при загрузке (не по прокрутке) */
  const rc = document.querySelector('.m-tfrc .p-rc'); if (!rc) return; rc.classList.remove('is-scroll'); rc.style.removeProperty('--rc-y'); requestAnimationFrame(() => rc.classList.add('is-in')); })();