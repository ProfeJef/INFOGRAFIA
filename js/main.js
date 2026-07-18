document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const loadingEl = document.getElementById('loading');
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const startBtn = document.getElementById('startBtn');

  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const aseBar = document.getElementById('aseBar');
  const weekBar = document.getElementById('weekBar');
  const flowBar = document.getElementById('flowBar');
  const asePct = document.getElementById('asePct');
  const weekPct = document.getElementById('weekPct');
  const flowPct = document.getElementById('flowPct');

  const modalOverlay = document.getElementById('modalOverlay');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('closeBtn');

  const interactBtn = document.getElementById('interactBtn');
  const rotateBtn = document.getElementById('rotateBtn');
  const rotateNowBtn = document.getElementById('rotateNowBtn');
  const rotateCloseBtn = document.getElementById('rotateCloseBtn');
  const rotateHint = document.getElementById('rotateHint');

  const joystickBase = document.getElementById('joystickBase');
  const joystickStick = document.getElementById('joystickStick');

  canvas.width = GAME.width;
  canvas.height = GAME.height;

  const visited = new Set();
  const keys = {};
  const touchState = { x: 0, y: 0, active: false };

  let started = false;
  let rotateHintDismissed = false;
  let joystickPointerId = null;

  const player = {
    x: MAIN_PATH.minX,
    y: MAIN_PATH.y,
    speed: 3
  };

  function isMobileLike() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function updateHud() {
    const total = Object.keys(MAP_STATIONS).length;
    const done = visited.size;
    const pct = total ? Math.round((done / total) * 100) : 0;

    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = `${done}/${total} días`;

    if (aseBar) aseBar.style.width = pct + '%';
    if (weekBar) weekBar.style.width = pct + '%';
    if (flowBar) flowBar.style.width = pct + '%';

    if (asePct) asePct.textContent = pct + '%';
    if (weekPct) weekPct.textContent = pct + '%';
    if (flowPct) flowPct.textContent = pct + '%';
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.style.display = 'none';
  }

  function openStation(key) {
    if (typeof STATIONS === 'undefined' || !STATIONS[key]) return;

    const s = STATIONS[key];
    visited.add(key);
    updateHud();

    if (modalTag) modalTag.textContent = s.zona || 'DÍA';
    if (modalTitle) modalTitle.textContent = s.nombre || '';

    if (modalBody) {
      modalBody.className = s.zona ? String(s.zona).toLowerCase() : '';
      modalBody.innerHTML = `
        ${s.imagen ? `<img src="${s.imagen}" alt="${s.nombre || 'Imagen del día'}" class="stationImage">` : ''}
        <p><strong>Contexto:</strong> ${s.contexto || ''}</p>
        <p><strong>Enfoque:</strong> ${s.enfoque || ''}</p>
        <p><strong>Metodología:</strong> ${s.metodologia || ''}</p>
        <p><strong>TIC:</strong> ${s.tics || ''}</p>
        <p><strong>Aportes:</strong> ${s.aportes || ''}</p>
        ${s.fuente ? `<p><a href="${s.fuente}" target="_blank" rel="noopener noreferrer">Ver fuente</a></p>` : ''}
      `;
    }

    if (modalOverlay) modalOverlay.style.display = 'flex';
  }

  function resetGame() {
    visited.clear();
    updateHud();
    closeModal();

    player.x = MAIN_PATH.minX;
    player.y = MAIN_PATH.y;

    started = false;
    touchState.x = 0;
    touchState.y = 0;
    touchState.active = false;
    centerJoystick();

    if (welcomeOverlay) welcomeOverlay.style.display = 'flex';
  }

  function interact() {
    const nearby = getNearbyStation(player);
    const nearExit = getNearbyExit(player);

    if (nearby) {
      openStation(nearby.key);
    } else if (nearExit) {
      resetGame();
    }
  }

  function getInputVector() {
    let dx = 0;
    let dy = 0;

    if (keys['arrowleft'] || keys['a']) dx -= 1;
    if (keys['arrowright'] || keys['d']) dx += 1;
    if (keys['arrowup'] || keys['w']) dy -= 1;
    if (keys['arrowdown'] || keys['s']) dy += 1;

    dx += touchState.x;
    dy += touchState.y;

    dx = Math.max(-1, Math.min(1, dx));
    dy = Math.max(-1, Math.min(1, dy));

    return { dx, dy };
  }

  function updateMovement() {
    if (!started) return;

    const { dx, dy } = getInputVector();
    const branch = getNearestBranch(player, 48);
    const onBranch = branch && Math.abs(player.x - branch.x) <= 3 && player.y < branch.baseY;

    if (onBranch) {
      if (dy < -0.15) {
        player.y -= player.speed * Math.abs(dy);
        if (player.y < branch.topY) player.y = branch.topY;
      }

      if (dy > 0.15) {
        player.y += player.speed * Math.abs(dy);
        if (player.y > branch.baseY) player.y = branch.baseY;
      }

      if (dx < -0.15) {
        player.y = branch.baseY;
        player.x -= player.speed * Math.abs(dx);
      }

      if (dx > 0.15) {
        player.y = branch.baseY;
        player.x += player.speed * Math.abs(dx);
      }
    } else {
      if (dx < -0.15) player.x -= player.speed * Math.abs(dx);
      if (dx > 0.15) player.x += player.speed * Math.abs(dx);

      if (dy < -0.15 && branch) {
        player.x += (branch.x - player.x) * 0.3;
        player.y -= player.speed * Math.abs(dy);
        if (Math.abs(player.x - branch.x) < 1.2) player.x = branch.x;
        if (player.y < branch.topY) player.y = branch.topY;
      }

      if (dy > 0.15) {
        player.y = MAIN_PATH.y;
      }
    }

    clampPlayerToWalkable(player);
  }

  function loop() {
    updateMovement();
    drawScene(ctx, player);
    requestAnimationFrame(loop);
  }

  function centerJoystick() {
    if (!joystickStick) return;
    joystickStick.style.transform = 'translate(0px, 0px)';
  }

  function updateJoystickFromPoint(clientX, clientY) {
    if (!joystickBase || !joystickStick) return;

    const rect = joystickBase.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = clientX - cx;
    let dy = clientY - cy;

    const max = rect.width * 0.28;
    const dist = Math.hypot(dx, dy);

    if (dist > max) {
      dx = (dx / dist) * max;
      dy = (dy / dist) * max;
    }

    joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;
    touchState.x = dx / max;
    touchState.y = dy / max;
    touchState.active = true;
  }

  async function enterLandscapeMode() {
    const root = document.documentElement;

    try {
      if (root.requestFullscreen) {
        await root.requestFullscreen();
      }

      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape');
      }
    } catch (err) {
    }
  }

  function updateRotateHint() {
    if (!rotateHint || rotateHintDismissed || !isMobileLike()) return;

    const portrait = window.matchMedia('(orientation: portrait)').matches;
    const modalOpen = modalOverlay && modalOverlay.style.display === 'flex';

    rotateHint.classList.toggle('show', portrait && started && !modalOpen);
  }

  function canvasPointToGame(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function nearestTappedStation(point) {
    let best = null;

    for (const key in MAP_STATIONS) {
      const s = MAP_STATIONS[key];
      const dist = Math.hypot(point.x - s.x, point.y - s.y);

      if (dist <= 70 && (!best || dist < best.dist)) {
        best = { key, ...s, dist };
      }
    }

    return best;
  }

  function movePlayerNearStation(key) {
    const station = MAP_STATIONS[key];
    const branch = BRANCHES[key];
    if (!station || !branch) return;

    player.x = branch.x;
    player.y = branch.topY;
  }

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;

    if (key === 'escape') closeModal();

    if (key === 'e' && !e.repeat) {
      interact();
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  window.addEventListener('blur', () => {
    for (const k in keys) keys[k] = false;
    touchState.x = 0;
    touchState.y = 0;
    touchState.active = false;
    centerJoystick();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      started = true;
      if (welcomeOverlay) welcomeOverlay.style.display = 'none';
      updateRotateHint();
    });
  }

  if (interactBtn) {
    interactBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      interact();
    });
  }

  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      rotateHintDismissed = true;
      if (rotateHint) rotateHint.classList.remove('show');
      enterLandscapeMode();
    });
  }

  if (rotateNowBtn) {
    rotateNowBtn.addEventListener('click', () => {
      rotateHintDismissed = true;
      if (rotateHint) rotateHint.classList.remove('show');
      enterLandscapeMode();
    });
  }

  if (rotateCloseBtn) {
    rotateCloseBtn.addEventListener('click', () => {
      rotateHintDismissed = true;
      if (rotateHint) rotateHint.classList.remove('show');
    });
  }

  if (joystickBase) {
    joystickBase.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      joystickPointerId = e.pointerId;
      joystickBase.setPointerCapture(e.pointerId);
      updateJoystickFromPoint(e.clientX, e.clientY);
    });

    joystickBase.addEventListener('pointermove', (e) => {
      if (joystickPointerId !== e.pointerId) return;
      updateJoystickFromPoint(e.clientX, e.clientY);
    });

    const endJoystick = (e) => {
      if (joystickPointerId !== e.pointerId) return;
      joystickPointerId = null;
      touchState.x = 0;
      touchState.y = 0;
      touchState.active = false;
      centerJoystick();
    };

    joystickBase.addEventListener('pointerup', endJoystick);
    joystickBase.addEventListener('pointercancel', endJoystick);
    joystickBase.addEventListener('lostpointercapture', () => {
      joystickPointerId = null;
      touchState.x = 0;
      touchState.y = 0;
      touchState.active = false;
      centerJoystick();
    });
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (!started) return;

    const point = canvasPointToGame(e.clientX, e.clientY);
    const tappedStation = nearestTappedStation(point);

    if (tappedStation) {
      movePlayerNearStation(tappedStation.key);
      interact();
      return;
    }

    const nearExitTap = Math.hypot(point.x - EXIT_POINT.x, point.y - EXIT_POINT.y) <= 56;
    if (nearExitTap) {
      player.x = EXIT_POINT.x;
      player.y = EXIT_POINT.y;
      interact();
    }
  });

  window.addEventListener('resize', updateRotateHint);
  window.addEventListener('orientationchange', updateRotateHint);

  updateHud();

  if (loadingEl) {
    loadingEl.style.display = 'none';
  }

  centerJoystick();
  loop();
});
