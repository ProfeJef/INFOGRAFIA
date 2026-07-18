// components.js — fondo panorámico fijo + avatar sprite + estaciones del mapa
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

// Cambia .png por los nombres exactos que tengas en tu carpeta assets
ASSETS.background.src = 'assets/FONDO-INFOGRAFIA.png';
ASSETS.avatar.src = 'assets/avatar-1.png';
ASSETS.lunes.src = 'assets/lunes-1.png';
ASSETS.martes.src = 'assets/martes-1.png';
ASSETS.miercoles.src = 'assets/miercoles-1.png';
ASSETS.jueves.src = 'assets/jueves-1.png';
ASSETS.viernes.src = 'assets/viernes-1.png';

// Coordenadas de interacción dentro del mapa panorámico
const MAP_STATIONS = {
  d1: { x: 220, y: 220, r: 60, label: 'LUNES', image: 'lunes' },
  d2: { x: 385, y: 205, r: 60, label: 'MARTES', image: 'martes' },
  d3: { x: 565, y: 205, r: 60, label: 'MIERCOLES', image: 'miercoles' },
  d4: { x: 760, y: 220, r: 60, label: 'JUEVES', image: 'jueves' },
  d5: { x: 920, y: 220, r: 60, label: 'VIERNES', image: 'viernes' }
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
    ctx.drawImage(ASSETS.avatar, player.x - 28, player.y - 58, 58, 78);
  } else {
    ctx.fillStyle = '#d62828';
    ctx.fillRect(player.x - 10, player.y - 24, 20, 24);
  }
}

function drawStationGlow(ctx, station, active = false) {
  ctx.save();

  const radius = active ? station.r + 10 : station.r - 8;
  const alpha = active ? 0.28 : 0.12;

  const g = ctx.createRadialGradient(
    station.x, station.y, 8,
    station.x, station.y, radius
  );
  g.addColorStop(0, `rgba(255,255,180,${alpha})`);
  g.addColorStop(1, 'rgba(255,255,180,0)');

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(station.x, station.y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawStationHint(ctx, player) {
  const station = getNearbyStation(player);
  if (!station) return;

  ctx.save();

  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(player.x - 42, player.y - 98, 84, 30);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x - 42, player.y - 98, 84, 30);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px VT323, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Presiona E', player.x, player.y - 78);

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

  for (const key in MAP_STATIONS) {
    const station = MAP_STATIONS[key];
    const active = !!getNearbyStation(player) && getNearbyStation(player).key === key;
    drawStationGlow(ctx, station, active);
  }

  drawAvatar(ctx, player);
  drawStationHint(ctx, player);
}

function clampPlayerToPath(player) {
  const minX = 70;
  const maxX = 965;
  const minY = 300;
  const maxY = 470;

  player.x = Math.max(minX, Math.min(maxX, player.x));
  player.y = Math.max(minY, Math.min(maxY, player.y));
}
