/* Outline Agency — поведение компонентов кита (ds/components.css). Подключается на всех страницах, кроме главной
   (у главной своё в блоках src/). Сборка подставляет [["M405.039 61.7084H430.26H455.481C457.873 50.5041 452.86 24.8405 421.96 24.1234C405.039 23.7307 388.563 31.1746 387.287 52.7465C385.899 64.0254 392.637 88.8718 421.96 88.8718C431.793 88.8718 449.597 84.2842 453.566 68.7476H438.154C437.415 70.9135 433.009 75.3206 421.96 75.3206C416.794 75.3206 406.03 73.4208 405.039 61.7084ZM421.96 37.3436C409.147 37.3436 405.336 46.161 405.039 50.5444H438.533C437.28 39.537 428.296 37.3436 421.96 37.3436Z", "#0B0B0B"], ["M96.435 26.1752C113.554 26.1752 127.432 40.2072 127.432 57.5166C127.432 74.826 113.554 88.858 96.435 88.858H30.997C13.8778 88.858 0 74.826 0 57.5166C0 40.2072 13.8778 26.1752 30.997 26.1752H96.435ZM30.3082 44.2836C23.0801 44.2836 17.2205 50.2082 17.2205 57.5166C17.2205 64.825 23.0801 70.7496 30.3082 70.7496H97.1239C104.352 70.7496 110.211 64.825 110.211 57.5166C110.211 50.2082 104.352 44.2836 97.1239 44.2836H30.3082Z", "#2878EE"], ["M296.193 9.6435C296.193 14.9695 291.876 19.287 286.55 19.287C281.224 19.287 276.906 14.9695 276.906 9.6435C276.906 4.31754 281.224 0 286.55 0C291.876 0 296.193 4.31754 296.193 9.6435Z", "#0B0B0B"], ["M205.958 26.8168V10.3323H224.25V26.8168H236.61V43.2851H224.25V67.8125C224.25 69.5662 225.245 72.4744 230.794 72.4744C234.261 72.4744 235.154 72.4606 236.61 72.4744V88.858H229.339C211.124 88.858 205.958 77.6591 205.958 70.629V43.2851H197.347V26.8168H205.958Z", "#2878EE"], ["M247.287 6.1994H265.196V88.858H247.287V6.1994Z", "#0B0B0B"], ["M277.595 26.1752H295.505V88.858H277.595V26.1752Z", "#0B0B0B"], ["M155.287 69.5634C153.724 67.8605 152.949 64.632 152.949 61.4638V26.1752H134.322V61.4638C134.215 73.6185 138.835 80.4971 144.744 84.3159C150.47 88.0163 157.361 88.8139 162.199 88.8539V88.858H162.532C162.541 88.858 162.552 88.8573 162.561 88.8573C162.572 88.8573 162.582 88.858 162.592 88.858H162.925V88.8539C167.763 88.8139 174.654 88.0163 180.38 84.3159C186.289 80.4971 190.909 73.6185 190.802 61.4638V26.1752H172.175V61.4638C172.175 64.632 171.4 67.8605 169.837 69.5634C168.339 71.1952 166.071 72.1376 162.925 72.1658L162.536 72.1651L162.199 72.1658C159.053 72.1382 156.785 71.1952 155.287 69.5634Z", "#2878EE"], ["M307.903 88.858V26.7013H324.582L325.695 33.9941C332.233 26.6668 340.084 25.4863 346.305 25.4864C372.81 25.4865 375.408 45.3015 375.408 55.7701V88.858H357.027V55.7701C357.027 40.8196 348.899 38.1981 341.003 38.1981C325.695 38.1981 325.695 48.5594 325.695 55.7701V88.858H307.903Z", "#0B0B0B"]] — контуры логотипа из assets/logo-vec/logo-fill.svg.
   Порядок: шапка и меню → тёмная шапка над [data-hdr-dark] → вкладки → FAQ → появление → подвал (карта + логотип контуром). */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobile = matchMedia('(max-width: 1000px)');
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ── шапка: выпадающие меню (наведение на десктопе, нажатие везде, Esc, клик мимо) ── */
  const dds = $$('.o-hdr__dd');
  const closeAll = except => dds.forEach(d => { if (d !== except) { d.classList.remove('is-open'); d.querySelector('button').setAttribute('aria-expanded', 'false'); } });
  dds.forEach(d => {
    const b = d.querySelector('button'); let t = 0;
    const open = v => { closeAll(d); d.classList.toggle('is-open', v); b.setAttribute('aria-expanded', String(v)); };
    b.addEventListener('click', () => open(!d.classList.contains('is-open')));
    if (fine) { d.addEventListener('pointerenter', () => { clearTimeout(t); open(true); }); d.addEventListener('pointerleave', () => { t = setTimeout(() => open(false), 140); }); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.o-hdr__dd')) closeAll(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); setMenu(false); } });

  /* ── меню на телефоне ── */
  const burger = document.querySelector('.o-hdr__burger'), menu = document.getElementById('o-menu');
  const setMenu = v => { if (!burger || !menu) return; burger.setAttribute('aria-expanded', String(v)); menu.classList.toggle('is-open', v); menu.inert = !v; document.documentElement.classList.toggle('o-lock', v); };
  if (burger && menu) { menu.inert = true; burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true')); $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false))); }

  /* ── шапка темнеет, когда целиком над тёмной карточкой ── */
  const hdr = document.querySelector('.o-hdr'), darks = $$('[data-hdr-dark]');
  if (hdr && darks.length) { let raf = 0;
    const check = () => { raf = 0; const h = hdr.offsetHeight; hdr.classList.toggle('is-dark', darks.some(el => { const r = el.getBoundingClientRect(); return r.top <= 0 && r.bottom >= h; })); };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(check); }, { passive: true }); check(); }

  /* ── вкладки: на десктопе макет справа, на телефоне — под открытым пунктом; повторное нажатие на телефоне закрывает ── */
  $$('[data-tabs]').forEach(root => {
    const tabs = $$('.o-tabs__tab', root), stage = root.querySelector('.o-tabs__stage'), imgs = stage ? $$('.o-phone__view img', stage) : [];
    let cur = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const place = () => { if (!stage) return; if (mobile.matches && cur >= 0) tabs[cur].after(stage); else root.append(stage); };
    const set = i => { cur = i; tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i))); imgs.forEach((im, k) => im.classList.toggle('is-on', k === i)); place(); };
    tabs.forEach((t, i) => t.addEventListener('click', () => { if (mobile.matches && i === cur) { set(-1); return; } if (i !== cur) set(i); }));
    mobile.addEventListener('change', () => { if (!mobile.matches && cur < 0) set(0); else place(); });
    set(cur < 0 ? 0 : cur);
  });

  /* ── FAQ: открыт один вопрос, высота анимируется (дробные высоты, без прокрутки страницы) ── */
  $$('.o-faq').forEach(list => {
    const its = $$('.o-faq__it', list);
    const anim = (it, open) => { const s = it.querySelector('summary'), from = it.offsetHeight;
      if (open) it.open = true; const to = open ? it.scrollHeight : s.offsetHeight;
      if (reduce) { if (!open) it.open = false; return; }
      it.style.overflow = 'hidden'; const a = it.animate({ height: [from + 'px', to + 'px'] }, { duration: 320, easing: 'cubic-bezier(.23, 1, .32, 1)' });
      a.onfinish = () => { if (!open) it.open = false; it.style.overflow = ''; }; };
    its.forEach(it => it.querySelector('summary').addEventListener('click', e => { e.preventDefault(); const open = !it.open; if (open) its.forEach(o => o !== it && o.open && anim(o, false)); anim(it, open); }));
  });

  /* ── кнопки тарифа подставляют тариф в форму ── */
  $$('[data-tariff]').forEach(a => a.addEventListener('click', () => { const f = document.querySelector('.o-form input[name="tariff"]'); if (f) f.value = a.dataset.tariff; }));
  $$('form.o-form').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); const b = f.querySelector('button[type="submit"]'); if (b) b.textContent = 'Форма подключается на боевом сайте'; }));

  /* ── появление: элементы .o-rv скрыты заранее (класс .o-js на <html>), проявляются переходом ── */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.o-rv').forEach(el => io.observe(el));

  /* ── рукописное слово с росчерком: росчерк дорисовывается, когда слово видно ── */
  $$('.o-ink').forEach(el => io.observe(el));

  /* ── летающие карточки обложки: параллакс от мыши (перенесено с главной, src/hero-floats.html) ── */
  const flos = $$('.o-flo');
  if (flos.length && !reduce && fine) { let fr = 0, mx = 0, my = 0;
    addEventListener('pointermove', e => { mx = e.clientX - innerWidth / 2; my = e.clientY - innerHeight / 2; if (fr) return;
      fr = requestAnimationFrame(() => { fr = 0; flos.forEach(f => { const k = +f.dataset.k || .03; f.style.setProperty('--mx', (-mx * k).toFixed(1) + 'px'); f.style.setProperty('--my', (-my * k).toFixed(1) + 'px'); }); }); }, { passive: true }); }

  /* ── лента логотипов: бежит влево, на наведении замедляется, тянется с инерцией (перенесено с главной, src/b02-clients.html) ── */
  $$('.o-band__mq').forEach(mq => {
    const track = mq.querySelector('.o-band__track'), sec = mq.closest('.o-band-sec'), orig = [...track.children];
    for (let k = 0; k < 2; k++) orig.forEach(li => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('img').forEach(i => i.alt = ''); track.append(c); });
    let setW = 0; const measure = () => { setW = track.scrollWidth / 3; }; measure(); addEventListener('resize', measure); addEventListener('load', measure);
    const BASE = reduce ? 0 : -38; let x = 0, v = BASE, drag = false, lastX = 0, lastT = 0, vel = 0, hover = false, vis = true;
    const wrap = () => { if (!setW) return; while (x <= -setW) x += setW; while (x > 0) x -= setW; };
    mq.addEventListener('pointerenter', () => { hover = true; }); mq.addEventListener('pointerleave', () => { hover = false; });
    mq.addEventListener('pointerdown', e => { drag = true; lastX = e.clientX; lastT = performance.now(); vel = 0; mq.setPointerCapture(e.pointerId); mq.classList.add('is-drag'); if (sec) sec.classList.add('is-touched'); });
    mq.addEventListener('pointermove', e => { if (!drag) return; const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT); x += dx; vel = vel * .6 + (dx / dt * 1000) * .4; lastX = e.clientX; lastT = now; wrap(); });
    const end = () => { if (!drag) return; drag = false; mq.classList.remove('is-drag'); v = Math.max(-2400, Math.min(2400, vel)); };
    mq.addEventListener('pointerup', end); mq.addEventListener('pointercancel', end);
    new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(mq);
    let prev = performance.now();
    const tick = now => { const dt = Math.min(.05, (now - prev) / 1000); prev = now;
      if (vis && !drag) { const target = hover ? BASE * .25 : BASE; v += (target - v) * Math.min(1, dt * 2.2); x += v * dt; wrap(); }
      track.style.transform = `translate3d(${x}px,0,0)`; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });

  /* ── волны между светлой и тёмной секцией (механика главной, src/b04-network.html и b05-light.html): 4 слоя по 10 точек,
     у точек своя задержка; слои поднимаются, пока переход въезжает в экран, и к моменту, когда виден его низ, он уже залит ── */
  const WAVES = { down: ['#e4e6ea', '#c4c8ce', '#9ba0a8', '#6c717a', '#3a3e45', '#24272d', '#1a1c21', '#111317'],
                  up:   ['#2b2e34', '#3b3f46', '#c4c8ce', '#6c717a', '#e6e8eb', '#f3f4f5', '#fafafa', '#fafafa'] };
  $$('.o-wave').forEach((wrapEl, w) => {
    const C = WAVES[wrapEl.classList.contains('o-wave--up') ? 'up' : 'down'];
    wrapEl.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs>${[0, 1, 2, 3].map(L => `<linearGradient id="ow${w}-${L}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C[L * 2]}"/><stop offset="1" stop-color="${C[L * 2 + 1]}"/></linearGradient>`).join('')}</defs>${[0, 1, 2, 3].map(L => `<path fill="url(#ow${w}-${L})" d="M0 100H100Z"/>`).join('')}</svg>`;
    const paths = $$('path', wrapEl), P = 10, noise = (i, L) => (Math.sin(i * .9 + L * 1.7 + w) + Math.sin(i * .37 + L * 2.9 + 1)) / 4 + .5;
    const delays = paths.map((_, L) => Array.from({ length: P }, (_, i) => L * .13 + noise(i, L) * .1)), smooth = t => t * t * (3 - 2 * t);
    const draw = prog => paths.forEach((p, L) => { const ys = delays[L].map(d => 100 * (1 - smooth(Math.min(1, Math.max(0, (prog - d) / .5)))));
      const step = 100 / (P - 1); let d = `M0 ${ys[0].toFixed(3)} C`;
      for (let i = 1; i < P; i++) { const x0 = (i - 1) * step, h = step / 2; d += ` ${(x0 + h).toFixed(3)} ${ys[i - 1].toFixed(3)} ${(x0 + h).toFixed(3)} ${ys[i].toFixed(3)} ${(i * step).toFixed(3)} ${ys[i].toFixed(3)}`; }
      p.setAttribute('d', d + ' L100 100 L0 100 Z'); });
    const target = () => { const r = wrapEl.getBoundingClientRect(); return Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height * 1.05))); };
    let cur = 0, tgt = 0, raf = 0;
    const tick = () => { cur += (tgt - cur) * .16; if (Math.abs(tgt - cur) < .001) cur = tgt; draw(cur); raf = cur === tgt ? 0 : requestAnimationFrame(tick); };
    const on = () => { tgt = reduce ? 1 : target(); if (reduce) return draw(1); if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); cur = tgt = reduce ? 1 : target(); draw(cur);
  });

  /* ── подвал: логотип контуром с «фонариком» ── */
  const L = [["M405.039 61.7084H430.26H455.481C457.873 50.5041 452.86 24.8405 421.96 24.1234C405.039 23.7307 388.563 31.1746 387.287 52.7465C385.899 64.0254 392.637 88.8718 421.96 88.8718C431.793 88.8718 449.597 84.2842 453.566 68.7476H438.154C437.415 70.9135 433.009 75.3206 421.96 75.3206C416.794 75.3206 406.03 73.4208 405.039 61.7084ZM421.96 37.3436C409.147 37.3436 405.336 46.161 405.039 50.5444H438.533C437.28 39.537 428.296 37.3436 421.96 37.3436Z", "#0B0B0B"], ["M96.435 26.1752C113.554 26.1752 127.432 40.2072 127.432 57.5166C127.432 74.826 113.554 88.858 96.435 88.858H30.997C13.8778 88.858 0 74.826 0 57.5166C0 40.2072 13.8778 26.1752 30.997 26.1752H96.435ZM30.3082 44.2836C23.0801 44.2836 17.2205 50.2082 17.2205 57.5166C17.2205 64.825 23.0801 70.7496 30.3082 70.7496H97.1239C104.352 70.7496 110.211 64.825 110.211 57.5166C110.211 50.2082 104.352 44.2836 97.1239 44.2836H30.3082Z", "#2878EE"], ["M296.193 9.6435C296.193 14.9695 291.876 19.287 286.55 19.287C281.224 19.287 276.906 14.9695 276.906 9.6435C276.906 4.31754 281.224 0 286.55 0C291.876 0 296.193 4.31754 296.193 9.6435Z", "#0B0B0B"], ["M205.958 26.8168V10.3323H224.25V26.8168H236.61V43.2851H224.25V67.8125C224.25 69.5662 225.245 72.4744 230.794 72.4744C234.261 72.4744 235.154 72.4606 236.61 72.4744V88.858H229.339C211.124 88.858 205.958 77.6591 205.958 70.629V43.2851H197.347V26.8168H205.958Z", "#2878EE"], ["M247.287 6.1994H265.196V88.858H247.287V6.1994Z", "#0B0B0B"], ["M277.595 26.1752H295.505V88.858H277.595V26.1752Z", "#0B0B0B"], ["M155.287 69.5634C153.724 67.8605 152.949 64.632 152.949 61.4638V26.1752H134.322V61.4638C134.215 73.6185 138.835 80.4971 144.744 84.3159C150.47 88.0163 157.361 88.8139 162.199 88.8539V88.858H162.532C162.541 88.858 162.552 88.8573 162.561 88.8573C162.572 88.8573 162.582 88.858 162.592 88.858H162.925V88.8539C167.763 88.8139 174.654 88.0163 180.38 84.3159C186.289 80.4971 190.909 73.6185 190.802 61.4638V26.1752H172.175V61.4638C172.175 64.632 171.4 67.8605 169.837 69.5634C168.339 71.1952 166.071 72.1376 162.925 72.1658L162.536 72.1651L162.199 72.1658C159.053 72.1382 156.785 71.1952 155.287 69.5634Z", "#2878EE"], ["M307.903 88.858V26.7013H324.582L325.695 33.9941C332.233 26.6668 340.084 25.4863 346.305 25.4864C372.81 25.4865 375.408 45.3015 375.408 55.7701V88.858H357.027V55.7701C357.027 40.8196 348.899 38.1981 341.003 38.1981C325.695 38.1981 325.695 48.5594 325.695 55.7701V88.858H307.903Z", "#0B0B0B"]];
  const foot = document.querySelector('.o-footer');
  const slot = foot && foot.querySelector('.o-olg-slot');
  if (slot) {
    const id = 'olg1', base = L.map(([d], i) => `<path d="${d}" pathLength="1" style="--i:${i}"/>`).join('');
    const hl = L.map(([d, c]) => { const blue = c.toUpperCase() === '#2878EE'; return `<path d="${d}" stroke="${blue ? '#2878ee' : '#ffffff'}"/><path class="t" d="${d}" stroke="${blue ? '#8fb8ff' : '#c9ced8'}"/>`; }).join('');
    slot.outerHTML = `<svg class="o-olg" viewBox="-2 -2 460 94" aria-hidden="true"><defs><radialGradient id="${id}g"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <mask id="${id}m" maskUnits="userSpaceOnUse" x="-200" y="-200" width="860" height="500"><circle class="spot" cx="-200" cy="45" r="70" fill="url(#${id}g)"/></mask></defs><g class="b draw">${base}</g><g class="h" mask="url(#${id}m)">${hl}</g></svg>`;
    const svg = foot.querySelector('.o-olg'), spot = svg.querySelector('.spot');
    const unit = () => svg.clientWidth && svg.style.setProperty('--u', (460 / svg.clientWidth).toFixed(4)); new ResizeObserver(unit).observe(svg); unit();
    let auto = true, raf = 0, vis = false, cx = -130, cy = 45, ph = 0, last = 0;
    const pt = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460 - 2, (e.clientY - r.top) / r.height * 94 - 2]; };
    svg.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; auto = false; [cx, cy] = pt(e); spot.setAttribute('cx', cx); spot.setAttribute('cy', cy); svg.classList.add('is-lit'); });
    svg.addEventListener('pointerleave', () => { auto = true; ph = Math.max(0, Math.min(.99, (cx + 130) / 740)); });
    /* 15.11 (Никита): фонарик идёт только слева направо — уходит за правый край и снова выходит слева; перенос в начало, пока пятно за пределами логотипа, поэтому незаметен */ const loop = now => { if (!vis) return; const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; if (auto && !reduce) { const p0 = ph; ph = (ph + dt / 6.5) % 1; const tx = -130 + ph * 740, ty = 45 + Math.sin(ph * Math.PI * 2) * 20; if (ph < p0) { cx = tx; cy = ty; } else { const f = Math.min(1, dt * 5); cx += (tx - cx) * f; cy += (ty - cy) * f; } spot.setAttribute('cx', cx.toFixed(1)); spot.setAttribute('cy', cy.toFixed(1)); svg.classList.add('is-lit'); } raf = requestAnimationFrame(loop); };
    new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; if (vis) { svg.classList.add('is-in'); cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(loop); } }), { threshold: .2 }).observe(svg);
  }

  /* ── подвал: живая карта «как в Яндексе» (canvas). Перенесено с главной (src/fin-variants.tpl.html, вариант А, 03.11):
     улицы — сетка в повёрнутой системе (u, v); маршрут лесенкой от «вы здесь» к метке бизнеса; машины по полосам; метки конкурентов на перекрёстках ── */
  /* mapScene(host, canvas, opts) — та же карта для подвала и для фона обложки (.o-mapbg). opts: x0, x1, y0, y1 — где ставить маршруты (доли ширины и высоты) */
  function mapScene(foot, cv, opts = {}) {
  const X0 = opts.x0 ?? .06, X1 = opts.x1 ?? .94, Y0 = opts.y0 ?? .07, Y1 = opts.y1 ?? .42;
  const th = { bg: '#f8f7f6', block: '#efebe7', house: '#e6dfda', park: '#dcf2c9', park2: '#cdecb2', water: '#94d4fa', road: '#ffffff', casing: 'rgba(149,153,161,.55)', majorCasing: 'rgba(149,153,161,.8)', car: ['rgba(40,120,238,.75)', 'rgba(255,100,20,.8)'], pin: '#8e949e', poi: ['#ffa15e', '#8ad9cb', '#d38fec', '#94b7f0'] };
  const cx = cv.getContext('2d'); let W = 0, H = 0, dpr = 1, base = null, U = [], V = [], cars = [], pins = [], route = null, vis = false, raf = 0, last = 0, R = 1000;
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; let wet = () => false;
  const ang = -0.21, ca = Math.cos(ang), sa = Math.sin(ang); let OX = 0, OY = 0;
  const S = (u, v) => [OX + u * ca - v * sa, OY + u * sa + v * ca];
  const NAMES = (foot.dataset.pins || 'Ваш автосервис|Ваша клиника|Ваша кофейня|Ваш салон').split('|'); let nameK = 0;
  const build = () => {
    const r = foot.getBoundingClientRect(); W = Math.round(r.width); H = Math.round(r.height); if (!W || !H) return;
    dpr = Math.min(1.5, devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr; seed = 11; OX = W / 2; OY = H / 2; R = Math.hypot(W, H) / 2 + 80;
    const lines = () => { const out = []; for (let o = -R; o < R; o += 70 + rnd() * 70) out.push({ o, major: rnd() < .25 }); return out; };
    U = lines(); V = lines();
    base = document.createElement('canvas'); base.width = cv.width; base.height = cv.height; const b = base.getContext('2d'); b.scale(dpr, dpr);
    b.fillStyle = th.bg; b.fillRect(0, 0, W, H);
    const quad = (u0, v0, u1, v1, fill) => { b.fillStyle = fill; b.beginPath(); [S(u0, v0), S(u1, v0), S(u1, v1), S(u0, v1)].forEach(([x, y], k) => k ? b.lineTo(x, y) : b.moveTo(x, y)); b.closePath(); b.fill(); };
    /* 15.11 (Никита: «река идёт прямо через дома и улицы») — берег: дома у воды не ставим, мелкие улицы обрываются у реки, через неё — только магистрали-мосты; машины, маршрут и метки на воду не заходят */ const bz = (t, a0, a1, a2, a3) => { const m = 1 - t; return m * m * m * a0 + 3 * m * m * t * a1 + 3 * m * t * t * a2 + t * t * t * a3; }; const RP = []; for (let k = 0; k <= 90; k++) { const t = k / 90; RP.push([bz(t, -80, W * .3, W * .62, W + 80), bz(t, H * .2, H * .55, H * .02, H * .34)]); } wet = (x, y, pad = 0) => { for (let k = 0; k < RP.length - 1; k++) { const [ax, ay] = RP[k], dx = RP[k + 1][0] - ax, dy = RP[k + 1][1] - ay, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))); if (Math.hypot(x - ax - dx * t, y - ay - dy * t) < 27 + pad) return true; } return false; }; const house = (u0, v0, u1, v1) => { const c = S((u0 + u1) / 2, (v0 + v1) / 2); if (!wet(c[0], c[1], 14)) quad(u0, v0, u1, v1, th.house); };
      for (let i = 0; i < U.length - 1; i++) for (let j = 0; j < V.length - 1; j++) {
      const g = 7, u0 = U[i].o + g, u1 = U[i + 1].o - g, v0 = V[j].o + g, v1 = V[j + 1].o - g; if (u1 - u0 < 20 || v1 - v0 < 20) continue;
      const c = S((u0 + u1) / 2, (v0 + v1) / 2); if (c[0] < -150 || c[0] > W + 150 || c[1] < -150 || c[1] > H + 150) continue;
      if (rnd() < .1) { quad(u0, v0, u1, v1, th.park); quad(u0 + 8, v0 + 8, u1 - 8, v1 - 8, th.park2); continue; }
      quad(u0, v0, u1, v1, th.block);
      for (let u = u0 + 2; u < u1 - 10; u += 14 + rnd() * 16) { const w = 10 + rnd() * 12, d = 12 + rnd() * 10; if (u + w > u1 - 2) break; house(u, v0 + 2, u + w, v0 + 2 + d); house(u, v1 - 2 - d, u + w, v1 - 2); }
      for (let v = v0 + 26; v < v1 - 30; v += 16 + rnd() * 14) { const h = 10 + rnd() * 10, d = 12 + rnd() * 8; house(u0 + 2, v, u0 + 2 + d, v + h); house(u1 - 2 - d, v, u1 - 2, v + h); }
    }
    /* река — после дорог, см. ниже */
    const seg = (l, fam) => fam === 'U' ? [S(l.o, -R), S(l.o, R)] : [S(-R, l.o), S(R, l.o)];
    [['U', U], ['V', V]].forEach(([f, arr]) => arr.forEach(l => { const [p0, p1] = seg(l, f); b.strokeStyle = l.major ? th.majorCasing : th.casing; b.lineWidth = l.major ? 12 : 7; b.beginPath(); b.moveTo(...p0); b.lineTo(...p1); b.stroke(); }));
    [['U', U], ['V', V]].forEach(([f, arr]) => arr.forEach(l => { const [p0, p1] = seg(l, f); b.strokeStyle = th.road; b.lineWidth = l.major ? 10 : 5; b.beginPath(); b.moveTo(...p0); b.lineTo(...p1); b.stroke(); })); /* река поверх улиц; магистрали — мосты поверх реки */ b.save(); b.lineCap = 'butt'; b.beginPath(); b.moveTo(-80, H * .2); b.bezierCurveTo(W * .3, H * .55, W * .62, H * .02, W + 80, H * .34); b.strokeStyle = th.water; b.lineWidth = 54; b.stroke(); b.restore(); [['U', U], ['V', V]].forEach(([f, arr]) => arr.forEach(l => { if (!l.major) return; const [p0, p1] = seg(l, f); b.strokeStyle = th.majorCasing; b.lineWidth = 13; b.beginPath(); b.moveTo(...p0); b.lineTo(...p1); b.stroke(); b.strokeStyle = th.road; b.lineWidth = 10; b.beginPath(); b.moveTo(...p0); b.lineTo(...p1); b.stroke(); }));
    for (let k = 0; k < 16; k++) { const i = 1 + ((rnd() * (U.length - 3)) | 0), j = 1 + ((rnd() * (V.length - 3)) | 0), du = (U[i + 1].o - U[i].o) * (.25 + rnd() * .5), dv = (V[j + 1].o - V[j].o) * (.25 + rnd() * .5);
      const [x, y] = S(U[i].o + du, V[j].o + dv); if (x < 20 || x > W - 20 || y < 20 || y > H - 20) continue; if (wet(x, y, 8)) continue;
      b.fillStyle = '#fff'; b.beginPath(); b.arc(x, y, 6.5, 0, 7); b.fill(); b.fillStyle = th.poi[k % th.poi.length]; b.beginPath(); b.arc(x, y, 5, 0, 7); b.fill(); }
    cars = Array.from({ length: Math.round(W / 14) }, () => newCar()); pins = []; route = null;
  };
  const newCar = () => { const fam = rnd() < .5 ? 'U' : 'V', arr = fam === 'U' ? U : V, l = arr[(rnd() * arr.length) | 0];
    return { fam, l, t: -R + rnd() * 2 * R, v: (l.major ? 70 : 38) * (rnd() < .5 ? -1 : 1) * (.7 + rnd() * .6), side: rnd() < .5 ? -1 : 1, warm: rnd() < .35 }; };
  const visible = ([x, y], m = 0) => x > m && x < W - m && y > m && y < H - m;
  const node = () => { for (let k = 0; k < 60; k++) { const i = (rnd() * U.length) | 0, j = (rnd() * V.length) | 0, p = S(U[i].o, V[j].o); if (!wet(p[0], p[1], 10) && p[0] > W * X0 && p[0] < W * X1 && p[1] > H * Y0 && p[1] < H * Y1) return [i, j]; } return null; };
  const newRoute = () => {
    for (let k = 0; k < 40; k++) { const a = node(), z = node(); if (!a || !z) continue;
      const di = z[0] - a[0], dj = z[1] - a[1]; if (Math.abs(di) < 2 || Math.abs(dj) < 2) continue;
      const ia = a[0] + Math.round(di * (.3 + rnd() * .4)), jb = a[1] + Math.round(dj * (.3 + rnd() * .4));
      const steps = [[a[0], a[1]], [a[0], jb], [ia, jb], [ia, z[1]], [z[0], z[1]]], P = steps.map(([i, j]) => S(U[i].o, V[j].o)).filter((q, n, arr) => !n || Math.hypot(q[0] - arr[n - 1][0], q[1] - arr[n - 1][1]) > 1);
      const dry = st => st.slice(1).every(([i, j], n) => { const [pi, pj] = st[n], l = pi === i ? U[i] : V[j]; if (l.major) return true; const a = S(U[pi].o, V[pj].o), z2 = S(U[i].o, V[j].o); for (let s = 0; s <= 24; s++) { if (wet(a[0] + (z2[0] - a[0]) * s / 24, a[1] + (z2[1] - a[1]) * s / 24, 4)) return false; } return true; }); if (P.length >= 4 && P.every(q => visible(q, 24)) && dry(steps)) { route = { pts: P, t: 0, name: NAMES[nameK++ % NAMES.length] }; return; } }
    route = null; };
  const pinPath = (L, r) => { const t = Math.acos(r / L); cx.beginPath(); cx.moveTo(0, 0); cx.arc(0, -L, r, Math.PI / 2 + t, Math.PI / 2 - t + Math.PI * 2); cx.closePath(); };
  const font = getComputedStyle(document.body).fontFamily || 'sans-serif';
  const frame = now => {
    if (!vis || !base) return; raf = requestAnimationFrame(frame); if (now - last < 32) return; const dt = Math.min(.05, (now - last) / 1000); last = now;
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.drawImage(base, 0, 0); cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cars.forEach(c => { c.t += c.v * dt * (reduce ? 0 : 1); if (Math.abs(c.t) > R) Object.assign(c, newCar()); const off = c.side * (c.l.major ? 2.5 : 1.2);
      const [x, y] = c.fam === 'U' ? S(c.l.o + off, c.t) : S(c.t, c.l.o + off); if (!visible([x, y], -10)) return; if (!c.l.major && wet(x, y, 3)) return;
      const dir = c.fam === 'U' ? [-sa, ca] : [ca, sa], tl = (c.l.major ? 14 : 8) * Math.sign(c.v);
      const g = cx.createLinearGradient(x, y, x - dir[0] * tl, y - dir[1] * tl); g.addColorStop(0, th.car[c.warm ? 1 : 0]); g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.strokeStyle = g; cx.lineWidth = c.l.major ? 2.2 : 1.5; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x - dir[0] * tl, y - dir[1] * tl); cx.stroke(); });
    if (!route) newRoute();
    if (route) { route.t += dt / 5;
      const P = route.pts, lens = P.slice(1).map((q, k) => Math.hypot(q[0] - P[k][0], q[1] - P[k][1])), tot = lens.reduce((x, y) => x + y, 0);
      const prog = Math.min(1, route.t / .45) * tot, fade = route.t > .88 ? Math.max(0, 1 - (route.t - .88) / .12) : 1, BLUE = '#3d7cf0';
      cx.save(); cx.globalAlpha = fade; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.strokeStyle = BLUE; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(...P[0]); let left = prog;
      for (let k = 1; k < P.length && left > 0; k++) { const f = Math.min(1, left / lens[k - 1]); cx.lineTo(P[k - 1][0] + (P[k][0] - P[k - 1][0]) * f, P[k - 1][1] + (P[k][1] - P[k - 1][1]) * f); left -= lens[k - 1]; }
      cx.stroke();
      cx.fillStyle = 'rgba(61,124,240,.16)'; cx.beginPath(); cx.arc(...P[0], 13, 0, 7); cx.fill();
      cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(...P[0], 7.5, 0, 7); cx.fill(); cx.fillStyle = BLUE; cx.beginPath(); cx.arc(...P[0], 5.5, 0, 7); cx.fill();
      if (route.t > .45) { const k = Math.min(1, (route.t - .45) / .06), e = 1 - Math.pow(1 - k, 3), [x, y] = P[P.length - 1];
        cx.save(); cx.translate(x, y - 3); cx.scale(e, e); cx.shadowColor = 'rgba(255,100,20,.4)'; cx.shadowBlur = 14; cx.shadowOffsetY = 2; cx.fillStyle = '#ff6414'; pinPath(31, 13.5); cx.fill();
        cx.shadowColor = 'transparent'; cx.strokeStyle = '#fff'; cx.lineWidth = 2.5; cx.lineJoin = 'round'; cx.stroke(); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(0, -31, 5.2, 0, 7); cx.fill(); cx.restore();
        const ta = Math.min(1, Math.max(0, (route.t - .5) / .06)); if (ta > 0) { cx.globalAlpha = fade * ta; cx.font = '600 14px ' + font;
          const tw = cx.measureText(route.name).width, bw = tw + 28, bh = 32, bx = x + 22, by = y - 3 - 31 - bh / 2;
          cx.fillStyle = '#1c1f24'; cx.beginPath(); cx.roundRect(bx, by, bw, bh, 9); cx.fill(); cx.fillStyle = '#fff'; cx.textBaseline = 'middle'; cx.fillText(route.name, bx + 14, by + bh / 2 + 1); } }
      cx.restore(); if (route.t > 1) route = null; }
    if (rnd() < dt * .8 && pins.length < 6) { const n = node(); if (n) { const i = n[0], j = n[1], du = (U[Math.min(i + 1, U.length - 1)].o - U[i].o) * .5; const q0 = S(U[i].o + du, V[j].o + 8); if (!wet(q0[0], q0[1], 14)) pins.push({ p: q0, t: 0 }); } }
    pins = pins.filter(q => (q.t += dt / 6) < 1); pins.forEach(q => { const a = q.t < .12 ? q.t / .12 : q.t > .85 ? (1 - q.t) / .15 : 1, [x, y] = q.p;
      cx.save(); cx.globalAlpha = a; cx.translate(x, y - 1); cx.fillStyle = th.pin; cx.strokeStyle = '#fff'; cx.lineWidth = 2.5; pinPath(20, 8.5); cx.fill(); cx.lineJoin = 'round'; cx.stroke();
      cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(0, -20, 3.2, 0, 7); cx.fill(); cx.restore(); });
  };
  const rebuild = () => { build(); if (reduce || !vis) { const v = vis; vis = true; last = 0; frame(performance.now() + 100); cancelAnimationFrame(raf); vis = v; } };
  new ResizeObserver(rebuild).observe(foot);
  new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) { last = 0; raf = requestAnimationFrame(frame); } }), { threshold: 0 }).observe(foot);
  }
  if (foot) { const fcv = foot.querySelector('.o-footer__map'); if (fcv) mapScene(foot, fcv); }
  /* зона, где появляются маршруты и подписи: data-x0/x1/y0/y1 — доли ширины и высоты (на узких экранах — data-mx0…my1) */
  $$('.o-mapbg').forEach(h => { const c = h.querySelector(':scope > canvas'); if (!c) return; const d = h.dataset, m = matchMedia('(max-width: 1000px)').matches, g = (k, def) => +((m && d['m' + k]) || d[k] || def);
    mapScene(h, c, { x0: g('x0', .5), x1: g('x1', .94), y0: g('y0', .12), y1: g('y1', .88) }); });
})();
