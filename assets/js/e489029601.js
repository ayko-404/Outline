
(() => {
  /* «Подробнее по площадкам»: появление карточек (вариант Б выбран 02.11, переключатель убран) */
  const sec = document.getElementById('ploshadki'); if (!sec) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { sec.classList.add('is-in'); io.disconnect(); } }), { threshold: .2 });
  io.observe(sec);
})();
