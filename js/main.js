// ===================================================
// MAPA DE RUTA PEDAGOGICA - LOGICA DEL JUEGO
// ===================================================
const contents = {
  0: "Resignificar los <strong>descansos de primaria</strong> como espacios formativos de encuentro, juego y convivencia. Integrar el <strong>Aprendizaje Social y Emocional (ASE)</strong> no como relleno, sino como parte del curriculo oculto y transversal.",
  1: "<strong>Mision:</strong> Exploracion instrumental, canto y percusion corporal.<br><strong>Impacto ASE:</strong> Fortalecer la sensibilidad artistica, el autocontrol, el respeto por los turnos y el cuidado de los bienes comunes.",
  2: "<strong>Mision:</strong> Trompo, metras, salto de lazo, golosa.<br><strong>Impacto ASE:</strong> Recuperar la cultura infantil, la coordinacion motriz, la cooperacion y la resolucion pacifica de conflictos bajo reglas compartidas.",
  3: "<strong>Mision:</strong> Ajedrez, parques, domino, tangram y retos logicos.<br><strong>Impacto ASE:</strong> Estimular el pensamiento estrategico, la toma de decisiones, la paciencia ante la frustracion y la atencion.",
  4: "<strong>Mision:</strong> Cine pedagogico en cafeteria y karaoke en el aula virtual.<br><strong>Impacto ASE:</strong> Promover la lectura audiovisual critica, la expresion oral, el disfrute comunicativo y la ciudadania digital.",
  5: "<strong>Mision:</strong> Rumba terapia y expresion corporal dirigida.<br><strong>Impacto ASE:</strong> Favorecer el bienestar fisico, la identidad cultural, la integracion grupal y un estado de <strong>flow</strong> (disfrute profundo) para cerrar la semana.",
  6: "El descanso es un <strong>tiempo educativo protegido</strong>. La evaluacion es formativa y cualitativa (sin notas), midiendo 5 dimensiones: Participacion, Convivencia, Autonomia, Creatividad y Cuidado Institucional. Una escuela inclusiva ofrece multiples vias de participacion (Inteligencias Multiples)."
};

const stations = document.querySelectorAll('.station');
const avatarWrap = document.getElementById('avatarWrap');
const overlay = document.getElementById('overlay');
const modalTitle = document.getElementById('modalTitle');
const modalTag = document.getElementById('modalTag');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.getElementById('closeBtn');
const aseBar = document.getElementById('aseBar');
const asePct = document.getElementById('asePct');
const weekBar = document.getElementById('weekBar');
const weekPct = document.getElementById('weekPct');
const flowBar = document.getElementById('flowBar');
const flowPct = document.getElementById('flowPct');

let progress = 0;
const visited = new Set();
let currentStation = null;
const totalDays = 5; // lunes a viernes

function moveAvatarTo(el){
  const trackRect = document.getElementById('track').getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const relativeLeft = elRect.left - trackRect.left + (elRect.width/2) - 20;
  avatarWrap.style.left = relativeLeft + 'px';
}

function openModal(st){
  currentStation = st;
  const id = st.dataset.id;
  modalTitle.textContent = st.dataset.title;
  modalTag.textContent = st.dataset.tag;
  modalBody.innerHTML = contents[id];
  overlay.classList.add('active');
}

function updateBars(id){
  progress = Math.min(100, progress + 14);
  aseBar.style.width = progress + '%';
  asePct.textContent = progress + '%';

  if(id >= 1 && id <= 5){
    const daysDone = [1,2,3,4,5].filter(d => visited.has(String(d))).length;
    const weekPercent = Math.round((daysDone/totalDays)*100);
    weekBar.style.width = weekPercent + '%';
    weekPct.textContent = weekPercent + '%';
  }
  if(id === 5 || id === 6){
    flowBar.style.width = '100%';
    flowPct.textContent = '100%';
  }
}

function closeModal(){
  overlay.classList.remove('active');
  const id = currentStation.dataset.id;
  if(!visited.has(id)){
    visited.add(id);
    updateBars(parseInt(id));
    currentStation.classList.add('done');
  }
}

stations.forEach(st => {
  st.addEventListener('click', () => {
    moveAvatarTo(st);
    setTimeout(() => openModal(st), 550);
  });
});

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });

window.addEventListener('load', () => moveAvatarTo(stations[0]));
window.addEventListener('resize', () => moveAvatarTo(currentStation || stations[0]));
