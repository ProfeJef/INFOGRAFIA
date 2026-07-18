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

  canvas.width = GAME.width;
  canvas.height = GAME.height;

  const visited = new Set();
  const keys = {};

  let started = false;

  const player = {
    x: MAIN_PATH.minX,
    y: MAIN_PATH.y,
    speed: 3
  };

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
    if (!window.STATIONS || !STATIONS[key]) return;

    const s = STATIONS[key];
    visited.add(key);
    updateHud();

    if (modalTag) modalTag.textContent = s.zona || 'DÍA';
    if (modalTitle) modalTitle.textContent = s.nombre || '';

    if (modalBody) {
      modalBody.className = s.zona ? String(s.zona).toLowerCase() : '';
      modalBody.innerHTML = `
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
    if (welcomeOverlay) welcomeOverlay.style.display = 'flex';
  }

  function updateMovement() {
    if (!started) return;

    const branch = getNearestBranch(player, 48);
    const onBranch = branch && Math.abs(player.x - branch.x) <= 2 && player.y < branch.baseY;

    if (onBranch) {
      if (keys['arrowup'] || keys['w']) {
        player.y -= player.speed;
        if (player.y < branch.topY) player.y = branch.topY;
      }

      if (keys['arrowdown'] || keys['s']) {
        player.y += player.speed;
        if (player.y > branch.baseY) player.y = branch.baseY;
      }

      if (keys['arrowleft'] || keys['a']) {
        player.y = branch.baseY;
        player.x -= player.speed;
      }

      if (keys['arrowright'] || keys['d']) {
        player.y = branch.baseY;
        player.x += player.speed;
      }
    } else {
      if (keys['arrowleft'] || keys['a']) player.x -= player.speed;
      if (keys['arrowright'] || keys['d']) player.x += player.speed;

      if ((keys['arrowup'] || keys['w']) && branch) {
        player.x = branch.x;
        player.y -= player.speed;
        if (player.y < branch.topY) player.y = branch.topY;
      }

      if (keys['arrowdown'] || keys['s']) {
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

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;

    if (key === 'escape') closeModal();

    if (key === 'e' && !e.repeat) {
      const nearby = getNearbyStation(player);
      const nearExit = getNearbyExit(player);

      if (nearby) {
        openStation(nearby.key);
      } else if (nearExit) {
        resetGame();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  window.addEventListener('blur', () => {
    for (const k in keys) keys[k] = false;
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
    });
  }

  updateHud();

  if (loadingEl) {
    loadingEl.style.display = 'none';
  }

  loop();
});
