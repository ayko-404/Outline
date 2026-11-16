(() => { /* лупа: едет по восьмёрке; на десктопе — за курсором, через 2 с снова сама */
  const st = document.querySelector('.m-lens__st'); if (!st) return; const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0 = performance.now(), hold = 0, raf = 0, vis = false;
  const set = (x, y) => { st.style.setProperty('--lx', x + 'px'); st.style.setProperty('--ly', y + 'px'); };
  const tick = now => { if (!vis) return; raf = requestAnimationFrame(tick); if (now < hold) return; const w = st.clientWidth, h = st.clientHeight, k = (now - t0) / 1000;
    set(w * (.5 + .3 * Math.sin(k * .7)), h * (.5 + .32 * Math.sin(k * 1.4 + .6))); };
  st.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const b = st.getBoundingClientRect(); hold = performance.now() + 2000; t0 -= 0; set(e.clientX - b.left, e.clientY - b.top); });
  if (rm) { set(st.clientWidth * .5, st.clientHeight * .55); return; }
  new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) raf = requestAnimationFrame(tick); })).observe(st);
  set(st.clientWidth * .5, st.clientHeight * .5); })();
(() => { /* пометки на полях: рисуются по очереди, когда обложка видна */
  const n = document.querySelector('.m-notes'); if (!n) return;
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { n.classList.add('is-drawn'); o.disconnect(); } }), { threshold: .3 }).observe(n);
  document.addEventListener('click', e => { if (e.target.closest('.p-vsw [data-vg="acv"]')) { n.classList.remove('is-drawn'); void n.offsetWidth; setTimeout(() => n.classList.add('is-drawn'), 200); } }); })();