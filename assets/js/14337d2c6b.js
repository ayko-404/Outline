
(() => {
  const R = window.__revs, sec = document.getElementById('otzyvy'), track = document.getElementById('rvb-track');
  if (!R || !sec || !track) return;
  const N = R.length, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
  /* иллюстрация карточки — та же, что в окне истории; появятся r.before / r.after — встанут скриншоты */
  /* 12.11: вместо цветных плашек — сгенерированные фото по нише автора (assets/gen, временно до скриншотов от клиентов, подписано «пример») */
  const GEN = { 'Кофейня в Москве': '/Outline/assets/img/b3cab42300.webp', 'Частный детский сад': '/Outline/assets/img/bfa1e51bc7.webp', 'Автосалон': '/Outline/assets/img/a1cc516e1f.webp', 'Офлайн-школа английского': '/Outline/assets/img/72a432552c.webp', 'Сеть магазинов мясной продукции': '/Outline/assets/img/cf7bcdbaf2.webp', 'Магазин одежды в Пензе': '/Outline/assets/img/56d6ed89bd.webp' };
  const phs = r => GEN[r.biz] ? ['20% 50%', '75% 40%', '95% 70%'].map(p => `<i style="background:url(${GEN[r.biz]}) ${p} / cover"></i>`).join('') : '<i></i><i></i><i></i>';
  const mock = (r, full) => full
    ? `<div class="ycm is-full"><div class="ycm__ph">${phs(r)}</div><b>${r.biz}</b><div class="ycm__st"><span>★★★★★</span>Открыто</div><ul><li>Фото и описание</li><li>Услуги и цены</li><li>Ответы на отзывы</li></ul><div class="ycm__bt"><i></i><i></i><i></i></div></div>`
    : `<div class="ycm is-empty"><div class="ycm__ph">Нет фото</div><b>${r.biz}</b><div class="ycm__st"><span>★★★★★</span>мало оценок</div><ul><li>Часы работы не указаны</li><li>Нет услуг и цен</li><li>Отзывы без ответов</li></ul><div class="ycm__bt"><i></i><i></i><i></i></div></div>`;
  const side = (r, after) => r.before && r.after ? `<img loading="lazy" decoding="async" src="${after ? r.after : r.before}" alt="Карточка ${after ? 'после' : 'до'}">` : mock(r, after);
  let cur = 0, tm = 0, sweep = 0;

  /* «Что сделали» — коротко, 3 пункта (03.11, Никита: «пустота смущает»). 🧪 ПРИМЕР: текст-заглушка по нише, пока нет кейса от Ивана —
     заменить реальными работами по каждому клиенту (r.did) и убрать пометку «пример» */
  const DID = {"marat": ["Оформили карточку и меню с ценами", "Обновили фото зала и напитков", "Отвечаем на каждый отзыв"], "viktoria": ["Заполнили услуги и программы", "Добавили фото групп и площадки", "Собираем отзывы родителей"], "sergey": ["Разложили услуги и модели по разделам", "Запустили рекламу на картах", "Отвечаем на отзывы"], "alena": ["Оформили курсы с ценами", "Обновили фото классов", "Собираем отзывы учеников"], "artem": ["Привели все точки к единому виду", "Обновили часы работы и цены", "Отвечаем на отзывы по всем точкам"], "roman": ["Оформили каталог и бренды", "Обновили фото зала и витрин", "Запустили рекламу в радиусе 5 км"]};
  const CK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12.5 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const did = r => { const list = r.did || DID[r.id]; if (!list) return '';
    return `<div class="rvf__did"><small>Что сделали</small><ul>${list.map(t => `<li><i>${CK}</i>${t}</li>`).join('')}</ul></div>`; };
  const txt = r => `<div class="rvf__txt"><div class="rvf__who"><img loading="lazy" decoding="async" src="${r.img}" alt=""><span><b>${r.name}</b><small>${r.biz}</small></span></div>
    <h3 class="rvf__h">${r.res}</h3>${did(r)}<a class="rvs__cta" href="#razbor">Хочу так же ${ARR}</a></div>`;
  /* 12.11 (Никита): шторку «Было | Стало» показываем, только когда у отзыва есть настоящие скриншоты до/после (r.before, r.after) */
  const cmp = r => !(r.before && r.after) ? '' : `<div class="rvf__cmpw"><small>Карточка в Яндекс Картах${r.before ? "" : " · пример"}</small><div class="rvs__cmp" role="slider" aria-label="Было и стало" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
    <div class="is-before">${side(r, 0)}</div><div class="is-after">${side(r, 1)}</div><span class="rvs__lbl l">Было</span><span class="rvs__lbl r">Стало</span><span class="rvs__knob"></span></div></div>`;
  const vid = r => `<img loading="lazy" decoding="async" src="${r.img}" alt=""><button type="button" class="rvf__play" aria-label="Смотреть видеоотзыв: ${r.name}">${PLAY}</button>${r.dur ? `<span class="rvf__dur">${r.dur}</span>` : ''}`;

  /* 16.11 (Никита: «на странице отзывов — не слайдер, а отдельные карточки») — секция с data-grid: сетка карточек, видео Rutube играет прямо в карточке */
  if (sec.dataset.grid) {
    const g = document.createElement('div'); g.className = 'rvg';
    g.innerHTML = R.map((r, k) => `<article class="rvg__c"><div class="rvf__vid rvg__vid" data-i="${k}">${vid(r)}</div>
      <div class="rvg__b"><div class="rvf__who"><img loading="lazy" decoding="async" src="${r.img}" alt=""><span><b>${r.name}</b><small>${r.biz}</small></span></div><h3 class="rvg__h">${r.res}</h3>${did(r)}<a class="rvs__cta" href="#razbor">Хочу так же ${ARR}</a></div></article>`).join('');
    track.before(g);
    g.addEventListener('click', e => { const b = e.target.closest('.rvf__play'); if (!b) return; const v = b.closest('.rvg__vid'), r = R[+v.dataset.i];
      g.querySelectorAll('.rvg__vid.is-play').forEach(x => { x.classList.remove('is-play'); x.querySelector('iframe')?.remove(); });
      v.classList.add('is-play'); v.insertAdjacentHTML('beforeend', `<iframe title="Видеоотзыв: ${r.name}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen src="https://rutube.ru/play/embed/${r.v}/?autoplay=1"></iframe>`);
      const f = v.querySelector('iframe'); f.addEventListener('load', () => f.classList.add('is-ready')); });
    return;
  }

  const box = document.createElement('div'); box.className = 'rvf';
  box.innerHTML = `<div class="rvf__vid">${vid(R[0])}</div>
    <div class="rvf__main" role="tabpanel" id="rvf-panel"><div class="rvf__top">${txt(R[0])}${cmp(R[0])}</div>
      <div class="rvf__nav"><div class="rvf__th" role="tablist" aria-label="Отзывы">${R.map((r, k) => `<button type="button" role="tab" class="rvf__t" data-i="${k}" aria-selected="${k === 0}" aria-controls="rvf-panel" tabindex="${k ? -1 : 0}" aria-label="${r.name}, ${r.biz}"><img loading="lazy" decoding="async" src="${r.img}" alt=""></button>`).join('')}</div>
        <div class="rvf__ctl"><span class="rvf__cnt">1 из ${N}</span><button type="button" class="rvf__arr" data-d="-1" aria-label="Предыдущий отзыв"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button><button type="button" class="rvf__arr" data-d="1" aria-label="Следующий отзыв"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div></div></div>`;
  track.before(box);
  const V = box.querySelector('.rvf__vid'), top = box.querySelector('.rvf__top'), th = box.querySelector('.rvf__th');

  /* шторка: тянуть мышью или пальцем, стрелки на клавиатуре; при смене отзыва — короткий проход, чтобы было видно, что её можно двигать */
  const bindCmp = () => {
    const c = box.querySelector('.rvs__cmp'); if (!c) return; let drag = false;
    const set = p => { p = Math.max(4, Math.min(96, p)); c.style.setProperty('--x', p + '%'); c.setAttribute('aria-valuenow', Math.round(p)); };
    const at = e => { const b = c.getBoundingClientRect(); set((e.clientX - b.left) / b.width * 100); };
    c.addEventListener('pointerdown', e => { drag = true; cancelAnimationFrame(sweep); c.setPointerCapture(e.pointerId); at(e); });
    c.addEventListener('pointermove', e => drag && at(e));
    c.addEventListener('pointerup', () => drag = false); c.addEventListener('pointercancel', () => drag = false);
    c.addEventListener('keydown', e => { const v = parseFloat(c.style.getPropertyValue('--x')) || 50; if (e.key === 'ArrowLeft') set(v - 5); if (e.key === 'ArrowRight') set(v + 5); });
    if (reduce) return set(50);
    const t0 = performance.now(); cancelAnimationFrame(sweep);
    const run = now => { const k = Math.min(1, (now - t0 - 350) / 1400); if (k < 0) { set(86); sweep = requestAnimationFrame(run); return; }
      const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; set(86 - 36 * e); if (k < 1) sweep = requestAnimationFrame(run); };
    sweep = requestAnimationFrame(run);
  };

  const go = (i, focus) => {
    i = (i + N) % N; if (i === cur) return; cur = i; const r = R[i];
    th.querySelectorAll('.rvf__t').forEach(t => { const on = +t.dataset.i === i; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    const act = th.children[i]; if (th.scrollWidth > th.clientWidth + 2) th.scrollTo({ left: act.offsetLeft - (th.clientWidth - act.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    box.querySelector('.rvf__cnt').textContent = `${i + 1} из ${N}`;
    V.classList.remove('is-play'); V.innerHTML = vid(r); V.querySelector('img').classList.add('is-new');
    [...top.children].forEach(x => x.classList.add('is-out'));
    clearTimeout(tm); tm = setTimeout(() => { top.innerHTML = txt(r) + cmp(r); [...top.children].forEach(x => x.classList.add('is-in')); bindCmp(); }, reduce ? 0 : 130);
  };

  /* видео — Rutube прямо в блоке, по кнопке */
  V.addEventListener('click', e => { if (!e.target.closest('.rvf__play')) return; const r = R[cur];
    V.classList.add('is-play'); V.insertAdjacentHTML('beforeend', `<iframe title="Видеоотзыв: ${r.name}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen src="https://rutube.ru/play/embed/${r.v}/?autoplay=1"></iframe>`);
    const f = V.querySelector('iframe'); f.addEventListener('load', () => f.classList.add('is-ready')); });
  box.addEventListener('click', e => { const t = e.target.closest('.rvf__t'), a = e.target.closest('.rvf__arr'); if (t) go(+t.dataset.i); else if (a) go(cur + +a.dataset.d); });
  th.addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); go(cur + d, true); } });
  /* свайп по видео на телефоне — следующий / предыдущий */
  let sx = null; V.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  V.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50 && !V.classList.contains('is-play')) go(cur + (dx < 0 ? 1 : -1)); });
  bindCmp();
})();
