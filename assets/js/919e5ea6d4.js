(() => { /* состояние страницы: ?status=ok — заявка принята, ?status=error — ошибка отправки, без параметра — прямое открытие */
  const q = new URLSearchParams(location.search).get('status'), k = q === 'ok' || q === 'error' ? q : 'direct';
  document.querySelectorAll('.m-th__st').forEach(x => { x.hidden = x.dataset.st !== k; });
  const r = document.querySelector('[data-retry]'); if (r) r.addEventListener('click', () => history.back()); })();