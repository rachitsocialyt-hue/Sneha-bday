(() => {
  'use strict';

  const pages = [
    { title: 'Welcome', render: page1 },
    { title: 'Party', render: page2 },
    { title: 'Cake', render: page3 },
    { title: 'Scratch', render: page4 },
    { title: 'Letter', render: page5 },
    { title: 'Photos', render: page6 },
    { title: 'Final', render: page7 }
  ];
  let current = 0;
  let busy = false;
  let musicStarted = false;
  const layer = document.getElementById('pageLayer');
  const book = document.getElementById('book');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const counter = document.getElementById('pageCounter');
  const audio = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function ambient(pageIndex) {
    const root = document.getElementById('ambient');
    root.innerHTML = '';
    if (pageIndex === 6) return;
    const items = ['🍺','🎂','🧁','❤️','✨'];
    items.forEach((emoji, i) => {
      const el = document.createElement('span');
      el.className = 'float-item';
      el.textContent = emoji;
      el.style.animationDelay = `${-(Math.random()*4.5).toFixed(2)}s`;
      root.appendChild(el);
    });
  }

  function render(index, direction = 'next') {
    const newPage = document.createElement('section');
    newPage.className = 'page under-page';
    newPage.setAttribute('aria-label', `${pages[index].title} page`);
    pages[index].render(newPage);
    layer.innerHTML = '';
    layer.appendChild(newPage);
    ambient(index);
    counter.textContent = `${index + 1} / ${pages.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;
    if (index === 6) nextBtn.style.display = 'none'; else nextBtn.style.display = '';
    if (index === 0) prevBtn.style.visibility = 'hidden'; else prevBtn.style.visibility = 'visible';
  }

  function turn(to) {
    if (busy || to < 0 || to >= pages.length || to === current) return;
    busy = true;
    const oldPage = layer.firstElementChild;
    const direction = to > current ? 'next' : 'prev';
    const newPage = document.createElement('section');
    newPage.className = 'page under-page';
    newPage.setAttribute('aria-label', `${pages[to].title} page`);
    pages[to].render(newPage);
    layer.appendChild(newPage);
    oldPage.classList.add('turning');
    if (direction === 'prev') oldPage.classList.add('reverse');
    current = to;
    ambient(current);
    counter.textContent = `${current + 1} / ${pages.length}`;
    prevBtn.disabled = current === 0; nextBtn.disabled = current === pages.length - 1;
    if (current === 6) nextBtn.style.display = 'none'; else nextBtn.style.display = '';
    if (current === 0) prevBtn.style.visibility = 'hidden'; else prevBtn.style.visibility = 'visible';
    setTimeout(() => {
      oldPage.remove();
      busy = false;
      if (current === 4) setupTyping();
      if (current === 3) setupScratch();
      if (current === 2) setupCake();
      if (current === 1) setupBottle();
    }, 820);
  }

  function startMusic() {
    if (!audio) return;
    audio.volume = 0.36;
    audio.play().then(() => {
      musicStarted = true;
      musicToggle.textContent = '🔊';
      musicToggle.setAttribute('aria-label','Pause background music');
    }).catch(() => showToast('Tap the music button to start the song'));
  }
  function toggleMusic() {
    if (audio.paused) startMusic();
    else { audio.pause(); musicToggle.textContent = '🔇'; musicToggle.setAttribute('aria-label','Play background music'); }
  }
  musicToggle.addEventListener('click', toggleMusic);

  function page1(el) {
    el.innerHTML = `<div class="decor"><div class="float-item">🍺</div><div class="float-item">🎂</div><div class="float-item">🧁</div><div class="float-item">❤️</div><div class="float-item">✨</div></div>
      <div class="eyebrow">A little birthday scrapbook</div>
      <h1 class="title">Happy Birthday,<br>Sneha ❤️</h1>
      <div class="subtitle">made with love by Rachit</div>
      <p class="body">A tiny journey made just for you. Turn the page and let the birthday begin. 🫶</p>
      <button id="startBtn" class="start-btn">Start the Journey →</button>`;
    el.querySelector('#startBtn').addEventListener('click', () => { startMusic(); turn(1); });
  }

  function page2(el) {
    el.innerHTML = `<div class="eyebrow">Page 02 · Let the party begin</div>
      <h2 class="title" style="font-size:clamp(2.7rem,6vw,5rem)">Happy Birthday Party,<br>Sneha! 🎉</h2>
      <div class="bottle-wrap"><span class="cap-ring"></span><button class="bottle" id="bottle" aria-label="Tap bottle cap">🍺</button></div>
      <div class="guide"><strong>🍺 Wanna open the bottle?</strong><br>📱 Shake your phone <b>or</b> 👆 tap the cap</div>
      <div id="partyText" class="celebrate">CHEERS! 🍻</div>
      <p class="body" id="partySub">Your little birthday party is waiting for you. 😭🫶</p>`;
    setupBottle(el);
  }

  let shakeLast = 0, shakeHandler = null;
  function setupBottle(root = document) {
    const bottle = root.querySelector('#bottle'); if (!bottle) return;
    bottle.onclick = () => popBottle(bottle, root);
    if (shakeHandler) window.removeEventListener('devicemotion', shakeHandler);
    shakeHandler = e => {
      const a = e.accelerationIncludingGravity; if (!a) return;
      const mag = Math.abs(a.x||0)+Math.abs(a.y||0)+Math.abs(a.z||0);
      const now = Date.now();
      if (mag > 32 && now - shakeLast > 1000) { shakeLast = now; popBottle(bottle, root); }
    };
    window.addEventListener('devicemotion', shakeHandler, {passive:true});
  }
  function popBottle(bottle, root) {
    if (bottle.dataset.opened) return;
    bottle.dataset.opened = '1'; bottle.classList.add('shake');
    setTimeout(() => bottle.textContent = '🍾', 260);
    setTimeout(() => {
      const text = root.querySelector('#partyText'); if (text) text.classList.add('show');
      burst(root, ['🫧','🍺','🎉','❤️','✨']);
      showToast('Cheers, Sneha! 🍻');
    }, 420);
  }

  function page3(el) {
    el.innerHTML = `<div class="eyebrow">Page 03 · Make a wish</div>
      <h2 class="title" style="font-size:clamp(2.5rem,6vw,4.6rem)">Cut the Cake 🎂</h2>
      <div class="cake-zone" id="cakeZone"><div class="cake" id="cake">🎂</div><div class="knife" id="knife" aria-label="Swipe the knife">🔪</div><div class="cut-line" id="cutLine"></div></div>
      <p class="body"><strong>Make a wish first…</strong><br>Then swipe the knife across the cake →</p>
      <div id="cakeResult" class="celebrate">HAPPY BIRTHDAY! 🎉<br><span style="font-size:.65em">You got 20! ✨</span></div>`;
    setupCake(el);
  }
  function setupCake(root=document) {
    const knife=root.querySelector('#knife'), zone=root.querySelector('#cakeZone'); if(!knife||!zone) return;
    let dragging=false,startX=0,startY=0;
    const move=(e)=>{if(!dragging)return; const p=e.touches?e.touches[0]:e; const dx=p.clientX-startX,dy=p.clientY-startY; knife.style.transform=`translate(${Math.max(-20,Math.min(zone.clientWidth-100,dx))}px,${Math.max(-10,Math.min(180,dy))}px) rotate(-25deg)`; if(Math.abs(dx)>zone.clientWidth*.45 && Math.abs(dy)<zone.clientHeight*.42) cutCake(root);};
    const up=()=>{dragging=false;};
    const down=e=>{dragging=true;const p=e.touches?e.touches[0]:e;startX=p.clientX;startY=p.clientY;};
    knife.addEventListener('pointerdown',down); window.addEventListener('pointermove',move); window.addEventListener('pointerup',up); knife.addEventListener('touchstart',down,{passive:true}); window.addEventListener('touchmove',move,{passive:true}); window.addEventListener('touchend',up);
    knife.addEventListener('click',()=>{ if(!root.querySelector('#cake')?.classList.contains('cut')) showToast('Swipe the knife across the cake →'); });
  }
  function cutCake(root){const cake=root.querySelector('#cake');if(!cake||cake.classList.contains('cut'))return;cake.classList.add('cut');root.querySelector('#cutLine').classList.add('show');setTimeout(()=>root.querySelector('#cakeResult').classList.add('show'),450);burst(root,['🎉','❤️','✨','🧁']);}

  function page4(el){
    el.innerHTML=`<div class="eyebrow">Page 04 · A little reveal</div><h2 class="title" style="font-size:clamp(2.4rem,6vw,4.3rem)">Something About You 🫶</h2>
      <div class="scratch-wrap" id="scratchWrap"><img src="assets/images/sneha-scratch.jpg" alt="Sneha holding a flower" loading="lazy"><canvas id="scratchCanvas"></canvas></div>
      <div class="scratch-hint">✨ <b>Scratch the card</b> to reveal the picture</div>
      <p class="body" style="max-width:700px;margin-top:10px">There’s something about your smile, your little expressions, and the way you make ordinary moments feel special… it’s genuinely rare. ❤️</p>`;
    setupScratch(el);
  }
  function setupScratch(root=document){const wrap=root.querySelector('#scratchWrap'),canvas=root.querySelector('#scratchCanvas');if(!wrap||!canvas)return;const ctx=canvas.getContext('2d',{willReadFrequently:false});let drawing=false,covered=true;function resize(){const r=wrap.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0);ctx.fillStyle='#d9d2d6';ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle='rgba(255,255,255,.18)';for(let x=-r.height;x<r.width+r.height;x+=28){ctx.save();ctx.translate(x,0);ctx.rotate(-.6);ctx.fillRect(0,0,10,r.height*2);ctx.restore()}ctx.fillStyle='#755765';ctx.font='600 16px DM Sans';ctx.textAlign='center';ctx.fillText('SCRATCH HERE ✨',r.width/2,r.height/2)}resize();let scratched=0;function point(e){const r=canvas.getBoundingClientRect();const p=e.touches?e.touches[0]:e;return{x:p.clientX-r.left,y:p.clientY-r.top}}function scratch(e){if(!drawing)return;e.preventDefault();const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(p.x,p.y,28,0,Math.PI*2);ctx.fill();scratched++;if(scratched%18===0)check()}function check(){try{const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;for(let i=3;i<data.length;i+=24){if(data[i]<30)clear++}if(clear/(data.length/24)>.42&&!canvas.dataset.done){canvas.dataset.done='1';burst(root,['❤️','✨','🌻']);showToast('There she is. 🫶')}}catch{}}canvas.addEventListener('pointerdown',e=>{drawing=true;scratch(e)});canvas.addEventListener('pointermove',scratch);window.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('touchstart',e=>{drawing=true;scratch(e)},{passive:false});canvas.addEventListener('touchmove',scratch,{passive:false});canvas.addEventListener('touchend',()=>drawing=false);window.addEventListener('resize',()=>{if(!canvas.dataset.resized){canvas.dataset.resized='1';setTimeout(()=>{canvas.dataset.resized='';resize()},150)}})}

  function page5(el){
    el.innerHTML=`<div class="eyebrow">Page 05 · A few words from me</div><h2 class="title" style="font-size:clamp(2.3rem,5.5vw,4.1rem)">And then… there's this smile. 🫶</h2>
      <div class="video-frame"><video src="assets/video/sneha-video.mp4" playsinline muted loop preload="metadata" controls></video></div>
      <p class="body" style="margin:8px 0 10px">Seriously Sneha, there's something about your smile… it just makes everything look a little better. ❤️</p>
      <div class="letter"><div class="typing" id="letterText"></div><span id="cursor" class="cursor"></span></div>`;
  }
  const letterText=`Happy Birthdayyy Sneha 🫶❤️\n\nyrr honestly idk kaha se start kru 😭 but aaj tera birthday h toh kuch toh likhna bnta h...\n\nsabse pehle, happiest birthdayyy 🫶🎂 I genuinely hope ki tu hamesha khush rhe, haste rhe and jo bhi tu chahti h life mein vo tujhe mile.\n\nand haan... tu jitni achi dikhti h na, usse kahi zyada achi tu as a person h. tere andar jo little little things h na, wahi tujhe different banati h.\n\nwe've had our moments, good ones, complicated ones... but still, jo memories hain na, they're genuinely special to me. and I guess some people, no matter what happens, will always have a special place somewhere. ❤️\n\nbas aaj ke din itna hi bolunga — keep smiling, keep being the same crazy/beautiful Sneha 😭🫶\n\nI hope this new year of your life brings you a lot of happiness, peace, success and obviously... bohot saari parties 😂🍻\n\nHappy 20th Birthday once again, Sneha. ❤️ Have the best dayyy. You deserve it. 🫶\n\n— Rachit ❤️`;
  let typingTimer;
  function setupTyping(){const target=document.getElementById('letterText'),cursor=document.getElementById('cursor');if(!target)return;clearInterval(typingTimer);target.textContent='';let i=0;typingTimer=setInterval(()=>{target.textContent=letterText.slice(0,i++);if(i>letterText.length){clearInterval(typingTimer);if(cursor)cursor.style.display='none'}},12)}

  function page6(el){
    el.innerHTML=`<div class="eyebrow">Page 06 · Okay, but look at you 😭</div><h2 class="title" style="font-size:clamp(2.4rem,6vw,4.5rem)">You’re Beautiful, Sneha 🌷</h2>
      <div class="photo-wall">
        <div class="wall-card"><img src="assets/images/sneha-1.jpg" alt="Sneha in a pink dress" loading="lazy"><div class="wall-caption">effortlessly pretty ❤️</div></div>
        <div class="wall-card"><img src="assets/images/sneha-2.jpg" alt="Sneha with a small plush toy" loading="lazy"><div class="wall-caption">that smile though 🫶</div></div>
        <div class="wall-card"><img src="assets/images/sneha-3.jpg" alt="Sneha smiling" loading="lazy"><div class="wall-caption">just… beautiful ✨</div></div>
        <div class="wall-card"><img src="assets/images/sneha-4.jpg" alt="Sneha looking to the side" loading="lazy"><div class="wall-caption">pretty without even trying 🌷</div></div>
      </div>
      <p class="body" style="margin:8px 0 0;max-width:720px">Your smile, your style, the way you carry yourself… there’s something really beautiful about you. You don’t even have to try too hard — you just have this effortless kind of beauty that makes you stand out. ❤️</p>
      <div class="thanks"><b>Big thanks to Akshita for providing all of your photos ❤️🫶</b></div>`;
  }

  function page7(el){
    el.classList.add('final-page');
    el.innerHTML=`<div class="heart-rain" aria-hidden="true"></div><div class="eyebrow">Page 07 · One last thing</div>
      <h2 class="title">Happiest Birthday,<br>Sneha! 🎂❤️</h2>
      <div class="final-message"><p><strong>Sneha you are always be my so special one ❤️🫶</strong></p><p>& I know we're not together now.. but I really tried my best to make u feel I'm there with you that's why I made a small website for you❤️</p><p>I hope this little surprise made you smile, even for a moment. 🫶</p></div>
      <div class="signature">Yours Rachit 🫶</div>`;
    const rain=el.querySelector('.heart-rain');for(let i=0;i<22;i++){const s=document.createElement('span');s.textContent=i%3?'❤️':'🫶';s.style.left=`${Math.random()*100}%`;s.style.animationDuration=`${5+Math.random()*6}s`;s.style.animationDelay=`${-Math.random()*8}s`;s.style.setProperty('--drift',`${(Math.random()-.5)*160}px`);rain.appendChild(s)}
  }

  function burst(root, emojis){for(let i=0;i<18;i++){const s=document.createElement('span');s.textContent=emojis[Math.floor(Math.random()*emojis.length)];s.style.position='absolute';s.style.left=`${15+Math.random()*70}%`;s.style.top=`${35+Math.random()*25}%`;s.style.fontSize=`${18+Math.random()*22}px`;s.style.zIndex='20';s.style.pointerEvents='none';s.animate([{transform:'translate(0,0) scale(.5)',opacity:0},{transform:`translate(${(Math.random()-.5)*260}px,${(Math.random()-.5)*230}px) scale(1.1)`,opacity:1,offset:.45},{transform:`translate(${(Math.random()-.5)*360}px,${-140-Math.random()*180}px) scale(.6)`,opacity:0}],{duration:1100+Math.random()*600,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>s.remove();root.appendChild(s)}}

  nextBtn.addEventListener('click',()=>turn(current+1)); prevBtn.addEventListener('click',()=>turn(current-1));
  let sx=0,sy=0;book.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});book.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.2){turn(current+(dx<0?1:-1))}},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')turn(current+1);if(e.key==='ArrowLeft')turn(current-1);if(e.code==='Space'){e.preventDefault();toggleMusic()}});

  render(0);
})();
