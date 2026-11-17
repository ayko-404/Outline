
(() => {
  /* переход волнами (механика nomu.store): 4 слоя, 10 точек, у каждой точки своя задержка */
  const wrap = document.getElementById('wavex'), paths = [...wrap.querySelectorAll('path')];
  // плавный шум вместо случайных скачков: соседние точки задерживаются почти одинаково — получаются волны, а не «столбы»
  const P = 10, noise = (i, L) => (Math.sin(i * .9 + L * 1.7) + Math.sin(i * .37 + L * 2.9 + 1)) / 4 + .5;
  const delays = paths.map((_, L) => Array.from({ length: P }, (_, i) => L * .13 + noise(i, L) * .1));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const BASE = 0, smooth = t => t * t * (3 - 2 * t);
  const draw = prog => paths.forEach((p, L) => {
    const ys = delays[L].map(d => { const e = smooth(Math.min(1, Math.max(0, (prog - d) / .5))); return L === paths.length - 1 ? 100 - (BASE + (100 - BASE) * e) : 100 * (1 - e); });
    const step = 100 / (P - 1); let d = `M0 ${ys[0].toFixed(3)} C`;
    for (let i = 1; i < P; i++) { const x0 = (i - 1) * step, x1 = i * step, h = step / 2; d += ` ${(x0 + h).toFixed(3)} ${ys[i - 1].toFixed(3)} ${(x0 + h).toFixed(3)} ${ys[i].toFixed(3)} ${x1.toFixed(3)} ${ys[i].toFixed(3)}`; }
    p.setAttribute('d', d + ' L100 100 L0 100 Z');
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // прогресс по прокрутке + мягкое догоняние (без рывков между кадрами колеса)
  let cur = 0, tgt = 0, raf = 0;
  const target = () => { const r = wrap.getBoundingClientRect(); /* как у nomu: нижний край перехода выходит на экран, когда тёмный слой уже поднялся */ /* 17.11 (Никита: «дыра после обложки»): на внутренних страницах (.p-cv) волна начинает подниматься сразу, как показалась снизу; финиш тот же */ const inner = !!document.querySelector('.p-cv'), st = inner ? .98 : .62; return Math.min(1, Math.max(0, (innerHeight * st - r.top) / (innerHeight * (st - .1)))); };
  const nwSec = document.getElementById('komu-pomogaem');
  const ready = v => nwSec && nwSec.classList.toggle('is-ready', v >= .97);
  const tick = () => { cur += (tgt - cur) * .16; if (Math.abs(tgt - cur) < .001) cur = tgt; draw(cur); ready(cur); raf = cur === tgt ? 0 : requestAnimationFrame(tick); };
  const onScroll = () => { tgt = reduce ? 1 : target(); if (reduce) { ready(1); return draw(1); } if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); cur = tgt = reduce ? 1 : target(); draw(cur); ready(cur);

  const sec = document.getElementById('komu-pomogaem');
  /* анимации иллюстраций — когда блок виден */
  new IntersectionObserver((es, io) => es.forEach(e => { if (e.isIntersecting) { sec.classList.add('is-in'); io.disconnect(); } }), { threshold: .1 }).observe(sec);
})();
