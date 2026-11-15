
(() => {
  /* кейсы: данные со старого outlineagency.ru; «до» — только где известно из текста кейса */
  const IMG = { kamyshi: '/Outline/assets/img/b481607ee1.webp', michurinsky: '/Outline/assets/img/64b866435f.webp', baza: '/Outline/assets/img/e97cfee39e.webp', ucandles: '/Outline/assets/img/053fcde02b.webp', avtodush: '/Outline/assets/img/46ef478198.webp', notarius: '/Outline/assets/img/c50e82eacc.webp', aviator: '/Outline/assets/img/3eef69e18f.webp' };
  const YA = { kamyshi: '/Outline/assets/img/18d6ad948f.webp', michurinsky: '/Outline/assets/img/78a03b8888.webp', baza: '/Outline/assets/img/18ee836f88.webp', ucandles: '/Outline/assets/img/f2c76e1650.webp', avtodush: '/Outline/assets/img/45a729ceed.webp', notarius: '/Outline/assets/img/3f5bda6440.webp', aviator: '/Outline/assets/img/1bc45e2645.webp' };
  const C = [
    { id: 'kamyshi', name: '«Камыши»', niche: 'Банный комплекс', city: 'Санкт-Петербург', period: 'дек 2024 — дек 2025', big: 'ТОП-3', cap: 'по всем ключевым запросам в Яндекс Картах более года', pos: 3, wasPos: 11, tbc: true,
      rows: [['Оборот с трафика карт в месяц', '6 млн ₽'], ['Просмотров профиля в месяц', '22 000+'], ['Цена целевого действия по рекламе', '6 ₽']] },
    { id: 'michurinsky', name: 'Ресторан на Мичуринском', niche: 'Кавказская кухня', city: 'Москва', period: 'с мая 2025', big: 'ТОП-1', cap: 'по ключевым запросам района полгода подряд', pos: 1, wasPos: 8, tbc: true,
      rows: [['Маршрутов в месяц', '5000+'], ['Просмотров профиля в месяц', '20 000+'], ['Цена целевого действия по рекламе', '8 ₽']] },
    { id: 'baza', name: 'The База', niche: 'Тату-салон', city: 'Московская область', period: 'янв 2023 — янв 2025', big: 'ТОП-1', cap: 'по ключевым запросам больше двух лет подряд', pos: 1, was: 'карточки не было — запуск с нуля',
      rows: [['Заявок в месяц', '130+', '0'], ['Звонков в месяц', '60–70', '0'], ['Просмотров профиля в месяц', '5000+', '0']] },
    { id: 'ucandles', name: 'Ucandles by Gor Maison', niche: 'Магазин ароматов', city: 'премиум-сегмент', period: 'с сентября 2025', big: 'ТОП-1', cap: 'обошли Летуаль и Золотое Яблоко рядом за 60 дней', pos: 1, wasPos: 6, tbc: true,
      rows: [['Рост трафика', '+330%'], ['Звонков', '×2'], ['Просмотров профиля в месяц', '3000+']] },
    { id: 'avtodush', name: '«Автодуш»', niche: 'Грузовая автомойка', city: 'Московская область', period: 'янв — июн 2025', big: 'ТОП-1', cap: 'по ключевым запросам больше полугода — с нуля', pos: 1, was: 'карточки не было — открытие с нуля',
      rows: [['Клиентов в месяц', '350+', '0'], ['Переходов в профиль в месяц', '4000+', '0'], ['Маршрутов в месяц', '500+', '0']] },
    { id: 'notarius', name: 'Нотариус', niche: 'Нотариальная контора', city: 'Москва', period: 'с января 2025', big: 'ТОП-3', cap: 'в радиусе 5 км больше года — без рекламы', pos: 3, wasPos: 9, tbc: true,
      rows: [['Записей за год', '×3'], ['Рейтинг на картах', '5,0'], ['Рост трафика в месяц', '+20%']] },
    { id: 'aviator', name: 'Aviator Boxing Club', niche: 'Боксёрский клуб', city: 'Пенза', period: 'с июня 2025', big: 'ТОП-1', cap: 'в Пензе по всем ключевым запросам', pos: 1, wasPos: 7, tbc: true,
      rows: [['Записей в первые месяцы', '×3'], ['Трафика', '×2'], ['Просмотров профиля в месяц', '3000+']] },
  ];
  /* кейсы — карточки по референсу Ивана (29.10): по две в ряд с листанием; рейтинг и число оценок — со скриншотов карточек в Яндекс Картах */
  const RT = { kamyshi: ['5,0', '2002'], michurinsky: ['5,0', '227'], baza: ['5,0', '507'], ucandles: ['5,0', '268'], avtodush: ['5,0', '109'], notarius: ['5,0', '97'], aviator: ['4,9', '37'] };
  window.__cases = { C, IMG, YA, RT };
  /* карточка в Яндекс Картах — крупно поверх страницы: тот же телефон, что в кейсе, перелетает из карточки в центр (FLIP) */
  const reduceLb = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPRING = 'linear(0, 0.022, 0.078, 0.155, 0.242, 0.334, 0.425, 0.511, 0.59, 0.662, 0.725, 0.78, 0.827, 0.866, 0.899, 0.925, 0.947, 0.964, 0.977, 0.987, 0.994, 0.999, 1.003, 1.005, 1.007, 1.008, 1.008, 1.008, 1.007, 1.006, 1.006, 1.005, 1.004, 1.004, 1.003, 1.003, 1.002, 1.002, 1.001, 1)';   // spring_linear.py --duration 0.55 --bounce 0.16 → 764 мс
  const lb = document.createElement('div'); lb.className = 'cs-lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML = '<div class="cs-lb__in"><div class="cs-lb__ph"></div><p class="cs-lb__cap"></p><button class="cs-lb__x" type="button" aria-label="Закрыть">×</button></div>';
  document.body.append(lb);
  const lbPh = lb.querySelector('.cs-lb__ph'), lbCap = lb.querySelector('.cs-lb__cap'), lbX = lb.querySelector('.cs-lb__x'); let lbFrom = null, lbSrc = null, lbAnim = [];
  // сдвиг и масштаб, которые ставят телефон окна на место телефона в кейсе
  const fromSrc = (src, dst) => { const a = src.getBoundingClientRect(), b = dst.getBoundingClientRect();
    return `translate(${a.left + a.width / 2 - b.left - b.width / 2}px, ${a.top + a.height / 2 - b.top - b.height / 2}px) scale(${a.width / b.width})`; };
  const onScreen = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; };
  const lbOpen = i => { const c = C[i];
    lbSrc = document.querySelector('.csv__ph .csv__dev');
    const dev = lbSrc ? lbSrc.cloneNode(true) : null;
    if (dev) { const view = dev.querySelector('.mph__view'), imgs = [...view.querySelectorAll('img')], im = imgs.pop();
      imgs.forEach(x => x.remove()); im.className = ''; im.src = YA[c.id]; im.alt = `Карточка ${c.name} в Яндекс Картах`;
      const g = document.createElement('span'); g.className = 'cs-lb__glare'; dev.querySelector('.mph__scr').append(g); }
    lbPh.replaceChildren(...(dev ? [dev] : []));
    lbCap.innerHTML = `${c.name}<small>Карточка в Яндекс Картах</small>`;
    lbFrom = document.activeElement; lb.classList.remove('is-closing'); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); lbX.focus({ preventScroll: true });
    if (!dev || reduceLb) return;
    lbAnim.forEach(a => a.cancel());
    const fly = onScreen(lbSrc);
    if (matchMedia('(max-width: 760px)').matches) {   // 10.11: на телефоне — плавно, без пружины с перелётом и без поворота
      lbAnim = [lbPh.animate(fly ? [{ transform: fromSrc(lbSrc, lbPh) }, { transform: 'none' }] : [{ transform: 'translateY(24px) scale(.96)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })];
      if (fly) lbSrc.style.visibility = 'hidden';
      lbAnim[0].finished.then(() => { if (lbSrc) lbSrc.style.visibility = ''; }, () => {});
      return; }
    lbAnim = [
      // полёт: из карточки в центр, посадка на пружине
      lbPh.animate(fly ? [{ transform: fromSrc(lbSrc, lbPh) }, { transform: 'none' }] : [{ transform: 'translateY(40px) scale(.9)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }),   // 15.11 (Никита: «дёргается») — без пружины с перелётом, дольше и мягче
      // в полёте телефон чуть разворачивается к зрителю и выпрямляется
      dev.animate([{ transform: 'rotateY(0) rotateX(0)' }, { transform: 'rotateY(-7deg) rotateX(3deg)', offset: .4 }, { transform: 'rotateY(0) rotateX(0)' }], { duration: 900, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' }),
      // блик по стеклу, когда телефон сел
      dev.querySelector('.cs-lb__glare').animate([{ transform: 'translateX(-55%)', opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .75 }, { transform: 'translateX(55%)', opacity: 0 }], { duration: 900, delay: 620, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', fill: 'both' }),
    ];
    if (fly) lbSrc.style.visibility = 'hidden';
    lbAnim[0].finished.then(() => { if (lbSrc) lbSrc.style.visibility = ''; }, () => {});
  };
  window.__csShot = i => lbOpen(i);
  const lbDone = () => { lb.classList.remove('is-open', 'is-closing'); lb.setAttribute('aria-hidden', 'true'); if (lbSrc) lbSrc.style.visibility = ''; lbPh.getAnimations().forEach(a => a.cancel());
    lbFrom && lbFrom.focus && lbFrom.focus({ preventScroll: true }); };
  const lbClose = () => { if (!lb.classList.contains('is-open') || lb.classList.contains('is-closing')) return;
    lb.classList.add('is-closing'); lb.classList.remove('is-open'); lbAnim.forEach(a => a.cancel());
    const dev = lbPh.firstElementChild;
    if (!dev || reduceLb || !lbSrc || !onScreen(lbSrc)) { if (dev && !reduceLb) lbPh.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(.94)' }], { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
      setTimeout(lbDone, reduceLb ? 0 : 300); return; }
    // назад в карточку: тот же путь, быстрее, без пружины
    const back = lbPh.animate([{ transform: 'none' }, { transform: fromSrc(lbSrc, lbPh) }], { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' });
    lbAnim = [back];
    back.finished.then(lbDone, () => {});
    setTimeout(() => { lbSrc.style.visibility = 'hidden'; }, 0); };
  lb.addEventListener('click', e => { if (e.target === lb || e.target === lbX) lbClose(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('is-open')) lbClose(); });

  /* тарифы: цены набираются при появлении */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = v => Math.round(v).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
  const prices = [...document.querySelectorAll('.tf__price b')];
  if (!reduce) new IntersectionObserver((es, io) => es.forEach(e => { if (!e.isIntersecting) return; io.disconnect();
    prices.forEach((b, k) => { const to = +b.dataset.to, t0 = performance.now() + k * 120, dur = 900;
      const st = now => { const p = Math.min(1, Math.max(0, (now - t0) / dur)), ev = 1 - Math.pow(1 - p, 3); b.textContent = fmt(to * (.6 + .4 * ev)); if (p < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); }); }), { threshold: .3 }).observe(document.querySelector('.tf'));
})();
