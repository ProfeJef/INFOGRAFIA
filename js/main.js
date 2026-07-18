document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  canvas.width = GAME.width;
  canvas.height = GAME.height;

  const player = {
    x: PATH.startX,
    y: PATH.y,
    speed: 3
  };

  const keys = {};
  let lastInteractionKey = null;

  function openStation(key) {
    if (!window.STATIONS || !STATIONS[key]) return;

    const s = STATIONS[key];
    const body = document.getElementById('modalBody');
    if (!body) return;

    body.className = s.zona || '';
    body.innerHTML = `
      <h2>${s.titulo || ''}</h2>
      <p>${s.contexto || ''}</p>
      <p>${s.enfoque || ''}</p>
      <p>${s.metodologia || ''}</p>
      <p>${s.tics || ''}</p>
      <p>${s.aportes || ''}</p>
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
    updateMovement();
    updateInteraction();
    drawScene(ctx, player);
    requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.key === 'Escape') {
      closeModal();
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  window.addEventListener('blur', () => {
    for (const k in keys) keys[k] = false;
  });

  const closeBtn = document.getElementById('closeBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  loop();
});
