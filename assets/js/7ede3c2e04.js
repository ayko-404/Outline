
(() => {
  const sec = document.getElementById('klienty'), mq = document.getElementById('cl-mq'), track = document.getElementById('cl-track');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // три копии ленты: хватает на широкий экран при любом сдвиге
  const orig = [...track.children];
  for (let k = 0; k < 2; k++) orig.forEach(li => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('img').forEach(i => i.alt = ''); track.append(c); });
  let setW = 0;
  const measure = () => { setW = track.scrollWidth / 3; };
  measure(); addEventListener('resize', measure);
  addEventListener('load', measure);

  const BASE = reduce ? 0 : -38;   // px/с, влево
  let x = 0, v = BASE, target = BASE, drag = false, lastX = 0, lastT = 0, vel = 0, hover = false;
  const wrap = () => { if (!setW) return; while (x <= -setW) x += setW; while (x > 0) x -= setW; };

  mq.addEventListener('pointerenter', () => { hover = true; });
  mq.addEventListener('pointerleave', () => { hover = false; });
  mq.addEventListener('pointerdown', e => {
    drag = true; lastX = e.clientX; lastT = performance.now(); vel = 0;
    mq.setPointerCapture(e.pointerId); mq.classList.add('is-drag'); sec.classList.add('is-touched');
  });
  mq.addEventListener('pointermove', e => {
    if (!drag) return;
    const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT);
    x += dx; vel = vel * .6 + (dx / dt * 1000) * .4; lastX = e.clientX; lastT = now; wrap();
  });
  const end = () => { if (!drag) return; drag = false; mq.classList.remove('is-drag'); v = Math.max(-2400, Math.min(2400, vel)); };
  mq.addEventListener('pointerup', end); mq.addEventListener('pointercancel', end);

  let prev = performance.now();
  const tick = now => {
    const dt = Math.min(.05, (now - prev) / 1000); prev = now;
    if (!drag) {
      target = hover ? BASE * .25 : BASE;
      v += (target - v) * Math.min(1, dt * 2.2);   // инерция броска плавно возвращается к обычной скорости
      x += v * dt; wrap();
    }
    track.style.transform = `translate3d(${x}px,0,0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
