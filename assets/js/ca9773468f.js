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
    if (st) document.documentElement.classList.contains('pre-on') ? addEventListener('os-pre:done', start, { once: true }) : start();
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
    const place = () => { if (mob()) return; const sr = scene.getBoundingClientRect(), H = Math.min(sr.height - 48, innerHeight - 150, 640);
      const top = Math.max(24, Math.min(sr.height - H - 24, innerHeight / 2 + 30 - H / 2 - sr.top)); box.style.setProperty('--dt', top + 'px'); box.style.setProperty('--dh', H + 'px'); };
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
    const show = (i, fromCover) => { const d = dets[i]; if (cur < 0) place(); dets.forEach(x => { x.hidden = x !== d; }); cur = i; oc.classList.add('is-det');
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
      if (plan || b.dataset.popName) { const nm = b.dataset.popName || plan.querySelector('.os-plan__name').textContent.trim(), pr = b.dataset.popPrice || plan.querySelector('.os-plan__price').textContent.trim(), meta = b.dataset.popMeta ? b.dataset.popMeta.split('|') : [...plan.querySelectorAll('.os-plan__meta span')].map(x => x.textContent.trim());
        h = `<span class="sp-pop__k">Тариф</span><h2 class="sp-pop__t">${esc(nm.charAt(0) + nm.slice(1).toLowerCase())} <em>${esc(pr)}</em></h2><ul class="sp-pop__chips">${meta.map(m => `<li>${esc(m)}</li>`).join('')}</ul><p class="sp-pop__lead">${LEAD}</p>`; }
      else if (tf === 'Многостраничный') h = `<span class="sp-pop__k">Многостраничный сайт</span><h2 class="sp-pop__t">Обсудим <em>вашу задачу</em></h2><p class="sp-pop__lead">Многостраничные сайты — от&nbsp;69&nbsp;900&nbsp;₽. Итоговая стоимость и сроки рассчитываются после обсуждения задачи.</p>`;
      else if (b.closest('.oc')) h = `<h2 class="sp-pop__t">Хочу сайт <em>в таком стиле</em></h2><p class="sp-pop__lead">${LEAD}</p>`;
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
  let MODE = (new URLSearchParams(location.search).get('pc') || 'a').replace(/[^abc]/g, '') || 'a';
  window.__paperMode = v => { MODE = v; };
  /* A «штамп»: оранжевая печать Outline с потёртостями — бьёт по бумаге, через несколько секунд выцветает */
  const STAMP = '<svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="osrSEED" d="M60 60m-41 0a41 41 0 1 1 82 0a41 41 0 1 1 -82 0"/>'
    + '<filter id="osgSEED" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="SEED"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.55"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>'
    + '<g filter="url(#osgSEED)" fill="none" stroke="currentColor"><circle cx="60" cy="60" r="54" stroke-width="5.5"/><circle cx="60" cy="60" r="31" stroke-width="3.2"/>'
    + '<text font-size="12.5" font-weight="800" letter-spacing="2.6" fill="currentColor" stroke="none" font-family="Geist Mono, ui-monospace, monospace"><textPath href="#osrSEED">OUTLINE · САЙТЫ С МОЗГАМИ ·</textPath></text>'
    + '<rect x="40" y="52" width="40" height="16" rx="8" stroke-width="5.5"/></g></svg>';
  let stN = 0;
  const stamp = (x, y) => { const el = document.createElement('span'); el.className = 'os-stamp';
    el.innerHTML = STAMP.replaceAll('SEED', String(++stN % 90 + 1));
    el.style.cssText = `left:${x}px;top:${y}px;--r:${(Math.random() * 40 - 20).toFixed(1)}deg`; bg.appendChild(el);
    const all = sec.querySelectorAll('.os-stamp'); if (all.length > 7) all[0].remove(); setTimeout(() => el.classList.add('is-old'), 5000); setTimeout(() => el.remove(), 7000); };

  /* красное поле — левее текста обложки; на узком экране поля нет (место только у текста) */
  const margin = () => { const c = sec.querySelector('.os-kh__in'); if (!c) return -999;
    const x = c.getBoundingClientRect().left + parseFloat(getComputedStyle(c).paddingLeft) - sec.getBoundingClientRect().left;
    const mx = x >= 48 ? Math.round(x - 26) : -999; sec.style.setProperty('--mx', mx + 'px'); return mx; };
  margin(); addEventListener('resize', margin);
  if (reduce) return;

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
  if (mode > .5 && mode < 1.5) g += vec2(crH(c + vec2(1., 0.)) - crH(c - vec2(1., 0.)), crH(c + vec2(0., 1.)) - crH(c - vec2(0., 1.))) * 16.;
  g *= smoothstep(0., 40., c.x) * smoothstep(0., 40., size.x - c.x) * smoothstep(0., 30., size.y - c.y);
  vec2 q = c + g / (1. + .25 * length(g)) * 6.;
  vec4 k = texture2D(b, vec2(q.x / sim.x, 1. - q.y / sim.y));
  float wet = clamp(k.g, 0., 1.), la = .1 * (1. + wet * .8);
  /* 24.11 (Никита: «сетку затушить к заголовку и тексту»): клетка тает у заголовка, подводки и кнопки — мягко, с запасом ~70 px */
  float fz = 0.;
  for (int i = 0; i < 3; i++) { vec4 r = prot[i];
    fz = max(fz, smoothstep(r.x - 80., r.x + 20., c.x) * smoothstep(r.z + 80., r.z - 20., c.x) * smoothstep(r.y - 70., r.y + 16., c.y) * smoothstep(r.w + 70., r.w - 16., c.y)); }
  la *= 1. - .86 * fz;
  vec3 col = mix(PAPER, BLUE, 1. - (1. - la * ln(q.x, sc.x)) * (1. - la * ln(q.y, sc.y)));
  col = mix(col, RED, .5 * clamp((1.2 - abs(q.x - mx - .5)) * sc.x * .6, 0., 1.));
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
    const d = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2, Math.sqrt(4.5e6 / (W * H)));
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
      if (!g.done) { g.done = true; seg.set([g.x, g.y, g.x, g.y], 4); pw[2] = 26; pw[3] = MODE === 'b' ? 1.4 : .7; } });
    return act; };
  const pass = (pr, src, dst, s4, par, wave) => { gl.bindFramebuffer(gl.FRAMEBUFFER, dst.f); gl.viewport(0, 0, dst.w, dst.h); gl.useProgram(pr.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src.t); gl.uniform1i(pr.u.s, 0);
    gl.uniform2f(pr.u.px, 1 / dst.w, 1 / dst.h); gl.uniform2f(pr.u.sim, SW, SH); gl.uniform4fv(pr.u.seg, s4);
    if (wave) gl.uniform2fv(pr.u.pw, par); else gl.uniform4fv(pr.u.ip, par); quad(); };
  const draw = () => { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cv.width, cv.height); gl.useProgram(PD.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, T[0].t); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, T[2].t);
    gl.uniform1i(PD.u.a, 0); gl.uniform1i(PD.u.b, 1); gl.uniform2f(PD.u.px, 1 / T[0].w, 1 / T[0].h); gl.uniform2f(PD.u.size, W, H); gl.uniform2f(PD.u.sim, SW, SH);
    gl.uniform2f(PD.u.res, cv.width, cv.height); gl.uniform2f(PD.u.sc, cv.width / W, cv.height / H); gl.uniform1f(PD.u.mx, mx); gl.uniform1f(PD.u.cell, CELL);
    gl.uniform4fv(PD.u.prot, prot); gl.uniform4fv(PD.u.ck, ck); gl.uniform1f(PD.u.mode, MODE === 'b' ? 1 : MODE === 'c' ? 2 : 0); quad(); };
  const off = () => { dead = true; cv.style.opacity = '0'; setTimeout(() => { cv.remove(); const x = gl.getExtension('WEBGL_lose_context'); x && x.loseContext(); }, 700); };
  const frame = (now) => { raf = 0; if (dead || !onScreen || document.hidden) return;
    raf = requestAnimationFrame(frame);
    const raw = last ? now - last : 16.7; last = now;
    slow = raw > 34 ? slow + 1 : Math.max(0, slow - 1); if (slow > 45 && !window.__paperForce) { off(); return; }   // не тянет — оставляем CSS-тетрадь
    if (++frames % 60 === 1) measure();
    acc += Math.min(100, raw); let n = Math.min(3, Math.floor(acc / 16.6)); acc = Math.min(acc - n * 16.6, 33);
    if (frames === 1) n = Math.max(n, 1); if (!n) return;
    quiet = forces(now) ? 0 : quiet + n;
    if (quiet > 1500 && frames > 2) { cancelAnimationFrame(raf); raf = 0; last = 0; return; }   // ~25 с покоя — спим до движения мыши
    if (quiet > 300) { if (frames % 4) return; n = 4; }   // волна улеглась — только сохнет, 15 раз в секунду
    for (let i = 0; i < n; i++) { pass(PW, T[0], T[1], seg, pw, true); T.splice(0, 2, T[1], T[0]); pass(PI, T[2], T[3], iseg, ip, false); T.splice(2, 2, T[3], T[2]); if (i === 0) { seg.fill(-1e4); iseg.fill(-1e4); } }
    draw(); if (cv.style.opacity !== '1') cv.style.opacity = '1'; };
  const wake = () => { if (!raf && !dead && onScreen && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };

  try { bg.insertBefore(cv, bg.firstChild); size(); } catch (e) { cv.remove(); return; }
  addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; quiet = Math.min(quiet, 300); wake(); }, { passive: true });
  addEventListener('scroll', () => { ptr.lx = null; }, { passive: true });   // прокрутка — не «мазок» через всю бумагу
  sec.addEventListener('pointerdown', e => { if (e.button > 0 || e.target.closest('a, button, input, label')) return;
    const H2 = document.documentElement; if (H2.classList.contains('o3d-grab') || H2.classList.contains('o3d-drag')) return;   // тянут связку — не капаем
    const sr = sec.getBoundingClientRect(); if (MODE === 'a') stamp(e.clientX - sr.left, e.clientY - sr.top);
    drops.push({ x: e.clientX - sr.left, y: e.clientY - sr.top, t: performance.now(), seed: Math.random() }); quiet = 0; wake(); }, { passive: true });
  new IntersectionObserver(es => { onScreen = es[es.length - 1].isIntersecting; wake(); }).observe(sec);
  document.addEventListener('visibilitychange', wake);
  let rz = 0; new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { try { size(); quiet = 0; wake(); } catch (e) { off(); } }); }).observe(sec);
  cv.addEventListener('webglcontextlost', e => { e.preventDefault(); off(); });
  wake();
})();

