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

  /* 24.11 кейсы на полке (реф shopify.com/editions): фильтр, наклон за курсором, раскрытие с перелётом обложки; переход ?tr=wave|sheet (временно) */
  const oc = document.querySelector('.oc');
  if (oc) {
    const covs = [...oc.querySelectorAll('.oc-cov')], dets = [...oc.querySelectorAll('.oc-det')], idx = [...oc.querySelectorAll('.oc-idx button')], box = oc.querySelector('.oc-dets');
    const mob = () => matchMedia('(max-width: 760px)').matches; let cur = -1, busy = false;
    const setTr = v => { R.dataset.otr = v; oc.querySelectorAll('[data-otr]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.otr === v))); dispatchEvent(new Event('scroll')); };
    setTr(new URLSearchParams(location.search).get('tr') === 'sheet' ? 'sheet' : 'wave');
    /* фильтр */
    const filt = f => { oc.querySelectorAll('[data-flt]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.flt === f)));
      covs.forEach(c => c.classList.toggle('is-out', f !== 'all' && c.dataset.f !== f)); idx.forEach(b => b.classList.toggle('is-out', f !== 'all' && b.dataset.f !== f)); };
    /* наведение: обложка выпрямляется и поднимается, слегка поворачивается за курсором; подпись внизу подчёркнута */
    const hov = (i, on) => { covs[i] && covs[i].classList.toggle('is-hov', on); idx[i] && idx[i].classList.toggle('is-hov', on); if (!on && covs[i]) covs[i].querySelector('.oc-cov__in').style.removeProperty('--ry'); };
    covs.forEach((c, i) => { const inn = c.querySelector('.oc-cov__in');
      c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hov(i, true); });
      c.addEventListener('pointerleave', () => hov(i, false));
      c.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || reduce) return; const r = c.getBoundingClientRect(); inn.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 14).toFixed(2) + 'deg'); }); });
    idx.forEach((b, i) => { b.addEventListener('pointerenter', () => hov(i, true)); b.addEventListener('pointerleave', () => hov(i, false)); });
    /* перелёт: сцена кейса стартует из прямоугольника обложки (FLIP) */
    const flip = (stage, from, back, done) => { const to = stage.getBoundingClientRect();
      const t = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
      stage.style.transition = 'none'; stage.style.transform = back ? 'none' : t; stage.style.borderRadius = back ? '' : `${4 * to.width / from.width}px`; void stage.offsetWidth;
      stage.style.transition = 'transform .75s cubic-bezier(.22, 1, .36, 1), border-radius .75s'; stage.style.transform = back ? t : 'none'; stage.style.borderRadius = '';
      setTimeout(done || (() => {}), 760); };
    const show = (i, fromCover) => { const d = dets[i]; dets.forEach(x => { x.hidden = x !== d; }); cur = i; oc.classList.add('is-det');
      covs.forEach((c, k) => c.style.opacity = k === i ? '0' : '');
      if (fromCover && !mob() && !reduce) { busy = true; flip(d.querySelector('.oc-det__stage'), covs[i].querySelector('.oc-cov__art').getBoundingClientRect(), false, () => { busy = false; }); }
      if (mob()) document.documentElement.style.overflow = 'hidden'; };
    const close = () => { if (cur < 0 || busy) return; const d = dets[cur], i = cur;
      const end = () => { d.hidden = true; d.querySelector('.oc-det__stage').style.cssText = ''; covs[i].style.opacity = ''; busy = false; };
      oc.classList.remove('is-det'); document.documentElement.style.overflow = ''; cur = -1;
      if (!mob() && !reduce && !covs[i].classList.contains('is-out')) { busy = true; covs[i].style.opacity = '0'; flip(d.querySelector('.oc-det__stage'), covs[i].querySelector('.oc-cov__art').getBoundingClientRect(), true, end); } else end(); };
    const step = s => { const vis = covs.map((c, k) => k).filter(k => !covs[k].classList.contains('is-out')); if (!vis.length) return; const p = vis.indexOf(cur); show(vis[(p + s + vis.length) % vis.length], false); };
    oc.addEventListener('click', e => { const t = e.target;
      const fb = t.closest('[data-flt]'); if (fb) { if (cur >= 0) close(); filt(fb.dataset.flt); return; }
      const tb = t.closest('button[data-otr]'); if (tb) { setTr(tb.dataset.otr); const u = new URL(location.href); u.searchParams.set('tr', tb.dataset.otr); history.replaceState(null, '', u); return; }
      const ob = t.closest('[data-open]'); if (ob) { const i = +ob.dataset.open; if (cur >= 0) show(i, false); else show(i, true); hov(i, false); return; }
      if (t.closest('[data-close]')) { close(); return; }
      const sb = t.closest('[data-step]'); if (sb) { step(+sb.dataset.step); return; }
      if (cur >= 0 && (t === box || t.classList.contains('oc-det'))) close(); });
    addEventListener('keydown', e => { if (cur < 0) return; if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); });
  }

  /* иллюстрации и линии — когда видны */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .25 });
  document.querySelectorAll('.os-card, .os-tf__grid, .os-steps__track, .os-no').forEach(el => io.observe(el));

  /* «Выбрать тариф» — тариф в форму, плавно к ней */
  document.addEventListener('click', e => { const b = e.target.closest('[data-os-tariff]'); if (!b) return;
    const f = document.querySelector('#zayavka form'); if (f && f.elements.tariff) f.elements.tariff.value = b.dataset.osTariff; });
})();
