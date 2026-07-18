const GAME = { width: 1024, height: 576 };

const ASSETS = {
  background: new Image(),
  avatar: new Image()
};

ASSETS.background.src = 'assets/FONDO-INFOGRAFIA.png';
ASSETS.avatar.src = 'assets/avatar-1.png';

const MAIN_PATH = { minX: 60, maxX: 1015, y: 445 };

const BRANCHES = {
  d1: { x: 177, topY: 400, baseY: 445 },
  d2: { x: 345, topY: 400, baseY: 445 },
  d3: { x: 518, topY: 400, baseY: 445 },
  d4: { x: 695, topY: 400, baseY: 445 },
  d5: { x: 872, topY: 400, baseY: 445 }
};

const MAP_STATIONS = {
  d1: { x: 177, y: 400, r: 42 },
  d2: { x: 345, y: 400, r: 42 },
  d3: { x: 518, y: 400, r: 42 },
  d4: { x: 695, y: 400, r: 42 },
  d5: { x: 872, y: 400, r: 42 }
};

const EXIT_POINT = {
  key: 'exit',
  x: 1015,
  y: 445,
  r: 32,
  label: 'SALIR'
};

function isAssetReady(img){
  return img && img.complete && img.naturalWidth > 0;
}

function drawBackground(ctx){
  if(isAssetReady(ASSETS.background)){
    ctx.drawImage(ASSETS.background,0,0,GAME.width,GAME.height);
  }else{
    const sky=ctx.createLinearGradient(0,0,0,GAME.height);
    sky.addColorStop(0,'#8ed6ff');
    sky.addColorStop(1,'#d9f4ff');
    ctx.fillStyle=sky;
    ctx.fillRect(0,0,GAME.width,GAME.height);
  }
}

function drawAvatar(ctx,player){
  if(isAssetReady(ASSETS.avatar)){
    const w=60,h=82;
    ctx.drawImage(ASSETS.avatar,player.x-w/2,player.y-h+8,w,h);
  }else{
    ctx.fillStyle='#d62828';
    ctx.fillRect(player.x-10,player.y-24,20,24);
  }
}

function drawPointGlow(ctx,x,y,r,active=false,color='255,255,255'){
  ctx.save();
  const pulse=.5+.5*Math.sin(Date.now()*.004);
  const baseRadius=active?r+10:r+4;
  const radius=baseRadius+(active?pulse*3:pulse*1.5);
  const inner=Math.max(4,r-10);
  const gradient=ctx.createRadialGradient(x,y,inner,x,y,radius);
  gradient.addColorStop(0,`rgba(${color},0.26)`);
  gradient.addColorStop(.7,`rgba(${color},0.09)`);
  gradient.addColorStop(1,`rgba(${color},0)`);
  ctx.fillStyle=gradient;
  ctx.beginPath();
  ctx.arc(x,y,radius,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawVisitedCheck(ctx,x,y,r){
  ctx.save();
  const cx=x+r-6,cy=y-r+6;
  ctx.beginPath();
  ctx.arc(cx,cy,11,0,Math.PI*2);
  ctx.fillStyle='#35a853';
  ctx.fill();
  ctx.lineWidth=3;
  ctx.strokeStyle='#ffffff';
  ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(cx-4,cy);
  ctx.lineTo(cx-1,cy+4);
  ctx.lineTo(cx+5,cy-5);
  ctx.stroke();
  ctx.restore();
}

function drawPersistentLegend(ctx){
  ctx.save();
  ctx.fillStyle='rgba(20,26,40,0.70)';
  ctx.fillRect(14,14,250,58);
  ctx.strokeStyle='rgba(255,255,255,0.42)';
  ctx.lineWidth=2;
  ctx.strokeRect(14,14,250,58);
  ctx.fillStyle='#ffffff';
  ctx.font='18px VT323, monospace';
  ctx.textAlign='left';
  ctx.textBaseline='middle';
  ctx.fillText('Muévete: Flechas / WASD / táctil',26,34);
  ctx.fillText('Interactúa: E o toque directo',26,56);
  ctx.restore();
}

function drawFocusRingOnNearby(ctx,nearby,nearExit){
  if(!nearby && !nearExit) return;
  ctx.save();
  ctx.strokeStyle='rgba(255,255,255,0.52)';
  ctx.lineWidth=2;
  ctx.setLineDash([6,4]);

  if(nearby){
    ctx.beginPath();
    ctx.arc(nearby.x,nearby.y,nearby.r+8,0,Math.PI*2);
    ctx.stroke();
  }else if(nearExit){
    ctx.beginPath();
    ctx.arc(nearExit.x,nearExit.y,nearExit.r+6,0,Math.PI*2);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.restore();
}

function drawHint(ctx,x,y,text){
  ctx.save();
  const w=160,h=32;
  ctx.fillStyle='rgba(0,0,0,0.76)';
  ctx.fillRect(x-w/2,y-100,w,h);
  ctx.strokeStyle='rgba(255,255,255,0.56)';
  ctx.lineWidth=1.8;
  ctx.strokeRect(x-w/2,y-100,w,h);
  ctx.fillStyle='#ffffff';
  ctx.font='18px VT323, monospace';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(text,x,y-84);
  ctx.restore();
}

function getNearestBranch(player,tolerance=48){
  let best=null;
  for(const key in BRANCHES){
    const b=BRANCHES[key];
    const dx=Math.abs(player.x-b.x);
    if(dx<=tolerance&&(!best||dx<best.dx)){
      best={key,...b,dx};
    }
  }
  return best;
}

function getNearbyStation(player){
  for(const key in MAP_STATIONS){
    const s=MAP_STATIONS[key];
    const dist=Math.hypot(player.x-s.x,player.y-s.y);
    if(dist<=s.r) return {key,...s};
  }
  return null;
}

function getNearbyExit(player){
  const dist=Math.hypot(player.x-EXIT_POINT.x,player.y-EXIT_POINT.y);
  return dist<=EXIT_POINT.r?EXIT_POINT:null;
}

function clampPlayerToWalkable(player){
  player.x=Math.max(MAIN_PATH.minX,Math.min(MAIN_PATH.maxX,player.x));
  player.y=Math.max(400,Math.min(445,player.y));
}

function drawScene(ctx,player,visited=new Set()){
  drawBackground(ctx);
  const nearby=getNearbyStation(player);
  const nearExit=getNearbyExit(player);

  drawPersistentLegend(ctx);

  for(const key in MAP_STATIONS){
    const s=MAP_STATIONS[key];
    const isActive=nearby&&nearby.key===key;
    const isVisited=visited.has(key);
    drawPointGlow(ctx,s.x,s.y,s.r,isActive);
    if(isVisited) drawVisitedCheck(ctx,s.x,s.y,s.r);
  }

  drawPointGlow(ctx,EXIT_POINT.x,EXIT_POINT.y,EXIT_POINT.r,!!nearExit,'255,200,200');
  drawAvatar(ctx,player);
  drawFocusRingOnNearby(ctx,nearby,nearExit);

  if(nearby){
    drawHint(ctx,player.x,player.y,'Presiona E o toca');
  }else if(nearExit){
    drawHint(ctx,player.x,player.y,'Salir: E');
  }
}