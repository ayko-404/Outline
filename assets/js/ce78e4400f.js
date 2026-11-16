(() => { /* лупа: едет по восьмёрке; на десктопе — за курсором, через 2 с снова сама */
  const st = document.querySelector('.m-lens__st'); if (!st) return; const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0 = performance.now(), hold = 0, raf = 0, vis = false;
  const set = (x, y) => { st.style.setProperty('--lx', x + 'px'); st.style.setProperty('--ly', y + 'px'); };
  const tick = now => { if (!vis) return; raf = requestAnimationFrame(tick); if (now < hold) return; const w = st.clientWidth, h = st.clientHeight, k = (now - t0) / 1000;
    set(w * (.5 + .28 * Math.sin(k * .55)), h * (.52 + .3 * Math.sin(k * 1.1 + .6))); };
  st.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const b = st.getBoundingClientRect(); hold = performance.now() + 2000; t0 -= 0; set(e.clientX - b.left, e.clientY - b.top); });
  if (rm) { set(st.clientWidth * .5, st.clientHeight * .55); return; }
  new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) raf = requestAnimationFrame(tick); })).observe(st);
  set(st.clientWidth * .5, st.clientHeight * .5); })();