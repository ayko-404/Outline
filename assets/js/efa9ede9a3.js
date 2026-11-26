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
    /* 24.11: при прелоадере 3D грузим после него — разбор моделей занимает главный поток, и анимация прелоадера замирала */
    const start = () => document.readyState === 'complete' ? idle() : addEventListener('load', idle, { once: true });
    if (st) document.documentElement.classList.contains('pre-on') ? (window.__osLogo ? start() : addEventListener('os-pre:logo', start, { once: true })) : start();   // 24.11: после логотипа, не после шторки
  }

  /* 24.11 2-й блок: закреплённый экран, две фразы по прокрутке (--q), подчёркивание «заявки» — когда фраза встала */
  const wi = document.querySelector('[data-why-intro]');
  if (wi && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ink = wi.querySelector('.os-why__b .o-ink'); let raf2 = 0;
    /* 24.11: отсчёт фраз начинается, когда лист поднялся почти до середины экрана — без пустого тёмного экрана до заголовка;
       --e на :root — погружение: лист расширяется до краёв, обложка уходит в глубину под вуаль; шапка темнеет над тёмным листом */
    const why = wi.closest('.os-why'), veil = document.querySelector('.os-veil'), R = document.documentElement, B = document.body;
    /* 24.11 (лаги): --e пишем только тем, кто его читает, а не на :root — иначе каждый кадр пересчитывались стили всей страницы */
    const eEls = [veil, why, ...document.querySelectorAll('.os-kh[data-v="e"] .os-kh__in, .os-kh[data-v="e"] .os-kh__bg')].filter(Boolean); let lastE = '';
    const upd = () => { raf2 = 0; const r = wi.getBoundingClientRect(), off = innerHeight * .55, span = r.height - innerHeight + off;
      const q = Math.max(0, Math.min(1, (off - r.top) / Math.max(1, span)));
      wi.style.setProperty('--q', q.toFixed(4)); if (ink) ink.classList.toggle('is-in', q > 0.74);
      const wr = why.getBoundingClientRect(), e = Math.max(0, Math.min(1, 1 - wr.top / (innerHeight * .9)));
      const ev = e.toFixed(3); if (ev !== lastE) { lastE = ev; eEls.forEach(el => el.style.setProperty('--e', ev)); } if (veil) veil.classList.toggle('is-gone', e <= 0 || e >= 1);
      B.classList.toggle('why-dark', wr.top <= 32 && wr.bottom > 32); };
    upd(); addEventListener('scroll', () => { if (!raf2) raf2 = requestAnimationFrame(upd); }, { passive: true }); addEventListener('resize', upd);
  }

  const R = document.documentElement;

  /* 24.11 (лаги): бесконечные анимации (живые демо, схема, тарифы) — на паузе, пока блок за экраном */
  if ('IntersectionObserver' in window) { const pio2 = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-off', !e.isIntersecting)), { rootMargin: '100px 0px' });
    document.querySelectorAll('.os-ill, .os-multi, .os-tf, .os-steps, .os-eyebrow, .os-timer').forEach(el => pio2.observe(el)); }

  /* 24.11 (Никита) из тёмного 2-го блока в светлые кейсы — волна, механика главной (#wavel, nomu): 4 слоя, 10 точек, у каждой своя задержка */
  const wave = (wrap, k) => { if (!wrap) return; const paths = [...wrap.querySelectorAll('path')], P = 10;
    const noise = (i, L) => k ? (Math.sin(i * .9 + L * 1.3 + 2) + Math.sin(i * .37 + L * 2.1)) / 4 + .5 : (Math.sin(i * .9 + L * 1.7) + Math.sin(i * .37 + L * 2.9 + 1)) / 4 + .5;
    const delays = paths.map((_, L) => Array.from({ length: P }, (_, i) => L * .13 + noise(i, L) * .1)), smooth = t => t * t * (3 - 2 * t);
    const draw = prog => paths.forEach((p, L) => { const ys = delays[L].map(d => 100 * (1 - smooth(Math.min(1, Math.max(0, (prog - d) / .5)))));
      const step = 100 / (P - 1); let d = `M0 ${ys[0].toFixed(3)} C`;
      for (let i = 1; i < P; i++) { const x0 = (i - 1) * step, x1 = i * step, h = step / 2; d += ` ${(x0 + h).toFixed(3)} ${ys[i - 1].toFixed(3)} ${(x0 + h).toFixed(3)} ${ys[i].toFixed(3)} ${x1.toFixed(3)} ${ys[i].toFixed(3)}`; }
      p.setAttribute('d', d + ' L100 100 L0 100 Z'); });
    const target = () => { const r = wrap.getBoundingClientRect(); return Math.min(1, Math.max(0, (innerHeight * .98 - r.top) / (innerHeight * (k ? 1.06 : .88)))); };
    let cur = 0, tgt = 0, raf = 0, last = -1;
    const tick = () => { cur += (tgt - cur) * .16; if (Math.abs(tgt - cur) < .001) cur = tgt; if (cur !== last) { draw(cur); last = cur; } raf = cur === tgt ? 0 : requestAnimationFrame(tick); };
    const on = () => { const r = wrap.getBoundingClientRect(); if (r.bottom < -innerHeight || r.top > innerHeight * 2) return; tgt = reduce ? 1 : target(); if (reduce) return draw(1); if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); cur = tgt = reduce ? 1 : target(); draw(cur); last = cur; };
  wave(document.getElementById('ocw-out'), 1);

  /* 24.11 кейсы на полке (реф shopify.com/editions): фильтр, наклон за курсором, раскрытие с перелётом обложки; переход ?tr=wave|sheet (временно) */
  const oc = document.querySelector('.oc');
  if (oc) {
    const covs = [...oc.querySelectorAll('.oc-cov')], dets = [...oc.querySelectorAll('.oc-det')], idx = [...oc.querySelectorAll('.oc-idx button')], box = oc.querySelector('.oc-dets');
    const mob = () => matchMedia('(max-width: 760px)').matches; let cur = -1, busy = false;
    const scene = oc.querySelector('.oc-scene');
    /* 25.11 (Никита: «поп-ап — блюр всего на фоне, сайт не листается, пока не закроешь»): слой поверх всей страницы по центру экрана */
    const place = () => { if (mob()) return; const H = Math.min(innerHeight - 120, 660); box.style.setProperty('--dt', Math.round((innerHeight - H) / 2) + 'px'); box.style.setProperty('--dh', H + 'px'); };
    const lockPage = on => { const L = window.__lenis; document.documentElement.classList.toggle('oc-modal', on); if (L) on ? L.stop() : L.start(); };
    /* фильтр */
    /* 25.11 (Никита: «табы переключаются с лагами»): раньше обложки сжимались по ширине .6 с и доски пересобирались после — теперь
       все тонут за .2 с (opacity + сдвиг), раскладка меняется один раз, оставшиеся по очереди опускаются на полку */
    const trk = oc.querySelector('.oc-track'); let fT = 0, fCur = 'all';
    const filt = f => { if (f === fCur) return; fCur = f; oc.querySelectorAll('[data-flt]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.flt === f)));
      const apply = () => { covs.forEach(c => c.classList.toggle('is-out', f !== 'all' && c.dataset.f !== f)); idx.forEach(b => b.classList.toggle('is-out', f !== 'all' && b.dataset.f !== f));
        const rows = Math.ceil(covs.filter(c => !c.classList.contains('is-out')).length / (mob() ? 99 : 3)); oc.querySelectorAll('.oc-plank').forEach((p, r) => p.classList.toggle('is-off', r >= rows)); };
      if (reduce || !trk) return apply();
      clearTimeout(fT); trk.classList.add('is-swap');
      fT = setTimeout(() => { apply(); trk.classList.remove('is-swap'); let k = 0;
        covs.forEach(c => { c.classList.remove('is-drop'); if (c.classList.contains('is-out')) return; c.style.setProperty('--dd', (k++ * 70) + 'ms'); void c.offsetWidth; c.classList.add('is-drop'); }); }, 200); };
    covs.forEach(c => c.addEventListener('animationend', e => { if (e.animationName === 'oc-drop') c.classList.remove('is-drop'); }));
    /* наведение: обложка выпрямляется и поднимается, слегка поворачивается за курсором; подпись внизу подчёркнута */
    const hov = (i, on) => { covs[i] && covs[i].classList.toggle('is-hov', on); idx[i] && idx[i].classList.toggle('is-hov', on); if (!on && covs[i]) covs[i].style.removeProperty('--ry'); };   // 25.11: поворот — на всей обложке (карточка и кнопки на ней)
    covs.forEach((c, i) => { const inn = c.querySelector('.oc-cov__in');
      c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hov(i, true); });
      c.addEventListener('pointerleave', () => hov(i, false));
      /* 25.11 v2 (Никита: «3D-искажения нравились, я не просил убирать»): обложка снова поворачивается за курсором */
      c.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || reduce) return; const r = c.getBoundingClientRect(); c.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 16).toFixed(2) + 'deg'); }); });
    /* 25.11 видео в обложках (Никита запишет на каждый кейс): играют, только пока полка в экране */
    /* 26.11 (Никита: «видео должно проигрываться по наведению на карточку»): запись сайта стоит на первом кадре и играет, пока мышь на обложке;
       на сенсорных экранах наведения нет — играет, пока обложка видна */
    const vids = [...oc.querySelectorAll('.oc-cov__art video')], touchDev = matchMedia('(hover: none)').matches;
    vids.forEach(v => { const c = v.closest('.oc-cov');
      if (!touchDev) { c.addEventListener('pointerenter', () => { if (reduce) return; v.preload = 'auto'; v.play().catch(() => {}); }); c.addEventListener('pointerleave', () => v.pause()); }
      else if (!reduce) new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { threshold: .6 }).observe(c); });
    idx.forEach((b, i) => { b.addEventListener('pointerenter', () => hov(i, true)); b.addEventListener('pointerleave', () => hov(i, false)); });
    /* 26.11 (Никита: «эти курсоры тоже убери»): курсор-призрак Open("…"), ходивший по обложкам, удалён */
    /* перелёт: сцена кейса стартует из прямоугольника обложки (FLIP) */
    const flip = (stage, from, back, done) => { const to = stage.getBoundingClientRect();
      const t = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
      stage.style.transition = 'none'; stage.style.transform = back ? 'none' : t; stage.style.borderRadius = back ? '' : `${4 * to.width / from.width}px`; void stage.offsetWidth;
      stage.style.transition = 'transform .75s cubic-bezier(.22, 1, .36, 1), border-radius .75s'; stage.style.transform = back ? t : 'none'; stage.style.borderRadius = '';
      setTimeout(done || (() => {}), 760); };
    const show = (i, fromCover) => { const d = dets[i]; if (cur < 0) place(); dets.forEach(x => { x.hidden = x !== d; }); cur = i; oc.classList.add('is-det');
      oc.querySelectorAll('.oc-det .oc-vid').forEach(v => { if (!d.contains(v)) v.pause(); }); if (!reduce) d.querySelectorAll('.oc-vid').forEach(v => { v.preload = 'auto'; v.play().catch(() => {}); });   // 26.11: записи сайта в окне и телефоне
      covs.forEach((c, k) => c.style.opacity = k === i ? '0' : '');
      if (fromCover && !mob() && !reduce) { busy = true; flip(d.querySelector('.oc-det__stage'), covs[i].querySelector('.oc-cov__art').getBoundingClientRect(), false, () => { busy = false; }); }
      lockPage(true); requestAnimationFrame(navAt); };
    /* 26.11 (Никита: «стрелки прижаты к контенту — пусть подстраиваются сами»): стрелки встают на 1,5rem ниже кнопок открытого кейса */
    const navAt = () => { if (cur < 0 || mob()) return; const box2 = oc.querySelector('.oc-scene > .oc-dets'), bt = dets[cur] && dets[cur].querySelector('.oc-det__btns'); if (!box2 || !bt) return;
      box2.style.setProperty('--nt', (bt.getBoundingClientRect().bottom - box2.getBoundingClientRect().top + 24) + 'px'); };
    addEventListener('resize', () => requestAnimationFrame(navAt));
    const close = () => { if (cur < 0 || busy) return; const d = dets[cur], i = cur;
      const end = () => { d.hidden = true; d.querySelector('.oc-det__stage').style.cssText = ''; covs[i].style.opacity = ''; busy = false; };
      oc.querySelectorAll('.oc-det .oc-vid').forEach(v => v.pause());
      oc.classList.remove('is-det'); lockPage(false); cur = -1;
      if (!mob() && !reduce && !covs[i].classList.contains('is-out')) { busy = true; covs[i].style.opacity = '0'; flip(d.querySelector('.oc-det__stage'), covs[i].querySelector('.oc-cov__art').getBoundingClientRect(), true, end); } else end(); };
    const step = s => { const vis = covs.map((c, k) => k).filter(k => !covs[k].classList.contains('is-out')); if (!vis.length) return; const p = vis.indexOf(cur); show(vis[(p + s + vis.length) % vis.length], false); };
    oc.addEventListener('click', e => { const t = e.target;
      const fb = t.closest('[data-flt]'); if (fb) { if (cur >= 0) close(); filt(fb.dataset.flt); return; }
      if (t.closest('.oc-go')) return;   // 26.11: стрелка «Открыть сайт» — ссылка, поп-ап не открываем
      const ob = t.closest('[data-open]'); if (ob) { const i = +ob.dataset.open; if (cur >= 0) show(i, false); else show(i, true); hov(i, false); return; }
      if (t.closest('[data-close]')) { close(); return; }
      const sb = t.closest('[data-step]'); if (sb) { step(+sb.dataset.step); return; }
      if (cur >= 0 && (t === box || t.classList.contains('oc-det'))) close(); });
    addEventListener('keydown', e => { if (cur < 0) return; if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); });
  }

  /* 24.11 тарифы — варианты (временно): ?tv=b|c|now */
  const tfs = document.querySelector('.os-tf');
  if (tfs) {
    const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
    const count = (el, from, to) => { if (reduce || from === to) { el.textContent = fmt(to); return; } const t0 = performance.now(), D = 650;
      const tick = now => { const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
    const setTv = v => { tfs.dataset.tv = v; document.querySelectorAll('[data-tv]').forEach(b => b.tagName === 'BUTTON' && b.setAttribute('aria-pressed', String(b.dataset.tv === v))); };
    const qtv = new URLSearchParams(location.search).get('tv'); if (/^(b|c|now)$/.test(qtv || '')) setTv(qtv);
    document.addEventListener('click', e => { const b = e.target.closest('button[data-tv]'); if (!b) return; setTv(b.dataset.tv); const u = new URL(location.href); u.searchParams.set('tv', b.dataset.tv); history.replaceState(null, '', u); });
    /* «Конструктор» */
    const tvb = tfs.querySelector('.tvb');
    if (tvb) { const tabs = [...tvb.querySelectorAll('[data-tvb]')], infos = [...tvb.querySelectorAll('.tvb__info')], lis = [...tvb.querySelectorAll('.tvb__list li')], blocks = [...tvb.querySelectorAll('.tvb__blocks i')], nEl = tvb.querySelector('.tvb__n span');
      let cur = 1, curN = 9;
      const sel = k => { const prev = cur, pv = +infos[prev].querySelector('.tvb__price').dataset.to; cur = k; tvb.dataset.k = k;
        tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === k))); infos.forEach((x, i) => { x.hidden = i !== k; });
        count(infos[k].querySelector('.tvb__price'), pv, +infos[k].querySelector('.tvb__price').dataset.to);
        let j = 0; lis.forEach(li => { const lv = +li.dataset.lv, on = lv <= k; li.style.setProperty('--j', on && lv > prev ? j++ : 0); li.classList.toggle('is-on', on); li.classList.toggle('is-new', on && lv === k && k > 0); });
        const n = +tabs[k].dataset.n; blocks.forEach((b, i) => b.classList.toggle('is-on', i < n));
        const n0 = curN; curN = n; if (reduce) nEl.textContent = n; else { const t0 = performance.now(); const tk = now => { const q = Math.min(1, (now - t0) / 500); nEl.textContent = Math.round(n0 + (n - n0) * q); if (q < 1) requestAnimationFrame(tk); }; requestAnimationFrame(tk); } };
      tabs.forEach((t, i) => t.addEventListener('click', () => sel(i)));
      lis.forEach(li => li.classList.toggle('is-on', +li.dataset.lv <= 1)); blocks.forEach((b, i) => b.classList.toggle('is-on', i < 9)); }
    /* «Голограммы»: наклон и блик за курсором, цены досчитываются при появлении */
    tfs.querySelectorAll('.tvc').forEach(c => { const inn = c.querySelector('.tvc__in');
      c.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || reduce) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        inn.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg'); inn.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg'); inn.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); inn.style.setProperty('--gy', (y * 100).toFixed(1) + '%'); });
      c.addEventListener('pointerleave', () => { inn.style.setProperty('--rx', '0deg'); inn.style.setProperty('--ry', '0deg'); }); });
    const pio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.querySelectorAll('.tvc__price').forEach((p, i) => setTimeout(() => count(p, 0, +p.dataset.to), i * 120)); pio.unobserve(e.target); }), { threshold: .3 });
    const g = tfs.querySelector('.tvc-grid'); if (g) pio.observe(g);
  }

  /* иллюстрации и линии — когда видны */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .25 });
  document.querySelectorAll('.os-card, .os-tf__grid, .os-steps__track, .os-no, .os-multi').forEach(el => io.observe(el));

  /* 24.11 (Никита: «кнопки на этой странице открывают свои поп-апы, не якорь к подвалу»): одна модалка, заголовок — по кнопке;
     внутрь переносится сама форма заявки из подвала (те же поля и отправка), при закрытии возвращается на место */
  const form = document.querySelector('#zayavka form');
  if (form) {
    const dlg = document.createElement('dialog'); dlg.className = 'sp-pop';
    dlg.innerHTML = '<div class="sp-pop__box"><button type="button" class="sp-pop__x" aria-label="Закрыть"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="sp-pop__head"></div><div class="sp-pop__body"></div></div>';
    document.body.appendChild(dlg);
    const head = dlg.querySelector('.sp-pop__head'), body = dlg.querySelector('.sp-pop__body'), home = document.createComment('form-home');
    const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const LEAD = 'Расскажите о своей задаче — предложим подходящий тариф и объясним, как будет выглядеть будущий сайт.';
    const open = b => { const plan = b.closest('.os-plan'), tf = b.dataset.osTariff || '';
      let h;
      if (tf === 'Многостраничный') h = `<span class="sp-pop__k">Многостраничный сайт</span><h2 class="sp-pop__t">Обсудим <em>вашу задачу</em></h2><p class="sp-pop__lead">Многостраничные сайты — от&nbsp;59&nbsp;990&nbsp;₽. Итоговая стоимость и сроки рассчитываются после обсуждения задачи.</p>`;
      else if (plan || b.dataset.popName) { const nm = b.dataset.popName || plan.querySelector('.os-plan__name').textContent.trim(), pr = b.dataset.popPrice || plan.querySelector('.os-plan__price').textContent.trim(), meta = b.dataset.popMeta ? b.dataset.popMeta.split('|') : (plan ? [...plan.querySelectorAll('.os-plan__meta span')] : []).map(x => x.textContent.trim());
        h = `<span class="sp-pop__k">Тариф</span><h2 class="sp-pop__t">${esc(nm.charAt(0) + nm.slice(1).toLowerCase())} <em>${esc(pr)}</em></h2><ul class="sp-pop__chips">${meta.map(m => `<li>${esc(m)}</li>`).join('')}</ul><p class="sp-pop__lead">${LEAD}</p>`; }
      else if (b.closest('.oc')) h = `<h2 class="sp-pop__t">Обсудим <em>ваш сайт</em></h2><p class="sp-pop__lead">${LEAD}</p>`;
      else h = `<h2 class="sp-pop__t">Обсудим <em>ваш сайт</em></h2><p class="sp-pop__lead">${LEAD}</p>`;
      head.innerHTML = h; if (form.elements.tariff) form.elements.tariff.value = b.dataset.popName || (plan ? plan.querySelector('.os-plan__name').textContent.trim() : tf);
      if (!home.parentNode) form.parentNode.insertBefore(home, form); body.appendChild(form);
      dlg.showModal(); document.documentElement.classList.add('sp-lock'); };
    const close = () => dlg.close();
    dlg.addEventListener('close', () => { if (home.parentNode) home.parentNode.insertBefore(form, home); document.documentElement.classList.remove('sp-lock'); });
    dlg.querySelector('.sp-pop__x').addEventListener('click', close);
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
    document.addEventListener('click', e => { const b = e.target.closest('a[href="#zayavka"]'); if (!b || b.closest('.sp-pop')) return; e.preventDefault(); open(b); });
  }
})();

