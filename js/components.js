// components.js — fondo 1024x576 + avatar siguiendo el sendero de izquierda a derecha
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

// Usa aquí la versión 1024x576 del fondo
ASSETS.background.src = 'assets/FONDO-INFOGRAFIA.png';
ASSETS.avatar.src = 'assets/avatar-1.png';
ASSETS.lunes.src = 'assets/lunes-1.png';
ASSETS.martes.src = 'assets/martes-1.png';
ASSETS.miercoles.src = 'assets/miercoles-1.png';
ASSETS.jueves.src = 'assets/jueves-1.png';
ASSETS.viernes.src = 'assets/viernes-1.png';

// Coordenadas del sendero y estaciones en un fondo 1024x576
// AJUSTA ESTOS NÚMEROS una vez tengas el PNG final a 1024x576.
const PATH = {
  startX: 180,  // donde entra el avatar al camino
  y: 410,       // altura del sendero
  minX: 180,
  maxX: 900
};

const MAP_STATIONS = {
  d1: { x: 270, y: PATH.y, r: 30, label: 'LUNES', image: 'lunes' },
  d2: { x: 420, y: PATH.y, r: 30, label: 'MARTES', image: 'martes' },
  d3: { x: 575, y: PATH.y, r: 30, label: 'MIERCOLES', image: 'miercoles' },
  d4: { x: 730, y: PATH.y, r: 30, label: 'JUEVES', image: 'jueves' },
  d5: { x: 885, y: PATH.y, r: 30, label: 'VIERNES', image: 'viernes' }
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
    const w = 64;
    const h = 88;
    ctx.drawImage(ASSETS.avatar, player.x - w / 2, player.y - h + 6, w, h);
  } else {
    ctx.fillStyle = '#d62828';
    ctx.fillRect(player.x - 10, player.y - 24, 20, 24);
  }
}

function drawStationGlow(ctx, station, active = false) {
  ctx.save();

  const radius = active ? station.r + 10 : station.r - 6;
  const alpha = active ? 0.35 : 0.12;

  const gradient = ctx.createRadialGradient(
    station.x, station.y, 6,
    station.x, station.y, radius
  );

  gradient.addColorStop(0, `rgba(255,255,180,${alpha})`);
  gradient.addColorStop(1, 'rgba(255,255,180,0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(station.x, station.y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawStationHint(ctx, player) {
  const station = getNearbyStation(player);
  if (!station) return;

  ctx.save();

  ctx.fillStyle = 'rgba(0,0,0,0.84)';
  ctx.fillRect(player.x - 50, player.y - 96, 100, 30);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x - 50, player.y - 96, 100, 30);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px VT323, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Presiona E', player.x, player.y - 76);

  ctx.restore();
}

function getNearbyStation(player) {
  for (const key in MAP_STATIONS) {
    const s = MAP_STATIONS[key];
    const dx = player.x - s.x;
    const dy = player.y - s.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= s.r) return { key, ...s };
  }
  return null;
}

function drawScene(ctx, player) {
  drawBackground(ctx);

  const nearby = getNearbyStation(player);

  for (const key in MAP_STATIONS) {
    const station = MAP_STATIONS[key];
    drawStationGlow(ctx, station, nearby && nearby.key === key);
  }

  drawAvatar(ctx, player);
  drawStationHint(ctx, player);
}

// El avatar sólo recorre el sendero horizontal
function clampPlayerToPath(player) {
  player.x = Math.max(PATH.minX, Math.min(PATH.maxX, player.x));

  const minY = PATH.y - 4;
  const maxY = PATH.y + 4;
  player.y = Math.max(minY, Math.min(maxY, player.y));
}
