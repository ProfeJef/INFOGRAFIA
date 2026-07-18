document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  canvas.width = GAME.width;
  canvas.height = GAME.height;

  const player = {
    x: MAIN_PATH.minX,
    y: MAIN_PATH.y,
    speed: 3.2
  };

  const keys = {};
  const visited = new Set();

  const touchInput = {
    dx: 0,
    dy: 0,
    active: false
  };

  let started = true;
  let joystickPointerId = null;
  let rotateDismissed = false;

  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('closeBtn');

  const interactBtn = document.getElementById('interactBtn');
  const rotateBtn = document.getElementById('rotateBtn');
  const rotateHint = document.getElementById('rotateHint');
  const rotateNowBtn = document.getElementById('rotateNowBtn');
  const rotateCloseBtn = document.getElementById('rotateCloseBtn');

  const joystickBase = document.getElementById('joystickBase');
  const joystickStick = document.getElementById('joystickStick');

  function openStation(key) {
    if (!STATIONS[key] || !modalBody) return;

    const s = STATIONS[key];
    visited.add(key);

    modalBody.className = (s.zona || '').toLowerCase();
    modalBody.innerHTML = `
      <h2>${s.nombre || ''}</h2>
      ${s.imagen ? `<img src="${s.imagen}" alt="${s.nombre || 'Estación'}" class="stationImage">` : ''}
      <p><strong>Contexto:</strong> ${s.contexto || ''}</p>
      <p><strong>Enfoque:</strong> ${s.enfoque || ''}</p>
      <p><strong>Metodología:</strong> ${s.metodologia || ''}</p>
      <p><strong>TIC:</strong> ${s.tics || ''}</p>
      <p><strong>Aportes:</strong> ${s.aportes || ''}</p>
      ${s.fuente ? `<p><a href="${s.fuente}" target="_blank" rel="noopener noreferrer">Ver fuente</a></p>` : ''}
    `;

    if (modalOverlay) modalOverlay.style.display = 'flex';
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.style.display = 'none';
  }

  function resetPlayer() {
    player.x = MAIN_PATH.minX;
    player.y = MAIN_PATH.y;
  }

  function interact() {
    const nearby = getNearbyStation(player);
    const nearExit = getNearbyExit(player);

    if (nearby) {
      openStation(nearby.key);
      return;
    }

    if (nearExit) {
      resetPlayer();
      closeModal();
    }
  }

  function getInputVector() {
    let dx = 0;
    let dy = 0;

    if (keys['arrowleft'] || keys['a']) dx -= 1;
    if (keys['arrowright'] || keys['d']) dx += 1;
    if (keys['arrowup'] || keys['w']) dy -= 1;
    if (keys['arrowdown'] || keys['s']) dy += 1;

    dx += touchInput.dx;
    dy += touchInput.dy;

    dx = Math.max(-1, Math.min(1, dx));
    dy = Math.max(-1, Math.min(1, dy));

    return { dx, dy };
  }

  function updateMovement() {
    if (!started) return;

    const { dx, dy } = getInputVector();
    const branch = getNearestBranch(player, 52);
    const onBranch = branch && Math.abs(player.x - branch.x) <= 4 && player.y < branch.baseY;

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
        player.x += (branch.x - player.x) * 0.28;
        player.y -= player.speed * Math.abs(dy);

        if (Math.abs(player.x - branch.x) < 1.4) {
          player.x = branch.x;
        }

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

  function updateJoystick(clientX, clientY) {
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
    touchInput.dx = dx / max;
    touchInput.dy = dy / max;
    touchInput.active = true;
  }

  function endJoystick() {
    joystickPointerId = null;
    touchInput.dx = 0;
    touchInput.dy = 0;
    touchInput.active = false;
    centerJoystick();
  }

  function canvasToGame(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function getTappedStation(point) {
    let best = null;

    for (const key in MAP_STATIONS) {
      const s = MAP_STATIONS[key];
      const dist = Math.hypot(point.x - s.x, point.y - s.y);

      if (dist <= s.r + 26 && (!best || dist < best.dist)) {
        best = { key, ...s, dist };
      }
    }

    return best;
  }

  function movePlayerToStation(key) {
    const branch = BRANCHES[key];
    if (!branch) return;

    player.x = branch.x;
    player.y = branch.topY;
    clampPlayerToWalkable(player);
  }

  async function requestLandscape() {
    try {
      const root = document.documentElement;

      if (root.requestFullscreen) {
        await root.requestFullscreen();
      }

      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape');
      }
    } catch (e) {
    }
  }

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function updateRotateHint() {
    if (!rotateHint || rotateDismissed || !isMobile()) return;

    const portrait = window.matchMedia('(orientation: portrait)').matches;
    const modalOpen = modalOverlay && modalOverlay.style.display === 'flex';

    rotateHint.classList.toggle('show', portrait && !modalOpen);
  }

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;

    if (key === 'e' && !e.repeat) interact();
    if (key === 'escape') closeModal();
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  window.addEventListener('blur', () => {
    Object.keys(keys).forEach(k => keys[k] = false);
    endJoystick();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
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
      rotateDismissed = true;
      if (rotateHint) rotateHint.classList.remove('show');
      requestLandscape();
    });
  }

  if (rotateNowBtn) {
    rotateNowBtn.addEventListener('click', () => {
      rotateDismissed = true;
      if (rotateHint) rotateHint.classList.remove('show');
      requestLandscape();
    });
  }

  if (rotateCloseBtn) {
    rotateCloseBtn.addEventListener('click', () => {
      rotateDismissed = true;
      if (rotateHint) rotateHint.classList.remove('show');
    });
  }

  if (joystickBase) {
    joystickBase.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      joystickPointerId = e.pointerId;
      joystickBase.setPointerCapture(e.pointerId);
      updateJoystick(e.clientX, e.clientY);
    });

    joystickBase.addEventListener('pointermove', (e) => {
      if (e.pointerId !== joystickPointerId) return;
      updateJoystick(e.clientX, e.clientY);
    });

    joystickBase.addEventListener('pointerup', (e) => {
      if (e.pointerId !== joystickPointerId) return;
      endJoystick();
    });

    joystickBase.addEventListener('pointercancel', endJoystick);
    joystickBase.addEventListener('lostpointercapture', endJoystick);
  }

  canvas.addEventListener('pointerdown', (e) => {
    const point = canvasToGame(e.clientX, e.clientY);
    const tapped = getTappedStation(point);

    if (tapped) {
      movePlayerToStation(tapped.key);
      interact();
      return;
    }

    const exitDist = Math.hypot(point.x - EXIT_POINT.x, point.y - EXIT_POINT.y);
    if (exitDist <= EXIT_POINT.r + 24) {
      player.x = EXIT_POINT.x;
      player.y = EXIT_POINT.y;
      interact();
    }
  });

  window.addEventListener('resize', updateRotateHint);
  window.addEventListener('orientationchange', updateRotateHint);

  centerJoystick();
  updateRotateHint();
  loop();
});