/* 25.11 v4 (Никита: «потом фильтрация должна пропадать»): фильтр кейсов — поверх экрана снизу, только пока на экране полка; ушла полка или открыт кейс — уезжает вниз */
(() => { const f = document.querySelector('.oc .oc-flt'), sh = document.querySelector('.oc .oc-shelf'), oc = document.querySelector('.oc'); if (!f || !sh) return;
  if (!('IntersectionObserver' in window)) { f.classList.add('is-up'); return; } let vis = false;
  const set = () => f.classList.toggle('is-up', vis && !oc.classList.contains('is-det'));
  /* 25.11 (Никита: «фильтры слишком поздно пропадают»): видимость — по последней доске, а не по всей полке с отступом:
     фильтр есть, пока верх полки ниже 78 % экрана… и пока последняя (видимая) доска не поднялась выше середины экрана */
  const tr = sh.querySelector('.oc-track'); let raf = 0;
  const calc = () => { raf = 0; const pl = [...sh.querySelectorAll('.oc-plank:not(.is-off)')].pop(), a = tr.getBoundingClientRect(), b = (pl || tr).getBoundingClientRect();
    const v = a.top < innerHeight * .78 && b.bottom > innerHeight * .5; if (v !== vis) { vis = v; set(); } };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(calc); }, { passive: true }); addEventListener('resize', calc); calc();
  new MutationObserver(set).observe(oc, { attributes: true, attributeFilter: ['class'] }); })();

