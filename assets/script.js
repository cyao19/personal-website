// One activation per gesture. Stationary controls activate on release so scrolling
// over a button is not mistaken for a tap; moving geese react at first contact.
// Shared across controls: a house tap can reveal the goose under the pointer.
// The compatibility click must not become a second activation on that new target.
let lastPointer = -Infinity;
function bindTap(element, activate, {moving = false} = {}) {
 if (!element) return;
 let gesture = null;
 const reset = () => { gesture = null; };
 element.addEventListener('keydown', event => {
  // Native button activation still handles Enter / Space, including rapid keyboard use.
  if (event.key === 'Enter' || event.key === ' ') lastPointer = -Infinity;
 });
 element.addEventListener('pointerdown', event => {
  if (event.button !== 0 || event.isPrimary === false) return;
  if (moving) {
   event.preventDefault(); lastPointer = performance.now(); activate(); return;
  }
  gesture = {id:event.pointerId, x:event.clientX, y:event.clientY};
 });
 element.addEventListener('pointermove', event => {
  if (gesture && event.pointerId === gesture.id &&
      Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 10) {
   reset(); lastPointer = performance.now();
  }
 });
 element.addEventListener('pointercancel', () => { reset(); lastPointer = performance.now(); });
 element.addEventListener('pointerleave', reset);
 element.addEventListener('pointerup', event => {
  if (!gesture || event.pointerId !== gesture.id) return;
  const tap = Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) <= 10;
  reset(); lastPointer = performance.now();
  if (tap) { event.preventDefault(); activate(); }
 });
 element.addEventListener('click', event => {
  // Suppress compatibility clicks, including detail=0 clicks from touch browsers.
  if (performance.now() - lastPointer < 750) { event.preventDefault(); return; }
  activate(); // keyboard, assistive technology, and browsers without Pointer Events
 });
}
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const year=document.getElementById('year');year.textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
bindTap(menu,()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
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
bindTap(breathButton,()=>{
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
  goose.innerHTML = `<svg viewBox="0 0 150 125" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g class="goose-bob">
      <g class="goose-leg goose-leg-back"><path d="M66 95 L64 108 L57 114 L72 114"/></g>
      <g class="goose-leg goose-leg-front"><path d="M87 95 L90 108 L83 114 L99 114"/></g>
      <path class="goose-tail" d="M33 78 Q24 78 20 71 Q30 73 39 69"/>
      <path class="goose-body-shape" d="M29 79 Q29 62 45 56 Q59 50 76 57 Q86 60 94 55 Q100 49 103 33 L108 17 Q110 8 119 8 Q128 8 130 17 Q131 22 128 28 Q121 38 120 54 Q119 73 112 84 Q102 100 77 101 Q52 102 38 92 Q29 86 29 79 Z"/>
      <path class="goose-wing" d="M43 76 Q54 84 68 82 Q61 89 51 87"/>
      <path class="goose-bill" d="M130 18 L143 22 L130 25 Z"/>
      <circle cx="123" cy="17" r="1.8" fill="#302e2a" stroke="none"/>
    </g>
  </svg>`;
  document.body.appendChild(goose);

  // Home-page resident uses the original goose artwork, with one cancellable state machine.
  const yard = document.querySelector('.goose-yard');
  if (yard) {
    yard.appendChild(goose);
    goose.classList.add('resident-goose', 'is-visible');
    const house = yard.querySelector('.goose-house');
    const status = document.getElementById('goose-status');
    let timer, movement, state = 'outside', visible = false, current = .76;
    function stop() { clearTimeout(timer); if (movement) { const left = goose.getBoundingClientRect().left - yard.getBoundingClientRect().left; movement.cancel(); movement = null; goose.style.left = left + "px"; } }
    function place(fraction) { current = fraction; goose.style.left = (fraction * yard.clientWidth - goose.offsetWidth / 2) + 'px'; }
    function label(text) { status.textContent = text; }
    function nap() {
      stop(); state = 'sleeping'; place(.5);
      goose.classList.add('is-inside'); goose.classList.remove('is-walking', 'is-running');
      goose.inert = true; house.classList.add('is-sleeping');
      house.setAttribute('aria-label', 'Wake the goose'); label('A little nap. Tap the house to wake me.');
      if (visible && !reduceMotion) timer = setTimeout(hello, 14000);
    }
    function move(to, duration, done) {
      stop(); goose.classList.add('is-walking');
      goose.classList.toggle('faces-left', to < current);
      const from = goose.offsetLeft, target = to * yard.clientWidth - goose.offsetWidth / 2;
      place(to);
      if (reduceMotion) { goose.classList.remove('is-walking'); done(); return; }
      movement = goose.animate([{left: from + 'px'}, {left: target + 'px'}], {duration, easing: 'ease-in-out'});
      movement.onfinish = () => { movement = null; goose.classList.remove('is-walking'); done(); };
    }
    function home() {
      state = 'returning'; label('Heading home…');
      move(.5, 1800, nap);
    }
    function hello() {
      stop(); state = 'emerging'; goose.inert = false;
      goose.classList.remove('is-inside', 'is-running'); house.classList.remove('is-sleeping');
      house.setAttribute('aria-label', 'Call the goose home'); label('Hello! Tap me and I’ll hurry home.');
      move(.76, 1600, () => {
        state = 'outside';
        if (visible && !reduceMotion) timer = setTimeout(home, 7000);
      });
    }
    bindTap(house, () => {
      if (state === 'emerging') return;
      if (state === 'sleeping' || state === 'returning') hello();
      else home();
    });
    bindTap(goose, () => {
      if (state === 'sleeping') { hello(); return; }
      if (state === 'emerging' || goose.classList.contains('is-running')) return;
      state = 'returning'; goose.classList.add('is-running');
      label('Home, quick!'); move(.5, 550, nap);
    }, {moving:true});
    goose.setAttribute('aria-label', 'Send the goose running home');
    place(.76);
    const observer = new IntersectionObserver(entries => {
      clearTimeout(timer);
      visible = entries[0].isIntersecting && !document.hidden;
      if (!visible) clearTimeout(timer);
      else if (!reduceMotion && state === 'outside') timer = setTimeout(home, 6500);
      else if (!reduceMotion && state === 'sleeping') timer = setTimeout(hello, 10000);
    }, {threshold: .2}); observer.observe(yard);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { visible = false; clearTimeout(timer); }
      else { const r = yard.getBoundingClientRect(); visible = r.bottom > 0 && r.top < innerHeight;
        if (visible && !reduceMotion && state !== 'emerging') { clearTimeout(timer); timer = setTimeout(state === 'sleeping' ? hello : home, 6500); }
      }
    });
    // Mobile browser bars resize the viewport height while scrolling. Only a real
    // yard-width change should reposition the goose or finish its journey.
    let yardWidth = yard.clientWidth;
    window.addEventListener('resize', () => {
      if (yard.clientWidth === yardWidth) return;
      yardWidth = yard.clientWidth;
      if (state === 'returning') nap();
      else {
        stop(); place(current); goose.classList.remove('is-walking');
        if (state === 'emerging') state = 'outside';
        if (visible && !reduceMotion) timer = setTimeout(state === 'sleeping' ? hello : home, 7000);
      }
    });
    return;
  }


  let walkAnimation = null;
  let runAnimation = null;
  let running = false;
  let visitTimeout = null;

  function hide() {
    goose.classList.remove('is-visible', 'is-running');
    goose.style.transform = '';
    running = false;
    if (walkAnimation) { walkAnimation.onfinish = null; walkAnimation.cancel(); }
    if (runAnimation) { runAnimation.onfinish = null; runAnimation.cancel(); }
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

  function runAway() {
    if (running || !walkAnimation) return;
    running = true;
    const currentX = goose.getBoundingClientRect().left;
    walkAnimation.onfinish = null;
    walkAnimation.cancel();
    walkAnimation = null;
    goose.style.transform = `translate3d(${currentX}px,0,0)`;
    goose.classList.add('is-running');
    runAnimation = goose.animate(
      [{transform:`translate3d(${currentX}px,0,0)`},
       {transform:`translate3d(${window.innerWidth + 160}px,0,0)`}],
      {duration:700, easing:'cubic-bezier(.35,0,.85,.5)', fill:'forwards'}
    );
    runAnimation.onfinish = hide;
  }
  bindTap(goose, runAway, {moving:true});

  if (!reduceMotion) {
    visitTimeout = setTimeout(visit, 3500);
    setInterval(visit, 36000);
  }
})();
