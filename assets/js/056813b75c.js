
(() => {
  /* роли и описания — дословно Иван (content.md); шкалы навыков убраны 29.10 по просьбе Никиты */
  const T = [
    { id: 'ivan', name: 'Иван', role: 'Сооснователь', img: '/Outline/assets/img/a98721c9b7.webp', about: 'Маркетинг, упаковка предложения, развитие бизнеса и&nbsp;продажи.' },
    { id: 'pavel', name: 'Павел', role: 'Сооснователь', img: '/Outline/assets/img/b3e6604d53.webp', about: 'Операционная и&nbsp;техническая работа агентства.' },
    { id: 'alisa', name: 'Алиса', role: 'Старший геомаркетолог', img: '/Outline/assets/img/7edc724607.webp', about: 'Продвижение карточек, содержание профилей и&nbsp;анализ динамики.' },
    { id: 'liza', name: 'Лиза', role: 'Аккаунт-директор', img: '/Outline/assets/img/81e886a7dc.webp', about: 'Организация сопровождения проектов и&nbsp;коммуникация с&nbsp;клиентами.' },
    { id: 'lera', name: 'Лера', role: 'Старший дизайнер', img: '/Outline/assets/img/2b9f3c5518.webp', about: 'Визуальное оформление карточек и&nbsp;контент для геосервисов.' },
    { id: 'dana', name: 'Дана', role: 'Специалист отдела репутации', img: '/Outline/assets/img/6323f6102d.webp', about: 'Работа с&nbsp;отзывами и&nbsp;обратной связью клиентов.' },
  ];
  const bar = (n, row) => `<span class="tm__bar" role="img" aria-label="${n} из 10">${Array.from({ length: 10 }, (_, k) => `<i class="${k < n ? 'on' : ''}" style="--k:${k};--row:${row}"></i>`).join('')}</span>`;
  const grid = document.getElementById('tm-grid');
  const rnd = (a, b) => (a + Math.random() * (b - a)).toFixed(2);
  // фильтры каналов для помех — один раз на страницу
  document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="tm-red"><feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter><filter id="tm-blue"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/></filter></svg>');
  grid.innerHTML = T.map((p, i) => `<article class="tm__card"><div class="tm__ph" style="--rd:${rnd(8, 15)}s;--rl:-${rnd(0, 15)}s;--gd:-${rnd(0, 1.2)}s"><img src="${p.img}" alt="${p.name}, ${p.role.toLowerCase()}" loading="lazy"><span class="tm__scan" aria-hidden="true"></span></div>
    <div class="tm__body"><h3>${p.name}</h3><p class="tm__role">${p.role}</p>
    </div></article>`).join('');
  /* цифры набираются при появлении */
  const nums = document.getElementById('tm-nums');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) new IntersectionObserver((es, o) => es.forEach(e => { if (!e.isIntersecting) return; o.disconnect();
    nums.querySelectorAll('i[data-to]').forEach((el, k) => { const to = +el.dataset.to, t0 = performance.now() + k * 120;
      const st = now => { const q = Math.min(1, Math.max(0, (now - t0) / 1100)); el.textContent = Math.round(to * (1 - Math.pow(1 - q, 3))); if (q < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); }); }), { threshold: .5 }).observe(nums);

  /* сканирование по наведению: проход 1,1 с сверху вниз, повтор каждые 2,4 с; при уходе — полоса гаснет за 0,25 с */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches)
    grid.querySelectorAll('.tm__card').forEach(card => { const sc = card.querySelector('.tm__scan'); let run = null;
      card.addEventListener('pointerenter', () => { if (run) run.cancel(); sc.getAnimations().forEach(a => a.cancel());
        run = sc.animate([{ transform: 'translateY(-100%)', opacity: 1 }, { transform: 'translateY(294%)', opacity: 1, offset: .46 }, { transform: 'translateY(294%)', opacity: 0, offset: .5 }, { transform: 'translateY(294%)', opacity: 0 }],
          { duration: 2400, iterations: Infinity, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' }); });
      card.addEventListener('pointerleave', () => { if (!run) return; const r = run; run = null;
        sc.animate([{ opacity: getComputedStyle(sc).opacity }, { opacity: 0 }], { duration: 250, easing: 'ease', fill: 'forwards' }).finished.then(a => { r.cancel(); a.cancel(); }); }); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .45 });
  grid.querySelectorAll('.tm__card').forEach(c => io.observe(c));
})();