/* 26.11 (Никита: «кастомный курсор по наведению на карточки убери»): курсор «Маршрут» над обложками удалён */

/* 26.11 кейсы на телефоне — слайдер: стрелки, счётчик «1 / 9» и точки под лентой обложек (ширина ≤ 760 px) */
(() => { const oc = document.querySelector('.oc'); if (!oc) return; const row = oc.querySelector('.oc-row'); if (!row) return;
  const ARL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>', ARR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  const nav = document.createElement('div'); nav.className = 'oc-mnav';
  nav.innerHTML = `<button type="button" data-d="-1" aria-label="Предыдущий кейс">${ARL}</button><span class="oc-mnav__mid"><span class="oc-mnav__n"></span><span class="oc-mnav__dots" aria-hidden="true"></span></span><button type="button" data-d="1" aria-label="Следующий кейс">${ARR}</button>`;
  row.after(nav);
  const vis = () => [...oc.querySelectorAll('.oc-cov')].filter(c => !c.classList.contains('is-out'));
  let cur = 0, raf = 0;
  const paint = () => { const v = vis(), dots = nav.querySelector('.oc-mnav__dots');
    if (dots.children.length !== v.length) dots.innerHTML = v.map(() => '<i></i>').join('');
    [...dots.children].forEach((d, i) => d.classList.toggle('is-on', i === cur));
    nav.querySelector('.oc-mnav__n').textContent = `${String(cur + 1).padStart(2, '0')} / ${String(v.length).padStart(2, '0')}`;
    nav.querySelector('[data-d="-1"]').disabled = cur <= 0; nav.querySelector('[data-d="1"]').disabled = cur >= v.length - 1; };
  const calc = () => { raf = 0; const v = vis(), mid = row.getBoundingClientRect().left + row.clientWidth / 2; let best = 0, bd = 1e9;
    v.forEach((c, i) => { const r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = i; } }); if (best !== cur) { cur = best; paint(); } };
  const go = i => { const v = vis(); i = Math.max(0, Math.min(v.length - 1, i)); const c = v[i]; if (!c) return;
    row.scrollTo({ left: c.offsetLeft - (row.clientWidth - c.offsetWidth) / 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  nav.addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (b) go(cur + +b.dataset.d); });
  row.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(calc); }, { passive: true });
  oc.addEventListener('click', e => { if (e.target.closest('[data-flt]')) setTimeout(() => { cur = 0; row.scrollTo({ left: 0 }); paint(); }, 260); });
  paint(); })();

