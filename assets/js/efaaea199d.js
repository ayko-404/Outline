
(() => { /* 17.11: после переключения кейса — если начало карточки ушло выше экрана, плавно подвести его под прилипший список */
  document.addEventListener('click', e => { const it = e.target.closest('.csv__it'); if (!it) return; const box = it.closest('.csv'); if (!box) return;
    const card = box.querySelector('.csv__card, .csv__in'); const list = box.querySelector('.csv__list'); if (!card || !list) return;
    requestAnimationFrame(() => { const lb = list.getBoundingClientRect(), side = getComputedStyle(list).flexDirection === 'column';
      const top = card.getBoundingClientRect().top, want = side ? 64 + 24 : lb.bottom + 12;
      if (top < want - 2) scrollTo({ top: scrollY + top - want, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }); });
})();
