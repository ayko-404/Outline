
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ENDPOINT = '/lead.php';
  const TG = 'https://t.me/ivanb01';
  const OK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm3.56 6.17a1 1 0 0 0-1.39.27l-3.7 5.5-1.76-1.77a1 1 0 0 0-1.42 1.42l2.63 2.62a1 1 0 0 0 1.53-.14l4.38-6.5a1 1 0 0 0-.27-1.4Z"/></svg>';
  const BAD = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg>';
  const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  /* уведомление (ref-184) */
  let cur = null;
  const toast = (kind, title, sub) => {
    if (cur) cur.remove();
    const pos = document.createElement('div'); pos.className = 'lt-pos';
    pos.innerHTML = `<div class="lt-pill ${kind}" role="${kind === 'ok' ? 'status' : 'alert'}" aria-live="polite" style="width:3.5rem"><span class="lt-ic">${kind === 'ok' ? OK : BAD}</span></div>`;
    document.body.append(pos); cur = pos;
    const pill = pos.firstElementChild; let timers = [];
    const close = () => { timers.forEach(clearTimeout); pill.classList.add('is-leave'); setTimeout(() => pos.remove(), 220); document.removeEventListener('keydown', esc); };
    const esc = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc);
    timers.push(setTimeout(() => {
      pill.insertAdjacentHTML('beforeend', `<span class="lt-body"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span><button type="button" class="lt-x" aria-label="Закрыть уведомление">${X}</button></span>`);
      pill.querySelector('.lt-x').addEventListener('click', close);
      const need = Math.min(pill.scrollWidth + 8, innerWidth - 32);
      pill.classList.add('is-open'); pill.style.width = need + 'px';
    }, reduce ? 0 : 620));
    timers.push(setTimeout(close, kind === 'ok' ? 5200 : 7000));
  };
  window.__leadToast = toast;

  /* ошибка поля (ref-183): тряска, красная рамка, подпись под полем */
  const shake = el => { if (reduce || !el.animate) return; el.animate([0, -4, 3, -2, 1, 0].map(x => ({ transform: `translateX(${x}px)`, easing: 'ease-out' })), { duration: 260 }); };
  const setErr = (wrap, msg) => { if (!wrap) return; const p = wrap.querySelector('.lf__err'); wrap.classList.remove('is-err'); void wrap.offsetWidth; if (p) p.textContent = msg; wrap.classList.add('is-err'); const inp = wrap.querySelector('input'); inp && inp.setAttribute('aria-invalid', 'true'); shake(wrap); };
  const clearErr = wrap => { if (!wrap) return; wrap.classList.remove('is-err'); const inp = wrap.querySelector('input'); inp && inp.removeAttribute('aria-invalid'); };
  const MSG = { name: 'Как к вам обращаться?', phone: 'Проверьте номер — нужно 10 цифр после +7', agree: 'Нужно согласие на обработку данных' };

  /* телефон: +7 999 123-45-67 */
  const fmtPhone = v => { let d = v.replace(/\D/g, ''); if (d[0] === '8') d = '7' + d.slice(1); if (d && d[0] !== '7') d = '7' + d; d = d.slice(0, 11); const r = d.slice(1);
    let s = d ? '+7' : ''; if (r.length) s += ' ' + r.slice(0, 3); if (r.length > 3) s += ' ' + r.slice(3, 6); if (r.length > 6) s += '-' + r.slice(6, 8); if (r.length > 8) s += '-' + r.slice(8, 10); return s; };
  document.addEventListener('input', e => { const i = e.target; if (!i.closest || !i.closest('form[data-lead]')) return;
    if (i.name === 'phone') { const at = i.selectionEnd === i.value.length; i.value = fmtPhone(i.value); if (at) i.setSelectionRange(i.value.length, i.value.length); }
    clearErr(i.closest('.lf')); });
  document.addEventListener('change', e => { if (e.target.name === 'agree' && e.target.closest('form[data-lead]')) clearErr(e.target.closest('.lf')); });
  document.addEventListener('focusin', e => { const i = e.target; if (i.name === 'phone' && i.closest && i.closest('form[data-lead]') && !i.value) i.value = '+7 '; });

  document.addEventListener('submit', async e => {
    const f = e.target; if (!f.matches || !f.matches('form[data-lead]')) return;
    e.preventDefault(); if (f.classList.contains('is-busy')) return;
    const v = n => (f.elements[n] && f.elements[n].value || '').trim(), box = n => f.elements[n] && f.elements[n].closest('.lf');
    const bad = [];
    if (v('name').length < 2) bad.push('name');
    if (v('phone').replace(/\D/g, '').length !== 11) bad.push('phone');
    if (!(f.elements.agree && f.elements.agree.checked)) bad.push('agree');
    ['name', 'phone', 'agree'].forEach(n => bad.includes(n) ? setErr(box(n), MSG[n]) : clearErr(box(n)));
    if (bad.length) { const first = f.elements[bad[0]]; first && first.focus({ preventScroll: false }); return; }
    const fd = new FormData(); ['name', 'phone', 'link', 'website', 'tariff'].forEach(n => fd.append(n, v(n))); fd.append('agree', '1'); fd.append('page', location.pathname);
    const btn = f.querySelector('button[type=submit]'), label = btn && btn.textContent; f.classList.add('is-busy'); if (btn) btn.textContent = 'Отправляем…';
    let ok = false, err = '';
    try { const r = await fetch(ENDPOINT, { method: 'POST', body: fd }); const j = await r.json().catch(() => ({})); ok = !!j.ok; err = j.error || ('http ' + r.status); } catch (x) { err = 'net'; }
    f.classList.remove('is-busy'); if (btn) btn.textContent = label;
    if (ok) {
      f.reset(); f.querySelectorAll('.lf').forEach(clearErr);
      f.dispatchEvent(new CustomEvent('lead:sent'));
      const dlg = f.closest('dialog'); if (dlg && dlg.open) try { dlg.close(); } catch (x) {}
      toast('ok', 'Заявка отправлена', 'Ответим за 5 минут в рабочее время');
    } else if (MSG[err]) { setErr(box(err), MSG[err]); }
    else if (err === 'rate') { toast('err', 'Заявка уже отправлена', 'Подождите немного или <a href="' + TG + '" target="_blank" rel="noopener">напишите в Telegram</a>'); }
    else { toast('err', 'Не удалось отправить', '<a href="' + TG + '" target="_blank" rel="noopener">Напишите нам в Telegram</a> или позвоните'); }
  });
})();
