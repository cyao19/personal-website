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



// Little wandering goose. One tap immediately interrupts its walk and sends it running.
(() => {
  if (document.querySelector('.site-goose')) return;
  const goose = document.createElement('button');
  goose.type = 'button';
  goose.className = 'site-goose';
  goose.setAttribute('aria-label', 'Make the goose run away');
  goose.title = 'Tap the goose';
  goose.innerHTML = `<svg viewBox="0 0 160 150" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g class="goose-bob">
      <g class="goose-leg goose-leg-back"><path d="M69 112 L68 128 L55 133 L76 133" /></g>
      <g class="goose-leg goose-leg-front"><path d="M95 111 L97 128 L86 133 L108 133" /></g>
      <path class="goose-tail" d="M30 91 Q17 86 16 75 Q29 81 40 80" />
      <path class="goose-body-shape" d="M27 92 C29 75 44 66 66 66 C82 66 95 74 105 67 C113 61 112 43 111 25 C110 12 115 6 122 6 C132 6 135 13 133 23 C131 39 130 57 132 78 C134 101 117 116 92 118 C66 121 43 115 33 104 Q27 99 27 92 Z" />
      <path class="goose-wing" d="M44 87 C59 94 80 96 95 88 C85 104 63 108 47 99" />
      <path class="goose-bill" d="M133 21 L149 26 L133 30 Z" />
      <circle cx="126" cy="18" r="2" fill="#2e2a28" stroke="none" />
    </g>
  </svg>`;
  document.body.appendChild(goose);

  let walkAnimation = null;
  let runAnimation = null;
  let running = false;
  let visitTimeout = null;

  function hide() {
    goose.classList.remove('is-visible', 'is-running');
    goose.style.transform = '';
    running = false;
    walkAnimation = null;
    runAnimation = null;
  }

  function visit() {
    if (reduceMotion || document.hidden || running || walkAnimation) return;
    goose.classList.add('is-visible');
    walkAnimation = goose.animate(
      [{transform:'translate3d(-160px,0,0)'}, {transform:`translate3d(${window.innerWidth + 160}px,0,0)`}],
      {duration:13000, easing:'linear', fill:'forwards'}
    );
    walkAnimation.onfinish = hide;
  }

  goose.addEventListener('click', () => {
    if (running || !walkAnimation) return;
    running = true;
    // Capture the current position before canceling the walk. No second tap needed.
    const currentX = goose.getBoundingClientRect().left;
    walkAnimation.onfinish = null;
    walkAnimation.cancel();
    walkAnimation = null;
    goose.style.transform = `translate3d(${currentX}px,0,0)`;
    goose.classList.add('is-running');
    runAnimation = goose.animate(
      [{transform:`translate3d(${currentX}px,0,0)`},
       {transform:`translate3d(${window.innerWidth + 160}px,0,0)`}],
      {duration:750, easing:'cubic-bezier(.35,0,.85,.5)', fill:'forwards'}
    );
    runAnimation.onfinish = hide;
  });

  if (!reduceMotion) {
    visitTimeout = setTimeout(visit, 3500);
    setInterval(visit, 36000);
  }
})();
