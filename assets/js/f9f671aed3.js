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

  const R = document.documentElement;

  /* 24.11 кейсы на полке (реф shopify.com/editions): фильтр, наклон за курсором, раскрытие с перелётом обложки; переход ?tr=wave|sheet (временно) */
  const oc = document.querySelector('.oc');
  if (oc) {
    const covs = [...oc.querySelectorAll('.oc-cov')], dets = [...oc.querySelectorAll('.oc-det')], idx = [...oc.querySelectorAll('.oc-idx button')], box = oc.querySelector('.oc-dets');
    const mob = () => matchMedia('(max-width: 760px)').matches; let cur = -1, busy = false;
    /* «Лист»: светлый блок наезжает на тёмный и расширяется до краёв */
    let raf4 = 0; const rise = () => { raf4 = 0; const r = oc.getBoundingClientRect(), e = Math.max(0, Math.min(1, 1 - r.top / (innerHeight * .9)));
      oc.style.setProperty('--e2', e.toFixed(4)); oc.classList.toggle('is-rise', e < 1 && cur < 0 && !reduce); };
    addEventListener('scroll', () => { if (!raf4) raf4 = requestAnimationFrame(rise); }, { passive: true }); addEventListener('resize', rise); rise();
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
    const show = (i, fromCover) => { const d = dets[i]; if (cur < 0) place(); dets.forEach(x => { x.hidden = x !== d; }); cur = i; oc.classList.add('is-det'); oc.classList.remove('is-rise');
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
