/* A1 / 09. Сменяемый тег и меню; без свечения и мыши, без canvas. */
(() => {
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const tag=document.querySelector('.signal-tag'),label=tag.querySelector('.signal-tag__text'),icon=tag.querySelector('.signal-tag__icon');
  const labels=['Геомаркетинговое агентство','От поиска — к вашей двери'];
  const icons=[
    '<path d="M8 15s5-4.7 5-8.5a5 5 0 0 0-10 0C3 10.3 8 15 8 15Z"/><circle cx="8" cy="6.5" r="1.5"/>',
    '<path d="m2 4 4-2 4 2 4-2v10l-4 2-4-2-4 2Z"/><path d="M6 2v10m4-8v10"/>',
    '<circle cx="3" cy="12" r="1.5"/><circle cx="13" cy="4" r="1.5"/><path d="M4.5 12h5a2.5 2.5 0 0 0 0-5h-3a2.5 2.5 0 0 1 0-5h3"/>',
    '<rect x="5.5" y="1.5" width="5" height="4" rx=".8"/><rect x="1" y="10" width="5" height="4" rx=".8"/><rect x="10" y="10" width="5" height="4" rx=".8"/><path d="M8 5.5v2H3.5V10M8 7.5h4.5V10"/>'
  ];
  icons.splice(3,1);icons.splice(1,1);
  let index=0,tagTimer,pending;
  function setTag(i){label.textContent=labels[i];icon.innerHTML='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">'+icons[i]+'</svg>';tag.dataset.index=i;}
  function nextTag(){
    if(document.hidden||motion.matches)return;
    // Measure the new intrinsic width; no hidden widest label or persistent min-width.
    const old=tag.getBoundingClientRect().width;tag.classList.remove('is-entering');tag.classList.add('is-leaving');
    pending=setTimeout(()=>{
      index=(index+1)%labels.length;tag.style.width='auto';setTag(index);
      const next=tag.getBoundingClientRect().width;tag.style.width=old+'px';void tag.offsetWidth;
      tag.style.width=next+'px';tag.classList.remove('is-leaving');tag.classList.add('is-entering');
      pending=setTimeout(()=>{tag.style.width='auto';},480);
    },180);
  }
  function setupTag(){clearInterval(tagTimer);clearTimeout(pending);tag.style.width='auto';tag.classList.remove('is-leaving','is-entering');if(motion.matches){index=0;setTag(0);}else tagTimer=setInterval(nextTag,3600);}
  setTag(0);setupTag();motion.addEventListener('change',setupTag);
  const toggle=document.querySelector('.nav-toggle'),nav=document.getElementById('primary-nav');
  function closeNav(){toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
  toggle.onclick=()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
  document.addEventListener('click',e=>{if(!e.target.closest('.hdr'))closeNav();});nav.addEventListener('click',e=>{if(e.target.closest('a'))closeNav();});
})();
