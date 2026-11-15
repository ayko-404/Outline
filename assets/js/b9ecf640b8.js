/* A1 / 05. Illustrative search → ranking → route → opened business profile. */
(() => {
  const $ = id => document.getElementById(id);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const niches = [
    {tab:'Стоматологии',q:'стоматология рядом',name:'Ваша клиника',cat:'Стоматология',grow:38,photo:'/Outline/assets/img/1ca44cc691.svg',alt:'Иллюстрация интерьера стоматологической клиники',book:'Записаться',review:'Нашла клинику на картах — записалась за минуту. Внимательные врачи, всё объяснили. Рекомендую!'},
    {tab:'Автосервисы',q:'автосервис рядом',name:'Ваш автосервис',cat:'Автосервис',grow:46,photo:'/Outline/assets/img/1abb8722d3.svg',alt:'Иллюстрация автомобиля в сервисном центре',book:'Записаться',review:'Быстро нашла сервис рядом с домом. Приняли вовремя, всё показали и объяснили. Теперь только сюда.'},
    {tab:'Кофейни',q:'кофейня рядом',name:'Ваша кофейня',cat:'Кофейня',grow:52,photo:'/Outline/assets/img/427176b576.svg',alt:'Иллюстрация: уютный интерьер кофейни',book:'Меню',review:'Нашла это место на картах и зашла за кофе. Очень уютно, вкусный завтрак и приветливые ребята!'},
    {tab:'Салоны красоты',q:'салон красоты рядом',name:'Ваш салон',cat:'Салон красоты',grow:41,photo:'/Outline/assets/img/be4cb9e0ea.svg',alt:'Иллюстрация: светлый интерьер салона красоты',book:'Записаться',review:'Выбрала салон по отзывам и осталась очень довольна. Легко записаться, отличный мастер. Обязательно вернусь!'}
  ];
  const tabs=$('tabs'),list=$('list'),pins=$('pins'),plane=document.querySelector('.demo-plane'),win=document.querySelector('.win'),side=document.querySelector('.side'),profile=$('business-card');
  let token=0,current=0,toastTimer;
  const wait = ms => new Promise(resolve=>setTimeout(resolve,ms));
  const pinSVG='<svg width="16" height="20" viewBox="0 0 20 26" aria-hidden="true"><path fill="currentColor" d="M10 0C4.5 0 0 4.4 0 9.8 0 17 10 26 10 26s10-9 10-16.2C20 4.4 15.5 0 10 0zm0 13.6a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6z"/></svg>';
  niches.forEach((n,i)=>{const b=document.createElement('button');b.className='tab';b.type='button';b.textContent=n.tab;b.setAttribute('aria-pressed','false');b.onclick=()=>run(i,true);tabs.append(b);});
  function closeProfile(){profile.hidden=true;profile.inert=true;side.classList.remove('profile-open');win.classList.remove('has-profile');plane.dataset.phase='route';}
  function openProfile(manual=false){
    if(manual)token++;
    const n=niches[current];
    $('profile-name').textContent=n.name;$('profile-category').textContent=n.cat;$('profile-photo').src=n.photo;$('profile-photo').alt=n.alt;$('book-label').textContent=n.book;$('review-text').textContent=n.review;
    profile.hidden=false;profile.inert=false;side.classList.add('profile-open');win.classList.add('has-profile');plane.dataset.phase='profile';
    $('cursor').style.opacity=0;
  }
  $('profile-back').onclick=()=>{token++;closeProfile();list.querySelector('.org.me')?.focus({preventScroll:true});};
  document.querySelectorAll('[data-demo-action]').forEach(b=>b.onclick=()=>{
    token++;clearTimeout(toastTimer);$('demo-toast').textContent=b.dataset.demoAction;$('demo-toast').classList.add('is-visible');
    toastTimer=setTimeout(()=>$('demo-toast').classList.remove('is-visible'),2600);
  });
  $('go').onclick=()=>run(current,true);
  function listing(me,n,k){
    return `<div class="ph">${me?pinSVG:''}</div><div><div class="nm">${me?n.name:'<span class="bl" style="width:'+([62,48,70][k%3])+'%"></span>'}${me?'<span class="tag-top">ПЕРВЫЙ В ВЫДАЧЕ</span>':''}</div><div class="meta"><span class="star">★ ${me?'4,9':['4,1','3,9','4,0'][k%3]}</span><span>${n.cat}</span>${me?'<span>·</span><span>Открыто до 21:00</span>':''}</div><div class="acts"><span>Позвонить</span><span>Маршрут</span>${me?'<span>'+n.book+'</span>':''}</div></div>`;
  }
  async function run(i,manual=false){
    const my=++token,n=niches[i];current=i;const instant=motion.matches;
    const pause=async ms=>{if(!instant)await wait(ms);return my===token;};
    closeProfile();plane.dataset.phase='search';clearTimeout(toastTimer);$('demo-toast').classList.remove('is-visible');
    [...tabs.children].forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-pressed',String(k===i));});
    ['fRoute','fCalls','fReview','route'].forEach(id=>$(id).classList.remove('in'));
    $('map').classList.remove('live');$('go').classList.remove('press');$('q').textContent='';list.innerHTML='';pins.innerHTML='';$('cnt').textContent='0';
    [...$('bars').children].forEach(b=>b.style.height='0');$('cursor').style.opacity=0;
    if(!await pause(manual?120:450))return;
    if(instant)$('q').textContent=n.q;
    else for(const ch of n.q){if(my!==token)return;$('q').textContent+=ch;if(!await pause(65))return;}
    $('go').classList.add('press');if(!await pause(150))return;$('go').classList.remove('press');
    plane.dataset.phase='results';
    const rows=[false,false,true,false].map((me,k)=>{
      const el=document.createElement('div');el.className='org'+(me?' me':'');el.style.top=k*7+'rem';el.innerHTML=listing(me,n,k);list.append(el);
      if(me){el.role='button';el.tabIndex=0;el.setAttribute('aria-label','Открыть карточку: '+n.name);el.onclick=()=>openProfile(true);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProfile(true);}};}
      return el;
    });
    for(const el of rows){if(my!==token)return;el.classList.add('in');if(!await pause(110))return;}
    for(const [x,y] of [[34,30],[70,24],[78,58],[24,46],[62,70],[86,36]]){const p=document.createElement('span');p.className='pin in';p.style.left=x+'%';p.style.top=y+'%';p.innerHTML='<i></i>';pins.append(p);}
    if(!await pause(650))return;
    rows[2].style.top='0rem';rows[0].style.top='7rem';rows[1].style.top='14rem';
    if(!await pause(650))return;rows[2].classList.add('top');plane.dataset.phase='ranked';
    const p=document.createElement('button');p.type='button';p.className='pin me in';p.style.left='56%';p.style.top='36%';p.innerHTML='<i></i><span class="lbl">'+n.name+'</span>';p.setAttribute('aria-label','Открыть карточку: '+n.name);p.onclick=()=>openProfile(true);pins.append(p);
    $('map').classList.add('live');if(!await pause(400))return;
    plane.dataset.phase='route';$('route').classList.add('in');$('fRoute').classList.add('in');
    if(!await pause(500))return;$('fCalls').classList.add('in');
    [30,38,34,46,52,78].forEach((h,k)=>$('bars').children[k].style.height=h+'%');
    const start=performance.now();
    function count(t){if(my!==token)return;const v=instant?1:Math.min(1,(t-start)/900);$('cnt').textContent=Math.round(n.grow*v);if(v<1)requestAnimationFrame(count);}
    count(start);
    if(!await pause(1500))return;
    if(!instant){const r=rows[2].getBoundingClientRect(),d=plane.getBoundingClientRect(),cur=$('cursor');cur.style.left=(r.left-d.left+r.width*.6)+'px';cur.style.top=(r.top-d.top+r.height*.5)+'px';cur.style.opacity=1;if(!await pause(650))return;}
    openProfile();
    if(instant)return;
    if(!await pause(7200))return;
    run((i+1)%niches.length);
  }
  motion.addEventListener('change',()=>run(current,true));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)token++;else run(current,true);});
  window.addEventListener('pagehide',()=>{token++;clearTimeout(toastTimer);});
  run(0);
})();