/* 24.11 (Никита, реф cloudstudio.es — «эффект тетради и такой же эффект наведения по фону»): обложка — тетрадный лист.
   Своя реализация той же техники (их код не копировали): WebGL без библиотек, две маленькие симуляции (клетка 4 px):
     волна — бумага «мокрая»: курсор тянет за собой волну, клетка и поля гнутся и ловят свет;
     чернила — след курсора чуть мочит бумагу, клик роняет синюю каплю, она расползается по волокнам, пока мокро, и сохнет.
   Под текстом чернил мало (контраст заголовка не страдает). Без WebGL, при «меньше движения», на медленной машине — остаётся
   CSS-тетрадь (.os-kh::before), картинка та же, просто не гнётся. Вне экрана и в покое не рисует. */
(() => {
  const sec = document.querySelector('.os-kh[data-v="e"]'); if (!sec) return;
  const bg = sec.querySelector('.os-kh__bg') || sec;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, coarse = matchMedia('(pointer: coarse)').matches;
  const CELL = 28;   // клетка тетради, px — как в CSS
  /* 25.11 выбор Никиты: клик по фону — «Клеточки» (штамп и смятие удалены) */
  /* красное поле — левее текста обложки; на узком экране поля нет (место только у текста) */
  /* 25.11 (Никита: «красную линию — к тексту, как красная строка»): поле — в 14 px левее начала заголовка, а не контейнера */
  const margin = () => { const c = sec.querySelector('.os-kh__h1 .l1') || sec.querySelector('.os-kh__in'); if (!c) return -999;   // h1 — display: contents, у него нет своей рамки
    const x = c.getBoundingClientRect().left - sec.getBoundingClientRect().left;
    const mx = x >= 40 ? Math.round(x - 14) : -999; sec.style.setProperty('--mx', mx + 'px'); return mx; };
  margin(); addEventListener('resize', margin);
  if (reduce || coarse) return;   // 26.11 (Никита: «анимацию на фоне на телефоне можно отключить»): на сенсорных — статичная CSS-тетрадь
  /* 24.11: бумага стартует после прелоадера — иначе первые секунды (прелоадер + загрузка 3D) кадры медленные, и защита выключала её насовсем */
  let ready = !document.documentElement.classList.contains('pre-on'), DPRMAX = coarse ? 1 : 1.25,   /* 25.11 (Никита: «нагружает ПК»): бумага мягкая — плотность пикселей выше 1,25 не видна, а стоит в 2,5 раза дороже */ degraded = false;

  const cv = document.createElement('canvas'); cv.className = 'os-kh__paper'; cv.setAttribute('aria-hidden', 'true');
  let gl; try { gl = cv.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' }); } catch (e) { gl = null; }
  if (!gl) return;
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  if (!window.__paperForce && dbg && /swiftshader|llvmpipe|software/i.test(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '')) return;   // без видеокарты — CSS-тетрадь

  /* текстура, в которую можно рисовать: half float, иначе float, иначе без эффекта */
  const hf = gl.getExtension('OES_texture_half_float'), hfl = gl.getExtension('OES_texture_half_float_linear');
  const fl = gl.getExtension('OES_texture_float'), fll = gl.getExtension('OES_texture_float_linear');
  const fbo = (w, h, type) => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, type, null);
    const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE; gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (!ok) { gl.deleteTexture(t); gl.deleteFramebuffer(f); return null; } return { t, f, w, h }; };
  let TYPE = null;
  for (const ty of [hf && hfl ? hf.HALF_FLOAT_OES : 0, fl && fll ? gl.FLOAT : 0]) { if (!ty) continue; const x = fbo(4, 4, ty); if (x) { gl.deleteTexture(x.t); gl.deleteFramebuffer(x.f); TYPE = ty; break; } }
  if (!TYPE) return;

  const P = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
  const LIB = `float h21(vec2 p){ p = fract(p * vec2(233.34, 851.73)); p += dot(p, p + 23.45); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + 1.), f.x), f.y); }
float sd(vec2 p, vec4 s){ vec2 a = p - s.xy, b = s.zw - s.xy; return length(a - b * clamp(dot(a, b) / max(dot(b, b), 1e-4), 0., 1.)); }
`;
  const VS = 'attribute vec2 a; varying vec2 v; void main(){ v = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }';
  /* волна: r — высота сейчас, g — шагом раньше; новая = среднее соседей × 2 − прежняя, с затуханием; курсор продавливает бумагу */
  const WAVE = P + LIB + `varying vec2 v; uniform sampler2D s; uniform vec2 px, sim; uniform vec4 seg[3]; uniform vec2 pw[3];
void main(){ vec4 c = texture2D(s, v);
  float n = texture2D(s, v + vec2(px.x, 0.)).r + texture2D(s, v - vec2(px.x, 0.)).r + texture2D(s, v + vec2(0., px.y)).r + texture2D(s, v - vec2(0., px.y)).r;
  float h = (n * .5 - c.g) * .982;
  vec2 p = vec2(v.x, 1. - v.y) * sim;
  for (int i = 0; i < 3; i++) { float d = sd(p, seg[i]) / pw[i].x; h -= pw[i].y * exp(-d * d); }
  gl_FragColor = vec4(clamp(h, -5., 5.), c.r, 0., 1.); }`;
  /* бумага: r — синие чернила, g — влага. Чернила текут по волокнам (шум), пока мокро; влага растекается и сохнет */
  const INK = P + LIB + `varying vec2 v; uniform sampler2D s; uniform vec2 px, sim; uniform vec4 seg[2]; uniform vec4 ip[2];
void main(){ vec4 c = texture2D(s, v);
  vec4 l = texture2D(s, v + vec2(px.x, 0.)) + texture2D(s, v - vec2(px.x, 0.)) + texture2D(s, v + vec2(0., px.y)) + texture2D(s, v - vec2(0., px.y)) - 4. * c;
  vec2 p = vec2(v.x, 1. - v.y) * sim;
  float fib = .35 + 1.3 * vn(p * vec2(.06, .02)) * vn(p * vec2(.02, .06) + 7.);
  vec4 o = c;
  o.r += (.004 + .11 * clamp(c.g, 0., 1.)) * fib * l.r;
  o.g += .1 * l.g; o.g *= .992; o.r *= .99985;
  for (int i = 0; i < 2; i++) { float d = sd(p, seg[i]) / abs(ip[i].x), k = exp(-d * d);
    float rough = ip[i].x < 0. ? .25 + 1.5 * pow(vn(p * .11 + float(i) * 9.), 2.) : 1.;
    o.r += ip[i].y * k * rough; o.g += ip[i].z * k * rough; }
  gl_FragColor = clamp(o, 0., 3.); }`;
  /* картинка: клетка и поля читаются со сдвигом по наклону бумаги, свет сбоку сверху; мокрое темнее; капли — синие с неровным краем */
  const DRAW = P + LIB + `uniform sampler2D a, b; uniform vec2 px, size, sim, res, sc; uniform float mx, cell, mode; uniform vec4 prot[3], ck[4];
const vec3 PAPER = vec3(.9647, .9529, .9255), BLUE = vec3(.157, .471, .933), INKC = vec3(.11, .29, .78), RED = vec3(1., .392, .078);
float hh(vec2 t){ return texture2D(a, t).r; }
float ln(float p, float s){ return clamp((.5 - abs(mod(p - .5 + cell * .5, cell) - cell * .5)) * s + .5, 0., 1.); }
/* B «смятие»: складки — сумма гребней в 5 направлениях; быстро сминается и медленно расправляется */
float crH(vec2 p){ float h = 0.; for (int i = 0; i < 4; i++) { vec4 c = ck[i]; if (c.z < 0.) continue;
  vec2 d = p - c.xy; float a = smoothstep(0., .12, c.z) * exp(-c.z * .9), cr = 0.;
  for (int k = 0; k < 5; k++) { float an = c.w * 6.283 + float(k) * 1.2566; cr += abs(sin(dot(d, vec2(cos(an), sin(an))) * (.06 + .02 * float(k)) + c.w * 7. + float(k))); }
  h += a * exp(-dot(d, d) / 16000.) * (cr - 2.5); } return h; }
/* C «клеточки»: вокруг клика клетки закрашиваются ручкой — штриховка внутри клетки, волной от центра */
float cellF(vec2 q){ float f = 0.; vec2 cl = floor(q / cell); for (int i = 0; i < 4; i++) { vec4 c = ck[i]; if (c.z < 0.) continue;
  vec2 dd = abs(cl - floor(c.xy / cell)); float man = dd.x + dd.y, r = h21(cl + c.w * 17.);
  float on = step(man + r * 1.2, c.z * 10.) * step(man, 2.5 + r * 3.5) * step(.25, r + step(man, .5));
  f = max(f, on * (1. - smoothstep(3.5, 5., c.z))); } return f; }
void main(){
  vec2 c = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y) / sc, t = vec2(c.x / sim.x, 1. - c.y / sim.y);
  vec2 g = vec2(hh(t + vec2(px.x, 0.)) - hh(t - vec2(px.x, 0.)), hh(t - vec2(0., px.y)) - hh(t + vec2(0., px.y)));
  g *= smoothstep(0., 40., c.x) * smoothstep(0., 40., size.x - c.x) * smoothstep(0., 30., size.y - c.y);
  vec2 q = c + g / (1. + .25 * length(g)) * 6.;
  vec4 k = texture2D(b, vec2(q.x / sim.x, 1. - q.y / sim.y));
  float wet = clamp(k.g, 0., 1.), la = .1 * (1. + wet * .8);
  /* 24.11 v4: линии гаснут к краям и к тексту — радиально, как сетка на «Контактах» (70% 70% at 50% 35%, #000 30% → прозрачно 100%) */
  float rf = clamp((1. - length(vec2((c.x - size.x * .5) / (size.x * .7), (c.y - size.y * .35) / (size.y * .7)))) / .7, 0., 1.);
  la *= rf;
  vec3 col = mix(PAPER, BLUE, 1. - (1. - la * ln(q.x, sc.x)) * (1. - la * ln(q.y, sc.y)));
  col = mix(col, RED, .5 * rf * clamp((1.2 - abs(q.x - mx - .5)) * sc.x * .6, 0., 1.));
  vec3 n = normalize(vec3(-g / (1. + length(g)) * .7, 1.)); float lit = dot(n, normalize(vec3(-.45, -.55, .7))) - .7;
  col *= 1. + lit * (lit > 0. ? .1 : .14) - wet * .03;
  float cap = .7;
  for (int i = 0; i < 3; i++) { vec4 r = prot[i];
    float z = smoothstep(r.x - 16., r.x, c.x) * smoothstep(r.z + 16., r.z, c.x) * smoothstep(r.y - 16., r.y, c.y) * smoothstep(r.w + 16., r.w, c.y);
    cap = min(cap, mix(.7, .14, z)); }
  float th = .05 + .08 * vn(q * .06), e = smoothstep(th, th + .015, k.r);
  float body = e * (.45 + .45 * smoothstep(th, th + .7, k.r)) * (.85 + .15 * vn(q * .7)) + (e - smoothstep(th + .03, th + .16, k.r)) * .3;
  col = mix(col, INKC, clamp(body, 0., 1.) * cap);
  if (mode > 1.5) { vec2 m = mod(q, cell); float ins = step(2.5, m.x) * step(m.x, cell - 1.5) * step(2.5, m.y) * step(m.y, cell - 1.5);
    float hat = clamp(1.3 - abs(mod(q.x + q.y + 2. * vn(q * .2), 4.5) - 2.25) * 1.1, 0., 1.);
    col = mix(col, INKC, cellF(q) * ins * hat * min(cap + .15, .8)); }
  gl_FragColor = vec4(col, 1.); }`;

  const prog = (fs) => { const p = gl.createProgram();
    [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, fs]].forEach(([ty, src]) => { const s = gl.createShader(ty); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); gl.attachShader(p, s); });
    gl.bindAttribLocation(p, 0, 'a'); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link');
    const u = {}; for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) { const x = gl.getActiveUniform(p, i); u[x.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, x.name); }
    return { p, u }; };
  let PW, PI, PD;
  try { PW = prog(WAVE); PI = prog(INK); PD = prog(DRAW); } catch (e) { return; }
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const quad = () => { gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.drawArrays(gl.TRIANGLES, 0, 3); };

  let W = 1, H = 1, SW = 0, SH = 0, K = coarse ? 5 : 4, T = [], mx = -999;
  const ck = new Float32Array(16), prot = new Float32Array(12), seg = new Float32Array(12), pw = new Float32Array(6), iseg = new Float32Array(8), ip = new Float32Array(8);
  const measure = () => { const sr = sec.getBoundingClientRect(); mx = margin();
    ['.os-kh__h1', '.os-kh__lead', '.os-kh__cta'].forEach((q, i) => { const el = sec.querySelector(q), r = el && el.getBoundingClientRect();
      prot.set(r && r.width ? [r.left - sr.left, r.top - sr.top, r.right - sr.left, r.bottom - sr.top] : [-1e4, -1e4, -1e4, -1e4], i * 4); }); };
  const size = () => { const r = sec.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    const d = Math.min(devicePixelRatio || 1, DPRMAX, Math.sqrt(4.5e6 / (W * H)));
    cv.width = Math.round(W * d); cv.height = Math.round(H * d);
    if (!T.length || W !== SW || H > SH) { T.forEach(x => { gl.deleteTexture(x.t); gl.deleteFramebuffer(x.f); });
      SW = W; SH = Math.ceil(H * 1.15 / K) * K; T = [0, 1, 2, 3].map(() => fbo(Math.ceil(SW / K), SH / K, TYPE));
      if (T.some(x => !x)) throw new Error('fbo'); }
    measure(); };

  /* ввод */
  const ptr = { x: -1, y: -1, lx: null, ly: null }, drops = [];
  let raf = 0, last = 0, acc = 0, frames = 0, quiet = 0, slow = 0, onScreen = true, dead = false;
  const forces = (now) => { seg.fill(-1e4); iseg.fill(-1e4); pw.fill(1); ip.fill(0); ip[0] = ip[4] = 1; pw[1] = pw[3] = pw[5] = 0;
    let act = false; const sr = sec.getBoundingClientRect(), x = ptr.x - sr.left, y = ptr.y - sr.top;
    if (ptr.lx !== null && ptr.x >= 0) { const d = Math.hypot(x - ptr.lx, y - ptr.ly);
      if (d > .5 && d < 300) { const k = Math.min(1, d / 16); seg.set([ptr.lx, ptr.ly, x, y], 0); pw[0] = 30; pw[1] = .22 * k; iseg.set([ptr.lx, ptr.ly, x, y], 0); ip.set([22, 0, .035 * k, 0], 0); act = true; } }
    if (ptr.x >= 0) { ptr.lx = x; ptr.ly = y; }
    /* 24.11 (Никита: «клик — свой эффект, чтобы не палиться»): капли чернил убраны; клик — ?pc=a штамп (DOM), b смятие, c клеточки (шейдер) */
    ck.fill(0); for (let i = 0; i < 4; i++) ck[i * 4 + 2] = -1;
    while (drops.length && now - drops[0].t > 6000) drops.shift();
    drops.slice(-4).forEach((g, i) => { ck.set([g.x, g.y, (now - g.t) / 1000, g.seed], i * 4); act = true;
      if (!g.done) { g.done = true; seg.set([g.x, g.y, g.x, g.y], 4); pw[2] = 26; pw[3] = .7; } });
    return act; };
  const pass = (pr, src, dst, s4, par, wave) => { gl.bindFramebuffer(gl.FRAMEBUFFER, dst.f); gl.viewport(0, 0, dst.w, dst.h); gl.useProgram(pr.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src.t); gl.uniform1i(pr.u.s, 0);
    gl.uniform2f(pr.u.px, 1 / dst.w, 1 / dst.h); gl.uniform2f(pr.u.sim, SW, SH); gl.uniform4fv(pr.u.seg, s4);
    if (wave) gl.uniform2fv(pr.u.pw, par); else gl.uniform4fv(pr.u.ip, par); quad(); };
  const draw = () => { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cv.width, cv.height); gl.useProgram(PD.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, T[0].t); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, T[2].t);
    gl.uniform1i(PD.u.a, 0); gl.uniform1i(PD.u.b, 1); gl.uniform2f(PD.u.px, 1 / T[0].w, 1 / T[0].h); gl.uniform2f(PD.u.size, W, H); gl.uniform2f(PD.u.sim, SW, SH);
    gl.uniform2f(PD.u.res, cv.width, cv.height); gl.uniform2f(PD.u.sc, cv.width / W, cv.height / H); gl.uniform1f(PD.u.mx, mx); gl.uniform1f(PD.u.cell, CELL);
    gl.uniform4fv(PD.u.prot, prot); gl.uniform4fv(PD.u.ck, ck); gl.uniform1f(PD.u.mode, 2); quad(); };
  const off = () => { dead = true; cv.style.opacity = '0'; setTimeout(() => { cv.remove(); const x = gl.getExtension('WEBGL_lose_context'); x && x.loseContext(); }, 700); };
  const frame = (now) => { raf = 0; if (dead || !onScreen || document.hidden) return;
    raf = requestAnimationFrame(frame);
    const raw = last ? now - last : 16.7; last = now;
    slow = raw > 34 ? slow + 1 : Math.max(0, slow - 1); if (slow > 60 && !window.__paperForce) { if (!degraded) { degraded = true; slow = 0; DPRMAX = 1; try { size(); } catch (e) { off(); } } else { off(); return; } }   // 24.11: сначала грубее, потом выключить   // не тянет — оставляем CSS-тетрадь
    if (++frames % 60 === 1) measure();
    acc += Math.min(100, raw); let n = Math.min(3, Math.floor(acc / 16.6)); acc = Math.min(acc - n * 16.6, 33);
    if (frames === 1) n = Math.max(n, 1); if (!n) return;
    quiet = forces(now) ? 0 : quiet + n;
    if (quiet > 1500 && frames > 2) { cancelAnimationFrame(raf); raf = 0; last = 0; return; }   // ~25 с покоя — спим до движения мыши
    if (quiet > 300) { if (frames % 4) return; n = 4; }   // волна улеглась — только сохнет, 15 раз в секунду
    for (let i = 0; i < n; i++) { pass(PW, T[0], T[1], seg, pw, true); T.splice(0, 2, T[1], T[0]); pass(PI, T[2], T[3], iseg, ip, false); T.splice(2, 2, T[3], T[2]); if (i === 0) { seg.fill(-1e4); iseg.fill(-1e4); } }
    draw(); if (cv.style.opacity !== '1') cv.style.opacity = '1'; };
  const wake = () => { if (ready && !raf && !dead && onScreen && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };

  try { bg.insertBefore(cv, bg.firstChild); size(); } catch (e) { cv.remove(); return; }
  addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; quiet = Math.min(quiet, 300); wake(); }, { passive: true });
  addEventListener('scroll', () => { ptr.lx = null; }, { passive: true });   // прокрутка — не «мазок» через всю бумагу
  sec.addEventListener('pointerdown', e => { if (e.button > 0 || e.target.closest('a, button, input, label')) return;
    const H2 = document.documentElement; if (H2.classList.contains('o3d-grab') || H2.classList.contains('o3d-drag')) return;   // тянут связку — не капаем
    const sr = sec.getBoundingClientRect();
    drops.push({ x: e.clientX - sr.left, y: e.clientY - sr.top, t: performance.now(), seed: Math.random() }); quiet = 0; wake(); }, { passive: true });
  new IntersectionObserver(es => { onScreen = es[es.length - 1].isIntersecting; wake(); }).observe(sec);
  document.addEventListener('visibilitychange', wake);
  let rz = 0; new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { try { size(); quiet = 0; wake(); } catch (e) { off(); } }); }).observe(sec);
  cv.addEventListener('webglcontextlost', e => { e.preventDefault(); off(); });
  addEventListener('os-pre:done', () => setTimeout(() => { ready = true; slow = 0; wake(); }, 900));
  wake();
})();

