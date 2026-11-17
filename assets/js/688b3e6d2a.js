/* Посадочная «Яндекс Карты»: обложка «разбор карточки», чек с ценой, появление перенесённого блока площадок. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seen = (els, cb, th = .35) => { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } }), { threshold: th }); els.forEach(el => el && io.observe(el)); };




  /* страницы услуг: светлая изометрия «карточка заполняется» — когда окно видно */
  seen([$('.p-work__win')], el => el.classList.add('is-in'), .35);

  /* обложка: метки с галочками появляются по одной, когда виден телефон */
  seen([$('.p-cva__vis')], el => el.classList.add('is-in'), .3);

  /* ситуации и «Состав сопровождения»: сцены запускаются, когда видна сама карточка */

  /* чек (13.11, Никита: «чтобы выдвигались по скроллу»): бумага выезжает из принтера вместе с прокруткой —
     начинает, когда принтер входит снизу экрана, выезжает целиком к верхней трети; строки «печатаются», когда выходят из щели,
     сумма досчитывается, когда показалось «Итого»; прокрутка назад — бумага уезжает обратно */
  const rc = $('.p-rc');
  if (rc) {
    const sum = $('.p-rc__sum', rc), to = +sum.dataset.to, fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, '\u00a0') + '\u00a0₽';
    if (reduce || matchMedia('(max-width: 760px)').matches) { rc.classList.add('is-in', 'is-static'); sum.textContent = fmt(to); }   // 17.11 (Никита): на телефоне чек показан сразу целиком, без выезда по прокрутке
    else {
      rc.classList.add('is-scroll'); sum.textContent = fmt(0);
      const paper = $('.p-rc__paper', rc), parts = [...rc.querySelectorAll('.p-rc__l, .p-rc__tot, .p-rc__bar, .p-rc__foot')], tot = $('.p-rc__tot', rc);
      let counted = false, raf = 0;
      const count = () => { counted = true; const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - k, 3); sum.textContent = fmt(to * e); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
      const upd = () => {
        raf = 0;
        const vh = innerHeight, top = rc.getBoundingClientRect().top, H = paper.offsetHeight;
        const p = Math.min(1, Math.max(0, (vh * .8 - top) / (vh * .55)));
        rc.style.setProperty('--rc-y', ((p - 1) * 100).toFixed(2) + '%');
        const hidden = (1 - p) * H;   // бумага выезжает нижним краем вперёд: видно всё ниже hidden
        parts.forEach(el => el.classList.toggle('is-pr', el.offsetTop + el.offsetHeight * .4 >= hidden));
        if (!counted && tot.classList.contains('is-pr')) count();
      };
      const req = () => { if (!raf) raf = requestAnimationFrame(upd); };
      addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); upd();
    }
  }

  /* «С вашей стороны»: сообщение в мессенджере — сначала «печатает», затем появляется */
  const note = $('.p-note');
  if (note) seen([note], el => { el.classList.add('is-in'); setTimeout(() => el.classList.add('is-typed'), reduce ? 0 : 1600); }, .4);

  /* поп-апы вместо прокрутки к якорям: «Получить бесплатный разбор» → форма, «Сколько стоит» → чек с ценой */
  (() => {
    const ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    const mk = (cls, html) => { const d = document.createElement('dialog'); d.className = 'p-pop ' + cls; d.innerHTML = `<div class="p-pop__box"><button class="p-pop__x" type="button" aria-label="Закрыть">×</button>${html}</div>`; document.body.append(d);
      d.querySelector('.p-pop__x').addEventListener('click', () => d.close()); d.addEventListener('click', e => { if (e.target === d) d.close(); }); d.addEventListener('close', () => document.documentElement.classList.remove('p-lock')); return d; };
    const tg = (document.querySelector('a[href*="t.me/"]') || {}).href || 'https://t.me/ivanb01';
    const tgIco = (document.querySelector('.cx__tg span') || {}).innerHTML || '';   // значок — тот же, что под формой CTA
    const form = mk('p-pop--form', `<p class="p-pop__t">Бесплатный <em>разбор</em> карточки</p><p class="p-pop__lead">Пришлите ссылку на&nbsp;карточку или название бизнеса и&nbsp;город. Покажем, что исправить в&nbsp;первую очередь.</p>
      <form class="o-form" data-lead novalidate><div class="o-form__who"><span class="o-form__av"><img loading="lazy" decoding="async" src="${(document.querySelector('.cx__av img') || {}).src || ''}" alt=""></span><span><b>Иван, сооснователь</b><small>Ответит за&nbsp;5&nbsp;минут в&nbsp;рабочее время</small></span></div>
      <div class="lf"><input class="o-field" type="text" name="name" placeholder="Имя" aria-label="Имя" autocomplete="name" required><p class="lf__err" role="alert"></p></div>
      <div class="lf"><input class="o-field" type="tel" name="phone" placeholder="Телефон" aria-label="Телефон" autocomplete="tel" inputmode="tel" required><p class="lf__err" role="alert"></p></div>
      <div class="lf"><input class="o-field" type="text" name="link" placeholder="Ссылка на карточку" aria-label="Ссылка на карточку в Яндекс Картах, 2ГИС или Google Maps" inputmode="url"><p class="lf__err" role="alert"></p></div>
      <input type="text" name="website" class="lf__trap" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="tariff" value="">
      <div class="lf lf--agree"><label class="o-check-field"><input type="checkbox" name="agree" value="1"><span>Согласен на&nbsp;<a href="${((document.querySelector('.plate__logo') || {}).getAttribute ? document.querySelector('.plate__logo').getAttribute('href') : '') || ''}policy/">обработку персональных данных</a></span></label><p class="lf__err" role="alert"></p></div>
      <button class="o-btn o-btn--primary o-btn--lg o-btn--block" type="submit">Получить бесплатный разбор</button>
      <a class="cx__tg p-pop__tg" href="${tg}" target="_blank" rel="noopener"><span>${tgIco}</span>или напишите в&nbsp;Telegram</a></form>
      <div class="p-pop__done"><b>Заявка принята</b><span>Ответим в&nbsp;течение 5&nbsp;минут в&nbsp;рабочее время.</span></div>`);
    const f = form.querySelector('form');
    /* 17.11: отправка — общий обработчик форм с data-lead (src/leadform.html); после успеха закрываем окно */
    f.addEventListener('lead:sent', () => { try { form.close(); } catch (x) {} });
    /* 14.11 (Никита: «плохо вмещаются поп-апы в экран»): если содержимое выше окна — поп-ап целиком уменьшается под высоту (не меньше 0,75), без прокрутки внутри; на телефоне — прокрутка как была */
    const fit = d => { const b = d.querySelector('.p-pop__box'); if (!b) return; b.style.zoom = ''; b.style.maxHeight = '';
      if (innerWidth <= 700) return; const avail = innerHeight - 32, need = b.scrollHeight;
      if (need > avail) { const z = Math.max(.75, avail / need); b.style.zoom = z; b.style.maxHeight = (avail / z) + 'px'; } };
    addEventListener('resize', () => document.querySelectorAll('.p-pop[open]').forEach(fit));
    const open = (d, tariff) => { if (d === form) { form.classList.remove('is-sent'); f.tariff.value = tariff || ''; } document.documentElement.classList.add('p-lock'); d.showModal(); fit(d); };
    const rc = document.querySelector('#tarify .p-rc');
    let price = null;
    if (rc) {
      const c = rc.cloneNode(true); c.classList.add('is-in'); c.classList.remove('is-scroll'); c.style.removeProperty('--rc-y'); c.removeAttribute('id');
      const sum = c.querySelector('.p-rc__sum'); if (sum) sum.textContent = (+sum.dataset.to).toLocaleString('ru-RU').replace(/\s/g, '\u00a0') + '\u00a0₽';
      const btn = document.querySelector('#tarify .o-btn--primary'), name = btn ? btn.textContent.trim() : 'Выбрать тариф';
      price = mk('p-pop--price', `<p class="p-pop__t">Сколько <em>стоит</em></p><div class="p-pop__rc"></div><div class="p-pop__acts"><button class="o-btn o-btn--primary o-btn--lg o-btn--block" type="button" data-go>${name} ${ARR}</button><button class="o-btn o-btn--lg o-btn--block" type="button" data-tf>Сравнить все тарифы</button></div>`);
      price.querySelector('.p-pop__rc').append(c);
      price.querySelector('[data-go]').addEventListener('click', () => { price.close(); open(form, (rc.getAttribute('aria-label') || '').split('»')[0].replace('Тариф «', '')); });
    }
    /* 13.11 (Никита): «Сравнить тарифы» — поп-ап со всеми тарифами в стиле главной (карточки — из шаблона #tf-tpl, его кладёт сборка) */
    const tpl = document.getElementById('tf-tpl');
    let tfp = null;
    if (tpl) {
      const tfLink = document.querySelector('.plate a[href$="tarify/"]'), more = tfLink ? tfLink.getAttribute('href') + '#sravnenie' : '';
      tfp = mk('p-pop--tf', `<p class="p-pop__t">Тарифы на&nbsp;<em>сопровождение</em></p><p class="p-pop__lead">Выберите формат работы: Яндекс Карты, ведение на&nbsp;трёх площадках или усиленное продвижение.</p><div class="p-pop__tf"></div>${more ? `<a class="p-pop__more" href="${more}">Подробное сравнение тарифов ${ARR}</a>` : ''}`);
      tfp.querySelector('.p-pop__tf').append(tpl.content.cloneNode(true));
      tfp.addEventListener('click', e => { const b = e.target.closest('.tf__btn'); if (!b) return; e.preventDefault(); tfp.close(); open(form, b.textContent.replace('Выбрать', '').trim()); });
    }
    /* 14.11 (Никита): «Сравнить тарифы» / «Сравнить все тарифы» ведут к таблице сравнения на странице «Тарифы» (/tarify/#sravnenie), а не в поп-ап */
    const tfA = document.querySelector('.plate a[href$="tarify/"], a[href$="tarify/"]');
    const onTf = /\/tarify\/?$/.test(location.pathname);
    const cmpUrl = onTf ? '#sravnenie' : (tfA ? tfA.getAttribute('href') + '#sravnenie' : '');
    const goCmp = () => { if (onTf) { const s = document.getElementById('sravnenie'); s && s.scrollIntoView({ behavior: 'smooth', block: 'start' }); } else if (cmpUrl) location.href = cmpUrl; };
    if (cmpUrl) document.querySelectorAll('a').forEach(a => { if (/^Сравнить/.test(a.textContent.trim()) && !a.closest('.p-pop')) a.setAttribute('href', cmpUrl); });
    if (price && cmpUrl) price.querySelector('[data-tf]').addEventListener('click', () => { price.close(); goCmp(); });
    else if (price && tfp) price.querySelector('[data-tf]').addEventListener('click', () => { price.close(); open(tfp); });
    else if (price) price.querySelector('[data-tf]').replaceWith(Object.assign(document.createElement('a'), { className: 'o-btn o-btn--lg o-btn--block', href: '../#tarify', textContent: 'Сравнить все тарифы' }));
    document.addEventListener('click', e => {
      const a = e.target.closest('a'); if (!a || a.closest('#razbor, .p-pop')) return;
      const href = a.getAttribute('href') || '', txt = a.textContent.trim();
      let d = null;
      if (href === '#razbor') d = form;
      else if (href === '#tarify') d = price || tfp;
      else if (tfp && /tarify\/?$|#tarify$/.test(href) && /^Сколько стоит/.test(txt)) d = tfp;
      if (!d) return;
      e.preventDefault(); e.stopPropagation(); open(d);
    }, true);
  })();

  /* 2ГИС, «Карточка, по которой удобно выбрать компанию»: вопрос клиента ↔ слово в тексте Ивана ↔ строка карточки подсвечиваются вместе */
  const iv = $('.iv');
  if (iv) {
    const qs = [...iv.querySelectorAll('.iq-q')], rs = [...iv.querySelectorAll('.iq .iq-r')], ms = [...(iv.closest('section') || iv).querySelectorAll('.iq-m')];
    let k = -1, tm = 0;
    const set = n => { k = n; [qs, rs, ms].forEach(arr => arr.forEach(x => x.classList.toggle('is-on', +x.dataset.q === k))); };
    const run = () => { clearInterval(tm); set(0); if (!reduce) tm = setInterval(() => set((k + 1) % qs.length), 1800); };
    [...qs, ...ms].forEach(x => x.addEventListener('pointerenter', () => { clearInterval(tm); set(+x.dataset.q); }));
    iv.addEventListener('pointerleave', run);
    seen([iv], run, .3);
  }
})();
