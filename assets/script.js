const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const year=document.getElementById('year');year.textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
if(!reduceMotion){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.09});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
 const art=document.querySelector('.hero-art');let targetX=0,targetY=0,x=0,y=0;
 art.addEventListener('pointermove',e=>{const b=art.getBoundingClientRect();targetX=((e.clientX-b.left)/b.width-.5)*24;targetY=((e.clientY-b.top)/b.height-.5)*20});art.addEventListener('pointerleave',()=>{targetX=0;targetY=0});
 function animate(){x+=(targetX-x)*.065;y+=(targetY-y)*.065;art.style.setProperty('--mx',x.toFixed(2)+'px');art.style.setProperty('--my',y.toFixed(2)+'px');requestAnimationFrame(animate)}animate();
}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}
let scheduled=false;function onScroll(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{const doc=document.documentElement;const max=doc.scrollHeight-innerHeight;document.querySelector('.progress').style.width=(max>0?scrollY/max*100:0)+'%';if(!reduceMotion){const about=document.querySelector('.about-visual');const r=about.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){const p=(innerHeight-r.top)/(innerHeight+r.height)-.5;about.style.setProperty('--scroll-offset',(p*38).toFixed(1)+'px')}}scheduled=false})}addEventListener('scroll',onScroll,{passive:true});onScroll();

// Opt-in guided breathing: four seconds expanding, four seconds contracting.
const breathButton=document.querySelector('.breath-button');
const breathStatus=document.querySelector('.breath-status');
const breathCore=breathButton.querySelector('.breath-core');
let breathTimer=null,breathStart=0;
function updateBreath(){
 const phase=Math.floor((performance.now()-breathStart)/4000)%2;
 const inhaling=phase===0;
 breathStatus.textContent=inhaling?'Inhale · expand':'Exhale · contract';
 breathCore.textContent=inhaling?'Inhale':'Exhale';
}
breathButton.addEventListener('click',()=>{
 const active=breathButton.getAttribute('aria-pressed')==='true';
 clearInterval(breathTimer);
 breathButton.setAttribute('aria-pressed',String(!active));
 if(active){breathStatus.textContent='Tap to begin';breathCore.textContent='Start';breathButton.setAttribute('aria-label','Start breathing animation');return;}
 breathStart=performance.now();
 breathButton.setAttribute('aria-label','Pause breathing animation');
 updateBreath();breathTimer=setInterval(updateBreath,100);
});
// Scroll-responsive instrumentation: a subtle nod to F1 telemetry.
let lastScroll=scrollY,lastStamp=performance.now(),displaySpeed=0;const speedNode=document.getElementById('velocity');const bars=[...document.querySelectorAll('.velocity-bars i')];
addEventListener('scroll',()=>{const now=performance.now();const elapsed=Math.max(16,now-lastStamp);const speed=Math.min(99,Math.round(Math.abs(scrollY-lastScroll)/elapsed*32));displaySpeed=speed;speedNode.textContent=String(speed).padStart(2,'0');bars.forEach((bar,i)=>bar.style.opacity=speed>(i*12)?'1':'.25');lastScroll=scrollY;lastStamp=now;},{passive:true});
