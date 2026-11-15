
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EO = 'cubic-bezier(0.23, 1, 0.32, 1)';   // --ease-out из motion.md

  /* плавная прокрутка — Lenis, как у humble; без reduce-motion */
  if (!reduce && window.Lenis) {
    const lenis = new Lenis({ lerp: .1, wheelMultiplier: 1, anchors: { offset: -80 } });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    window.__lenis = lenis;
  }

  /* разбить заголовок на слова; акцент, иконки и картинки — целыми */
  const split = el => {
    if (el.dataset.split) return [...el.querySelectorAll('.rw')];
    const walk = node => [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 3) {
        const f = document.createDocumentFragment();
        ch.textContent.split(/([ \n\t]+)/).forEach(p => { if (!p) return; if (/^[ \n\t]+$/.test(p)) f.append(p); else { const s = document.createElement('span'); s.className = 'rw'; s.textContent = p; f.append(s); } });
        ch.replaceWith(f);
      } else if (ch.nodeType === 1 && ch.tagName !== 'BR') {
        if (ch.matches('.word-accent, .platforms, em, svg, img')) ch.classList.add('rw'); else walk(ch);
      }
    });
    walk(el); el.dataset.split = 1; return [...el.querySelectorAll('.rw')];
  };
  const show = (el, delay = 0, f = false) => {
    if (reduce) { el.classList.remove('rv-x', 'rv-f'); el.style.opacity = 1; el.style.visibility = 'visible'; return; }
    el.classList.add('rv-x'); if (f) el.classList.add('rv-f'); el.style.opacity = ''; el.style.visibility = 'visible'; void el.offsetWidth;
    el.style.transitionDelay = delay + 'ms'; el.classList.add('rv-on');
    clearTimeout(el.__rvT); el.__rvT = setTimeout(() => { el.classList.remove('rv-x', 'rv-f', 'rv-on'); el.style.transitionDelay = ''; el.style.opacity = 1; }, delay + 800);
  };
  const words = (el, delay = 0) => { split(el); show(el, delay); };
  const rise = (els, delay = 0) => els.forEach((el, i) => show(el, delay + i * 60));
  const fade = (el, delay = 0) => show(el, delay, true);

  /* обложка — сразу */
  const h1 = document.querySelector('.hero .h1'); if (h1) split(h1);   // появление — CSS .rise; скрипт только делит на слова для смены заголовка
  window.__rewordH1 = () => { if (!h1) return; delete h1.dataset.split; words(h1, 0); };

  /* остальное — при появлении, один раз */
  const groups = [
    ['.clients__title', el => words(el)], ['.clients__press', el => rise([el])],
    ['.svc3__title', el => words(el)], ['.svc3__lead', el => rise([el], 250)], ['.svc3__grid', el => { fade(el, 350); rise([...el.querySelectorAll('.sv h3, .sv p')], 350); }], ['.svc3__stage', el => rise([el], 200)], ['.svc3__pf', el => rise([el], 450)],
    ['.nw__title', el => words(el)], ['.nw__lead', el => rise([el], 250)], ['.nw-two', el => rise([...el.querySelectorAll('.nw-card')], 150)],
    ['.nw-sub h3', el => words(el)], ['.lt__title', el => words(el)], ['.lt__lead', el => rise([el], 250)], ['.panels6', el => rise([...el.children], 100)], ['.nw-niches', el => rise([...el.querySelectorAll('.nc')], 100)], ['.nw-cta', el => rise([el])],
  ];
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); e.target.__rv(e.target); }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  const pre = { '.svc3__grid': '.sv h3, .sv p', '.nw-two': '.nw-card', '.panels6': ':scope > *', '.nw-niches': '.nc' };
  if (!reduce) groups.forEach(([sel]) => document.querySelectorAll(sel).forEach(el => { (pre[sel] ? el.querySelectorAll(pre[sel]) : [el]).forEach(x => x.classList.add('rv-x')); if (sel === '.svc3__grid') el.classList.add('rv-x', 'rv-f'); }));
  groups.forEach(([sel, fn]) => document.querySelectorAll(sel).forEach(el => { el.__rv = fn; io.observe(el); }));

  /* переключатели оформления */
  const B = document.body;
  const setter = (attr, def) => { const bs = [...document.querySelectorAll(`.vsw [data-${attr}]`)];
    const set = v => { B.dataset[attr] = v; bs.forEach(b => b.setAttribute('aria-pressed', b.dataset[attr] === v)); };
    bs.forEach(b => b.addEventListener('click', () => set(b.dataset[attr]))); set(def); };
  // выбор Никиты 28.10.2026: полоса без прозрачности, Wix Madefor Display, Caveat, фон #FAFAFA
  Object.assign(B.dataset, { hdr: 'bar', glass: '0', hf: 'c', af: 'c', bg: 'b' });
  // выбор Никиты: узор — сетка, телефон — капсула с номером, заголовок — текущий
  Object.assign(B.dataset, { pat: 'none', ph: 'pill', tg: 'none' });   // 29.10, отзыв клиента «глаза разбегаются»: без фона улиц и без тега на обложке
})();
