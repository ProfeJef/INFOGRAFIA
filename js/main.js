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

  canvas.width = GAME.width;
  canvas.height = GAME.height;

  const visited = new Set();

  const player = {
  x: 60,
  y: 445,
  speed: 3
};

  const keys = {};
  let lastInteractionKey = null;
  let started = false;

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

  function openStation(key) {
    if (!window.STATIONS || !STATIONS[key]) return;

    const s = STATIONS[key];
    visited.add(key);
    updateHud();

    const tag = document.getElementById('modalTag');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    if (tag) tag.textContent = s.zona || 'DÍA';
    if (title) title.textContent = s.nombre || '';
    if (!body) return;

    body.className = s.zona ? String(s.zona).toLowerCase() : '';
    body.innerHTML = `
      <p><strong>Contexto:</strong> ${s.contexto || ''}</p>
      <p><strong>Enfoque:</strong> ${s.enfoque || ''}</p>
      <p><strong>Metodología:</strong> ${s.metodologia || ''}</p>
      <p><strong>TIC:</strong> ${s.tics || ''}</p>
      <p><strong>Aportes:</strong> ${s.aportes || ''}</p>
      ${s.fuente ? `<p><a href="${s.fuente}" target="_blank" rel="noopener noreferrer">Ver fuente</a></p>` : ''}
    `;

    const modal = document.getElementById('modalOverlay');
    if (modal) modal.style.display = 'flex';
  }

  function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) modal.style.display = 'none';
  }

  function updateMovement() {
    if (!started) return;

    let dx = 0;
    let dy = 0;

    if (keys['arrowleft'] || keys['a']) dx -= player.speed;
    if (keys['arrowright'] || keys['d']) dx += player.speed;
    if (keys['arrowup'] || keys['w']) dy -= player.speed;
    if (keys['arrowdown'] || keys['s']) dy += player.speed;

    player.x += dx;
    player.y += dy;

    clampPlayerToPath(player);
  }

  function updateInteraction() {
    if (!started) return;

    const nearby = getNearbyStation(player);

    if (keys['e']) {
      if (nearby && lastInteractionKey !== nearby.key) {
        openStation(nearby.key);
        lastInteractionKey = nearby.key;
      }
    } else {
      lastInteractionKey = null;
    }
  }

  function loop() {
    drawScene(ctx, player);
    updateMovement();
    updateInteraction();
    requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === 'Escape') closeModal();
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  window.addEventListener('blur', () => {
    for (const k in keys) keys[k] = false;
  });

  const closeBtn = document.getElementById('closeBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const modalOverlay = document.getElementById('modalOverlay');
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