/* 24.11 v3: тарифы (появление, цены досчитываются), варианты «Многостраничного» ?mv= и процесса ?pv= с переключателями, переписка, стикеры */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seen = (el, fn, th = .25) => { if (!el) return; if (!('IntersectionObserver' in window)) { fn(); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { threshold: th }); io.observe(el); };

  /* тарифы: карточки встают, страница собирается по блоку, цены досчитываются */
  const tf3 = document.querySelector('.tf3');
  if (tf3) seen(tf3, () => { tf3.classList.add('is-in'); if (reduce) return;
    tf3.querySelectorAll('.tf3__price b').forEach((b, i) => { const to = +b.dataset.to, t0 = performance.now() + i * 120, D = 900;
      const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
      const f = now => { const k = Math.max(0, Math.min(1, (now - t0) / D)), e = 1 - Math.pow(1 - k, 3); b.textContent = fmt(to * (.55 + .45 * e)); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }); }, .2);

  /* переключатели вариантов (временно): видны, пока блок на экране; выбор — в адресе */
  const pick = (key, box, attr) => { if (!box) return;
    const set = v => { box.dataset[attr] = v; document.querySelectorAll(`button[data-v3="${key}"]`).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.val === v)));
      box.querySelectorAll(':scope > .is-in').forEach(x => { x.classList.remove('is-in'); void x.offsetWidth; x.classList.add('is-in'); }); run(box); requestAnimationFrame(() => dispatchEvent(new Event('resize'))); };
    const q = new URLSearchParams(location.search).get(key); if (/^[abc]$/.test(q || '')) set(q);
    document.addEventListener('click', e => { const b = e.target.closest(`button[data-v3="${key}"]`); if (!b) return; set(b.dataset.val); const u = new URL(location.href); u.searchParams.set(key, b.dataset.val); history.replaceState(null, '', u); });
    const sw = document.querySelector(`.v3-sw--${key}`);
    if (sw && 'IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => sw.classList.toggle('is-vis', e.isIntersecting)), { rootMargin: '-30% 0px -30% 0px' }).observe(box); };

  /* появление вариантов: is-in, когда вариант на экране; у «Переписки» сообщения приходят по очереди */
  const chats = new WeakMap();
  const chat = pv => { if (chats.get(pv)) return; chats.set(pv, 1);
    const typ = [...pv.querySelectorAll('.pva__typ')], msg = [...pv.querySelectorAll('.pva__msg')], li = [...pv.querySelectorAll('.pva__list li')];
    if (reduce) { msg.forEach(m => m.classList.add('is-on')); li.forEach(l => l.classList.add('is-on')); return; }
    let k = 0; const next = () => { if (k >= msg.length) return; const i = k++; typ[i].classList.add('is-on');
      setTimeout(() => { typ[i].classList.remove('is-on'); msg[i].classList.add('is-on'); li[i] && li[i].classList.add('is-on'); setTimeout(next, 900); }, 1000); };
    next(); };
  const run = box => [...box.children].forEach(v => { if (getComputedStyle(v).display === 'none') return; seen(v, () => { v.classList.add('is-in'); if (v.classList.contains('pv-a')) chat(v); }, .3); });
  const mvs = document.querySelector('.mvs'), pvs = document.querySelector('.pvs');

  if (mvs) run(mvs); if (pvs) run(pvs);

  /* фраза «Без бесконечных созвонов…»: наклейки прилипают после зачёркиваний (класс is-in ставит общий скрипт страницы) */
  const no = document.querySelector('.os-no3'); if (no) seen(no, () => no.classList.add('is-in'), .5);
})();

