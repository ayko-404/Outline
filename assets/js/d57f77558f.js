
(() => {
  const L = [["M405.039 61.7084H430.26H455.481C457.873 50.5041 452.86 24.8405 421.96 24.1234C405.039 23.7307 388.563 31.1746 387.287 52.7465C385.899 64.0254 392.637 88.8718 421.96 88.8718C431.793 88.8718 449.597 84.2842 453.566 68.7476H438.154C437.415 70.9135 433.009 75.3206 421.96 75.3206C416.794 75.3206 406.03 73.4208 405.039 61.7084ZM421.96 37.3436C409.147 37.3436 405.336 46.161 405.039 50.5444H438.533C437.28 39.537 428.296 37.3436 421.96 37.3436Z", "#0B0B0B"], ["M96.435 26.1752C113.554 26.1752 127.432 40.2072 127.432 57.5166C127.432 74.826 113.554 88.858 96.435 88.858H30.997C13.8778 88.858 0 74.826 0 57.5166C0 40.2072 13.8778 26.1752 30.997 26.1752H96.435ZM30.3082 44.2836C23.0801 44.2836 17.2205 50.2082 17.2205 57.5166C17.2205 64.825 23.0801 70.7496 30.3082 70.7496H97.1239C104.352 70.7496 110.211 64.825 110.211 57.5166C110.211 50.2082 104.352 44.2836 97.1239 44.2836H30.3082Z", "#2878EE"], ["M296.193 9.6435C296.193 14.9695 291.876 19.287 286.55 19.287C281.224 19.287 276.906 14.9695 276.906 9.6435C276.906 4.31754 281.224 0 286.55 0C291.876 0 296.193 4.31754 296.193 9.6435Z", "#0B0B0B"], ["M205.958 26.8168V10.3323H224.25V26.8168H236.61V43.2851H224.25V67.8125C224.25 69.5662 225.245 72.4744 230.794 72.4744C234.261 72.4744 235.154 72.4606 236.61 72.4744V88.858H229.339C211.124 88.858 205.958 77.6591 205.958 70.629V43.2851H197.347V26.8168H205.958Z", "#2878EE"], ["M247.287 6.1994H265.196V88.858H247.287V6.1994Z", "#0B0B0B"], ["M277.595 26.1752H295.505V88.858H277.595V26.1752Z", "#0B0B0B"], ["M155.287 69.5634C153.724 67.8605 152.949 64.632 152.949 61.4638V26.1752H134.322V61.4638C134.215 73.6185 138.835 80.4971 144.744 84.3159C150.47 88.0163 157.361 88.8139 162.199 88.8539V88.858H162.532C162.541 88.858 162.552 88.8573 162.561 88.8573C162.572 88.8573 162.582 88.858 162.592 88.858H162.925V88.8539C167.763 88.8139 174.654 88.0163 180.38 84.3159C186.289 80.4971 190.909 73.6185 190.802 61.4638V26.1752H172.175V61.4638C172.175 64.632 171.4 67.8605 169.837 69.5634C168.339 71.1952 166.071 72.1376 162.925 72.1658L162.536 72.1651L162.199 72.1658C159.053 72.1382 156.785 71.1952 155.287 69.5634Z", "#2878EE"], ["M307.903 88.858V26.7013H324.582L325.695 33.9941C332.233 26.6668 340.084 25.4863 346.305 25.4864C372.81 25.4865 375.408 45.3015 375.408 55.7701V88.858H357.027V55.7701C357.027 40.8196 348.899 38.1981 341.003 38.1981C325.695 38.1981 325.695 48.5594 325.695 55.7701V88.858H307.903Z", "#0B0B0B"]];   /* [d, цвет] — вектор логотипа из Figma */
  const VB = '-2 -2 460 94';
  const ft = document.querySelector('footer.ft'); if (!ft) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cta = document.getElementById('razbor');
  const colsHTML = () => ft.querySelector('.ft__top').outerHTML + ft.querySelector('.ft__bot').outerHTML;

  /* логотип контуром: база (пунктир, рисуется), подсветка под маской-фонариком */
  let uid = 0;
  const outline = (o = {}) => { const id = 'olg' + (++uid);
    const base = L.map(([d], i) => `<path d="${d}" pathLength="1" style="--i:${i}"/>`).join('');
    const dark = !!o.dark;
    const hl = L.map(([d, c]) => `<path d="${d}" stroke="${c === '#2878EE' ? '#2878ee' : (dark ? '#ffffff' : '#0f151d')}"/><path class="t" d="${d}" stroke="${c === '#2878EE' ? '#8fb8ff' : (dark ? '#c9ced8' : '#5b6170')}"/>`).join('');
    return `<svg class="olg" viewBox="${VB}" aria-hidden="true" data-id="${id}"><defs><radialGradient id="${id}g"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <mask id="${id}m" maskUnits="userSpaceOnUse" x="-200" y="-200" width="860" height="500"><circle class="spot" cx="-200" cy="45" r="70" fill="url(#${id}g)"/></mask></defs>
      <g class="b draw">${base}</g><g class="h" mask="url(#${id}m)">${hl}</g></svg>`; };
  const unit = (svg, vbw) => { const f = () => svg.clientWidth && svg.style.setProperty('--u', (vbw / svg.clientWidth).toFixed(4)); new ResizeObserver(f).observe(svg); f(); };
  const bindOutline = svg => { unit(svg, 460);
    const spot = svg.querySelector('.spot'); let auto = true, raf = 0, vis = false, cx = -130, cy = 45, ph = 0, last = 0;
    const pt = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460 - 2, (e.clientY - r.top) / r.height * 94 - 2]; };
    svg.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; auto = false; [cx, cy] = pt(e); spot.setAttribute('cx', cx); spot.setAttribute('cy', cy); svg.classList.add('is-lit'); });
    svg.addEventListener('pointerleave', () => { auto = true; ph = Math.max(0, Math.min(.99, (cx + 130) / 740)); });
    /* 15.11 (Никита): фонарик идёт только слева направо — уходит за правый край и снова выходит слева; перенос в начало, пока пятно за пределами логотипа, поэтому незаметен */ const loop = now => { if (!vis) return; const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; if (auto && !reduce) { const p0 = ph; ph = (ph + dt / 6.5) % 1; const tx = -130 + ph * 740, ty = 45 + Math.sin(ph * Math.PI * 2) * 20; if (ph < p0) { cx = tx; cy = ty; } else { const f = Math.min(1, dt * 5); cx += (tx - cx) * f; cy += (ty - cy) * f; } spot.setAttribute('cx', cx.toFixed(1)); spot.setAttribute('cy', cy.toFixed(1)); svg.classList.add('is-lit'); } raf = requestAnimationFrame(loop); };
    new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; if (vis) { svg.classList.add('is-in'); cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(loop); } }), { threshold: .2 }).observe(svg);
  };

  /* ===== А · живая карта (canvas) ===== */
  const A = document.createElement('section'); A.className = 'fin fina'; A.dataset.v = 'a'; A.dataset.map = 'ya'; A.setAttribute('aria-label', 'Подвал');
  A.innerHTML = `<div class="fina__msw"><button type="button" data-t="ya" aria-pressed="true">Как в Яндексе</button><button type="button" data-t="dark" aria-pressed="false">Тёмная</button></div><canvas class="fina__map" aria-hidden="true"></canvas><div class="fina__in">
    <div class="fina__card"><div class="fina__cin"><span class="fina__grid" aria-hidden="true"></span><div class="ft__in">${colsHTML()}</div>${outline({ dark: true })}</div></div></div>`;
  /* ===== Б · чертёж ===== */
  const B = document.createElement('section'); B.className = 'fin finb'; B.dataset.v = 'b'; B.hidden = true; B.setAttribute('aria-label', 'Подвал');
  B.innerHTML = `<span class="finb__grid"></span><div class="finb__stage"><svg class="finb__svg" aria-hidden="true"></svg></div><div class="finb__card"><div class="ft__in">${colsHTML()}</div></div>`;
  /* ===== В · контур ===== */
  const C = document.createElement('section'); C.className = 'fin finc finl'; C.dataset.v = 'c'; C.hidden = true; C.setAttribute('aria-label', 'Подвал');
  C.innerHTML = `<div class="finc__in"><div class="ft__in">${colsHTML()}</div>${outline()}</div>`;

  const sw = document.createElement('div'); sw.className = 'fin__sw';
  sw.innerHTML = `<div><small>Финал</small><button type="button" data-v="a" aria-pressed="true">А · Живая карта</button><button type="button" data-v="b" aria-pressed="false">Б · Чертёж</button><button type="button" data-v="c" aria-pressed="false">В · Контур</button></div>`;
  ft.dataset.fin = '1'; ft.before(A, B, C); (cta || A).before(sw);
  [A, C].forEach(s => bindOutline(s.querySelector('.olg')));
  A.querySelectorAll('.fina__msw button').forEach(b => b.addEventListener('click', () => { A.querySelectorAll('.fina__msw button').forEach(x => x.setAttribute('aria-pressed', x === b)); window.__finMapTheme && window.__finMapTheme(b.dataset.t); }));
  const set = v => { [A, B, C].forEach(s => s.hidden = s.dataset.v !== v); sw.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v));
    document.body.classList.toggle('fin-on-a', v === 'a'); if (v === 'b') drawBlueprint(); dispatchEvent(new Event('resize')); };
  sw.querySelectorAll('button').forEach(b => b.addEventListener('click', () => set(b.dataset.v)));
  set('a');

  /* --- карта v2 (03.11, Никита: «маршруты не по улицам», «ближе к Яндексу»): улицы — сетка в повёрнутой системе (u, v), поэтому маршрут,
     машины и метки живут только на улицах. Кварталы застроены домами, парки, река; дороги — двух классов с обводкой.
     Палитра «Яндекс» снята со скриншота Яндекс Карт 03.11 (фон #f8f7f6, дома #e6dfda, парки #dcf2c9, вода #94d4fa, обводка #9599a1);
     тёмная — своя (тёмную тему Яндекса снять не дали: лимит запросов) --- */
  const MAPPAL = {
    ya:   { bg: '#f8f7f6', block: '#efebe7', house: '#e6dfda', houseEdge: '#ddd4cd', park: '#dcf2c9', park2: '#cdecb2', water: '#94d4fa', road: '#ffffff', casing: 'rgba(149,153,161,.55)', majorCasing: 'rgba(149,153,161,.8)', car: ['rgba(40,120,238,.75)', 'rgba(255,100,20,.8)'], pin: '#8e949e', vignette: 'rgba(248,247,246,0)', poi: ['#ffa15e', '#8ad9cb', '#d38fec', '#94b7f0'] },
    dark: { bg: '#11141a', block: '#171b22', house: '#1f242d', houseEdge: '#262c36', park: '#16261d', park2: '#1a2e22', water: '#14253d', road: '#0b0d11', casing: 'rgba(255,255,255,.05)', majorCasing: 'rgba(255,255,255,.1)', car: ['rgba(210,225,255,.85)', 'rgba(255,160,90,.9)'], pin: 'rgba(200,210,225,.7)', vignette: 'rgba(13,16,20,.55)', poi: ['#c9773f', '#3f8f82', '#8a5ea0', '#4f73b0'] },
  };
  let mapTheme = 'ya';   /* 03.11: Никита — светлая «Как в Яндексе», подвал на ней заметнее; тёмная — в коде, переключатель скрыт */
  (() => {
    const cv = A.querySelector('canvas'), cx = cv.getContext('2d'); let W = 0, H = 0, dpr = 1, base = null, U = [], V = [], cars = [], pins = [], route = null, vis = false, raf = 0, last = 0, th = MAPPAL.ya;
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; let wet = () => false;
    const ang = -0.21, ca = Math.cos(ang), sa = Math.sin(ang); let OX = 0, OY = 0;
    const S = (u, v) => [OX + u * ca - v * sa, OY + u * sa + v * ca];          /* (u, v) → экран */
    const build = () => {
      const r = A.getBoundingClientRect(); W = Math.round(r.width); H = Math.round(r.height); if (!W || !H) return; th = MAPPAL[mapTheme];
      dpr = Math.min(1.5, devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr; seed = 11; OX = W / 2; OY = H / 2;
      const R = Math.hypot(W, H) / 2 + 80;
      const lines = () => { const out = []; for (let o = -R; o < R; o += 70 + rnd() * 70) out.push({ o, major: rnd() < .25 }); return out; };
      U = lines(); V = lines();                                                  /* U — линии u = const, V — линии v = const */
      base = document.createElement('canvas'); base.width = cv.width; base.height = cv.height; const b = base.getContext('2d'); b.scale(dpr, dpr);
      b.fillStyle = th.bg; b.fillRect(0, 0, W, H);
      const quad = (u0, v0, u1, v1, fill) => { b.fillStyle = fill; b.beginPath(); [S(u0, v0), S(u1, v0), S(u1, v1), S(u0, v1)].forEach(([x, y], k) => k ? b.lineTo(x, y) : b.moveTo(x, y)); b.closePath(); b.fill(); };
      /* кварталы: дома по периметру или парк */
      /* 15.11 (Никита: «река идёт прямо через дома и улицы») — берег: дома у воды не ставим, мелкие улицы обрываются у реки, через неё — только магистрали-мосты; машины, маршрут и метки на воду не заходят */ const bz = (t, a0, a1, a2, a3) => { const m = 1 - t; return m * m * m * a0 + 3 * m * m * t * a1 + 3 * m * t * t * a2 + t * t * t * a3; }; const RP = []; for (let k = 0; k <= 90; k++) { const t = k / 90; RP.push([bz(t, -80, W * .3, W * .62, W + 80), bz(t, H * .2, H * .55, H * .02, H * .34)]); } wet = (x, y, pad = 0) => { for (let k = 0; k < RP.length - 1; k++) { const [ax, ay] = RP[k], dx = RP[k + 1][0] - ax, dy = RP[k + 1][1] - ay, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))); if (Math.hypot(x - ax - dx * t, y - ay - dy * t) < 27 + pad) return true; } return false; }; const house = (u0, v0, u1, v1) => { const c = S((u0 + u1) / 2, (v0 + v1) / 2); if (!wet(c[0], c[1], 14)) quad(u0, v0, u1, v1, th.house); };
      for (let i = 0; i < U.length - 1; i++) for (let j = 0; j < V.length - 1; j++) {
        const g = 7, u0 = U[i].o + g, u1 = U[i + 1].o - g, v0 = V[j].o + g, v1 = V[j + 1].o - g; if (u1 - u0 < 20 || v1 - v0 < 20) continue;
        const c = S((u0 + u1) / 2, (v0 + v1) / 2); if (c[0] < -150 || c[0] > W + 150 || c[1] < -150 || c[1] > H + 150) continue;
        if (rnd() < .1) { quad(u0, v0, u1, v1, th.park); quad(u0 + 8, v0 + 8, u1 - 8, v1 - 8, th.park2); continue; }
        quad(u0, v0, u1, v1, th.block);
        for (let u = u0 + 2; u < u1 - 10; u += 14 + rnd() * 16) { const w = 10 + rnd() * 12, d = 12 + rnd() * 10; if (u + w > u1 - 2) break;
          house(u, v0 + 2, u + w, v0 + 2 + d); house(u, v1 - 2 - d, u + w, v1 - 2); }
        for (let v = v0 + 26; v < v1 - 30; v += 16 + rnd() * 14) { const h = 10 + rnd() * 10, d = 12 + rnd() * 8;
          house(u0 + 2, v, u0 + 2 + d, v + h); house(u1 - 2 - d, v, u1 - 2, v + h); }
      }
      /* река поверх кварталов: плавная кривая, мосты — там, где её пересекают улицы */
      /* река — после дорог, см. ниже */
      /* дороги: обводка, потом заливка — магистрали шире */
      const seg = (l, fam) => fam === 'U' ? [S(l.o, -R), S(l.o, R)] : [S(-R, l.o), S(R, l.o)];
      [['U', U], ['V', V]].forEach(([f, arr]) => arr.forEach(l => { const [p0, p1] = seg(l, f); b.strokeStyle = l.major ? th.majorCasing : th.casing; b.lineWidth = l.major ? 12 : 7; b.beginPath(); b.moveTo(...p0); b.lineTo(...p1); b.stroke(); }));
      [['U', U], ['V', V]].forEach(([f, arr]) => arr.forEach(l => { const [p0, p1] = seg(l, f); b.strokeStyle = th.road; b.lineWidth = l.major ? 10 : 5; b.beginPath(); b.moveTo(...p0); b.lineTo(...p1); b.stroke(); })); /* река поверх улиц; магистрали — мосты поверх реки */ b.save(); b.lineCap = 'butt'; b.beginPath(); b.moveTo(-80, H * .2); b.bezierCurveTo(W * .3, H * .55, W * .62, H * .02, W + 80, H * .34); b.strokeStyle = th.water; b.lineWidth = 54; b.stroke(); b.restore(); [['U', U], ['V', V]].forEach(([f, arr]) => arr.forEach(l => { if (!l.major) return; const [p0, p1] = seg(l, f); b.strokeStyle = th.majorCasing; b.lineWidth = 13; b.beginPath(); b.moveTo(...p0); b.lineTo(...p1); b.stroke(); b.strokeStyle = th.road; b.lineWidth = 10; b.beginPath(); b.moveTo(...p0); b.lineTo(...p1); b.stroke(); }));
      /* POI — кружки рубрик, как значки мест на картах */
      for (let k = 0; k < 16; k++) { const i = 1 + ((rnd() * (U.length - 3)) | 0), j = 1 + ((rnd() * (V.length - 3)) | 0), du = (U[i + 1].o - U[i].o) * (.25 + rnd() * .5), dv = (V[j + 1].o - V[j].o) * (.25 + rnd() * .5);
        const [x, y] = S(U[i].o + du, V[j].o + dv); if (x < 20 || x > W - 20 || y < 20 || y > H - 20) continue; if (wet(x, y, 8)) continue;
        b.fillStyle = '#fff'; b.beginPath(); b.arc(x, y, 6.5, 0, 7); b.fill(); b.fillStyle = th.poi[k % th.poi.length]; b.beginPath(); b.arc(x, y, 5, 0, 7); b.fill(); }
      cars = Array.from({ length: Math.round(W / 14) }, () => newCar()); pins = []; route = null;
    };
    const newCar = () => { const fam = rnd() < .5 ? 'U' : 'V', arr = fam === 'U' ? U : V, l = arr[(rnd() * arr.length) | 0];
      return { fam, l, t: -R + rnd() * 2 * R, v: (l.major ? 70 : 38) * (rnd() < .5 ? -1 : 1) * (.7 + rnd() * .6), side: rnd() < .5 ? -1 : 1, warm: rnd() < .35 }; };
    let R = 1000;
    const visible = ([x, y], m = 0) => x > m && x < W - m && y > m && y < H - m;
    /* узел сетки в видимой зоне (выше карточки подвала) */
    const node = () => { for (let k = 0; k < 60; k++) { const i = (rnd() * U.length) | 0, j = (rnd() * V.length) | 0, p = S(U[i].o, V[j].o);
      if (!wet(p[0], p[1], 10) && p[0] > W * .06 && p[0] < W * .94 && p[1] > H * .07 && p[1] < H * .42) return [i, j]; } return null; };
    /* маршрут «лесенкой», как на обложке: от точки «вы здесь» к метке бизнеса, поочерёдно по улицам двух направлений, 4 поворота */
    const NAMES = ['Ваш автосервис', 'Ваша клиника', 'Ваша кофейня', 'Ваш салон'];
    let nameK = 0;
    const newRoute = () => {
      for (let k = 0; k < 40; k++) { const a = node(), z = node(); if (!a || !z) continue;
        const di = z[0] - a[0], dj = z[1] - a[1]; if (Math.abs(di) < 2 || Math.abs(dj) < 2) continue;
        const ia = a[0] + Math.round(di * (.3 + rnd() * .4)), jb = a[1] + Math.round(dj * (.3 + rnd() * .4));
        const steps = [[a[0], a[1]], [a[0], jb], [ia, jb], [ia, z[1]], [z[0], z[1]]];   /* вдоль u, вдоль v, вдоль u, вдоль v */
        const P = steps.map(([i, j]) => S(U[i].o, V[j].o)).filter((q, n, arr) => !n || Math.hypot(q[0] - arr[n - 1][0], q[1] - arr[n - 1][1]) > 1);
        const dry = st => st.slice(1).every(([i, j], n) => { const [pi, pj] = st[n], l = pi === i ? U[i] : V[j]; if (l.major) return true; const a = S(U[pi].o, V[pj].o), z2 = S(U[i].o, V[j].o); for (let s = 0; s <= 24; s++) { if (wet(a[0] + (z2[0] - a[0]) * s / 24, a[1] + (z2[1] - a[1]) * s / 24, 4)) return false; } return true; }); if (P.length >= 4 && P.every(q => visible(q, 24)) && dry(steps)) { route = { pts: P, t: 0, name: NAMES[nameK++ % NAMES.length] }; return; } }
      route = null; };
    /* метка: круг радиуса r на высоте L над остриём, бока — касательные из острия (ровная геометрия, без «капли» на кривых) */
    const pinPath = (L, r) => { const t = Math.acos(r / L); cx.beginPath(); cx.moveTo(0, 0); cx.arc(0, -L, r, Math.PI / 2 + t, Math.PI / 2 - t + Math.PI * 2); cx.closePath(); };
    const frame = now => {
      if (!vis) return; raf = requestAnimationFrame(frame); if (now - last < 32) return; const dt = Math.min(.05, (now - last) / 1000); last = now;
      cx.setTransform(1, 0, 0, 1, 0, 0); cx.drawImage(base, 0, 0); cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      /* машины: по своей полосе (сдвиг от оси дороги), со шлейфом */
      cars.forEach(c => { c.t += c.v * dt * (reduce ? 0 : 1); if (Math.abs(c.t) > R) Object.assign(c, newCar()); const off = c.side * (c.l.major ? 2.5 : 1.2);
        const [x, y] = c.fam === 'U' ? S(c.l.o + off, c.t) : S(c.t, c.l.o + off); if (!visible([x, y], -10)) return; if (!c.l.major && wet(x, y, 3)) return;
        const dir = c.fam === 'U' ? [-sa, ca] : [ca, sa], tl = (c.l.major ? 14 : 8) * Math.sign(c.v);
        const g = cx.createLinearGradient(x, y, x - dir[0] * tl, y - dir[1] * tl), col = th.car[c.warm ? 1 : 0]; g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
        cx.strokeStyle = g; cx.lineWidth = c.l.major ? 2.2 : 1.5; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x - dir[0] * tl, y - dir[1] * tl); cx.stroke(); });
      /* маршрут: синяя линия рисуется от точки «вы здесь», в конце — оранжевая метка с подписью */
      if (!route) newRoute();
      if (route) { route.t += dt / 5;
        const P = route.pts, lens = P.slice(1).map((q, k) => Math.hypot(q[0] - P[k][0], q[1] - P[k][1])), tot = lens.reduce((x, y) => x + y, 0);
        const prog = Math.min(1, route.t / .45) * tot, fade = route.t > .88 ? Math.max(0, 1 - (route.t - .88) / .12) : 1, BLUE = '#3d7cf0';
        cx.save(); cx.globalAlpha = fade; cx.lineCap = 'round'; cx.lineJoin = 'round';
        cx.strokeStyle = BLUE; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(...P[0]); let left = prog, head = P[0];
        for (let k = 1; k < P.length && left > 0; k++) { const f = Math.min(1, left / lens[k - 1]); head = [P[k - 1][0] + (P[k][0] - P[k - 1][0]) * f, P[k - 1][1] + (P[k][1] - P[k - 1][1]) * f]; cx.lineTo(...head); left -= lens[k - 1]; }
        cx.stroke();
        /* «вы здесь» — синяя точка с белым кольцом и ореолом */
        cx.fillStyle = 'rgba(61,124,240,.16)'; cx.beginPath(); cx.arc(...P[0], 13, 0, 7); cx.fill();
        cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(...P[0], 7.5, 0, 7); cx.fill(); cx.fillStyle = BLUE; cx.beginPath(); cx.arc(...P[0], 5.5, 0, 7); cx.fill();
        if (route.t > .45) { const k = Math.min(1, (route.t - .45) / .06), e = 1 - Math.pow(1 - k, 3), [x, y] = P[P.length - 1];
          cx.save(); cx.translate(x, y - 3); cx.scale(e, e);
          cx.shadowColor = 'rgba(255,100,20,.4)'; cx.shadowBlur = 14; cx.shadowOffsetY = 2; cx.fillStyle = '#ff6414'; pinPath(31, 13.5); cx.fill();
          cx.shadowColor = 'transparent'; cx.strokeStyle = '#fff'; cx.lineWidth = 2.5; cx.lineJoin = 'round'; cx.stroke();
          cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(0, -31, 5.2, 0, 7); cx.fill(); cx.restore();
          /* подпись — тёмная плашка справа от метки, по центру её головки */
          const ta = Math.min(1, Math.max(0, (route.t - .5) / .06)); if (ta > 0) { cx.globalAlpha = fade * ta; cx.font = '600 14px ' + ((getComputedStyle(document.body).getPropertyValue('--f-body') || '').trim() || 'sans-serif'); cx.letterSpacing = '0px';
            const tw = cx.measureText(route.name).width, bw = tw + 28, bh = 32, bx = x + 22, by = y - 3 - 31 - bh / 2;
            cx.fillStyle = '#1c1f24'; cx.beginPath(); cx.roundRect(bx, by, bw, bh, 9); cx.fill(); cx.fillStyle = '#fff'; cx.textBaseline = 'middle'; cx.fillText(route.name, bx + 14, by + bh / 2 + 1); } }
        cx.restore(); if (route.t > 1) route = null; }
      /* метки конкурентов — на перекрёстках */
      if (rnd() < dt * .8 && pins.length < 6) { const n = node(); if (n) { const i = n[0], j = n[1], du = (U[Math.min(i + 1, U.length - 1)].o - U[i].o) * .5, dv = (V[Math.min(j + 1, V.length - 1)].o - V[j].o) * .5; const q0 = S(U[i].o + du, V[j].o + 8); if (!wet(q0[0], q0[1], 14)) pins.push({ p: q0, t: 0 }); } }
      pins = pins.filter(q => (q.t += dt / 6) < 1); pins.forEach(q => { const a = q.t < .12 ? q.t / .12 : q.t > .85 ? (1 - q.t) / .15 : 1, [x, y] = q.p;
        cx.save(); cx.globalAlpha = a; cx.translate(x, y - 1); cx.fillStyle = th.pin; cx.strokeStyle = th === MAPPAL.ya ? '#fff' : 'rgba(255,255,255,.7)'; cx.lineWidth = 2.5;
        pinPath(20, 8.5); cx.fill(); cx.lineJoin = 'round'; cx.stroke();
        cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(0, -20, 3.2, 0, 7); cx.fill(); cx.restore(); });
    };
    const rebuild = () => { R = Math.hypot(W || 1440, H || 900) / 2 + 80; build(); R = Math.hypot(W, H) / 2 + 80; if (reduce || !vis) { const v = vis; vis = true; last = 0; frame(performance.now() + 100); cancelAnimationFrame(raf); vis = v; } };
    window.__finMapTheme = t => { mapTheme = t; A.dataset.map = t; rebuild(); };
    new ResizeObserver(rebuild).observe(A);
    new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting && !A.hidden; cancelAnimationFrame(raf); if (vis) { last = 0; raf = requestAnimationFrame(frame); } }), { threshold: 0 }).observe(A);
  })();

  /* --- чертёж: логотип лежит на «листе» в аксонометрии, выдавлен вверх; рёбра — в углах и на силуэтах кривых --- */
  let drawn = false;
  function drawBlueprint() {
    if (drawn) return; drawn = true;
    const svg = B.querySelector('.finb__svg'), NS = 'http://www.w3.org/2000/svg';
    const ex = [0.92, 0.36], ey = [-0.5, 0.62], ez = [0, -1], Z = 38;    /* оси: x логотипа — вправо-вниз, y — к зрителю, z — вверх */
    const P = (x, y, z = 0) => [x * ex[0] + y * ey[0] + z * ez[0], x * ex[1] + y * ey[1] + z * ez[1]];
    const tmp = document.createElementNS(NS, 'svg'); tmp.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden'; document.body.append(tmp);
    const subs = L.flatMap(([d, c]) => d.split(/(?=M)/).map(s => [s.trim(), c])).filter(([s]) => s);
    let bot = '', top = '', edges = [], minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
    const ext = ([x, y]) => { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); };
    subs.forEach(([d, c]) => {
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); tmp.append(p); const len = p.getTotalLength(), n = Math.max(24, Math.ceil(len / 1.5)), pts = [];
      for (let k = 0; k <= n; k++) { const q = p.getPointAtLength(len * k / n); pts.push([q.x, q.y]); }
      const fmt = (z) => 'M' + pts.map(([x, y]) => P(x, y, z).map(v => v.toFixed(1)).join(' ')).join('L') + 'Z';
      bot += fmt(0); top += fmt(Z); pts.forEach(q => { ext(P(...q, 0)); ext(P(...q, Z)); });
      /* рёбра: острые углы контура и точки, где проекция касательной разворачивается по горизонтали (силуэт) */
      for (let k = 1; k < pts.length - 1; k++) { const a = pts[k - 1], b = pts[k], e = pts[k + 1];
        const v1 = [b[0] - a[0], b[1] - a[1]], v2 = [e[0] - b[0], e[1] - b[1]], l1 = Math.hypot(...v1), l2 = Math.hypot(...v2); if (!l1 || !l2) continue;
        const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (l1 * l2);
        const s1 = P(...b)[0] - P(...a)[0], s2 = P(...e)[0] - P(...b)[0];
        if (cos < .7 || (s1 * s2 < 0)) { const last = edges[edges.length - 1]; if (last && Math.hypot(last[0] - b[0], last[1] - b[1]) < 4) continue; edges.push([b[0], b[1], c]); } }
      p.remove();
    });
    tmp.remove();
    const pad = 70; const vb = [minx - pad, miny - pad - 30, maxx - minx + pad * 2, maxy - miny + pad * 2 + 40];
    svg.setAttribute('viewBox', vb.map(v => v.toFixed(0)).join(' ')); unit(svg, vb[2]);
    /* сетка листа под логотипом в той же аксонометрии */
    let grid = ''; for (let x = -40; x <= 500; x += 20) grid += `M${P(x, -30).join(' ')}L${P(x, 130).join(' ')}`; for (let y = -30; y <= 130; y += 20) grid += `M${P(-40, y).join(' ')}L${P(500, y).join(' ')}`;
    const L2 = (a, b, cls, extra = '') => `<path class="${cls}" pathLength="1" d="M${a.map(v => v.toFixed(1)).join(' ')}L${b.map(v => v.toFixed(1)).join(' ')}" ${extra}/>`;
    /* размерные линии: ширина 456 вдоль x, высота знака 90 вдоль y, высота выдавливания */
    const dA = P(0, 108), dB = P(456, 108), hA = P(-22, 0), hB = P(-22, 90);
    const tick = (q, ax) => L2([q[0] - ax[0] * 6, q[1] - ax[1] * 6], [q[0] + ax[0] * 6, q[1] + ax[1] * 6], 'dim');
    const mid = (a, b, dx, dy) => [(a[0] + b[0]) / 2 + dx, (a[1] + b[1]) / 2 + dy];
    const tA = mid(dA, dB, 0, 18), tH = mid(hA, hB, -34, 4), zA = P(456, 0), zB = P(456, 0, Z);
    svg.innerHTML = `<path d="${grid}" stroke="#fff" stroke-width=".5" opacity=".14" fill="none" vector-effect="non-scaling-stroke"/>
      <path class="bot" d="${bot}"/>
      ${edges.map(([x, y, c], i) => L2(P(x, y, 0), P(x, y, Z), 'edge' + (c === '#2878EE' ? ' acc' : ''), `style="--i:${i}"`)).join('')}
      <path class="top" pathLength="1" d="${top}"/>
      ${L2(dA, dB, 'dim')}${tick(dA, ey)}${tick(dB, ey)}${L2(hA, hB, 'dim')}${tick(hA, ex)}${tick(hB, ex)}${L2([zA[0] + 16, zA[1]], [zB[0] + 16, zB[1]], 'dim')}
      <text x="${tA[0].toFixed(0)}" y="${tA[1].toFixed(0)}" text-anchor="middle" transform="rotate(${(Math.atan2(ex[1], ex[0]) * 180 / Math.PI).toFixed(1)} ${tA[0].toFixed(0)} ${tA[1].toFixed(0)})">456</text>
      <text x="${tH[0].toFixed(0)}" y="${tH[1].toFixed(0)}" text-anchor="middle">90</text>
      <text x="${(zA[0] + 24).toFixed(0)}" y="${((zA[1] + zB[1]) / 2).toFixed(0)}">H 38</text>
      <text x="${vb[0] + 24}" y="${vb[1] + 34}">OUTLINE · ЛОГОТИП · М 1:1</text>
      <text x="${vb[0] + 24}" y="${vb[1] + 52}" opacity=".6">ЛИСТ 01 / 01 · ГЕОМАРКЕТИНГ</text>`;
    new IntersectionObserver((es, io) => es.forEach(e => { if (e.isIntersecting) { B.classList.add('is-in'); io.disconnect(); } }), { threshold: .25 }).observe(svg);
  }
  /* карточка подвала в чертеже: выезжает повёрнутой и выпрямляется по ходу прокрутки (как у illoca) */
  const bc = B.querySelector('.finb__card'), stage = B.querySelector('.finb__stage');
  const tilt = () => { if (B.hidden || reduce) return; const top = stage.getBoundingClientRect().bottom - 96, k = Math.min(1, Math.max(0, (innerHeight - top) / Math.max(1, bc.offsetHeight * .9)));
    const e = 1 - Math.pow(1 - k, 3); bc.style.setProperty('--rot', (-8 * (1 - e)).toFixed(2) + 'deg'); bc.style.setProperty('--ty', (140 * (1 - e)).toFixed(1) + 'px'); };
  addEventListener('scroll', () => requestAnimationFrame(tilt), { passive: true }); addEventListener('resize', tilt);
})();
