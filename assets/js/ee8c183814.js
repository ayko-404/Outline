
(() => {
  /* отзывы — обложки и ссылки с канала Outline на Rutube; подписи — формулировки со старого outlineagency.ru */
  const R = [
    { id: 'marat', name: 'Марат', biz: 'Кофейня в Москве', res: 'Вывели кофейню в ТОП-3 по району за 2 месяца', v: 'cbbe45c523218c14085491534ef269ee', dur: '0:19', img: '/Outline/assets/img/b7c4445d1d.webp' },
    { id: 'viktoria', name: 'Виктория', biz: 'Частный детский сад', res: 'В 4 раза увеличили трафик в карточку', v: '374260457e5351617cd3b3be55b815cb', img: '/Outline/assets/img/ffd52d4d65.webp' },
    { id: 'sergey', name: 'Сергей', biz: 'Автосалон', res: 'Трафик в автосалон вырос в 2 раза за 2 месяца', v: '1a063c319c377f36da6ecf4535523dbe', img: '/Outline/assets/img/45d1761c7c.webp' },
    { id: 'alena', name: 'Алена', biz: 'Офлайн-школа английского', res: '40+ заявок в месяц с карт', v: '95650a587e04c46554ce7c0b1fe40d9b', img: '/Outline/assets/img/841066d48d.webp' },
    { id: 'artem', name: 'Артем', biz: 'Сеть магазинов мясной продукции', res: 'Упаковали все точки сети', v: '61ee749a9b07b734d50db509f24099d5', img: '/Outline/assets/img/0eba616f82.webp' },
    { id: 'roman', name: 'Роман', biz: 'Магазин одежды в Пензе', res: 'ТОП-1 в радиусе 5 км за 4 месяца', v: '8ae3bea931de7faf58059a420e3a058b', img: '/Outline/assets/img/d6d3dcf70a.webp' },
  ];
  window.__revs = R;
  const url = r => `https://rutube.ru/shorts/${r.v}/`;
  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
  const ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const m = R[0];
  document.getElementById("rvw").innerHTML = `
    <article class="rvw__main"><a class="rvw__vid" href="${url(m)}" target="_blank" rel="noopener" aria-label="Смотреть видеоотзыв: ${m.name}"><img src="${m.img}" alt="" loading="lazy"><span class="rvw__play">${PLAY}</span><span class="rvw__dur">${m.dur}</span></a>
      <div class="rvw__txt"><span class="rvw__tag">Видеоотзыв</span><p class="rvw__res">${m.res}</p>
        <div class="rvw__who"><span><b>${m.name}</b><small>${m.biz}</small></span></div>
        <a class="rvw__btn" href="${url(m)}" target="_blank" rel="noopener">Смотреть отзыв ${ARR}</a></div></article>
    <div class="rvw__list">${R.slice(1).map(r => `<a class="rvw__row" href="${url(r)}" target="_blank" rel="noopener"><img src="${r.img}" alt="" loading="lazy"><span><b>${r.name} · ${r.biz}</b><span>${r.res}</span></span><i>${PLAY}</i></a>`).join('')}
      <a class="rvw__more" href="#" aria-disabled="true">Отзывы о&nbsp;нас на&nbsp;Яндекс Картах ${ARR}</a></div>`;
  /* форма: без согласия кнопка не активна (152-ФЗ, ст. 9 ч. 1) */
  const ag = document.getElementById('cta8-agree'), btn = document.getElementById('cta8-btn');
  ag.addEventListener('change', () => { btn.disabled = !ag.checked; });
  /* на узком экране — короткая подсказка во втором поле, чтобы не обрезалась */
  const wf = document.querySelector('.cx__form input[data-short]'); if (wf && matchMedia('(max-width: 760px)').matches) wf.placeholder = 'Ссылка или название';
  /* превью разбора: строки и кольцо оценки появляются, когда блок на экране */
  const cx = document.querySelector('.cx');
  if (cx && !matchMedia('(prefers-reduced-motion: reduce)').matches) { cx.classList.add('js');
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { cx.classList.add('is-in'); o.disconnect(); } }), { threshold: .35 }).observe(cx); }
})();
