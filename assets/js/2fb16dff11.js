
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* обратный переход (механика nomu): 4 слоя поднимаются по очереди, последний — цвет страницы */
  const wrap = document.getElementById('wavel'), paths = [...wrap.querySelectorAll('path')], sec6 = document.getElementById('kak-nachinaem');
  const P = 10, noise = (i, L) => (Math.sin(i * .9 + L * 1.3 + 2) + Math.sin(i * .37 + L * 2.1)) / 4 + .5;
  const delays = paths.map((_, L) => Array.from({ length: P }, (_, i) => L * .13 + noise(i, L) * .1));
  const smooth = t => t * t * (3 - 2 * t);
  const draw = prog => paths.forEach((p, L) => {
    const ys = delays[L].map(d => 100 * (1 - smooth(Math.min(1, Math.max(0, (prog - d) / .5)))));
    const step = 100 / (P - 1); let d = `M0 ${ys[0].toFixed(3)} C`;
    for (let i = 1; i < P; i++) { const x0 = (i - 1) * step, x1 = i * step, h = step / 2; d += ` ${(x0 + h).toFixed(3)} ${ys[i - 1].toFixed(3)} ${(x0 + h).toFixed(3)} ${ys[i].toFixed(3)} ${x1.toFixed(3)} ${ys[i].toFixed(3)}`; }
    p.setAttribute('d', d + ' L100 100 L0 100 Z');
  });
  // нижний край перехода (светлый блок) выходит на экран, когда светлый слой уже поднялся снизу
  const target = () => { const r = wrap.getBoundingClientRect(); return Math.min(1, Math.max(0, (innerHeight * .62 - r.top) / (innerHeight * .7))); };
  const ready = v => { sec6.classList.toggle('is-ready', v >= .8); wrap.dataset.done = v >= .8 ? '1' : ''; };
  let cur = 0, tgt = 0, raf = 0;
  const tick = () => { cur += (tgt - cur) * .16; if (Math.abs(tgt - cur) < .001) cur = tgt; draw(cur); ready(cur); raf = cur === tgt ? 0 : requestAnimationFrame(tick); };
  const onScroll = () => { tgt = reduce ? 1 : target(); if (reduce) { draw(1); ready(1); return; } if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); cur = tgt = reduce ? 1 : target(); draw(cur); ready(cur);

  /* анимации иллюстраций — когда блок виден */
  document.querySelectorAll('.lt').forEach(s => new IntersectionObserver((es, io) => es.forEach(e => { if (e.isIntersecting && (!s.classList.contains('lt') || s.id !== 'kak-nachinaem' || s.classList.contains('is-ready'))) { s.classList.add('is-in'); io.disconnect(); } }), { threshold: .2 }).observe(s));
  const mo = new MutationObserver(() => { if (sec6.classList.contains('is-ready')) setTimeout(() => sec6.classList.add('is-in'), 300); }); mo.observe(sec6, { attributes: true, attributeFilter: ['class'] });

  /* графики отчёта (02.11): строятся под размер окна, рисуются при появлении слева направо, потом — тихий цикл импульсов (CSS) */
  const card = document.querySelector('.fun7');
  const MON = ['май', 'июн', 'июл', 'авг', 'сен', 'окт'];
  // иллюстрация месячного отчёта, метрики — content.md «Макет месячного отчёта»; заменить на обезличенный отчёт клиента от Ивана
  const VIEWS = [1990, 2040, 1960, 2080, 2110, 2060, 2170, 2140, 2230, 2190, 2280, 2350, 2310, 2400, 2460, 2420, 2530, 2580, 2540, 2650, 2700, 2660, 2760, 2810, 2850, 2910];
  const CLICKS = [[210, 305, 95], [235, 340, 105], [275, 395, 120], [295, 425, 130], [335, 480, 145], [360, 520, 160]];   // звонок, маршрут, сайт
  const LEADS = [41, 49, 60, 68, 79, 88], COST = [880, 730, 600, 530, 460, 410];
  const wk = i => new Date(2026, 4, 4 + i * 7);   // недели с понедельника 4 мая
  // монотонная кривая: плавно, без выбросов выше и ниже точек
  const curve = P => { const n = P.length, m = [], t = []; for (let i = 0; i < n - 1; i++) m[i] = (P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]);
    t[0] = m[0]; t[n - 1] = m[n - 2]; for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (let i = 0; i < n - 1; i++) { if (!m[i]) { t[i] = t[i + 1] = 0; continue; } const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b; if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; } }
    const f = v => v.toFixed(1); let d = `M${f(P[0][0])} ${f(P[0][1])}`;
    for (let i = 0; i < n - 1; i++) { const h = (P[i + 1][0] - P[i][0]) / 3; d += ` C${f(P[i][0] + h)} ${f(P[i][1] + t[i] * h)} ${f(P[i + 1][0] - h)} ${f(P[i + 1][1] - t[i + 1] * h)} ${f(P[i + 1][0])} ${f(P[i + 1][1])}`; }
    return d; };
  const CFG = {
    views: { min: 1500, max: 3000, grid: [2000, 2500, 3000], g: ['#6fa2f7', '#8aa2e2'] },   // ось не с нуля, как в Метрике: видно рост
    leads: { max: 1200, grid: [400, 800, 1200], g: ['#ed9270', '#ff8a4d'], bar: '#8aa2e2', lmax: 120 },
    cost: { max: 900, grid: [300, 600, 900], g: ['#ed9270', '#ff8a4d'] },
  };
  const AX = 24, TOP = 8;   // снизу — подписи месяцев, сверху — запас под пик
  const charts = [...card.querySelectorAll('.ch7')].map(el => ({ el, k: el.dataset.ch, plot: el.querySelector('.ch7__plot'), svg: el.querySelector('svg'), coin: el.querySelector('.rub7'), rings: el.querySelector('.rg7') }));
  const render = c => {
    const W = c.plot.clientWidth, H = c.plot.clientHeight, base = H - AX, h = base - TOP, o = CFG[c.k], id = 'c7' + c.k;
    if (!W) return;
    const Y = (v, max = o.max, min = max === o.max ? o.min || 0 : 0) => base - (v - min) / (max - min) * h, f = v => v.toFixed(1);
    let defs = `<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0"><stop offset="0" stop-color="${o.g[0]}"/><stop offset="1" stop-color="${o.g[1]}"/></linearGradient>`;
    let s = o.grid.map(v => `<line class="gl" x1="0" x2="${W}" y1="${f(Y(v))}" y2="${f(Y(v))}"/>`).join('') + `<line class="bl" x1="0" x2="${W}" y1="${base + .5}" y2="${base + .5}"/>`;
    let ax = '', P;
    // заливка под линией: мягкий градиент + точки, как частицы прежней ленты
    const area = (P, x0, x1) => { const d = curve(P) + ` L${f(x1)} ${base} L${f(x0)} ${base} Z`;
      defs += `<linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <linearGradient id="${id}fv" gradientUnits="userSpaceOnUse" x1="0" y1="${TOP}" x2="0" y2="${base}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>
        <pattern id="${id}p" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1" fill="#fff"/></pattern>
        <mask id="${id}mf" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${base}" fill="url(#${id}fv)"/></mask>
        <mask id="${id}ma" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><path d="${d}" fill="url(#${id}v)"/></mask>
        <mask id="${id}md" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><g mask="url(#${id}mf)"><path d="${d}" fill="url(#${id}p)"/></g></mask>`;
      return `<g class="ar7"><rect width="${W}" height="${base}" fill="url(#${id}g)" mask="url(#${id}ma)" opacity=".5"/><rect width="${W}" height="${base}" fill="url(#${id}g)" mask="url(#${id}md)" opacity=".7"/></g>`; };
    const label = (x, i, anchor = 'middle') => `<text class="ax" x="${f(x)}" y="${H - 6}" text-anchor="${anchor}">${MON[i]}</text>`;
    if (c.k === 'views') {
      P = VIEWS.map((v, i) => [2 + i / (VIEWS.length - 1) * (W - 8), Y(v)]);
      s += area(P, P[0][0], P[P.length - 1][0]) + `<path class="ln" pathLength="1" d="${curve(P)}" stroke="url(#${id}g)"/><path class="cm7" pathLength="1" d="${curve(P)}" stroke="url(#${id}g)"/>`;
      const L = P[P.length - 1]; s += `<circle class="rp7" cx="${f(L[0])}" cy="${f(L[1])}" r="3.5" stroke="${o.g[1]}"/><circle class="pt" cx="${f(L[0])}" cy="${f(L[1])}" r="3.5" stroke="${o.g[1]}"/>`;
      let m = -1; VIEWS.forEach((_, i) => { const mo = wk(i).getMonth() - 4; if (mo !== m) { m = mo; ax += label(P[i][0], mo, 'start'); } });
    } else if (c.k === 'leads') {
      const band = W / 6, bw = Math.min(band * .5, 30), r = 3;
      defs += `<pattern id="${id}p" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1" fill="${o.bar}" fill-opacity=".55"/></pattern>`
        + `<pattern id="${id}q" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.1" fill="#c3d3ff"/></pattern>`;
      CLICKS.forEach((a, i) => { const v = a[0] + a[1] + a[2], x = band * (i + .5) - bw / 2, y = Y(v);
        const d = `M${f(x)} ${base} V${f(y + r)} Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)} H${f(x + bw - r)} Q${f(x + bw)} ${f(y)} ${f(x + bw)} ${f(y + r)} V${base} Z`;
        s += `<g class="br" style="--i:${i}"><path d="${d}" fill="${o.bar}" fill-opacity=".14"/><path d="${d}" fill="url(#${id}p)"/><path class="bf" d="${d}" fill="url(#${id}q)"/><path d="M${f(x + r)} ${f(y + .75)} H${f(x + bw - r)}" stroke="${o.bar}" stroke-width="1.5" stroke-linecap="round"/></g>`;
        ax += label(band * (i + .5), i); });
      P = LEADS.map((v, i) => [band * (i + .5), Y(v, o.lmax)]);
      s += `<path class="ln" pathLength="1" d="${curve(P)}" stroke="url(#${id}g)"/><path class="cm7" pathLength="1" d="${curve(P)}" stroke="url(#${id}g)"/>` + P.map(p => `<circle class="pt" cx="${f(p[0])}" cy="${f(p[1])}" r="3" stroke="url(#${id}g)"/>`).join('');
    } else {
      const R = c.coin.offsetWidth / 2;
      P = COST.map((v, i) => [4 + i / 5 * (W - 4 - R), Y(v)]);
      s += area(P, P[0][0], P[5][0]) + `<path class="ln" pathLength="1" d="${curve(P)}" stroke="url(#${id}g)"/><path class="cm7" pathLength="1" d="${curve(P)}" stroke="url(#${id}g)"/>` + P.slice(0, 5).map(p => `<circle class="pt" cx="${f(p[0])}" cy="${f(p[1])}" r="3" stroke="url(#${id}g)"/>`).join('');
      P.forEach((p, i) => { ax += label(p[0], i, i ? 'middle' : 'start'); });
      const L = P[5]; [c.coin, c.rings].forEach(e => { e.style.left = L[0] + 'px'; e.style.top = L[1] + 'px'; });
    }
    c.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    c.svg.innerHTML = `<defs>${defs}</defs>${s}${ax}`;
  };
  charts.forEach(c => {
    new ResizeObserver(() => render(c)).observe(c.plot);
    render(c);
  });
  // появление: каждый график — когда он на экране (на телефоне они друг под другом); линии и столбики — CSS-переходами,
  // ₽ отзывается, когда линия дошла (цифры над графиками убраны 02.11 — Никита: «акцент на цифры не нужен»)
  if (!reduce) {
    card.classList.add('js7');
    charts.forEach(c => {
      new IntersectionObserver((es, io) => es.forEach(e => { if (!e.isIntersecting) return; io.disconnect();
        const d = parseFloat(getComputedStyle(c.el).getPropertyValue('--d')) || 0;
        requestAnimationFrame(() => c.el.classList.add('is-play'));
        if (c.coin) setTimeout(() => c.coin.classList.add('is-hit'), d + 1000);
        setTimeout(() => c.el.classList.add('is-loop'), 1500); }), { threshold: .6 }).observe(c.el);
    });
    new IntersectionObserver(es => es.forEach(e => card.classList.toggle('is-off', !e.isIntersecting))).observe(card);
  }
})();