/* 24.11 (Никита, реф cloudstudio.es, блок «What we do»: «нравится, как курсоры активничают — хочу, чтобы наши карточки так же
   появлялись, после выделения области»): карточки тёмного блока собирают курсоры, как подагенты. Своя реализация.
   Ведущий курсор «Outline · Task × 4» раздаёт работу; у каждой карточки свой курсор с подписью инструмента:
   Draw(card) — тянет пунктирную рамку из угла в угол, карточка появляется оттуда, где отпустили мышь;
   Write("…") — заголовок и текст печатаются по словам, курсор у конца строки. Потом курсор уходит, карточка остаётся настоящей.
   «Меньше движения» или без IntersectionObserver — карточки сразу на месте. */
(() => {
  const grid = document.querySelector('.os-why__grid'); if (!grid) return;
  const cards = [...grid.querySelectorAll('.os-card')]; if (!cards.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const COL = ['#5b8ff0', '#ff7a3d', '#3ddc97', '#b49cff'];
  const ARROW = '<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M2.2 1.8v18.4l4.9-4.5 3.4 7.4 3.3-1.5-3.4-7.3h6.7z"/></svg>';
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const tween = (ms, fn) => new Promise(done => { const t0 = performance.now(); const f = now => { const k = Math.min(1, (now - t0) / ms); fn(ease(k)); k < 1 ? requestAnimationFrame(f) : done(); }; requestAnimationFrame(f); });
  const snip = (s, n) => { s = s.replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };
  const rel = el => { const g = grid.getBoundingClientRect(), r = el.getBoundingClientRect(); return { x: r.left - g.left, y: r.top - g.top, w: r.width, h: r.height, r: r.right - g.left, b: r.bottom - g.top }; };

  /* слова заголовка и текста — в отдельные span, чтобы «печатать» (неразрывные пробелы и разметка внутри сохраняются) */
  const split = el => { const out = []; const walk = n => { [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) { const parts = c.textContent.split(/(\s+)/); const fr = document.createDocumentFragment();
        parts.forEach(p => { if (!p) return; if (/^\s+$/.test(p)) { fr.appendChild(document.createTextNode(p)); return; } const s = document.createElement('span'); s.className = 'sw-w'; s.textContent = p; fr.appendChild(s); out.push(s); });
        c.replaceWith(fr); }
      else if (c.nodeType === 1) walk(c); }); }; walk(el); return out; };

  cards.forEach(c => { c.classList.remove('o-rv'); c.classList.add('sw-wait'); });
  grid.classList.add('sw-on');

  const cursor = (col, tag, lead) => { const el = document.createElement('div'); el.className = 'sw-cur' + (lead ? ' sw-cur--lead' : ''); el.style.setProperty('--c', col);
    el.innerHTML = ARROW + `<span class="sw-tag">${lead ? '<b>✻ Outline</b>' : ''}<span></span></span>`; grid.appendChild(el);
    const o = { el, x: 0, y: 0, set(x, y) { o.x = x; o.y = y; el.style.transform = `translate(${x}px, ${y}px)`; }, tag(t) { el.querySelector('.sw-tag > span').textContent = t; el.classList.toggle('has-tag', !!t); },
      async to(x, y, ms) { const x0 = o.x, y0 = o.y; await tween(ms, k => o.set(x0 + (x - x0) * k, y0 + (y - y0) * k)); },
      async bye() { el.classList.add('is-out'); await wait(350); el.remove(); } };
    o.tag(tag || ''); return o; };

  /* печать по словам: курсор держится у конца последнего слова */
  const type = async (cur, words, ms) => { for (const w of words) { w.classList.add('on'); const r = rel(w); cur.set(r.r + 2, r.b - 6); await wait(ms); } };

  const build = async (c, i, from) => {
    const col = COL[i % COL.length], cur = cursor(col, ''), R = rel(c);
    cur.set(from ? from.x : R.x - 48, from ? from.y : R.y - 36); requestAnimationFrame(() => cur.el.classList.add('is-on'));
    await cur.to(R.x + 6, R.y + 6, 620);
    /* выделение области — рамка с ручками по углам, тянется из угла в угол */
    cur.tag('Draw(card)');
    const sel = document.createElement('div'); sel.className = 'sw-sel'; sel.style.setProperty('--c', col); sel.innerHTML = '<i></i><i></i><i></i><i></i>';
    Object.assign(sel.style, { left: R.x + 'px', top: R.y + 'px', width: '0px', height: '0px' }); grid.appendChild(sel);
    await tween(720, k => { const w = R.w * k, h = R.h * k; sel.style.width = w + 'px'; sel.style.height = h + 'px'; cur.set(R.x + w, R.y + h); });
    /* отпустили — карточка появляется из точки отпускания */
    c.style.setProperty('--ox', '100%'); c.style.setProperty('--oy', '100%'); c.classList.remove('sw-wait'); c.classList.add('sw-pop', 'is-in');
    sel.classList.add('is-done'); setTimeout(() => sel.remove(), 400);
    await wait(260);
    /* 24.11 (Никита: «быстрая печать по словам странно выглядит»): текст проявляется целиком — из размытия, заголовок, потом абзац; курсор спокойно проходит по нему */
    const h3 = c.querySelector('h3'), pp = c.querySelector('p');
    if (h3) { const r = rel(h3); await cur.to(r.x, r.y + r.h - 4, 360); cur.tag(`Write("${snip(h3.textContent, 22)}")`); c.classList.add('sw-txt');
      const pr = pp ? rel(pp) : r; await tween(1100, k => cur.set(r.x + (pr.r - r.x) * k * .85, r.y + r.h - 4 + (pr.b - r.y - r.h) * k)); }
    cur.tag(''); await wait(220);
    await Promise.all([cur.to(cur.x + 30, cur.y + 24, 380), cur.bye()]);
    c.classList.add('sw-done');
  };

  /* одна партия = карточки, вошедшие в экран вместе; если их больше одной — сначала ведущий курсор раздаёт задачи */
  const go = async batch => {
    let from = null;
    if (batch.length > 1) { const g = grid.getBoundingClientRect(), lead = cursor('#ff6414', `Task × ${batch.length}`, true);
      const lx = g.width / 2 - 40, ly = -54; lead.set(lx - 120, ly - 40); requestAnimationFrame(() => lead.el.classList.add('is-on'));
      await lead.to(lx, ly, 700); await wait(450); from = { x: lx, y: ly }; lead.bye(); }
    await Promise.all(batch.map((c, k) => wait(k * 330).then(() => build(c, cards.indexOf(c), from))));
  };
  const io = new IntersectionObserver(es => { const batch = es.filter(e => e.isIntersecting).map(e => e.target).filter(c => !c._go);
    batch.forEach(c => { c._go = true; io.unobserve(c); }); if (batch.length) go(batch.sort((a, b) => cards.indexOf(a) - cards.indexOf(b))); }, { threshold: .35 });
  cards.forEach(c => io.observe(c));
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
      box.querySelectorAll(':scope > .is-in').forEach(x => { x.classList.remove('is-in'); void x.offsetWidth; x.classList.add('is-in'); }); run(box); };
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
  pick('mv', mvs, 'mv'); pick('pv', pvs, 'pv');
  if (mvs) run(mvs); if (pvs) run(pvs);

  /* фраза «Без бесконечных созвонов…»: наклейки прилипают после зачёркиваний (класс is-in ставит общий скрипт страницы) */
  const no = document.querySelector('.os-no3'); if (no) seen(no, () => no.classList.add('is-in'), .5);
})();

