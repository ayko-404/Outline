(() => { /* 20.11 «Outline Sites»: шторка «набросок ↔ сайт», анимации иллюстраций, тариф в форму */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* шторка: сама ходит туда-обратно; мышь или палец — управление, через 3 с снова сама */
  const cmp = document.querySelector('.os-cmp'), stage = cmp && cmp.querySelector('.os-cmp__stage');
  if (cmp && stage) {
    const set = p => cmp.style.setProperty('--x', Math.max(4, Math.min(96, p)).toFixed(2) + '%');
    let hold = 0, raf = 0, vis = false, t0 = performance.now(), drag = false;
    const at = e => { const b = stage.getBoundingClientRect(); set((e.clientX - b.left) / b.width * 100); hold = performance.now() + 3000; };
    stage.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || drag) at(e); });
    stage.addEventListener('pointerdown', e => { drag = true; at(e); });
    addEventListener('pointerup', () => { drag = false; });
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick = now => { if (!vis) return; raf = requestAnimationFrame(tick); if (now < hold) { t0 = now - 1750; return; }
      const k = ((now - t0) / 7000) % 1, tri = k < .5 ? k * 2 : 2 - k * 2; set(82 - ease(tri) * 64); };
    if (reduce) set(50);
    else new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) raf = requestAnimationFrame(tick); })).observe(cmp);
  }

  /* 3D-«о»: сцена (three.js, ~130 КБ сжатая) — только после загрузки страницы, в простое; при «меньше движения» — картинка */
  const o3 = document.querySelector('.os-3d[data-o3d-src]');
  if (o3 && !reduce) {
    const go = () => { const sc = document.createElement('script'); sc.src = o3.dataset.o3dSrc; document.body.appendChild(sc); };
    const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 300));
    document.readyState === 'complete' ? idle() : addEventListener('load', idle, { once: true });
  }

  /* 23.11 обложка со связкой брелоков: сцена после загрузки страницы */
  const kh = document.querySelector('.os-kh');
  if (kh) {
    /* варианты обложки (временно): ?v=a|b|c|d и переключатель */
    const setV = v => { kh.dataset.v = v; kh.querySelectorAll('[data-kv]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kv === v)));
      if (window.__keysLayout && v !== 'c') requestAnimationFrame(() => window.__keysLayout(v)); };
    const q = new URLSearchParams(location.search).get('v'); if (q && /^[a-f]$/.test(q)) setV(q);
    kh.addEventListener('click', e => { const b = e.target.closest('[data-kv]'); if (!b) return; setV(b.dataset.kv);
      const u = new URL(location.href); u.searchParams.set('v', b.dataset.kv); history.replaceState(null, '', u); });
    /* 24.11 фон обложки — слова справа (реф fourmula.ai) */
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let vis = true; new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(kh);
    const chips = [...kh.querySelectorAll('.os-kh__drum li')], M2 = chips.length; let act = 0;
    const drum = () => { chips.forEach((c, i) => { let d = ((i - act) % M2 + M2) % M2; if (d > M2 / 2) d -= M2; const ad = Math.abs(d);
      c.style.transform = `translateY(${(d * 3.15).toFixed(2)}rem)`; c.style.opacity = String(ad > 2.5 ? 0 : [1, 0.6, 0.25][Math.round(ad)]); c.classList.toggle('is-on', d === 0); }); };
    drum(); if (!rm) setInterval(() => { if (vis && /drum|both/.test(kh.dataset.bg)) { act = (act + 1) % M2; drum(); } }, 1900);
    const st = kh.querySelector('.os-kh__stage[data-keys-src]');
    const go = () => { const sc = document.createElement('script'); sc.src = st.dataset.keysSrc; document.body.appendChild(sc); };
    const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 2000 }) : setTimeout(go, 200));
    if (st) document.readyState === 'complete' ? idle() : addEventListener('load', idle, { once: true });
  }

  /* 24.11 2-й блок: закреплённый экран, две фразы по прокрутке (--q), подчёркивание «заявки» — когда фраза встала */
  const wi = document.querySelector('[data-why-intro]');
  if (wi && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ink = wi.querySelector('.os-why__b .o-ink'); let raf2 = 0;
    /* 24.11: отсчёт фраз начинается, когда лист поднялся почти до середины экрана — без пустого тёмного экрана до заголовка;
       --e на :root — погружение: лист расширяется до краёв, обложка уходит в глубину под вуаль; шапка темнеет над тёмным листом */
    const why = wi.closest('.os-why'), veil = document.querySelector('.os-veil'), R = document.documentElement, B = document.body;
    const upd = () => { raf2 = 0; const r = wi.getBoundingClientRect(), off = innerHeight * .55, span = r.height - innerHeight + off;
      const q = Math.max(0, Math.min(1, (off - r.top) / Math.max(1, span)));
      wi.style.setProperty('--q', q.toFixed(4)); if (ink) ink.classList.toggle('is-in', q > 0.74);
      const wr = why.getBoundingClientRect(), e = Math.max(0, Math.min(1, 1 - wr.top / (innerHeight * .9)));
      R.style.setProperty('--e', e.toFixed(4)); if (veil) veil.classList.toggle('is-gone', e <= 0 || e >= 1);
      B.classList.toggle('why-dark', wr.top <= 32 && wr.bottom > 32); };
    upd(); addEventListener('scroll', () => { if (!raf2) raf2 = requestAnimationFrame(upd); }, { passive: true }); addEventListener('resize', upd);
  }

  /* 24.11 волны между светлым и тёмным — механика главной (#wavex/#wavel, nomu): 4 слоя, 10 точек, у каждой своя задержка */
  const R = document.documentElement;
  const wave = (wrap, k) => { if (!wrap) return; const paths = [...wrap.querySelectorAll('path')], P = 10;
    const noise = (i, L) => k ? (Math.sin(i * .9 + L * 1.3 + 2) + Math.sin(i * .37 + L * 2.1)) / 4 + .5 : (Math.sin(i * .9 + L * 1.7) + Math.sin(i * .37 + L * 2.9 + 1)) / 4 + .5;
    const delays = paths.map((_, L) => Array.from({ length: P }, (_, i) => L * .13 + noise(i, L) * .1)), smooth = t => t * t * (3 - 2 * t);
    const draw = prog => paths.forEach((p, L) => { const ys = delays[L].map(d => 100 * (1 - smooth(Math.min(1, Math.max(0, (prog - d) / .5)))));
      const step = 100 / (P - 1); let d = `M0 ${ys[0].toFixed(3)} C`;
      for (let i = 1; i < P; i++) { const x0 = (i - 1) * step, x1 = i * step, h = step / 2; d += ` ${(x0 + h).toFixed(3)} ${ys[i - 1].toFixed(3)} ${(x0 + h).toFixed(3)} ${ys[i].toFixed(3)} ${x1.toFixed(3)} ${ys[i].toFixed(3)}`; }
      p.setAttribute('d', d + ' L100 100 L0 100 Z'); });
    const target = () => { const r = wrap.getBoundingClientRect(); return Math.min(1, Math.max(0, (innerHeight * .98 - r.top) / (innerHeight * (k ? 1.06 : .88)))); };
    let cur = 0, tgt = 0, raf = 0;
    const tick = () => { cur += (tgt - cur) * .16; if (Math.abs(tgt - cur) < .001) cur = tgt; draw(cur); raf = cur === tgt ? 0 : requestAnimationFrame(tick); };
    const on = () => { tgt = reduce ? 1 : target(); if (reduce) return draw(1); if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); cur = tgt = reduce ? 1 : target(); draw(cur); };
  wave(document.getElementById('ocw-in'), 0); wave(document.getElementById('ocw-out'), 1);

  /* 24.11 кейсы крупно — три раскладки на выбор (временно): ?cases=vt|stk|bento, переход ?tr=wave|sheet */
  const oc = document.querySelector('.oc');
  if (oc) {
    const cards = [...oc.querySelectorAll('.oc-card')], tabs = [...oc.querySelectorAll('.oc-tab')], list = oc.querySelector('.oc-list'); let cur = 0;
    const press = (sel, v, attr) => oc.querySelectorAll(sel).forEach(b => b.setAttribute('aria-pressed', String(b.dataset[attr] === v)));
    const show = i => { cur = (i + cards.length) % cards.length; cards.forEach((c, k) => c.classList.toggle('is-on', k === cur)); tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === cur)));
      const bar = tabs[cur] && tabs[cur].querySelector('.oc-tab__bar'); if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; } };
    const setCs = v => { oc.dataset.cs = v; press('[data-ocs]', v, 'ocs'); cards.forEach(c => { c.style.removeProperty('--s'); c.style.removeProperty('--b'); }); show(cur); stk(); };
    const setTr = v => { R.dataset.otr = v; press('[data-otr]', v, 'otr'); dispatchEvent(new Event('scroll')); };
    const qs = new URLSearchParams(location.search);
    oc.addEventListener('click', e => { const b = e.target.closest('[data-ocs],[data-otr]'), t = e.target.closest('.oc-tab');
      if (t) { show(+t.dataset.i); return; } if (!b) return; const u = new URL(location.href);
      if (b.dataset.ocs) { setCs(b.dataset.ocs); u.searchParams.set('cases', b.dataset.ocs); } else { setTr(b.dataset.otr); u.searchParams.set('tr', b.dataset.otr); } history.replaceState(null, '', u); });
    tabs.forEach(t => t.querySelector('.oc-tab__bar').addEventListener('animationend', () => { if ((oc.dataset.cs || 'vt') === 'vt') show(cur + 1); }));
    list.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') oc.classList.add('is-hold'); }); list.addEventListener('pointerleave', () => oc.classList.remove('is-hold'));
    new IntersectionObserver(es => es.forEach(e => oc.classList.toggle('is-play', e.isIntersecting && !reduce)), { threshold: .35 }).observe(list);
    /* окно сайта листается, когда карточка на экране */
    const lio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-live', e.isIntersecting)), { threshold: .45 });
    cards.forEach(c => lio.observe(c));
    /* «Стопка»: входящая карточка подрастает (как у chipsa), накрытая — уменьшается и темнеет */
    let raf3 = 0;
    function stk() { raf3 = 0; if (oc.dataset.cs !== 'stk' || reduce) return;
      cards.forEach((c, i) => { const r = c.getBoundingClientRect(), top = parseFloat(getComputedStyle(c).top) || 0, h = r.height / (parseFloat(c.style.getPropertyValue('--s')) || 1);
        const grow = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * .55)));
        const nx = cards[i + 1] ? cards[i + 1].getBoundingClientRect().top : Infinity, p = Math.min(1, Math.max(0, (top + h - nx) / h));
        c.style.setProperty('--s', ((.92 + .08 * grow) * (1 - p * .08)).toFixed(4)); c.style.setProperty('--b', (1 - p * .45).toFixed(3)); }); }
    addEventListener('scroll', () => { if (!raf3) raf3 = requestAnimationFrame(stk); }, { passive: true });
    const qc = qs.get('cases'), qt = qs.get('tr');
    setTr(qt === 'sheet' ? 'sheet' : 'wave'); setCs(/^(vt|stk|bento)$/.test(qc || '') ? qc : 'vt');
  }

  /* иллюстрации и линии — когда видны */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .25 });
  document.querySelectorAll('.os-card, .os-tf__grid, .os-steps__track, .os-no').forEach(el => io.observe(el));

  /* «Выбрать тариф» — тариф в форму, плавно к ней */
  document.addEventListener('click', e => { const b = e.target.closest('[data-os-tariff]'); if (!b) return;
    const f = document.querySelector('#zayavka form'); if (f && f.elements.tariff) f.elements.tariff.value = b.dataset.osTariff; });
})();
