// main.js — recorrido interactivo sobre fondo panorámico fijo
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  canvas.width = GAME.width;
  canvas.height = GAME.height;

  const visited = new Set();

  const player = {
    x: 150,
    y: 390,
    speed: 3
  };

  let started = false;

  const startBtn = document.getElementById('startBtn');
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('closeBtn');
  const loading = document.getElementById('loading');

  const keys = {};
  const NAV_KEYS = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'e', ' '];

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      welcomeOverlay.style.display = 'none';
      started = true;
    });
  } else {
    started = true;
  }

  window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (NAV_KEYS.includes(k)) e.preventDefault();
    keys[k] = true;

    if (k === 'e') {
      interact();
    }
  }, { passive: false });

  window.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
  });

  window.addEventListener('blur', () => {
    for (const k in keys) keys[k] = false;
  });

  function interact() {
    const station = getNearbyStation(player);
    if (station) {
      openStation(station.key);
    }
  }

  function openStation(key) {
    const mapInfo = MAP_STATIONS[key];
    const data = typeof STATIONS !== 'undefined' ? STATIONS[key] : null;

    if (!mapInfo || !data) return;

    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (modalTag) {
      modalTag.textContent = data.zona ? data.zona.toUpperCase() : mapInfo.label;
    }

    if (modalTitle) {
      modalTitle.textContent = data.nombre || mapInfo.label;
    }

    let extraImage = '';
    if (ASSETS[mapInfo.image] && ASSETS[mapInfo.image].src) {
      extraImage = `
        <div style="margin:0 0 14px 0;">
          <img
            src="${ASSETS[mapInfo.image].src}"
            alt="${data.nombre || mapInfo.label}"
            style="width:100%; max-width:360px; display:block; margin:0 auto; border-radius:12px; border:3px solid #5d3a1a;"
          >
        </div>
      `;
    }

    if (modalBody) {
      modalBody.innerHTML = `
        ${extraImage}
        <p><strong>Contexto:</strong> ${data.contexto || ''}</p>
        <p><strong>Enfoque:</strong> ${data.enfoque || ''}</p>
        <p><strong>Metodologia:</strong> ${data.metodologia || ''}</p>
        <p><strong>TIC:</strong> ${data.tics || ''}</p>
        <p><strong>Aportes:</strong> ${data.aportes || ''}</p>
        ${data.fuente ? `<p><a href="${data.fuente}" target="_blank" rel="noopener noreferrer">Ver fuente ↗</a></p>` : ''}
      `;
    }

    if (modalOverlay) {
      modalOverlay.style.display = 'flex';
    }

    visited.add(key);
    updateProgress();
    updateBars();
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.style.display = 'none';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  function updateProgress() {
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    const total = 5;
    const pct = (visited.size / total) * 100;

    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${visited.size}/${total} dias`;
  }

  function updateBars() {
    const aseBar = document.getElementById('aseBar');
    const asePct = document.getElementById('asePct');
    const weekBar = document.getElementById('weekBar');
    const weekPct = document.getElementById('weekPct');
    const flowBar = document.getElementById('flowBar');
    const flowPct = document.getElementById('flowPct');

    const totalVisited = visited.size;
    const aseValue = Math.min(100, totalVisited * 20);
    const weekValue = Math.min(100, totalVisited * 20);
    const flowValue = totalVisited >= 5 ? 100 : Math.min(100, totalVisited * 20);

    if (aseBar) aseBar.style.width = aseValue + '%';
    if (asePct) asePct.textContent = aseValue + '%';

    if (weekBar) weekBar.style.width = weekValue + '%';
    if (weekPct) weekPct.textContent = weekValue + '%';

    if (flowBar) flowBar.style.width = flowValue + '%';
    if (flowPct) flowPct.textContent = flowValue + '%';
  }

  const joystickZone = document.getElementById('joystickZone');
  const joystickStick = document.getElementById('joystickStick');
  const btnAction = document.getElementById('btnAction');
  let touchDir = null;

  if (joystickZone) {
    let baseRect = null;

    const startTouch = e => {
      baseRect = joystickZone.getBoundingClientRect();
      e.preventDefault();
    };

    const moveTouch = e => {
      if (!baseRect) return;

      const t = e.touches ? e.touches[0] : e;
      const cx = baseRect.left + baseRect.width / 2;
      const cy = baseRect.top + baseRect.height / 2;

      let dx = t.clientX - cx;
      let dy = t.clientY - cy;

      const dist = Math.hypot(dx, dy);
      const max = baseRect.width / 2;

      if (dist > max) {
        dx = dx / dist * max;
        dy = dy / dist * max;
      }

      if (joystickStick) {
        joystickStick.style.left = (31 + dx * 0.55) + 'px';
        joystickStick.style.top = (31 + dy * 0.55) + 'px';
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        touchDir = dx > 15 ? 'right' : dx < -15 ? 'left' : null;
      } else {
        touchDir = dy > 15 ? 'down' : dy < -15 ? 'up' : null;
      }

      e.preventDefault();
    };

    const endTouch = e => {
      baseRect = null;
      touchDir = null;

      if (joystickStick) {
        joystickStick.style.left = '31px';
        joystickStick.style.top = '31px';
      }

      if (e) e.preventDefault();
    };

    joystickZone.addEventListener('touchstart', startTouch, { passive: false });
    joystickZone.addEventListener('touchmove', moveTouch, { passive: false });
    joystickZone.addEventListener('touchend', endTouch, { passive: false });
    joystickZone.addEventListener('mousedown', startTouch);
    window.addEventListener('mousemove', e => { if (baseRect) moveTouch(e); });
    window.addEventListener('mouseup', endTouch);
  }

  if (btnAction) {
    const fire = e => {
      interact();
      if (e) e.preventDefault();
    };

    btnAction.addEventListener('touchstart', fire, { passive: false });
    btnAction.addEventListener('click', fire);
  }

  function handleInput() {
    if (!started) return;
    if (modalOverlay && modalOverlay.style.display === 'flex') return;

    let dx = 0;
    let dy = 0;

    if (keys['arrowleft'] || keys['a'] || touchDir === 'left') dx -= player.speed;
    if (keys['arrowright'] || keys['d'] || touchDir === 'right') dx += player.speed;
    if (keys['arrowup'] || keys['w'] || touchDir === 'up') dy -= player.speed;
    if (keys['arrowdown'] || keys['s'] || touchDir === 'down') dy += player.speed;

    player.x += dx;
    player.y += dy;

    clampPlayerToPath(player);
  }

  function loop() {
    handleInput();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene(ctx, player);
    requestAnimationFrame(loop);
  }

  updateProgress();
  updateBars();

  if (loading) loading.style.display = 'none';

  loop();
});