/* 25.11 прелоадер v3 (Никита, реф tinywins.com): тёмный экран, фраза; знак «о» быстро меняет облик (контур, пунктир, синий, полоски, оранжевый, кружки, пиксели, 3D, от руки);
   собирается логотип; фон вспыхивает светлым — логотип улетает на своё место в шапке, страница открывается под ним. Клик — сразу к концу */
(() => {
  const pre = document.querySelector('.os-pre'), H = document.documentElement; if (!pre) return;
  if (H.classList.contains('no-pre')) { pre.remove(); return; }
  window.__osDrop = true;
  const st = document.querySelector('.os-kh__stage[data-keys-src]');
  if (st) Object.values(st.dataset).forEach(v => { if (/\.(js|glb|gltf|jpe?g|png|webp|hdr|ktx2)(\?|$)/i.test(v)) fetch(v, { credentials: 'same-origin' }).catch(() => {}); });
  const logo = () => { if (window.__osLogo) return; window.__osLogo = true; dispatchEvent(new Event('os-pre:logo')); };
  const T = []; const at = (ms, fn) => T.push(setTimeout(fn, ms));
  const M = pre.querySelectorAll('.os-pre__m').length, STEP = 170;
  let ended = false;
  const done = () => { if (!pre.isConnected) return; pre.remove(); H.classList.remove('pre-on', 'pre-hold'); dispatchEvent(new Event('resize')); dispatchEvent(new Event('os-pre:done')); };
  /* 25.11 v3 (Никита: «нравится шторка — только чтобы опускалась лесенкой»): экран делится на вертикальные полосы,
     они по очереди слева направо уезжают вниз — ступеньками; логотип гаснет в начале хода */
  const fly = () => { if (ended) return; ended = true; T.forEach(clearTimeout); logo();
    const N = innerWidth < 760 ? 5 : 8, ST = 70, D = 800, st = document.createElement('div'); st.className = 'os-pre__st';
    st.innerHTML = Array.from({ length: N }, (_, i) => `<i style="--i:${i}"></i>`).join(''); st.style.setProperty('--n', N); st.style.setProperty('--sd', ST + 'ms'); st.style.setProperty('--d', D + 'ms');
    pre.prepend(st); requestAnimationFrame(() => pre.classList.add('is-out'));
    const total = D + (N - 1) * ST;
    setTimeout(() => H.classList.remove('pre-hold', 'pre-on'), total * .45);   // обложка проявляется, когда открылась примерно половина
    setTimeout(done, total + 60); };
  pre.dataset.pl = 'e';   // 26.11 выбор Никиты: «Свет сверху»
  /* сценарий */
  for (let k = 0; k < M; k++) at(1500 + k * STEP, () => { pre.dataset.m = k; });
  at(1500 + M * STEP, () => { delete pre.dataset.m; pre.classList.add('is-logo'); });   // 25.11 (Никита: «в конце покажи просто наш обычный лого, без лагов»): логотип встаёт сразу, без анимации
  at(1500 + M * STEP + 700, fly);
  pre.addEventListener('click', fly);
  setTimeout(done, 7000);   // на всякий случай   // на всякий случай
})();

