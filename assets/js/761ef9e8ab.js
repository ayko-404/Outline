
/* 10.11.2026: на телефоне карточки «Как начинаем» и список «Что в разборе» анимируются, когда сами попадают в экран */
(() => { if (!matchMedia('(max-width: 760px)').matches) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-vis'); io.unobserve(e.target); } }), { threshold: .45 });
  document.querySelectorAll('#kak-nachinaem .rm6__card, #kak-nachinaem .pn6').forEach(el => io.observe(el));
  /* «Услуги»: телефон уменьшен transform: scale(.62) — убрать пустое место, которое он занимал бы в полном размере */
  const fitPh = () => document.querySelectorAll('#uslugi .sv.is-act .sv__pic > .xph').forEach(x => { x.style.setProperty('margin-bottom', -Math.round(x.offsetHeight * (1 - .62)) + 'px', 'important'); });
  document.querySelectorAll('#uslugi .sv').forEach(sv => sv.addEventListener('click', () => requestAnimationFrame(fitPh)));
  addEventListener('resize', fitPh);
})();
