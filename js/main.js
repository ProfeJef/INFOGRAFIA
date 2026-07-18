// main.js — Logica del recorrido semanal: movimiento, camara, interaccion, HUD
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const fadeEl = document.getElementById('fade');

  const map = buildTrackMap();
  const visited = new Set();

  const player = { col: 3, row: 7, x: 3*TILE, y: 7*TILE, targetX: 3*TILE, targetY: 7*TILE, dir:'down', moving:false, speed:4, animT:0 };

  let transitioning = true;
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('welcomeOverlay').style.display = 'none';
    transitioning = false;
  });

  const ZOOM = 1.7;
  const camera = { x: player.x + TILE/2, y: player.y + TILE/2 };
  function updateCamera(){
    const targetX = player.x + TILE/2, targetY = player.y + TILE/2;
    camera.x += (targetX - camera.x) * 0.12;
    camera.y += (targetY - camera.y) * 0.12;
    const halfW = (canvas.width/ZOOM)/2, halfH = (canvas.height/ZOOM)/2;
    const mapW = COLS*TILE, mapH = ROWS*TILE;
    camera.x = Math.max(halfW, Math.min(mapW-halfW, camera.x));
    camera.y = Math.max(halfH, Math.min(mapH-halfH, camera.y));
  }
  function applyCameraTransform(){
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(ZOOM, ZOOM);
    ctx.translate(-camera.x, -camera.y);
  }
  function screenToWorld(px,py){
    const wx = (px - canvas.width/2)/ZOOM + camera.x;
    const wy = (py - canvas.height/2)/ZOOM + camera.y;
    return { col: Math.floor(wx/TILE), row: Math.floor(wy/TILE) };
  }

  const keys = {};
  window.addEventListener('keydown', e => { keys[e.key.toLowerCase()]=true; if(e.key.toLowerCase()==='e') interact(); });
  window.addEventListener('keyup', e => { keys[e.key.toLowerCase()]=false; });
  window.addEventListener('blur', () => { for(const k in keys) keys[k]=false; });

  function isWalkable(c,r){
    if (r<0||r>=ROWS||c<0||c>=COLS) return false;
    if (r===6 && map[r][c] !== 'grass' && typeof map[r][c]==='string') return true;
    return r===6 || r===7 || r===8;
  }
  function tryMove(dc,dr,dir){
    if (player.moving || transitioning) return;
    player.dir = dir;
    const nc = player.col+dc, nr = player.row+dr;
    if (!isWalkable(nc,nr)) return;
    player.col=nc; player.row=nr;
    player.targetX = nc*TILE; player.targetY = nr*TILE;
    player.moving = true;
  }
  function interact(){
    const key = map[player.row] ? map[player.row][player.col] : null;
    if (typeof key === 'string' && STATIONS[key]) openStation(key);
    else {
      const nearKey = Object.entries(STATION_COLS).find(([k,c]) => Math.abs(c-player.col)<=1 && Math.abs(6-player.row)<=1);
      if (nearKey) openStation(nearKey[0]);
    }
  }
  function openStation(key){
    const s = STATIONS[key];
    if (!s) return;
    document.getElementById('modalTag').textContent = s.zona.toUpperCase();
    document.getElementById('modalTitle').textContent = s.nombre;
    document.getElementById('modalBody').innerHTML = `
      <p><strong>Contexto:</strong> ${s.contexto}</p>
      <p><strong>Enfoque:</strong> ${s.enfoque}</p>
      <p><strong>Metodologia:</strong> ${s.metodologia}</p>
      <p><strong>TIC:</strong> ${s.tics}</p>
      <p><strong>Aportes:</strong> ${s.aportes}</p>
      ${s.fuente ? `<p><a href="${s.fuente}" target="_blank">Ver fuente ↗</a></p>` : ''}
    `;
    document.getElementById('modalOverlay').style.display = 'flex';
    visited.add(key);
    updateProgress();
    updateBars();
  }
  function closeModal(){ document.getElementById('modalOverlay').style.display = 'none'; }
  document.getElementById('closeBtn').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target.id==='modalOverlay') closeModal(); });
  document.addEventListener('keydown', e => { if (e.key==='Escape') closeModal(); });

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width/rect.width, scaleY = canvas.height/rect.height;
    const px = (e.clientX-rect.left)*scaleX, py = (e.clientY-rect.top)*scaleY;
    const { col, row } = screenToWorld(px,py);
    const key = map[row] ? map[row][col] : null;
    if (typeof key === 'string' && STATIONS[key]) openStation(key);
  });

  function updateProgress(){
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    const pct = (visited.size/7)*100;
    fill.style.width = pct+'%';
    text.textContent = `${visited.size}/7 dias`;
  }
  function updateBars(){
    const asePct = Math.min(100, visited.size*14);
    document.getElementById('aseBar').style.width = asePct+'%';
    document.getElementById('asePct').textContent = asePct+'%';
    const weekDays = ['d1','d2','d3','d4','d5'].filter(d => visited.has(d)).length;
    const weekPct = Math.round((weekDays/5)*100);
    document.getElementById('weekBar').style.width = weekPct+'%';
    document.getElementById('weekPct').textContent = weekPct+'%';
    if (visited.has('d5') || visited.has('d6')){
      document.getElementById('flowBar').style.width = '100%';
      document.getElementById('flowPct').textContent = '100%';
    }
  }

  const joystickZone = document.getElementById('joystickZone');
  const joystickStick = document.getElementById('joystickStick');
  const btnAction = document.getElementById('btnAction');
  let touchDir = null;
  if (joystickZone){
    let baseRect = null;
    const startTouch = e => { baseRect = joystickZone.getBoundingClientRect(); e.preventDefault(); };
    const moveTouch = e => {
      if (!baseRect) return;
      const t = e.touches ? e.touches[0] : e;
      const cx = baseRect.left+baseRect.width/2, cy = baseRect.top+baseRect.height/2;
      let dx = t.clientX-cx, dy = t.clientY-cy;
      const dist = Math.hypot(dx,dy), max = baseRect.width/2;
      if (dist>max){ dx=dx/dist*max; dy=dy/dist*max; }
      joystickStick.style.left = (31+dx*0.55)+'px';
      joystickStick.style.top = (31+dy*0.55)+'px';
      if (Math.abs(dx)>Math.abs(dy)) touchDir = dx>15?'right':dx<-15?'left':null;
      else touchDir = dy>15?'down':dy<-15?'up':null;
      e.preventDefault();
    };
    const endTouch = e => { baseRect=null; touchDir=null; joystickStick.style.left='31px'; joystickStick.style.top='31px'; if(e) e.preventDefault(); };
    joystickZone.addEventListener('touchstart', startTouch, {passive:false});
    joystickZone.addEventListener('touchmove', moveTouch, {passive:false});
    joystickZone.addEventListener('touchend', endTouch, {passive:false});
    joystickZone.addEventListener('mousedown', startTouch);
    window.addEventListener('mousemove', e => { if (baseRect) moveTouch(e); });
    window.addEventListener('mouseup', endTouch);
  }
  if (btnAction){
    const fire = e => { interact(); if(e) e.preventDefault(); };
    btnAction.addEventListener('touchstart', fire, {passive:false});
    btnAction.addEventListener('click', fire);
  }

  function handleInput(){
    if (player.moving || transitioning) return;
    if (keys['arrowup']||keys['w']||touchDir==='up') tryMove(0,-1,'up');
    else if (keys['arrowdown']||keys['s']||touchDir==='down') tryMove(0,1,'down');
    else if (keys['arrowleft']||keys['a']||touchDir==='left') tryMove(-1,0,'left');
    else if (keys['arrowright']||keys['d']||touchDir==='right') tryMove(1,0,'right');
  }
  function updatePlayer(){
    player.animT += 0.28;
    if (!player.moving) return;
    const dx = player.targetX-player.x, dy = player.targetY-player.y;
    const dist = Math.hypot(dx,dy);
    if (dist<=player.speed){ player.x=player.targetX; player.y=player.targetY; player.moving=false; }
    else { player.x += dx/dist*player.speed; player.y += dy/dist*player.speed; }
  }

  let t = 0;
  function loop(){
    t += 0.03;
    handleInput();
    updatePlayer();
    updateCamera();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    applyCameraTransform();
    drawTrack(ctx, map, t, visited);
    drawAvatar(ctx, player, TILE);
    ctx.restore();
    requestAnimationFrame(loop);
  }
  updateProgress();
  document.getElementById('loading') && (document.getElementById('loading').style.display='none');
  loop();
});
