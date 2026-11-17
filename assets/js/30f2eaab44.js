
(() => {
  const ck = document.querySelector('.ol-ck'); if (!ck) return;
  let ok = false; try { ok = localStorage.getItem('ol-cookie') === '1'; } catch (e) {}
  if (ok) { ck.remove(); return; }
  ck.hidden = false; setTimeout(() => ck.classList.add('is-on'), 900);
  ck.querySelector('button').addEventListener('click', () => {
    try { localStorage.setItem('ol-cookie', '1'); } catch (e) {}
    ck.classList.remove('is-on'); setTimeout(() => ck.remove(), 450);
  });
})();
