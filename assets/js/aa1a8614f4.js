
(() => {
  const sec = document.getElementById('uslugi');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { sec.classList.add('is-in'); io.disconnect(); } }), { threshold: .05 });
  io.observe(sec);
  // Б: блок закреплён, активная услуга — по прогрессу прокрутки секции
  const cards = [...sec.querySelectorAll('.sv')], N = cards.length, num = document.getElementById('svc3-n');
  const pinned = () => getComputedStyle(sec.querySelector('.svc3__in')).position === 'sticky';
  let act = -1;
  const fmt = (v, dec) => dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('ru-RU').replace(/\u00a0/g, '\u2009');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runCounters = card => card.querySelectorAll('[data-to]').forEach(el => {
    const from = +el.dataset.from, to = +el.dataset.to, dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '', d = +(el.dataset.d || 0) * 1000, dur = +(el.dataset.dur || 1) * 1000;
    cancelAnimationFrame(el._raf); el.textContent = fmt(reduce ? to : from, dec) + suf; if (reduce) return;
    const t0 = performance.now() + d;
    const step = now => { const k = Math.min(1, Math.max(0, (now - t0) / dur)), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * e, dec) + suf; if (k < 1) el._raf = requestAnimationFrame(step); };
    el._raf = requestAnimationFrame(step);
  });
  const activate = i => { if (i === act) return; act = i; cards.forEach((c, k) => c.classList.toggle('is-act', k === i)); num.textContent = String(i + 1).padStart(2, '0'); sec.querySelectorAll('.svc3__seg i').forEach((x, k) => x.classList.toggle('on', k <= i)); runCounters(cards[i]); };
  const onScroll = () => {
    if (!pinned()) { if (!matchMedia('(max-width: 760px)').matches) activate(Math.max(act, 0)); return; }   // 10.11: на телефоне пункты — выпадающие, сами не открываются
    const total = sec.offsetHeight - innerHeight, prog = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / total));
    const f = prog * N, i = Math.min(N - 1, Math.floor(f));
    activate(i); cards[i].style.setProperty('--p', Math.min(1, f - i).toFixed(3)); sec.querySelector('.svc3__grid').style.setProperty('--gp', prog.toFixed(4));
  };
  cards.forEach((c, i) => c.addEventListener('click', () => {
    if (!pinned()) {
      if (matchMedia('(max-width: 760px)').matches && i === act) { act = -1; c.classList.remove('is-act'); return; }   // повторное нажатие — закрыть
      activate(i); return; }
    const total = sec.offsetHeight - innerHeight;
    scrollTo({ top: sec.getBoundingClientRect().top + scrollY + total * (i + .5) / N, behavior: 'smooth' });
  }));
  // иллюстрация целиком в окне: масштаб по свободной высоте и ширине
  // иллюстрация центрируется в части окна над плашками «Загрузили…» (они снизу) и масштабируется по ней — не наезжает на плашки и не оставляет пустоту сверху
  const fit = () => cards.forEach(c => { const pic = c.querySelector('.sv__pic'), x = pic && pic.querySelector('.xw'); if (!x) return;
    x.style.setProperty('--fit', 1); if (!pinned()) { pic.style.paddingBottom = ''; return; }
    const ob = pic.querySelector('.obs'), reserve = ob ? ob.offsetHeight + 32 : 16; pic.style.paddingBottom = reserve + 'px';
    const availH = pic.clientHeight - parseFloat(getComputedStyle(pic).paddingTop) - reserve - 8, availW = pic.clientWidth - 48;
    const k = Math.min(1.3, availH / x.offsetHeight, availW / x.offsetWidth); x.style.setProperty('--fit', Math.max(.6, k).toFixed(3)); });
  // закреплённый блок целиком в экране: если не помещается — уменьшаем (zoom), высоту компенсируем
  const inr = sec.querySelector('.svc3__in');
  const pinFit = () => { if (!pinned()) { inr.style.zoom = ''; inr.style.height = ''; return; }
    inr.style.zoom = ''; inr.style.height = ''; const have = innerHeight;
    // масштаб — один на весь блок: по самой высокой услуге (у каждой своё описание), чтобы при листании ничего не «дышало»
    const prev = cards.findIndex(c => c.classList.contains('is-act')); sec.classList.add('is-measuring');
    let need = 0; cards.forEach((c, i) => { cards.forEach((x, k) => x.classList.toggle('is-act', k === i)); need = Math.max(need, inr.scrollHeight); });
    cards.forEach((x, k) => x.classList.toggle('is-act', k === prev)); sec.classList.remove('is-measuring');
    if (need <= have + 1) { centerList(); return; }
    let k = have / (need * 1.03); inr.style.zoom = k.toFixed(3); inr.style.height = (have / k).toFixed(0) + 'px';
    for (let pass = 0; pass < 3; pass++) { const box = have / k, now = inr.scrollHeight; if (now <= box + 1) break; k = Math.max(.6, k * box / (now * 1.03)); inr.style.zoom = k.toFixed(3); inr.style.height = (have / k).toFixed(0) + 'px'; }  centerList(); };
  const grid = sec.querySelector('.svc3__grid');
  const centerList = () => { grid.style.marginTop = ''; if (!pinned()) return;
    const prev = cards.findIndex(c => c.classList.contains('is-act')); sec.classList.add('is-measuring');
    let gmax = 0; cards.forEach((c, i) => { cards.forEach((x, k) => x.classList.toggle('is-act', k === i)); gmax = Math.max(gmax, grid.offsetHeight); });
    cards.forEach((x, k) => x.classList.toggle('is-act', k === prev)); sec.classList.remove('is-measuring');
    const bottom = inr.clientHeight - parseFloat(getComputedStyle(inr).paddingBottom), free = bottom - grid.offsetTop - gmax;
    if (free > 24) grid.style.marginTop = Math.round(free * .42) + 'px'; };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', () => { pinFit(); onScroll(); fit(); }); onScroll(); pinFit(); fit();

  document.fonts && document.fonts.ready.then(() => { pinFit(); fit(); });
})();
