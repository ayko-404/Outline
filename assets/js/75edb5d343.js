
(() => {
  const inf = document.querySelector('.lg__inf'), base = inf && inf.querySelector('.lg__base'), glint = inf && inf.querySelector('.lg__glint');
  if (!inf || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const EIO = 'cubic-bezier(0.77, 0, 0.175, 1)';   // --ease-in-out из motion.md
  const RUN = {
    // А: разрыв проходит полный круг — знак «прокручивается» по своей петле; 64 → −36 — тот же кадр, стык без скачка
    a: () => base.animate([{ strokeDashoffset: 64 }, { strokeDashoffset: -36 }], { duration: 1800, easing: EIO }),
    // Б: объёмный оборот вокруг вертикальной оси
    b: () => inf.animate([{ transform: 'perspective(240px) rotateY(0deg)' }, { transform: 'perspective(240px) rotateY(360deg)' }], { duration: 1400, easing: EIO }),
    // В: светлый блик пробегает по неподвижному знаку
    c: () => glint.animate([{ strokeDasharray: '14 86', strokeDashoffset: 64, opacity: 0 }, { opacity: .9, offset: .15 }, { opacity: .9, offset: .8 }, { strokeDasharray: '14 86', strokeDashoffset: -36, opacity: 0 }], { duration: 1700, easing: 'linear' }),
  };
  const EVERY = { a: 7000, b: 9000, c: 6500 };
  let mode = document.body.dataset.logo || 'a', busy = null, timer = 0;
  const play = () => { if (busy) return; busy = RUN[mode](); busy.onfinish = busy.oncancel = () => { busy = null; }; };
  const loop = () => { clearInterval(timer); timer = setInterval(() => { if (!document.hidden) play(); }, EVERY[mode]); };
  setTimeout(play, 1200); loop();
  inf.closest('a, .lg').addEventListener('pointerenter', play);
  window.__setLogo = m => { mode = m; document.body.dataset.logo = m; if (busy) busy.cancel(); play(); loop(); };
})();
