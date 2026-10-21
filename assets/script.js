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
