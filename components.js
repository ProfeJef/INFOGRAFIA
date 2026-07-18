// components.js — Mapa lineal de 7 estaciones (un dia por parada) + dibujo de escenas
const TILE = 32;
const COLS = 34, ROWS = 10;

const PAL = {
  sky1:'#8fd6f0', sky2:'#bdeaf8',
  grass1:'#6cc24a', grass2:'#4a9e3a', grass3:'#2e6e2e',
  dirt1:'#d9a15c', dirt2:'#b8763a', dirtLine:'#8a5a2f',
  wood:'#a5713c', woodDark:'#5d3a1a', woodLight:'#c98f56',
  navy:'#1c2b3a', gold:'#d9a955', red:'#c0392b', blue:'#2980b9'
};

const STATION_COLS = { d0:3, d1:8, d2:13, d3:18, d4:23, d5:28, d6:33 };

function buildTrackMap() {
  const m = Array.from({length: ROWS}, () => Array(COLS).fill('grass'));
  for (let c=0;c<COLS;c++){ m[7][c]='path'; m[8][c]='path'; }
  Object.entries(STATION_COLS).forEach(([key,c]) => { m[6][c]=key; });
  return m;
}

function drawGrass(ctx,c,r){
  const light=(c+r)%2===0;
  ctx.fillStyle = light? PAL.grass1 : PAL.grass2;
  ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
}
function drawPath(ctx,c,r){
  const light=(c+r)%3===0;
  ctx.fillStyle = light? PAL.dirt1 : PAL.dirt2;
  ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
  ctx.strokeStyle='rgba(0,0,0,0.08)'; ctx.strokeRect(c*TILE,r*TILE,TILE,TILE);
}

function drawFence(ctx,c,r){
  drawGrass(ctx,c,r);
  const x=c*TILE, y=r*TILE;
  ctx.fillStyle=PAL.woodDark; ctx.fillRect(x+6,y+4,4,TILE-4);
  ctx.fillStyle=PAL.wood; ctx.fillRect(x+8,y+10,TILE-16,4);
}

