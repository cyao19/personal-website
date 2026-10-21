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


// Small wandering goose. Added on both pages without editing their HTML.
(() => {
  if (reduceMotion || document.querySelector('.site-goose')) return;
  const goose = document.createElement('button');
  goose.type = 'button';
  goose.className = 'site-goose';
  goose.setAttribute('aria-label', 'Honk at the wandering goose');
  goose.title = 'Say hello to the goose';
  goose.innerHTML = `<span class="goose-honk" aria-hidden="true">honk!</span>
    <svg viewBox="0 0 112 94" role="img" aria-label="Little white goose with an orange beak and feet">
      <g class="goose-legs" fill="none" stroke="#d58c4e" stroke-width="3.5" stroke-linecap="round">
        <path d="M46 67 L45 82 L35 84 M45 82 L52 85"/><path d="M65 66 L65 81 L56 84 M65 81 L73 84"/>
      </g>
      <path d="M19 45 Q11 40 9 32 Q23 39 34 39 C44 34 58 34 68 39 C77 30 72 20 73 12 C74 2 85 1 91 8 C96 14 92 23 89 29 L88 47 C86 64 72 72 51 72 C32 72 20 63 19 45 Z" fill="#fffefa" stroke="#666275" stroke-width="1.6" stroke-linejoin="round"/>
      <path class="goose-wing" d="M27 46 Q46 40 65 49 Q54 62 34 57" fill="#f1edf3" stroke="#8b8496" stroke-width="1.25"/>
      <path d="M91 14 L106 18 L92 23 Z" fill="#e8a15d" stroke="#b87845" stroke-width="1.1"/>
      <circle cx="85" cy="12" r="2.15" fill="#3d3a42"/>
    </svg>`;
  document.body.appendChild(goose);
  let honkTimer;
  goose.addEventListener('click', () => {
    goose.classList.add('is-honking');
    clearTimeout(honkTimer);
    honkTimer = setTimeout(() => goose.classList.remove('is-honking'), 1100);
  });
  function wander() {
    if (document.hidden) return;
    goose.classList.remove('is-walking', 'is-honking');
    // Restart the walk from the left on each visit.
    void goose.offsetWidth;
    goose.classList.add('is-walking');
  }
  goose.addEventListener('animationend', (e) => {
    if (e.animationName === 'goose-cross') goose.classList.remove('is-walking');
  });
  // A quiet surprise, not a constant animation.
  setTimeout(wander, 3500);
  setInterval(wander, 36000);
})();
