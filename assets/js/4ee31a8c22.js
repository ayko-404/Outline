
(() => {
  /* узор фона — слой внутри обложки, под контентом */
  const page = document.querySelector('.page');
  if (page) { const bg = document.createElement('div'); bg.className = 'bgpat'; bg.setAttribute('aria-hidden', 'true'); page.prepend(bg); }

  /* фирменные иконки тега: заливка + штрих, одна толщина, под смысл фразы */
  const ICONS = [
    '<svg viewBox="0 0 20 20" fill="none"><path d="M10 18s6-5.6 6-10.2A6 6 0 0 0 4 7.8C4 12.4 10 18 10 18Z" fill="currentColor"/><circle cx="10" cy="7.8" r="2.3" fill="#ff6414"/></svg>',
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 15.5h6a3 3 0 0 0 0-6h-3a3 3 0 0 1 0-6h5.5" stroke-dasharray="2.2 2.6"/><circle cx="4.5" cy="15.5" r="1.9" fill="currentColor" stroke="none"/><path d="M15.5 6.8c-1.6 0-2.6-1.1-2.6-2.4 0-1.7 2.6-3.6 2.6-3.6s2.6 1.9 2.6 3.6c0 1.3-1 2.4-2.6 2.4Z" fill="currentColor" stroke="none" transform="translate(0 1.2)"/></svg>'
  ];
  const tag = document.querySelector('.signal-tag'), icon = tag && tag.querySelector('.signal-tag__icon');
  if (icon) {
    const apply = () => { const i = +(tag.dataset.index || 0) % ICONS.length; if (icon.dataset.k !== String(i) || !icon.innerHTML.includes('viewBox="0 0 20 20"')) { icon.dataset.k = i; icon.innerHTML = ICONS[i]; } };
    new MutationObserver(apply).observe(icon, { childList: true }); apply();
  }

  /* элементы для вариантов тега */
  if (tag) {
    const live = document.createElement('span'); live.className = 'tg-live'; live.setAttribute('aria-hidden', 'true'); live.innerHTML = '<i></i><i></i>';
    const st = document.createElement('span'); st.className = 'tg-stack'; st.setAttribute('aria-hidden', 'true');
    st.innerHTML = '<span><img loading="lazy" decoding="async" src="/Outline/assets/img/762345dd67.svg" alt=""></span><span class="is-2gis"><img loading="lazy" decoding="async" src="/Outline/assets/img/0dd5d44153.png" alt=""></span><span><svg viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="gpin4"><path d="M12 22.5s7-6.1 7-12.7A7 7 0 0 0 5 9.8c0 6.6 7 12.7 7 12.7Z"/></clipPath></defs><g clip-path="url(#gpin4)"><rect x="4" y="2" width="16" height="22" fill="#ea4335"/><rect x="4" y="2" width="8" height="9" fill="#4285f4"/><rect x="4" y="11" width="8" height="13" fill="#34a853"/><rect x="12" y="13" width="8" height="11" fill="#fbbc04"/></g><circle cx="12" cy="9.8" r="2.7" fill="#fff"/></svg></span>';
    tag.prepend(st); tag.prepend(live);
    const inf = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); inf.setAttribute('class', 'tg-inf'); inf.setAttribute('viewBox', '-20 -20 376 205'); inf.setAttribute('aria-hidden', 'true');
    inf.innerHTML = '<path pathLength="100" d="M168 82.5C196 46 230 23.5 253 23.5C286 23.5 311.5 50 311.5 82.5C311.5 115 286 141.5 253 141.5C230 141.5 196 119 168 82.5C140 46 106 23.5 83 23.5C50 23.5 24.5 50 24.5 82.5C24.5 115 50 141.5 83 141.5C106 141.5 140 119 168 82.5Z"/>';
    tag.append(inf);   // справа, у края тега (позиция — в CSS)
  }

  /* шапка темнеет, когда под ней тёмный блок */
  const darks = [...document.querySelectorAll('.nw, #wavex, #wavel, .fina__card')], B = document.body, hdr = document.querySelector('.hdr');
  const check = () => { const y = 32; let dark = false;
    for (const el of darks) { const r = el.getBoundingClientRect(); if (el.id === 'wavex') { if (r.top < innerHeight * .1 && r.bottom > y) dark = true; } else if (el.id === 'wavel') { if (r.top <= y && r.bottom > y && el.dataset.done !== '1') dark = true; } else if (el.classList.contains('fina__card')) { if (!el.closest('.fin').hidden && r.top <= (hdr ? hdr.getBoundingClientRect().top : 0) + 1 && r.bottom > y) dark = true; }   /* тёмная карточка подвала: шапка темнеет, когда целиком над ней (карта светлая — над ней шапка светлая), 03.11 */
      else if (r.top <= y && r.bottom > y) dark = true; }
    B.classList.toggle('hdr-dark', dark); };
  addEventListener('scroll', check, { passive: true }); addEventListener('resize', check); check();
})();