/* 24.11 «Веер» v2: приподнимается ближайшая к курсору карточка (по горизонтали) — без дёрганья от перекрывающихся карточек */
(() => {
  const fan = document.querySelector('.mva__fan'); if (!fan) return; const cs = [...fan.querySelectorAll('.mva__c')]; let cur = -1;
  const set = i => { if (i === cur) return; cur = i; cs.forEach((c, k) => c.classList.toggle('is-on', k === i)); };
  fan.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = fan.getBoundingClientRect(); set(Math.max(0, Math.min(cs.length - 1, Math.round((e.clientX - r.left) / r.width * (cs.length - 1))))); });
  fan.addEventListener('pointerleave', () => set(-1));
})();



/* 24.11 процесс — «Канбан» (выбран): курсор переносит шаги по доске */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms)), ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const tween = (ms, fn) => new Promise(done => { const t0 = performance.now(); const f = now => { const k = Math.min(1, (now - t0) / ms); fn(ease(k)); k < 1 ? requestAnimationFrame(f) : done(); }; requestAnimationFrame(f); });
  const onSeen = (el, fn, th = .35) => { if (!el) return; if (reduce || !('IntersectionObserver' in window)) { fn(true); return; } const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && el.offsetParent) { io.disconnect(); fn(false); } }), { threshold: th }); io.observe(el); };
  /* C «Канбан» */
  const C = document.querySelector('.pv-c .pvc2__board');
  if (C) { const cols = [...C.querySelectorAll('.pvc2__col')], cards = [...C.querySelectorAll('.pvc2__card')], col = cards.map(() => 0);
    const mob = () => matchMedia('(max-width: 760px)').matches;
    const layout = () => { if (mob()) return; const br = C.getBoundingClientRect(); let maxH = 0;
      cols.forEach((c, ci) => { const r = c.getBoundingClientRect(), hd = c.querySelector('.pvc2__h'); let y = (hd ? hd.getBoundingClientRect().bottom : r.top + 40) - br.top + 14;   // 26.11 (Никита: «отступы кривоваты»): от низа заголовка колонки, а не 46 px от верха
        cards.forEach((cd, k) => { if (col[k] !== ci) return; cd.style.width = (r.width - 32) + 'px'; cd._x = r.left - br.left + 16; cd._y = y; if (!cd.classList.contains('is-drag')) cd.style.transform = `translate(${cd._x}px, ${cd._y}px)`; y += cd.offsetHeight + 10; });
        maxH = Math.max(maxH, y + 16); }); C.style.minHeight = Math.max(maxH + (C.closest('.pv-c').classList.contains('is-done') ? 58 : 0), 380) + 'px'; };
    layout(); addEventListener('resize', layout);
    const cur = (() => { const el = document.createElement('div'); el.className = 'sw-cur'; el.style.setProperty('--c', '#5b8ff0');
      el.innerHTML = '<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M2.2 1.8v18.4l4.9-4.5 3.4 7.4 3.3-1.5-3.4-7.3h6.7z"/></svg><span class="sw-tag"><span></span></span>'; C.appendChild(el);
      const o = { el, x: 0, y: 0, set(x, y) { o.x = x; o.y = y; el.style.transform = `translate(${x}px, ${y}px)`; }, tag(t) { el.querySelector('.sw-tag > span').textContent = t; el.classList.toggle('has-tag', !!t); } }; return o; })();
    const cnt = () => cols.forEach((c, ci) => { const n = c.querySelector('.pvc2__n'), k = col.filter(x => x === ci).length; if (n) n.textContent = k; c.classList.toggle('is-empty', !k); });   // 26.11: пустая колонка — штриховка cnt();
    const move = async (k, to) => { const cd = cards[k]; const sx = cd._x + cd.offsetWidth - 24, sy = cd._y + 22, cx = cur.x, cy = cur.y;
      cur.tag(''); await tween(300, e => cur.set(cx + (sx - cx) * e, cy + (sy - cy) * e)); cur.tag(to === 1 ? 'В работу' : 'Готово ✓');
      cd.classList.add('is-drag'); col[k] = to; cd.dataset.col = to; const x0 = cd._x, y0 = cd._y; await wait(30); layout(); const x1 = cd._x, y1 = cd._y, w = cd.offsetWidth; cd.style.transition = 'none';
      await tween(450, e => { const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e; cd.style.transform = `translate(${x}px, ${y}px)`; cur.set(x + w - 24, y + 22); });
      cd.style.transition = ''; cd.classList.remove('is-drag'); cnt(); setTimeout(layout, 600); await wait(100); };
    const run = async instant => { if (instant || mob()) { cards.forEach((c, k) => { col[k] = 2; c.dataset.col = 2; }); cnt(); layout(); C.closest('.pv-c').classList.add('is-done'); return; }
      const br = C.getBoundingClientRect(); cur.set(br.width * .5, -40); cur.el.classList.add('is-on');
      for (let k = 0; k < cards.length; k++) { await move(k, 1); cur.tag(''); const cd = cards[k]; cd.classList.add('is-work'); await wait(650); cd.classList.remove('is-work'); await move(k, 2); }   /* 24.11 (Никита: «долго — клиент устанет»): ~9 с на всю доску */
      cur.tag(''); cur.el.classList.add('is-out');
      const live = C.querySelector('.pvc2__live'), dc = cols[2].getBoundingClientRect(), b0 = C.getBoundingClientRect(); const lc = cards[cards.length - 1], ly = Math.max(...cards.map(c => c._y + c.offsetHeight)) + 14;   // 25.11: плашка под последней карточкой, доска вытягивается под неё
      live.style.left = (dc.left - b0.left + 16) + 'px'; live.style.top = ly + 'px';
      C.closest('.pv-c').classList.add('is-done'); layout(); };
    onSeen(C, run, .3); }
})();

