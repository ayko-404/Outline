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
    /* 24.11 фон обложки: переключатель (временно) + анимации, только пока обложка видна */
    const setBg = v => { kh.dataset.bg = v; kh.querySelectorAll('[data-kbg]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kbg === v))); };
    const qb = new URLSearchParams(location.search).get('bg'); if (qb && /^(flow|drum|both|none)$/.test(qb)) setBg(qb);
    kh.addEventListener('click', e => { const b = e.target.closest('[data-kbg]'); if (!b) return; setBg(b.dataset.kbg);
      const u = new URL(location.href); u.searchParams.set('bg', b.dataset.kbg); history.replaceState(null, '', u); });
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let vis = true; new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(kh);
    const cards = [...kh.querySelectorAll('.os-kh__card')], N = cards.length;
    let off = 0, lt = 0;
    const flowTick = now => { requestAnimationFrame(flowTick); if (!vis || !/flow|both/.test(kh.dataset.bg)) { lt = now; return; }
      const dt = Math.min(64, now - (lt || now)); lt = now; if (!rm) off += dt * 0.00018;   // одна карточка ≈ за 5,5 с
      const sm = innerWidth < 700, R = sm ? 300 : 760, step = sm ? 0.3 : 0.19;
      cards.forEach((c, i) => { let p = ((i - off) % N + N) % N; if (p > N / 2) p -= N; const th = p * step, a = Math.abs(th);
        if (a > 1.5) { c.style.visibility = 'hidden'; return; } c.style.visibility = '';
        c.style.transform = `translate3d(${(R * Math.sin(th)).toFixed(1)}px,0,${(-R * (1 - Math.cos(th)) * 0.9).toFixed(1)}px) rotateY(${(-Math.max(-1.2, Math.min(1.2, th * 2.1))).toFixed(3)}rad)`;
        c.style.opacity = String(Math.max(0, Math.min(1, (1.5 - a) * 2.2))); }); };
    requestAnimationFrame(flowTick);
    const chips = [...kh.querySelectorAll('.os-kh__drum li')], M2 = chips.length; let act = 0;
    const drum = () => { chips.forEach((c, i) => { let d = ((i - act) % M2 + M2) % M2; if (d > M2 / 2) d -= M2; const ad = Math.abs(d);
      c.style.transform = `translateY(${(d * 3.15).toFixed(2)}rem)`; c.style.opacity = String(ad > 2.5 ? 0 : [1, 0.6, 0.25][Math.round(ad)]); c.classList.toggle('is-on', d === 0); }); };
    drum(); if (!rm) setInterval(() => { if (vis && /drum|both/.test(kh.dataset.bg)) { act = (act + 1) % M2; drum(); } }, 1900);
    const st = kh.querySelector('.os-kh__stage[data-keys-src]');
    const go = () => { const sc = document.createElement('script'); sc.src = st.dataset.keysSrc; document.body.appendChild(sc); };
    const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 2000 }) : setTimeout(go, 200));
    if (st) document.readyState === 'complete' ? idle() : addEventListener('load', idle, { once: true });
  }

  /* иллюстрации и линии — когда видны */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .25 });
  document.querySelectorAll('.os-card, .os-tf__grid, .os-steps__track, .os-no').forEach(el => io.observe(el));

  /* «Выбрать тариф» — тариф в форму, плавно к ней */
  document.addEventListener('click', e => { const b = e.target.closest('[data-os-tariff]'); if (!b) return;
    const f = document.querySelector('#zayavka form'); if (f && f.elements.tariff) f.elements.tariff.value = b.dataset.osTariff; });
})();
