/* M01 / прогон 12: планшет растёт при прокрутке (как outcrowd.io), парящие карточки со сдвигом при скролле, тень шапки. */
(()=>{
  const stage=document.getElementById('stage');if(!stage)return;
  const mq=matchMedia('(prefers-reduced-motion: reduce)');
  const fl=[...stage.querySelectorAll('.fl')];const hdr=document.querySelector('.hdr');
  const S0=.84;let ticking=false,h=0;
  function measure(){stage.style.marginBottom='0px';h=stage.offsetHeight;}
  function apply(){
    ticking=false;const y=scrollY;
    const p=mq.matches?1:Math.min(1,Math.max(0,y/(innerHeight*.62)));
    const e=1-Math.pow(1-p,3),s=S0+(1-S0)*e;
    stage.style.transform='scale('+s.toFixed(4)+')';
    stage.style.marginBottom=(-(1-s)*h).toFixed(1)+'px';
    if(!mq.matches)fl.forEach(f=>{f.style.transform='translate3d(0,'+(-y*parseFloat(f.dataset.k||0)).toFixed(1)+'px,0)';});
    if(hdr)hdr.classList.toggle('is-stuck',y>8);
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(apply);}}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',()=>{measure();apply();});
  document.fonts&&document.fonts.ready.then(()=>{measure();apply();});measure();apply();
})();
