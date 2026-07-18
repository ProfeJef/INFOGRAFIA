const GAME = {
  width: 1024,
  height: 576
};

const ASSETS = {
  background: new Image(),
  avatar: new Image()
};

ASSETS.background.src = 'assets/FONDO-INFOGRAFÍA.png';
ASSETS.avatar.src = 'assets/avatar-1.png';

const PATH_POINTS = [
  { x: 60,  y: 445 },

  { x: 120, y: 445 },
  { x: 150, y: 442 },
  { x: 168, y: 430 },
  { x: 177, y: 400 },
  { x: 177, y: 445 },

  { x: 250, y: 445 },
  { x: 300, y: 442 },
  { x: 332, y: 438 },
  { x: 345, y: 400 },
  { x: 345, y: 445 },

  { x: 430, y: 445 },
  { x: 470, y: 442 },
  { x: 505, y: 440 },
  { x: 518, y: 400 },
  { x: 518, y: 445 },

  { x: 575, y: 445 },
  { x: 618, y: 442 },
  { x: 635, y: 435 },
  { x: 645, y: 400 },
  { x: 645, y: 445 },

  { x: 730, y: 445 },
  { x: 790, y: 442 },
  { x: 850, y: 438 },
  { x: 872, y: 400 },
  { x: 872, y: 445 },

  { x: 940, y: 445 },
  { x: 1005, y: 445 },
  { x: 1015, y: 445 }
];

const MAP_STATIONS = {
  d1: { x: 177, y: 400, r: 26, label: 'LUNES' },
  d2: { x: 345, y: 400, r: 26, label: 'MARTES' },
  d3: { x: 518, y: 400, r: 26, label: 'MIERCOLES' },
  d4: { x: 645, y: 400, r: 26, label: 'JUEVES' },
  d5: { x: 872, y: 400, r: 26, label: 'VIERNES' }
};

const EXIT_POINT = {
  key: 'exit',
  x: 1015,
  y: 445,
  r: 24,
  label: 'SALIR'
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
    const w = 60;
    const h = 82;
    ctx.drawImage(ASSETS.avatar, player.x - w / 2, player.y - h + 8, w, h);
  } else {
    ctx.fillStyle = '#d62828';
    ctx.fillRect(player.x - 10, player.y - 24, 20, 24);
  }
}

function drawPointGlow(ctx, x, y, r, active = false, color = '255,255,180') {
  ctx.save();
  const radius = active ? r + 10 : r - 8;
  const alpha = active ? 0.35 : 0.12;
  const gradient = ctx.createRadialGradient(x, y, 6, x, y, radius);
  gradient.addColorStop(0, `rgba(${color},${alpha})`);
  gradient.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function projectPointToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const ab2 = abx * abx + aby * aby;
  if (ab2 === 0) return { x: ax, y: ay, t: 0, dist: Math.hypot(px - ax, py - ay) };

  let t = ((px - ax) * abx + (py - ay) * aby) / ab2;
  t = Math.max(0, Math.min(1, t));

  const x = ax + abx * t;
  const y = ay + aby * t;
  const dist = Math.hypot(px - x, py - y);

  return { x, y, t, dist };
}

function clampPlayerToPath(player) {
  let best = null;

  for (let i = 0; i < PATH_POINTS.length - 1; i++) {
    const a = PATH_POINTS[i];
    const b = PATH_POINTS[i + 1];
    const p = projectPointToSegment(player.x, player.y, a.x, a.y, b.x, b.y);

    if (!best || p.dist < best.dist) {
      best = p;
    }
  }

  if (best) {
    player.x = best.x;
    player.y = best.y;
  }
}

function getNearbyStation(player) {
  for (const key in MAP_STATIONS) {
    const s = MAP_STATIONS[key];
    const dist = Math.hypot(player.x - s.x, player.y - s.y);
    if (dist <= s.r) return { key, ...s };
  }
  return null;
}

function getNearbyExit(player) {
  const dist = Math.hypot(player.x - EXIT_POINT.x, player.y - EXIT_POINT.y);
  return dist <= EXIT_POINT.r ? EXIT_POINT : null;
}

function drawHint(ctx, x, y, text) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.84)';
  ctx.fillRect(x - 60, y - 96, 120, 30);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 60, y - 96, 120, 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px VT323, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y - 76);
  ctx.restore();
}

function drawScene(ctx, player) {
  drawBackground(ctx);

  const nearby = getNearbyStation(player);
  const nearExit = getNearbyExit(player);

  for (const key in MAP_STATIONS) {
    const s = MAP_STATIONS[key];
    drawPointGlow(ctx, s.x, s.y, s.r, nearby && nearby.key === key);
  }

  drawPointGlow(ctx, EXIT_POINT.x, EXIT_POINT.y, EXIT_POINT.r, !!nearExit, '255,120,120');
  drawAvatar(ctx, player);

  if (nearby) drawHint(ctx, player.x, player.y, 'Presiona E');
  else if (nearExit) drawHint(ctx, player.x, player.y, 'Salir: E');
}
