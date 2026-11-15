(() => { /* поиск и рубрики: по заголовку и описанию + по рубрике */
  const inp = document.querySelector('.m-bls input'), tabs = [...document.querySelectorAll('.m-btab')], none = document.querySelector('.m-blg__none'); if (!inp) return;
  let cat = 'all';
  const run = () => { const q = inp.value.trim().toLowerCase(); let k = 0;
    document.querySelectorAll('.m-blg [data-q]').forEach(c => { const on = (!q || c.dataset.q.includes(q)) && (cat === 'all' || c.dataset.cat === cat); c.hidden = !on; if (on && c.offsetParent !== null) k++; });
    none.hidden = k > 0; };
  inp.addEventListener('input', run);
  tabs.forEach(b => b.addEventListener('click', () => { cat = b.dataset.cat; tabs.forEach(x => x.setAttribute('aria-pressed', x === b)); run(); }));
  document.addEventListener('click', e => { if (e.target.closest('.p-vsw [data-vg="bl"]')) setTimeout(run, 0); }); })();