function drawTree(ctx,c,r){
  drawGrass(ctx,c,r);
  const x=c*TILE, y=r*TILE;
  ctx.fillStyle='rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(x+17,y+27,11,4,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#5b4636'; ctx.fillRect(x+13,y+16,6,14);
  ctx.fillStyle='#3f7d32'; ctx.beginPath(); ctx.arc(x+16,y+10,13,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#5aa84a';
  ctx.beginPath(); ctx.arc(x+8,y+14,8,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+24,y+14,8,0,Math.PI*2); ctx.fill();
}

function shadeRect(ctx,x,y,w,h,fill,dark){
  ctx.fillStyle=fill; ctx.fillRect(x,y,w,h);
  ctx.fillStyle=dark; ctx.fillRect(x,y+h-Math.max(3,h*0.18),w,Math.max(3,h*0.18));
  ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=1.2; ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
}

// ===== Escenas por estacion (dibujadas dentro de un "cuadro" 2x2 tiles) =====
function sceneInicio(ctx,x,y){
  ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(x+32,y+66,30,6,0,0,Math.PI*2); ctx.fill();
  shadeRect(ctx,x,y+16,64,48,PAL.woodLight,'#a5672e');
  ctx.fillStyle='#8b5a2b'; ctx.strokeStyle='#3d2410'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(x-6,y+16); ctx.lineTo(x+32,y-14); ctx.lineTo(x+70,y+16); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#a5713c'; ctx.beginPath(); ctx.moveTo(x+32,y-14); ctx.lineTo(x+70,y+16); ctx.lineTo(x+58,y+16); ctx.lineTo(x+32,y-4); ctx.closePath(); ctx.fill();
  shadeRect(ctx,x+24,y+36,16,28,'#5d3a1a','#3a2410');
  shadeRect(ctx,x+6,y+22,12,12,'#bfe4f5','#8fc9e0');
  ctx.fillStyle='#e8f7ff'; ctx.fillRect(x+7,y+23,5,5);
  shadeRect(ctx,x+46,y+22,12,12,'#bfe4f5','#8fc9e0');
  ctx.fillStyle='#e8f7ff'; ctx.fillRect(x+47,y+23,5,5);
}
function sceneLunes(ctx,x,y){
  ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(x+32,y+66,30,6,0,0,Math.PI*2); ctx.fill();
  shadeRect(ctx,x,y+16,64,48,PAL.woodLight,'#a5672e');
  ctx.fillStyle='#a33b2b'; ctx.strokeStyle='#5a1f14'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(x-6,y+16); ctx.lineTo(x+32,y-14); ctx.lineTo(x+70,y+16); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle='#3d2410'; ctx.lineWidth=1;
  ctx.fillStyle='#f6c39b'; ctx.beginPath(); ctx.arc(x+20,y+48,8,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#2c2116'; ctx.beginPath(); ctx.arc(x+18,y+44,7,Math.PI,Math.PI*2); ctx.fill();
  shadeRect(ctx,x+14,y+52,12,10,'#4a6fa5','#33517f');
  ctx.fillStyle='#a5672e'; ctx.beginPath(); ctx.ellipse(x+30,y+56,6,9,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#f6c39b'; ctx.beginPath(); ctx.arc(x+50,y+50,7,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#1a1a1a'; ctx.beginPath(); ctx.arc(x+48,y+46,6,Math.PI,Math.PI*2); ctx.fill();
  shadeRect(ctx,x+44,y+56,14,8,'#c0392b','#8e1f1a');
}
function sceneMartes(ctx,x,y){
  ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.ellipse(x+32,y+66,30,6,0,0,Math.PI*2); ctx.fill();
  shadeRect(ctx,x,y+30,64,34,'#d8c9a3','#c2b28c');
  ctx.strokeStyle='#e74c3c'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(x+18,y+34,12,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle='#ff8a75'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(x+18,y+34,12,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='#7f8c8d'; ctx.fillRect(x+46,y+8,3,30);
  ctx.fillStyle='#bdc3c7'; ctx.fillRect(x+46.5,y+8,1,30);
  ctx.fillStyle='#f1c40f'; ctx.strokeStyle='#8a6a2e'; ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(x+36,y-2); ctx.lineTo(x+58,y-2); ctx.lineTo(x+47,y+10); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle='#3d2410'; ctx.lineWidth=1;
  ctx.fillStyle='#f6c39b'; ctx.beginPath(); ctx.arc(x+14,y+52,8,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#5c3a21'; ctx.beginPath(); ctx.arc(x+12,y+48,7,Math.PI,Math.PI*2); ctx.fill();
  shadeRect(ctx,x+8,y+58,12,8,'#e67e22','#c4671a');
}
function sceneMiercoles(ctx,x,y){
  ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(x+32,y+66,30,6,0,0,Math.PI*2); ctx.fill();
  shadeRect(ctx,x+10,y-4,44,24,'#8b5a2b','#5d3a1a');
  shadeRect(ctx,x+14,y,8,16,'#c0392b','#8e1f1a');
  shadeRect(ctx,x+26,y,8,16,'#2980b9','#1c5a80');
  shadeRect(ctx,x+38,y,8,16,'#27ae60','#1a7a43');
  shadeRect(ctx,x,y+24,64,40,PAL.woodLight,'#a5672e');
  ctx.strokeStyle='#5d3a1a'; ctx.lineWidth=1.5; ctx.strokeRect(x+7,y+29,29,15);
  for(let i=0;i<4;i++) for(let j=0;j<2;j++){
    ctx.fillStyle = (i+j)%2===0 ? '#222' : '#eee';
    ctx.fillRect(x+8+i*7,y+30+j*7,7,7);
  }
}
function sceneJueves(ctx,x,y){
  ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(x+32,y+66,30,6,0,0,Math.PI*2); ctx.fill();
  shadeRect(ctx,x,y-6,64,36,'#2c1a4d','#1a0f2e');
  shadeRect(ctx,x+8,y,32,20,'#6c5ce7','#4a3aa8');
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.moveTo(x+18,y+6); ctx.lineTo(x+18,y+16); ctx.lineTo(x+28,y+11); ctx.closePath(); ctx.fill();
  shadeRect(ctx,x+4,y+34,14,14,'#c0392b','#8e1f1a');
  shadeRect(ctx,x+22,y+34,14,14,'#c0392b','#8e1f1a');
  shadeRect(ctx,x+40,y+34,14,14,'#c0392b','#8e1f1a');
}
function sceneViernes(ctx,x,y){
  ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(x+32,y+66,30,6,0,0,Math.PI*2); ctx.fill();
  shadeRect(ctx,x,y+40,32,20,'#d63384','#a11f63');
  shadeRect(ctx,x+32,y+40,32,20,'#e91e63','#a11f45');
  ctx.strokeStyle='#3d2410'; ctx.lineWidth=1;
  ctx.fillStyle='#f6c39b'; ctx.beginPath(); ctx.arc(x+20,y+22,7,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#3a2410'; ctx.beginPath(); ctx.arc(x+18,y+18,6,Math.PI,Math.PI*2); ctx.fill();
  shadeRect(ctx,x+14,y+28,12,14,'#f39c12','#c4791a');
  ctx.fillStyle='#c68642'; ctx.beginPath(); ctx.arc(x+44,y+22,7,0,Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#1a1a1a'; ctx.beginPath(); ctx.arc(x+42,y+18,6,Math.PI,Math.PI*2); ctx.fill();
  shadeRect(ctx,x+38,y+28,12,14,'#2980b9','#1c5a80');
  ctx.fillStyle='#f1c40f'; ctx.beginPath(); ctx.arc(x+8,y+2,3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(241,196,15,0.3)'; ctx.beginPath(); ctx.arc(x+8,y+2,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#3498db'; ctx.beginPath(); ctx.arc(x+30,y-4,3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(52,152,219,0.3)'; ctx.beginPath(); ctx.arc(x+30,y-4,5,0,Math.PI*2); ctx.fill();
}
function sceneFinal(ctx,x,y){
  ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(x+32,y+66,30,6,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#7f8c8d'; ctx.fillRect(x+26,y-10,4,50);
  ctx.fillStyle='#bdc3c7'; ctx.fillRect(x+26.5,y-10,1.5,50);
  ctx.fillStyle='#2ecc71'; ctx.strokeStyle='#1a7a43'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(x+30,y-8); ctx.lineTo(x+58,y-2); ctx.lineTo(x+30,y+4); ctx.closePath(); ctx.fill(); ctx.stroke();
  shadeRect(ctx,x+6,y+40,52,10,'#6c757d','#4a5257');
  for(let i=0;i<4;i++){ ctx.fillStyle = i%2===0?'#222':'#fff'; ctx.fillRect(x+10+i*10,y+32,10,10); }
  ctx.strokeStyle='#5d3a1a'; ctx.lineWidth=1.5; ctx.strokeRect(x+9,y+31,42,10);
}

const SCENE_FN = { d0:sceneInicio, d1:sceneLunes, d2:sceneMartes, d3:sceneMiercoles, d4:sceneJueves, d5:sceneViernes, d6:sceneFinal };
const DAY_LABEL = { d0:'INICIO', d1:'LUNES', d2:'MARTES', d3:'MIERCOLES', d4:'JUEVES', d5:'VIERNES', d6:'FINAL' };

function drawStationPlatform(ctx,c,r,key,visited){
  const x=c*TILE, y=r*TILE;
  ctx.fillStyle='rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(x+16,y+18,26,7,0,0,Math.PI*2); ctx.fill();
  const fn = SCENE_FN[key];
  if (fn) fn(ctx, x-16, y-40);
  ctx.fillStyle=PAL.navy; ctx.font='bold 8px "Press Start 2P", monospace'; ctx.textAlign='center';
  ctx.fillText(DAY_LABEL[key]||'', x+16, y+26);
  ctx.textAlign='left';
  if (visited.has(key)){
    ctx.fillStyle=PAL.gold;
    ctx.beginPath(); ctx.arc(x+30,y-30,5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#8a6a2e'; ctx.lineWidth=1; ctx.stroke();
  }
}

function drawAvatar(ctx, player, TILE){
  const x = player.x, y = player.y - 14;
  const bob = player.moving ? Math.sin(player.animT*4)*2 : 0;
  ctx.save();
  ctx.translate(x+TILE/2, y+TILE/2+bob);
  ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0,20,10,3,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#f6c39b'; ctx.fillRect(-8,-16,16,14);
  ctx.fillStyle='#c0392b'; ctx.fillRect(-9,-22,18,7);
  ctx.fillStyle='#2c2c2c'; ctx.fillRect(-5,-10,2,2); ctx.fillRect(3,-10,2,2);
  ctx.fillStyle='#2980b9'; ctx.fillRect(-8,-2,16,14);
  ctx.fillStyle='#e67e22'; ctx.fillRect(-11,0,5,10);
  ctx.fillStyle='#34495e'; ctx.fillRect(-8,12,7,10); ctx.fillRect(1,12,7,10);
  ctx.restore();
}

function drawTrack(ctx, map, t, visited){
  for (let r=0;r<ROWS;r++){
    for (let c=0;c<COLS;c++){
      const cell = map[r][c];
      if (r===7 || r===8) drawPath(ctx,c,r);
      else drawGrass(ctx,c,r);
    }
  }
  const decoCols = [1,6,11,16,21,26,31];
  decoCols.forEach((c,i) => { if(i%2===0) drawTree(ctx,c,4); else drawFence(ctx,c,5); });
  Object.entries(STATION_COLS).forEach(([key,c]) => {
    drawStationPlatform(ctx, c, 6, key, visited);
  });
}
