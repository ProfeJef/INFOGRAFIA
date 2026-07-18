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

const PATH = {
  startX: 60,
  y: 445,
  minX: 60,
  maxX: 1005,
  exitX: 1015,
  exitY: 445
};

const MAP_STATIONS = {
  d1: { x: 177, y: 400, r: 34, label: 'LUNES' },
  d2: { x: 345, y: 400, r: 34, label: 'MARTES' },
  d3: { x: 518, y: 400, r: 34, label: 'MIERCOLES' },
  d4: { x: 645, y: 400, r: 34, label: 'JUEVES' },
  d5: { x: 872, y: 400, r: 34, label: 'VIERNES' }
};

const EXIT_POINT = {
  key: 'exit',
  x: 1015,
  y: 445,
  r: 26,
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
    const w = 64;
    const h = 88;
    ctx.drawImage(ASSETS.avatar, player.x - w / 2, player.y - h + 6, w, h);
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

function getNearbyExit(player) {
  const dx = player.x - EXIT_POINT.x;
  const dy = player.y - EXIT_POINT.y;
  const dist = Math.hypot(dx, dy);
  if (dist <= EXIT_POINT.r) return EXIT_POINT;
  return null;
}

function drawHint(ctx, x, y, text) {
  ctx.save();

  const width = 120;
  const height = 30;

  ctx.fillStyle = 'rgba(0,0,0,0.84)';
  ctx.fillRect(x - width / 2, y - 96, width, height);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - width / 2, y - 96, width, height);

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
    const station = MAP_STATIONS[key];
    drawPointGlow(ctx, station.x, station.y, station.r, nearby && nearby.key === key);
  }

  drawPointGlow(
    ctx,
    EXIT_POINT.x,
    EXIT_POINT.y,
    EXIT_POINT.r,
    !!nearExit,
    '255,120,120'
  );

  drawAvatar(ctx, player);

  if (nearby) {
    drawHint(ctx, player.x, player.y, 'Presiona E');
  } else if (nearExit) {
    drawHint(ctx, player.x, player.y, 'Salir: E');
  }
}

function clampPlayerToPath(player) {
  player.x = Math.max(PATH.minX, Math.min(PATH.maxX, player.x));
  player.y = PATH.y;
}
