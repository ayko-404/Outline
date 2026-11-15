
(() => {
  /* FAQ: один открытый вопрос, плавная высота (WAAPI). Закрытие: анимируем до высоты заголовка, потом снимаем open */
  const items = [...document.querySelectorAll('#faq .fq__it')]; if (!items.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, EASE = 'cubic-bezier(0.22, 1, 0.36, 1)', DUR = 480;
  /* высоты дробные (getBoundingClientRect) — с целыми пикселями в конце анимации карточка «доскакивала» */
  const H = el => el.getBoundingClientRect().height, head = d => H(d.querySelector('summary'));
  const close = d => { if (!d.open || d.classList.contains('is-closing')) return;
    if (reduce) { d.open = false; return; }
    d.classList.add('is-closing'); d._a && d._a.cancel();
    d._a = d.animate({ height: [H(d) + 'px', head(d) + 'px'] }, { duration: DUR, easing: EASE });
    d._a.onfinish = () => { d.open = false; d.classList.remove('is-closing'); d._a = null; };
    d._a.oncancel = () => d.classList.remove('is-closing'); };
  const open = d => { items.forEach(x => x !== d && close(x));
    if (reduce) { d.open = true; return; }
    const from = H(d); d._a && d._a.cancel(); d.classList.remove('is-closing'); d.open = true;
    const to = H(d); d._a = d.animate({ height: [from + 'px', to + 'px'] }, { duration: DUR, easing: EASE });
    d._a.onfinish = () => { d._a = null; };
  };
  items.forEach(d => d.querySelector('summary').addEventListener('click', e => { e.preventDefault();
    if (d.open && !d.classList.contains('is-closing')) close(d); else open(d); }));
})();
