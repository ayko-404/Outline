
(() => {
  /* сцены «Услуг» стартуют, только когда блок дошёл до экрана: до этого анимации выключены (иначе первая сцена отыгрывает заранее) */
  const sec = document.getElementById('uslugi'); if (!sec) return; const box = sec.querySelector('.svc3') || sec;
  const chk = () => { if (sec.getBoundingClientRect().top < innerHeight * .5) { box.dataset.seen = '1'; removeEventListener('scroll', chk); } };
  addEventListener('scroll', chk, { passive: true }); chk();
})();
