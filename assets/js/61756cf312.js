
/* HOME-POPUPS — поп-апы главной: разбор и кейсы */
(() => {
  const ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const mk = (cls, html) => { const d = document.createElement('dialog'); d.className = 'hp-pop ' + cls; d.innerHTML = `<div class="hp-pop__box"><button class="hp-pop__x" type="button" aria-label="Закрыть"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>${html}</div>`; document.body.append(d);
    d.querySelector('.hp-pop__x').addEventListener('click', () => d.close()); d.addEventListener('click', e => { if (e.target === d) d.close(); }); d.addEventListener('close', () => document.documentElement.classList.remove('hp-lock')); return d; };
  const open = d => { document.documentElement.classList.add('hp-lock'); d.showModal(); };
  const init = () => {
    const form = document.getElementById('cta8-form');
    let pf = null;
    if (form) {
      pf = mk('hp-pop--form', '<p class="hp-pop__t">Бесплатный <em>разбор</em> карточки</p><p class="hp-pop__lead">Пришлите ссылку на&nbsp;карточку или название бизнеса и&nbsp;город. Покажем, что исправить в&nbsp;первую очередь.</p><div class="hp-pop__slot"></div>');
      const mark = document.createComment('cta8-form');
      pf.addEventListener('close', () => { if (mark.parentNode) { mark.replaceWith(form); } });
      pf.__fill = () => { if (!mark.parentNode) form.replaceWith(mark); pf.querySelector('.hp-pop__slot').append(form); };
    }
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href="#razbor"]'); if (!a || a.closest('#razbor, .hp-pop')) return;
      const d = pf; if (!d) return;
      e.preventDefault(); e.stopPropagation();
      const menu = a.closest('[class*="mn-"], .mn'); if (menu) { const x = document.querySelector('.mn-close, [data-mn-close]'); if (x) x.click(); }
      if (d === pf) pf.__fill();
      open(d);
    }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
