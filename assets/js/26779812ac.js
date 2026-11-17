
(() => {
  /* меню шапки: панели «Услуги» и «Кому помогаем», лист на телефоне */
  const hdr = document.querySelector('.hdr'), nav = hdr && hdr.querySelector('.plate__nav');
  if (!nav) return;
  const logo = hdr.querySelector('.plate__logo'), base = (h => /^(\.\.\/)+$/.test(h) ? h : '')((logo && logo.getAttribute('href')) || '');   // ../ или ../../ (статьи блога)
  const here = location.pathname.replace(/\/index\.html$/, '/');
  const PF = { ya: '/Outline/assets/img/9b02ef72cb.webp', gis: '/Outline/assets/img/c2bed05462.webp', g: '/Outline/assets/img/d816192b91.webp' };
  const svc = [
    { k: 'ya', t: 'Яндекс Карты', d: 'Карточки, отзывы, реклама, аналитика', href: base + 'prodvizhenie-na-yandex-kartah/' },
    { k: 'gis', t: '2ГИС', d: 'Карточка, контент, репутация', href: base + 'prodvizhenie-v-2gis/' },
    { k: 'g', t: 'Google Maps', d: 'Профиль компании и отзывы', href: base + 'prodvizhenie-v-google-maps/' },
  ];
  /* иконки ниш — те же, что в плитках «Выберите направление» на главной (src/b04-network.html) */
  const niches = [["<svg class=\"mn-ico\" aria-hidden=\"true\" style=\"--n:0\" viewBox=\"0 0 48 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g class=\"ia a-tooth\"><path d=\"M24 12c-4-3.5-12-4-14 2-2 6 2 10 3 16 1 5 2 10 5 10 3 0 3-8 6-8s3 8 6 8c3 0 4-5 5-10 1-6 5-10 3-16-2-6-10-5.5-14-2Z\"/></g><path class=\"ia a-spark\" d=\"M40 6v6M37 9h6\" stroke-width=\"2.2\"/></svg>", "Стоматологии и медцентры", "127 178 255", "стоматология рядом"], ["<svg class=\"mn-ico\" aria-hidden=\"true\" style=\"--n:1\" viewBox=\"0 0 48 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"ia a-speed\" d=\"M1 22h5M2 27h4\" stroke-width=\"2\"/><g class=\"ia a-car\"><path d=\"M8 31v-6l5-2 5-7h14l6 7 5 2v6h-3\"/><path d=\"M17 31h14\"/></g><g class=\"ia a-wheel w1\" style=\"transform-origin:13px 32px\"><circle cx=\"13\" cy=\"32\" r=\"4\"/><path d=\"M13 29v6\" stroke-width=\"1.6\"/></g><g class=\"ia a-wheel w2\" style=\"transform-origin:35px 32px\"><circle cx=\"35\" cy=\"32\" r=\"4\"/><path d=\"M35 29v6\" stroke-width=\"1.6\"/></g></svg>", "Автосервисы и СТО", "163 184 214", "шиномонтаж рядом"], ["<svg class=\"mn-ico\" aria-hidden=\"true\" style=\"--n:2\" viewBox=\"0 0 48 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"ia a-steam\" d=\"M17 13c-2-2 2-3 0-6\"/><path class=\"ia a-steam\" d=\"M24 13c-2-2 2-3 0-6\"/><path d=\"M8 18h26v10a10 10 0 0 1-10 10h-6A10 10 0 0 1 8 28V18Z\"/><path d=\"M34 21h3a5 5 0 0 1 0 10h-4M6 42h30\"/></svg>", "Рестораны, кафе и кофейни", "255 170 110", "кофейня рядом"], ["<svg class=\"mn-ico\" aria-hidden=\"true\" style=\"--n:3\" viewBox=\"0 0 48 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g class=\"ia a-blade1\"><circle cx=\"11\" cy=\"14\" r=\"5\"/><path d=\"M15.5 16.5 40 34\"/></g><g class=\"ia a-blade2\"><circle cx=\"11\" cy=\"34\" r=\"5\"/><path d=\"M15.5 31.5 40 14\"/></g></svg>", "Салоны красоты", "255 150 195", "маникюр рядом"], ["<svg class=\"mn-ico\" aria-hidden=\"true\" style=\"--n:4\" viewBox=\"0 0 48 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle class=\"ia a-bub\" cx=\"30\" cy=\"18\" r=\"1.8\" stroke-width=\"1.6\"/><path d=\"M6 24h36v4a10 10 0 0 1-10 10H16A10 10 0 0 1 6 28v-4ZM12 38l-2 4M36 38l2 4M12 24V10a4 4 0 0 1 8 0\"/><path class=\"ia a-water\" d=\"M10 30c3 2 6 2 9 0s6-2 9 0 6 2 9 0\" stroke-width=\"1.8\"/></svg>", "Бани и банные комплексы", "111 211 199", "баня с бассейном"], ["<svg class=\"mn-ico\" aria-hidden=\"true\" style=\"--n:5\" viewBox=\"0 0 48 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 14v26M6 32h36v8M6 26h36v6M14 22a3.5 3.5 0 1 0 0-.1M22 26v-5h14a6 6 0 0 1 6 6\"/><path class=\"ia a-z\" d=\"M32 6h6l-6 6h6\" stroke-width=\"2\"/></svg>", "Отели и гостиницы", "184 163 255", "отель в центре"], ["<svg class=\"mn-ico\" aria-hidden=\"true\" style=\"--n:6\" viewBox=\"0 0 48 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"6\" y=\"28\" width=\"14\" height=\"14\" rx=\"2.5\"/><rect x=\"24\" y=\"28\" width=\"14\" height=\"14\" rx=\"2.5\"/><g class=\"ia a-block\"><rect x=\"15\" y=\"11\" width=\"14\" height=\"14\" rx=\"2.5\"/></g></svg>", "Детские центры", "255 211 107", "детский центр рядом"], ["<svg class=\"mn-ico\" aria-hidden=\"true\" style=\"--n:7\" viewBox=\"0 0 48 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle class=\"ia a-aura\" cx=\"24\" cy=\"24\" r=\"17\" stroke-width=\"1.4\" stroke-dasharray=\"2 4\"/><g class=\"ia a-yogi\"><circle cx=\"24\" cy=\"10\" r=\"4\"/><path d=\"M24 16v12M10 22l14 6 14-6M14 40l10-12 10 12M8 40h32\"/></g></svg>", "Студии йоги", "155 224 127", "йога рядом"]];   /* [иконка, ниша, цвет плитки, запрос] — как плитки «Выберите направление» на главной */
  const isCur = h => h.indexOf('prodvizhenie-') >= 0 && here.indexOf(h.replace(/^\.\.\//, '')) >= 0;
  const svcHTML = svc.map(s => `<a class="mn-it" href="${s.href}"${isCur(s.href) ? ' aria-current="page"' : ''}>${PF[s.k] ? `<img loading="lazy" decoding="async" src="${PF[s.k]}" alt="">` : ''}<span><b>${s.t}</b><small>${s.d}</small></span>${s.soon ? '<span class="mn-soon">скоро</span>' : ''}</a>`).join('');
  const NURL = {"Стоматологии и медцентры": "prodvizhenie-medcentra-na-kartah", "Автосервисы и СТО": "prodvizhenie-sto-na-kartah", "Рестораны, кафе и кофейни": "prodvizhenie-restorana-na-kartah", "Салоны красоты": "prodvizhenie-salona-krasoty-na-kartah", "Бани и банные комплексы": "prodvizhenie-bani-na-kartah", "Отели и гостиницы": "prodvizhenie-otelya-na-kartah", "Детские центры": "prodvizhenie-detskogo-centra-na-kartah", "Студии йоги": "prodvizhenie-yogi-na-kartah"};
  const SRCH = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></g></svg>';
  const nicheHTML = niches.map(([e, t, c, q]) => { const h = base + NURL[t] + '/'; return `<a class="mn-it mn-it--n" style="--t:${c}" href="${h}"${isCur(h) ? ' aria-current="page"' : ''}><i aria-hidden="true">${e}</i><span><b>${t}</b><small class="mn-q">${SRCH}${q}</small></span></a>`; }).join('');
  const links = [...nav.querySelectorAll('a.dd')];
  const panels = [];
  const mk = (a, html, cols) => { const p = document.createElement('div'); p.className = 'mn-dd' + (cols ? ' mn-dd--cols' : ''); p.innerHTML = html; p.setAttribute('role', 'menu'); document.body.append(p); panels.push([a, p]); return p; };
  if (links[0]) mk(links[0], svcHTML, false);
  if (links[1]) mk(links[1], nicheHTML, true);
  let t = 0;
  const place = (a, p) => { const r = a.getBoundingClientRect(), c = r.left + r.width / 2, w = p.offsetWidth || 360, x = Math.min(innerWidth - w / 2 - 12, Math.max(w / 2 + 12, c)); p.style.left = x + 'px'; p.style.top = (r.bottom + 12) + 'px'; p.style.setProperty('--ax', (c - x) + 'px'); };
  const close = () => panels.forEach(([a, p]) => { p.classList.remove('is-open'); a.classList.remove('is-open'); a.setAttribute('aria-expanded', 'false'); });
  const open = (a, p) => { clearTimeout(t); close(); place(a, p); p.classList.add('is-open'); a.classList.add('is-open'); a.setAttribute('aria-expanded', 'true'); };
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  panels.forEach(([a, p]) => {
    a.setAttribute('aria-haspopup', 'true'); a.setAttribute('aria-expanded', 'false');
    /* 15.11 (Никита): клик только открывает меню — на десктопе после наведения не закрывает его (раньше закрывал), на телефоне — переключает */
    a.addEventListener('click', e => { e.preventDefault(); if (fine) open(a, p); else p.classList.contains('is-open') ? close() : open(a, p); });
    if (fine) {
      a.addEventListener('pointerenter', () => open(a, p));
      [a, p].forEach(el => el.addEventListener('pointerleave', () => { t = setTimeout(close, 160); }));
      p.addEventListener('pointerenter', () => clearTimeout(t));
    }
    p.querySelectorAll('a').forEach(x => x.addEventListener('click', close));
  });
  document.addEventListener('click', e => { if (!e.target.closest('.mn-dd, .plate__nav a.dd')) close(); });
  addEventListener('scroll', close, { passive: true }); addEventListener('resize', close);

  /* телефон: бургер открывает лист */
  const burger = hdr.querySelector('.nav-toggle');
  if (burger) {
    const sh = document.createElement('div'); sh.className = 'mn-sheet'; sh.id = 'mn-sheet'; sh.inert = true;
    sh.innerHTML = `<h4>Услуги</h4><div class="mn-plate">${svcHTML}</div><h4>Кому помогаем</h4><div class="mn-grid mn-plate">${nicheHTML}</div><hr><div class="mn-main"><a href="${base}tarify/">Тарифы</a><a href="${base}cases/">Кейсы</a><a href="${base}blog/">Блог</a><a href="${base}contacts/">Контакты</a></div><a class="mn-cta" href="#razbor">Получить бесплатный разбор</a>`;
    document.body.append(sh);
    const set = v => { sh.classList.toggle('is-open', v); sh.inert = !v; burger.setAttribute('aria-expanded', String(v)); document.documentElement.classList.toggle('mn-lock', v); };
    burger.setAttribute('aria-controls', 'mn-sheet');
    burger.addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); set(!sh.classList.contains('is-open')); }, true);
    sh.querySelectorAll('a').forEach(x => x.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); close(); } });
  }
})();
