document.addEventListener('DOMContentLoaded',()=>{
  const canvas=document.getElementById('game');
  const ctx=canvas.getContext('2d');

  const loadingEl=document.getElementById('loading');
  const welcomeOverlay=document.getElementById('welcomeOverlay');
  const startBtn=document.getElementById('startBtn');

  const progressText=document.getElementById('progressText');
  const aseBar=document.getElementById('aseBar');
  const weekBar=document.getElementById('weekBar');
  const flowBar=document.getElementById('flowBar');
  const asePct=document.getElementById('asePct');
  const weekPct=document.getElementById('weekPct');
  const flowPct=document.getElementById('flowPct');

  const modalOverlay=document.getElementById('modalOverlay');
  const modalBox=modalOverlay.querySelector('.modalBox');
  const modalTag=document.getElementById('modalTag');
  const modalTitle=document.getElementById('modalTitle');
  const modalBody=document.getElementById('modalBody');
  const closeBtn=document.getElementById('closeBtn');
  const restartBtn=document.getElementById('restartBtn');

  const joystickZone=document.getElementById('joystickZone');
  const joystickStick=document.getElementById('joystickStick');
  const btnAction=document.getElementById('btnAction');

  const btnRotate=document.getElementById('btnRotate');
  const btnBack=document.getElementById('btnBack');
  const rotateHint=document.getElementById('rotateHint');
  const rotateNowBtn=document.getElementById('rotateNowBtn');
  const rotateCloseBtn=document.getElementById('rotateCloseBtn');

  const dayButtons=document.querySelectorAll('.day-btn');
  const quickAccessDetails=document.querySelector('.quickAccessDetails');

  canvas.width=GAME.width;
  canvas.height=GAME.height;

  const visited=new Set();
  const keys={};
  let started=false;
  let rotateDismissed=false;
  let lastFocus=null;
  let currentMode='station';

  const player={x:MAIN_PATH.minX,y:MAIN_PATH.y,speed:3};
  let moveVec={x:0,y:0};
  let joystickActive=false;

  function isMobileLike(){
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function isModalOpen(){
    return modalOverlay.style.display==='flex';
  }

  function updateHud(){
    const total=Object.keys(MAP_STATIONS).length;
    const done=visited.size;
    const pct=total?Math.round(done/total*100):0;

    progressText.textContent=`${done}/${total} días`;
    aseBar.style.width=pct+'%';
    weekBar.style.width=pct+'%';
    flowBar.style.width=pct+'%';
    asePct.textContent=pct+'%';
    weekPct.textContent=pct+'%';
    flowPct.textContent=pct+'%';
  }

  function getFocusableInModal(){
    return [...modalOverlay.querySelectorAll('button,a[href],summary,[tabindex]:not([tabindex="-1"])')]
      .filter(el=>!el.disabled&&el.offsetParent!==null);
  }

  function trapFocusInModal(e){
    if(!isModalOpen()||e.key!=='Tab') return;
    const f=getFocusableInModal();
    if(!f.length) return;

    const first=f[0];
    const last=f[f.length-1];

    if(e.shiftKey&&document.activeElement===first){
      e.preventDefault();
      last.focus();
    }else if(!e.shiftKey&&document.activeElement===last){
      e.preventDefault();
      first.focus();
    }
  }

  function closeModal(){
    modalOverlay.style.display='none';
    modalOverlay.setAttribute('aria-hidden','true');
    document.removeEventListener('keydown',trapFocusInModal);
    if(lastFocus&&typeof lastFocus.focus==='function') lastFocus.focus();
  }

  function buildStationModalContent(s){
    return `
      ${s.imagen ? `<img src="${s.imagen}" alt="${s.nombre || 'Imagen del día'}" class="stationImage">` : ''}
      ${s.areas ? `<p><strong>Áreas responsables:</strong> ${s.areas}</p>` : ''}
      ${s.resumen ? `<p><strong>Resumen del día:</strong> ${s.resumen}</p>` : ''}
      <details class="detailsBlock">
        <summary>Ver más detalles</summary>
        <div class="detailsContent">
          ${s.contexto ? `<p><strong>Contexto:</strong> ${s.contexto}</p>` : ''}
          ${s.enfoque ? `<p><strong>Propósito pedagógico:</strong> ${s.enfoque}</p>` : ''}
          ${s.metodologia ? `<p><strong>Actividad central:</strong> ${s.metodologia}</p>` : ''}
          ${s.tics ? `<p><strong>TIC:</strong> ${s.tics}</p>` : ''}
          ${s.aportes ? `<p><strong>Aportes:</strong> ${s.aportes}</p>` : ''}
          ${s.criterioClave ? `<p><strong>Criterio de seguimiento:</strong> ${s.criterioClave}</p>` : ''}
          ${s.evidencia ? `<p><strong>Evidencia observable:</strong> ${s.evidencia}</p>` : ''}
          ${s.instrumento ? `<p><strong>Instrumento sugerido:</strong> ${s.instrumento}</p>` : ''}
        </div>
      </details>
    `;
  }

  function openStation(key,triggerEl=null){
    if(typeof STATIONS==='undefined'||!STATIONS[key]) return;

    currentMode='station';
    restartBtn.classList.add('hidden');
    closeBtn.textContent='Cerrar';

    const s=STATIONS[key];
    visited.add(key);
    updateHud();

    lastFocus=triggerEl||document.activeElement;
    modalTag.textContent=s.zona||'DÍA';
    modalTitle.textContent=s.nombre||'';
    modalBody.innerHTML=buildStationModalContent(s);

    modalOverlay.style.display='flex';
    modalOverlay.setAttribute('aria-hidden','false');
    document.addEventListener('keydown',trapFocusInModal);

    const firstFocusable=getFocusableInModal()[0];
    if(firstFocusable) firstFocusable.focus();
    else modalBox.focus();

    updateRotateHint();
  }

  function openEnding(triggerEl=null){
    currentMode='ending';
    restartBtn.classList.remove('hidden');
    closeBtn.textContent='Cerrar';

    lastFocus=triggerEl||document.activeElement;
    modalTag.textContent=ENDING.tag;
    modalTitle.textContent=ENDING.title;
    modalBody.innerHTML=ENDING.paragraphs.map(p=>`<p>${p}</p>`).join('');

    modalOverlay.style.display='flex';
    modalOverlay.setAttribute('aria-hidden','false');
    document.addEventListener('keydown',trapFocusInModal);

    const firstFocusable=getFocusableInModal()[0];
    if(firstFocusable) firstFocusable.focus();
    else modalBox.focus();

    updateRotateHint();
  }

  function resetGame(){
    visited.clear();
    updateHud();
    closeModal();

    player.x=MAIN_PATH.minX;
    player.y=MAIN_PATH.y;
    moveVec.x=0;
    moveVec.y=0;
    joystickActive=false;
    centerStick();

    started=false;
    rotateDismissed=false;
    welcomeOverlay.style.display='flex';
    updateRotateHint();
  }

  function interact(triggerEl=null){
    const nearby=getNearbyStation(player);
    const nearExit=getNearbyExit(player);

    if(nearby){
      openStation(nearby.key,triggerEl);
    }else if(nearExit){
      openEnding(triggerEl);
    }
  }

  function getKeyboardVector(){
    let dx=0,dy=0;
    if(keys['arrowleft']||keys['a']) dx-=1;
    if(keys['arrowright']||keys['d']) dx+=1;
    if(keys['arrowup']||keys['w']) dy-=1;
    if(keys['arrowdown']||keys['s']) dy+=1;
    return{dx,dy};
  }

  function getInputVector(){
    const kb=getKeyboardVector();
    let dx=kb.dx+moveVec.x;
    let dy=kb.dy+moveVec.y;

    dx=Math.max(-1,Math.min(1,dx));
    dy=Math.max(-1,Math.min(1,dy));

    return{dx,dy};
  }

  function updateMovement(){
    if(!started||isModalOpen()) return;

    const{dx,dy}=getInputVector();
    const branch=getNearestBranch(player,48);
    const onBranch=branch&&Math.abs(player.x-branch.x)<=3&&player.y<branch.baseY;

    if(onBranch){
      if(dy<-.15){
        player.y-=player.speed*Math.abs(dy);
        if(player.y<branch.topY) player.y=branch.topY;
      }

      if(dy>.15){
        player.y+=player.speed*Math.abs(dy);
        if(player.y>branch.baseY) player.y=branch.baseY;
      }

      if(dx<-.15){
        player.y=branch.baseY;
        player.x-=player.speed*Math.abs(dx);
      }

      if(dx>.15){
        player.y=branch.baseY;
        player.x+=player.speed*Math.abs(dx);
      }
    }else{
      if(dx<-.15) player.x-=player.speed*Math.abs(dx);
      if(dx>.15) player.x+=player.speed*Math.abs(dx);

      if(dy<-.15&&branch){
        player.x+=(branch.x-player.x)*.3;
        player.y-=player.speed*Math.abs(dy);

        if(Math.abs(player.x-branch.x)<1.2) player.x=branch.x;
        if(player.y<branch.topY) player.y=branch.topY;
      }

      if(dy>.15){
        player.y=MAIN_PATH.y;
      }
    }

    clampPlayerToWalkable(player);
  }

  function loop(){
    updateMovement();
    drawScene(ctx,player,visited);
    requestAnimationFrame(loop);
  }

  function centerStick(){
    joystickStick.style.left='31px';
    joystickStick.style.top='31px';
  }

  function updateJoystick(clientX,clientY){
    if(isModalOpen()) return;

    const rect=joystickZone.getBoundingClientRect();
    const cx=rect.left+rect.width/2;
    const cy=rect.top+rect.height/2;

    let dx=clientX-cx;
    let dy=clientY-cy;
    const max=rect.width/2-16;
    const dist=Math.hypot(dx,dy);

    if(dist>max){
      dx=dx/dist*max;
      dy=dy/dist*max;
    }

    joystickStick.style.left=`${31+dx}px`;
    joystickStick.style.top=`${31+dy}px`;

    moveVec.x=dx/max;
    moveVec.y=dy/max;
    joystickActive=true;
  }

  function endJoystick(){
    moveVec.x=0;
    moveVec.y=0;
    joystickActive=false;
    centerStick();
  }

  async function requestLandscape(){
    const root=document.documentElement;
    try{
      if(root.requestFullscreen) await root.requestFullscreen();
      if(screen.orientation&&screen.orientation.lock) await screen.orientation.lock('landscape');
    }catch(err){}
  }

  async function exitLandscape(){
    try{
      if(screen.orientation&&screen.orientation.unlock) screen.orientation.unlock();
    }catch(err){}

    try{
      if(document.fullscreenElement&&document.exitFullscreen) await document.exitFullscreen();
    }catch(err){}

    rotateDismissed=false;
    updateRotateHint();
  }

  function updateRotateHint(){
    if(!rotateHint||!isMobileLike()) return;

    const portrait=window.matchMedia('(orientation: portrait)').matches;
    const shouldShow=started&&portrait&&!isModalOpen()&&!rotateDismissed;

    rotateHint.classList.toggle('show',!!shouldShow);
  }

  function canvasPointToGame(clientX,clientY){
    const rect=canvas.getBoundingClientRect();
    const scaleX=canvas.width/rect.width;
    const scaleY=canvas.height/rect.height;

    return{
      x:(clientX-rect.left)*scaleX,
      y:(clientY-rect.top)*scaleY
    };
  }

  function nearestTappedStation(point){
    let best=null;

    for(const key in MAP_STATIONS){
      const s=MAP_STATIONS[key];
      const dist=Math.hypot(point.x-s.x,point.y-s.y);

      if(dist<=70&&(!best||dist<best.dist)) best={key,...s,dist};
    }

    return best;
  }

  function movePlayerNearStation(key){
    const station=MAP_STATIONS[key];
    const branch=BRANCHES[key];
    if(!station||!branch) return;

    player.x=branch.x;
    player.y=branch.topY;
    clampPlayerToWalkable(player);
  }

  dayButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const key=btn.dataset.day;
      movePlayerNearStation(key);
      openStation(key,btn);
    });
  });

  window.addEventListener('keydown',e=>{
    const key=e.key.toLowerCase();

    if(key==='escape'&&isModalOpen()){
      e.preventDefault();
      closeModal();
      return;
    }

    if(isModalOpen()) return;

    keys[key]=true;
    if(key==='e'&&!e.repeat) interact(canvas);
  });

  window.addEventListener('keyup',e=>{
    keys[e.key.toLowerCase()]=false;
  });

  window.addEventListener('blur',()=>{
    for(const k in keys) keys[k]=false;
    endJoystick();
  });

  closeBtn.addEventListener('click',closeModal);
  restartBtn.addEventListener('click',resetGame);

  modalOverlay.addEventListener('click',e=>{
    if(e.target===modalOverlay) closeModal();
  });

  startBtn.addEventListener('click',()=>{
    started=true;
    welcomeOverlay.style.display='none';
    if(quickAccessDetails) quickAccessDetails.removeAttribute('open');
    updateRotateHint();
    canvas.focus();
  });

  btnAction.addEventListener('pointerdown',e=>{
    e.preventDefault();
    if(!isModalOpen()) interact(btnAction);
  });

  btnRotate.addEventListener('click',async()=>{
    rotateDismissed=true;
    rotateHint.classList.remove('show');
    await requestLandscape();
  });

  btnBack.addEventListener('click',async()=>{
    await exitLandscape();
  });

  rotateNowBtn.addEventListener('click',async()=>{
    rotateDismissed=true;
    rotateHint.classList.remove('show');
    await requestLandscape();
  });

  rotateCloseBtn.addEventListener('click',()=>{
    rotateDismissed=true;
    rotateHint.classList.remove('show');
  });

  joystickZone.addEventListener('pointerdown',e=>{
    e.preventDefault();
    joystickZone.setPointerCapture(e.pointerId);
    updateJoystick(e.clientX,e.clientY);
  });

  joystickZone.addEventListener('pointermove',e=>{
    if(!joystickActive) return;
    e.preventDefault();
    updateJoystick(e.clientX,e.clientY);
  });

  joystickZone.addEventListener('pointerup',e=>{
    e.preventDefault();
    endJoystick();
  });

  joystickZone.addEventListener('pointercancel',e=>{
    e.preventDefault();
    endJoystick();
  });

  canvas.addEventListener('pointerdown',e=>{
    if(isModalOpen()) return;
    const pt=canvasPointToGame(e.clientX,e.clientY);
    const station=nearestTappedStation(pt);

    if(station){
      movePlayerNearStation(station.key);
      openStation(station.key,canvas);
    }
  });

  if(loadingEl) loadingEl.style.display='none';
  updateHud();
  centerStick();
  loop();
});