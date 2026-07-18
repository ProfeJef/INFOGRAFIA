// components.js — versión con fondo panorámico fijo + avatar sprite
const TILE = 32;
const COLS = 32;
const ROWS = 18;

const GAME = {
  width: 1024,
  height: 576
};

const ASSETS = {
  background: new Image(),
  avatar: new Image(),
  lunes: new Image(),
  martes: new Image(),
  miercoles: new Image(),
  jueves: new Image(),
  viernes: new Image()
};

ASSETS.background.src = 'assets/FONDO-INFOGRAFIA.png';
ASSETS.avatar.src = 'assets/avatar-1.png';
ASSETS.lunes.src = 'assets/lunes-1.png';
ASSETS.martes.src = 'assets/martes-1.png';
ASSETS.miercoles.src = 'assets/miercoles-1.png';
ASSETS.jueves.src = 'assets/jueves-1.png';
ASSETS.viernes.src = 'assets/viernes-1.png';

const STATIONS = {
  d1: { x: 220, y: 220, r: 55, label: 'LUNES', image: 'lunes' },
  d2: { x: 385, y: 205, r: 55, label: 'MARTES', image: 'martes' },
  d3: { x: 565, y: 205, r: 55, label: 'MIERCOLES', image: 'miercoles' },
  d4: { x: 760, y: 220, r: 55, label: 'JUEVES', image: 'jueves' },
  d5: { x: 920, y: 220, r: 55, label: 'VIERNES', image: 'viernes' }
};

function isAssetReady(img) {
  return img && img.complete && img.naturalWidth > 0;
}

function drawBackground(ctx) {
  if (isAssetReady(ASSETS.background)) {
    ctx.drawImage(ASSETS.background, 0, 0, GAME.width, GAME.height);
  } else {
    ctx.fillStyle = '#8fd6f0';
    ctx.fillRect(0, 0, GAME.width, GAME.height);
  }
}

function drawAvatar(ctx, player) {
  if (isAssetReady(ASSETS.avatar)) {
    ctx.drawImage(ASSETS.avatar, player.x - 28, player.y - 56, 56, 72);
  } else {
    ctx.fillStyle = '#d62828';
    ctx.fillRect(player.x - 10, player.y - 24, 20, 24);
  }
}

function drawStationHint(ctx, player) {
  const station = getNearbyStation(player);
  if (!station) return;

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(player.x - 34, player.y - 92, 68, 28);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x - 34, player.y - 92, 68, 28);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px VT323, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Presiona E', player.x, player.y - 72);
  ctx.restore();
}

function getNearbyStation(player) {
  for (const key in STATIONS) {
    const s = STATIONS[key];
    const dx = player.x - s.x;
    const dy = player.y - s.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= s.r) return { key, ...s };
  }
  return null;
}

function drawScene(ctx, player) {
  drawBackground(ctx);
  drawAvatar(ctx, player);
  drawStationHint(ctx, player);
}

function clampPlayerToPath(player) {
  const minX = 70;
  const maxX = 960;
  const minY = 300;
  const maxY = 470;

  player.x = Math.max(minX, Math.min(maxX, player.x));
  player.y = Math.max(minY, Math.min(maxY, player.y));
}