/* 25.11: доски полки рисует фон ряда (v3.css, полка v4) — скрипт сборки досок убран */


/* 25.11 CTA «Многостраничный»: «Синька» + веер (выбор Никиты) — переключатель удалён */

/* 25.11: стикеры в тёмном блоке убраны (Никита) */

/* 25.11 тёмный блок: точечная сетка (реф melius.com) — пятно ярких точек следует за курсором */
(() => { const sec = document.querySelector('.os-why'); if (!sec) return; const d = document.createElement('div'); d.className = 'why-dots'; d.setAttribute('aria-hidden', 'true'); d.innerHTML = '<i></i>'; sec.prepend(d);
  if (matchMedia('(pointer: coarse)').matches) return; let raf = 0, x = 0, y = 0;
  new IntersectionObserver(([e]) => sec.classList.toggle('is-dots', e.isIntersecting)).observe(sec);
  sec.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY;   // 25.11: слой fixed — координаты экрана
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; d.style.setProperty('--mx', x + 'px'); d.style.setProperty('--my', y + 'px'); }); }, { passive: true });
  sec.addEventListener('pointerleave', () => { d.style.setProperty('--mx', '-999px'); });
})();

/* 25.11: тарифы — оставлены текущие (Никита), варианты в духе melius удалены */

/* 25.11 тарифы: на телефоне панель переворачивается кнопкой ↻ (на десктопе — наведением) */
document.addEventListener('click', e => { const b = e.target.closest('.tf3__flip'); if (b) { b.closest('.tf3__card').classList.toggle('is-flip'); return; }
  const c = e.target.closest('.tf3__card.is-flip'); if (c && !e.target.closest('a')) c.classList.remove('is-flip'); });


/* 26.11 (Никита: «на фоне „Многостраничного“ — интерактивную анимацию»): чертёж оживает — клетки сетки 28 px загораются
   за курсором и гаснут, через курсор — разметочные линии с координатами, как на чертеже; без мыши по сетке ходит точка */
(() => { const box = document.querySelector('.mv-a[data-mb="e"]'); if (!box || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas'); cv.className = 'mva__fx'; cv.setAttribute('aria-hidden', 'true'); box.prepend(cv);
  const ctx = cv.getContext('2d'), C = 28, heat = new Map(); let W = 0, H = 0, dpr = 1, mx = -1, my = -1, user = 0, vis = false, raf = 0, t0 = performance.now();
  const size = () => { const r = cv.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; };
  const hit = (x, y) => { const cx = Math.floor(x / C), cy = Math.floor(y / C);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) { const k = (cx + dx) + ':' + (cy + dy), v = dx || dy ? .35 : 1; heat.set(k, Math.max(heat.get(k) || 0, v)); } };
  const draw = now => { raf = 0; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    let x = mx, y = my;
    if (now - user > 2500) { const t = (now - t0) / 1000; x = W * (.62 + .26 * Math.sin(t * .37)); y = H * (.5 + .34 * Math.sin(t * .53 + 1)); }   // без мыши — точка ходит по правой половине
    if (x >= 0) hit(x, y);
    heat.forEach((v, k) => { const [cx, cy] = k.split(':').map(Number); ctx.fillStyle = `rgba(255,255,255,${(v * .16).toFixed(3)})`; ctx.fillRect(cx * C + 1, cy * C + 1, C - 1, C - 1);
      const nv = v - .012; nv > 0 ? heat.set(k, nv) : heat.delete(k); });
    if (x >= 0) { ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1; ctx.setLineDash([4, 5]); ctx.beginPath();
      ctx.moveTo(0, Math.round(y) + .5); ctx.lineTo(W, Math.round(y) + .5); ctx.moveTo(Math.round(x) + .5, 0); ctx.lineTo(Math.round(x) + .5, H); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.stroke();
      ctx.font = '500 11px "Geist Mono", ui-monospace, monospace'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(`X ${Math.round(x)}  Y ${Math.round(y)}`, x + 14, y - 12); }
    if (vis) raf = requestAnimationFrame(draw); };
  box.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return;   /* 26.11 (Никита): на телефоне — без слежения за пальцем, точка ходит сама */ const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; user = performance.now(); });
  box.addEventListener('pointerleave', () => { user = 0; mx = my = -1; });
  addEventListener('resize', size); size();
  new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; if (vis && !raf) { size(); raf = requestAnimationFrame(draw); } }), { threshold: .05 }).observe(box); })();
