
(() => {
  const h1 = document.querySelector('.h1'), lead = document.querySelector('.lead');
  const plat = h1.querySelector('.platforms').outerHTML;
  const stroke = h1.querySelector('.word-accent svg').outerHTML;
  const V = {
    now: { html: h1.innerHTML, label: h1.getAttribute('aria-label'), lead: lead.innerHTML },
    offer: {
      html: `<span class="h1-line">Больше звонков и&nbsp;записей</span><span class="h1-line">с ${plat} <span class="word-accent">карт${stroke}</span></span>`,
      label: 'Больше звонков и записей с Яндекс Карт, 2ГИС и Google Maps',
      lead: 'Ведём карточки, отвечаем на&nbsp;отзывы и&nbsp;запускаем рекламу для одной точки и&nbsp;сетей филиалов.'
    }
  };
  const fb = [...document.querySelectorAll('.vsw [data-f]')];
  const setF = f => { document.body.dataset.flo = f; fb.forEach(x => x.setAttribute('aria-pressed', x.dataset.f === f)); };
  fb.forEach(x => x.addEventListener('click', () => setF(x.dataset.f))); setF('b');
  const lb = [...document.querySelectorAll('.vsw [data-l]')];
  lb.forEach(x => x.addEventListener('click', () => { window.__setLogo && window.__setLogo(x.dataset.l); lb.forEach(y => y.setAttribute('aria-pressed', y === x)); }));
  lb[0] && lb[0].setAttribute('aria-pressed', 'true');
  const tb = [...document.querySelectorAll('.vsw [data-t]')];
  const setT = t => { if (t === 'none') delete document.body.dataset.tag; else document.body.dataset.tag = t; tb.forEach(x => x.setAttribute('aria-pressed', x.dataset.t === t)); };
  tb.forEach(x => x.addEventListener('click', () => setT(x.dataset.t))); setT('b');
  const btns = [...document.querySelectorAll('.vsw [data-h]')];
  const set = k => { const v = V[k]; h1.innerHTML = v.html; h1.setAttribute('aria-label', v.label); lead.innerHTML = v.lead; window.__rewordH1 && window.__rewordH1(); btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.h === k)); if (location.hash !== '#' + k) history.replaceState(null, '', '#' + k); };
  btns.forEach(b => b.addEventListener('click', () => set(b.dataset.h)));
  set(location.hash === '#offer' ? 'offer' : 'now');
})();
