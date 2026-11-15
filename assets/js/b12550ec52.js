
(() => {
  /* «Скоро»: href="#", пустой, или якорь на блок, которого на странице нет (кроме окон разбора и тарифов) */
  const OK = new Set(['razbor', 'tarify', 'top']);
  const soon = a => { const h = a.getAttribute('href'); if (h == null) return false; if (h === '' || h === '#') return true;
    if (h[0] === '#') { const id = h.slice(1); return !OK.has(id) && !document.getElementById(id); } return false; };
  const tip = document.createElement('span'); tip.className = 'soon-tip'; tip.textContent = 'Скоро'; tip.setAttribute('aria-hidden', 'true');
  let cur = null, tm = 0;
  const show = a => { if (!tip.isConnected) document.body.append(tip); const r = a.getBoundingClientRect();
    tip.style.left = (r.left + r.width / 2) + 'px'; tip.style.top = r.top + 'px'; tip.classList.add('on'); cur = a; };
  const hide = () => { tip.classList.remove('on'); cur = null; };
  document.addEventListener('mouseover', e => { const a = e.target.closest('a'); if (a && a !== cur && soon(a)) { a.classList.add('is-soon'); show(a); } else if (!a && cur) hide(); });
  document.addEventListener('mouseout', e => { if (cur && !cur.contains(e.relatedTarget)) hide(); });
  document.addEventListener('click', e => { const a = e.target.closest('a'); if (!a || !soon(a)) return; e.preventDefault(); show(a); clearTimeout(tm); tm = setTimeout(hide, 1400); }, true);
  addEventListener('scroll', () => cur && hide(), { passive: true });
})();