/* 24.11 обложка: переключатель эффекта клика (временно) — Штамп / Смятие / Клеточки */
(() => {
  const sec = document.querySelector('.os-kh[data-v="e"]'); if (!sec) return;
  const cur = (new URLSearchParams(location.search).get('pc') || 'a').replace(/[^abc]/g, '') || 'a';
  const sw = document.createElement('div'); sw.className = 'os-kh__sw v3-sw v3-sw--pc'; sw.setAttribute('role', 'group'); sw.setAttribute('aria-label', 'Клик по обложке (временно)');
  sw.innerHTML = '<span>Клик по фону</span>' + [['a', 'Штамп'], ['b', 'Смятие'], ['c', 'Клеточки']].map(([v, n]) => `<button type="button" data-val="${v}" aria-pressed="${v === cur}">${n}</button>`).join('');
  document.body.appendChild(sw);
  sw.addEventListener('click', e => { const b = e.target.closest('button[data-val]'); if (!b) return; sw.querySelectorAll('button[data-val]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    window.__paperMode && window.__paperMode(b.dataset.val); const u = new URL(location.href); u.searchParams.set('pc', b.dataset.val); history.replaceState(null, '', u); });
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => sw.classList.toggle('is-vis', e.isIntersecting)), { rootMargin: '-40% 0px -40% 0px' }).observe(sec);
})();

/* 24.11 прелоадер v2: один раз за визит (с ?pp= — всегда, для сравнения фраз); клик — пропустить. Когда шторка уехала:
   убираем его, обложка появляется по очереди, связка падает сверху на цепочку (window.__osDrop) */
(() => {
  const pre = document.querySelector('.os-pre'), H = document.documentElement; if (!pre) return;
  if (H.classList.contains('no-pre')) { pre.remove(); return; }
  window.__osDrop = true;
  const done = () => { if (!pre.isConnected) return; pre.remove(); H.classList.remove('pre-on'); try { sessionStorage.setItem('osPre', '1'); } catch (e) {}
    dispatchEvent(new Event('resize')); dispatchEvent(new Event('os-pre:done')); };
  pre.addEventListener('animationend', e => { if (e.target === pre && e.animationName === 'os-pre-out') done(); });
  pre.addEventListener('click', () => pre.classList.add('is-skip'));
  setTimeout(done, 7000);   // на всякий случай
})();

/* 24.11 переключатель фразы прелоадера (временно): перезагружает страницу с ?pp= */
(() => {
  const sw = document.querySelector('.v3-sw--pc'); if (!sw) return; const cur = document.documentElement.dataset.pp || 'a';
  sw.insertAdjacentHTML('beforeend', '<span>Фраза</span>' + ['a', 'b', 'c', 'd'].map((v, i) => `<button type="button" data-pp="${v}" aria-pressed="${v === cur}">${i + 1}</button>`).join(''));
  sw.addEventListener('click', e => { const b = e.target.closest('button[data-pp]'); if (!b) return; const u = new URL(location.href); u.searchParams.set('pp', b.dataset.pp); location.href = u; });
})();

/* 24.11 «Веер» v2: приподнимается ближайшая к курсору карточка (по горизонтали) — без дёрганья от перекрывающихся карточек */
(() => {
  const fan = document.querySelector('.mva__fan'); if (!fan) return; const cs = [...fan.querySelectorAll('.mva__c')]; let cur = -1;
  const set = i => { if (i === cur) return; cur = i; cs.forEach((c, k) => c.classList.toggle('is-on', k === i)); };
  fan.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = fan.getBoundingClientRect(); set(Math.max(0, Math.min(cs.length - 1, Math.round((e.clientX - r.left) / r.width * (cs.length - 1))))); });
  fan.addEventListener('pointerleave', () => set(-1));
})();
