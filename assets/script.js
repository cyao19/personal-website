const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const year=document.getElementById('year');year.textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
if(!reduceMotion){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.09});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
 const art=document.querySelector('.hero-art');let targetX=0,targetY=0,x=0,y=0;
 if(art){art.addEventListener('pointermove',e=>{const b=art.getBoundingClientRect();targetX=((e.clientX-b.left)/b.width-.5)*24;targetY=((e.clientY-b.top)/b.height-.5)*20});art.addEventListener('pointerleave',()=>{targetX=0;targetY=0});
 function animate(){x+=(targetX-x)*.065;y+=(targetY-y)*.065;art.style.setProperty('--mx',x.toFixed(2)+'px');art.style.setProperty('--my',y.toFixed(2)+'px');requestAnimationFrame(animate)}animate();}
}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}
let scheduled=false;function onScroll(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{const doc=document.documentElement;const max=doc.scrollHeight-innerHeight;document.querySelector('.progress').style.width=(max>0?scrollY/max*100:0)+'%';if(!reduceMotion){const about=document.querySelector('.about-visual');if(about){const r=about.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){const p=(innerHeight-r.top)/(innerHeight+r.height)-.5;about.style.setProperty('--scroll-offset',(p*38).toFixed(1)+'px')}}}scheduled=false})}addEventListener('scroll',onScroll,{passive:true});onScroll();

// Single-tap breathing control. The CSS animation and label use one shared state.
const breathButton=document.querySelector('.breath-button');
const breathStatus=document.querySelector('.breath-status');
const breathCore=breathButton?.querySelector('.breath-core');
const breathRing=breathButton?.querySelector('.breath-ring');
let breathing=false;
let breathFrame=0;
let breathStart=0;
let lastPhase=-1;
function updateBreath(now){
 if(!breathing)return;
 const phase=Math.floor((now-breathStart)/4000)%2;
 if(phase!==lastPhase){
  lastPhase=phase;
  const inhaling=phase===0;
  breathStatus.textContent=inhaling?'Inhale · expand':'Exhale · contract';
  breathCore.textContent=inhaling?'Inhale':'Exhale';
 }
 breathFrame=requestAnimationFrame(updateBreath);
}
breathButton?.addEventListener('click',()=>{
 breathing=!breathing;
 cancelAnimationFrame(breathFrame);
 breathButton.setAttribute('aria-pressed',String(breathing));
 breathButton.setAttribute('aria-label',breathing?'Stop breathing animation':'Start breathing animation');
 if(breathing){
  // Reset and begin immediately on the FIRST click, including on touch devices.
  breathRing.classList.remove('breathing');
  void breathRing.offsetWidth;
  breathRing.classList.add('breathing');
  breathStart=performance.now();
  lastPhase=-1;
  updateBreath(breathStart);
 }else{
  breathRing.classList.remove('breathing');
  breathStatus.textContent='Tap to begin';
  breathCore.textContent='Start';
 }
});


// A small wandering goose. Tap or press Enter/Space to send it running.
(() => {
  if (document.querySelector('.site-goose')) return;
  const goose = document.createElement('button');
  goose.type = 'button';
  goose.className = 'site-goose';
  goose.setAttribute('aria-label', 'Make the walking goose run away');
  goose.title = 'Tap the goose';
  goose.innerHTML = `<svg viewBox="0 0 140 130" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g class="goose-body">
      <path class="goose-outline goose-silhouette" d="M36 75 Q26 73 22 63 Q21 59 29 60 Q40 46 60 46 Q73 46 78 35 Q82 26 83 16 Q84 6 93 7 Q103 8 103 17 L103 24 L119 28 L103 32 Q99 44 99 57 Q99 83 79 91 Q52 101 36 75 Z"/>
      <path class="goose-outline goose-wing" d="M39 66 Q50 76 66 71"/>
      <circle cx="95" cy="17" r="2" fill="#302e2a"/>
      <path class="goose-beak" d="M103 24 L119 28 L103 32 Z"/>
      <g class="goose-leg goose-leg-one"><path class="goose-foot" d="M61 92 L59 108 L49 116 L65 116"/></g>
      <g class="goose-leg goose-leg-two"><path class="goose-foot" d="M78 92 L81 109 L74 117 L91 117"/></g>
    </g>
  </svg>`;
  document.body.appendChild(goose);

  let running = false;
  let resetTimer;
  const reset = () => {
    goose.classList.remove('is-walking', 'is-running');
    goose.style.left = '';
    goose.style.transform = '';
    running = false;
  };
  const visit = () => {
    if (document.hidden || running || goose.classList.contains('is-walking')) return;
    goose.classList.add('is-walking');
  };
  goose.addEventListener('click', () => {
    if (running || !goose.classList.contains('is-walking')) return;
    running = true;
    const x = goose.getBoundingClientRect().left;
    goose.classList.remove('is-walking');
    goose.style.left = `${x}px`;
    goose.style.transform = 'translate3d(0,0,0)';
    goose.classList.add('is-running');
    clearTimeout(resetTimer);
    resetTimer = setTimeout(reset, 950);
  });
  goose.addEventListener('animationend', event => {
    if (event.animationName === 'goose-cross') reset();
  });
  if (!reduceMotion) {
    setTimeout(visit, 3500);
    setInterval(visit, 36000);
  }
})();
