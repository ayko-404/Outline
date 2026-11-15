
(() => {
  const sec = document.getElementById('uslugi'); if (!sec) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = [...sec.querySelectorAll('.sv')].filter(c => c.querySelector('.mph__feed[data-steps]'));
  let run = null;
  const wait = ms => new Promise(r => { const t = setTimeout(r, ms); run && run.timers.push(t); });
  const play = async card => {
    const me = run = { timers: [] };
    const feed = card.querySelector('.mph__feed'), view = card.querySelector('.mph__view'), spot = feed.querySelector('.mph-spot');
    const steps = JSON.parse(feed.dataset.steps), H = +feed.dataset.h, pills = [...card.querySelectorAll('.ob')];
    const alive = () => run === me && card.classList.contains('is-act');
    while (alive()) {
      pills.forEach(p => p.classList.remove('on', 'cur')); spot.classList.remove('on', 'lbl');
      feed.style.transform = 'translateY(0)'; await wait(reduce ? 0 : 300);   // 13.11 (Никита: «чуть ускорить… не успеваешь увидеть»)
      for (let i = 0; i < steps.length && alive(); i++) {
        const [a, b, label] = steps[i];
        me.place = instant => {
          const k = feed.clientWidth / 420, P = parseFloat(getComputedStyle(feed).paddingTop) || 0, vh = view.clientHeight;
          const maxY = Math.max(0, P + H * k - vh), mid = P + (a + b) / 2 * k, y = Math.min(maxY, Math.max(0, mid - vh * .45));
          if (instant) { feed.style.transition = spot.style.transition = 'none'; }
          feed.style.transform = `translateY(${-y}px)`;
          spot.style.top = (P + a * k) + 'px'; spot.style.height = ((b - a) * k) + 'px';
          spot.classList.toggle('below', P + a * k - y < P + 30);
          spot.classList.toggle('in', steps[i][3] === 'in');   /* подпись внутри рамки справа — когда снаружи она закрыла бы соседний текст */
          if (instant) { feed.offsetWidth; feed.style.transition = spot.style.transition = ''; }
        };
        spot.classList.remove('lbl');
        if (i === 0) { spot.style.transition = 'none'; spot.offsetWidth; }   /* первый шаг — сразу на месте, без «въезда» сверху */
        me.place(false);
        if (i === 0) { spot.offsetWidth; spot.style.transition = ''; }
        spot.querySelector('b').textContent = label;
        spot.classList.add('on'); await wait(reduce ? 0 : 600); if (!alive()) break;
        spot.classList.add('lbl');
        pills.forEach(p => p.classList.remove('cur'));
        if (pills[i]) pills[i].classList.add('on', 'cur');
        if (i === steps.length - 1) pills.slice(i + 1).forEach(p => p.classList.add('on'));
        await wait(reduce ? 4000 : 1100);
      }
      if (!alive()) break;
      spot.classList.remove('lbl'); await wait(1000);
    }
    me.timers.forEach(clearTimeout);
  };
  const check = () => { const act = cards.find(c => c.classList.contains('is-act'));
    const vis = sec.getBoundingClientRect().top < innerHeight * .6 && sec.getBoundingClientRect().bottom > innerHeight * .4;
    if (!act || !vis) { if (run) { run.timers.forEach(clearTimeout); run = null; } return; }
    if (!run || run.card !== act) { if (run) run.timers.forEach(clearTimeout); play(act); run.card = act; } };
  /* размер телефона меняется (появление блока, окно) — текущий шаг ставим заново, без анимации */
  const ro = new ResizeObserver(() => { if (run && run.place) run.place(true); });
  cards.forEach(c => ro.observe(c.querySelector('.mph__view')));
  addEventListener('scroll', () => requestAnimationFrame(check), { passive: true }); addEventListener('resize', check);
  cards.forEach(c => new MutationObserver(check).observe(c, { attributes: true, attributeFilter: ['class'] }));
  check();
})();
