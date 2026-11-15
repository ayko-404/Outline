/* M01 / прогон 10: скользящая оранжевая пилюля у переключателя и подпись нижней кнопки по активной нише. */
(()=>{
  const tabs=document.getElementById('tabs'),plane=document.querySelector('.demo-plane');if(!tabs||!plane)return;
  const ind=document.createElement('span');ind.className='tab-ind';ind.setAttribute('aria-hidden','true');tabs.append(ind);
  const cta=document.createElement('a');cta.className='gb-cta';cta.href='#razbor';cta.innerHTML='<span class="gb-cta__label"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';plane.append(cta);
  const label=cta.firstChild;let last='';
  function sync(){const on=tabs.querySelector('.tab.on');if(!on)return;
    ind.style.width=on.offsetWidth+'px';ind.style.transform='translateX('+on.offsetLeft+'px)';
    const t='Разбор для: '+on.textContent.trim().toLowerCase();
    if(t!==last){if(last){cta.classList.add('is-swap');setTimeout(()=>{label.textContent=t;cta.classList.remove('is-swap');},180);}else label.textContent=t;last=t;}}
  new MutationObserver(sync).observe(tabs,{attributes:true,subtree:true,attributeFilter:['class']});
  addEventListener('resize',sync);document.fonts&&document.fonts.ready.then(sync);sync();
})();
