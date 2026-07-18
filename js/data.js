const STATIONS = {
  d1: {
    zona: 'Lunes',
    nombre: 'Lunes — Aula de música abierta',
    imagen: 'assets/lunes-1.png',
    areas: 'Música',
    resumen: 'El lunes abre la semana con experiencias de exploración instrumental, canto, percusión corporal y escucha compartida.',
    contexto: 'Este día resignifica el descanso como un espacio de encuentro y bienestar, donde la música ayuda a iniciar la semana con disposición positiva para aprender.',
    enfoque: 'Fortalece expresión musical, sensibilidad artística, escucha, turnos, autocontrol y cuidado de instrumentos.',
    metodologia: 'Se orientan prácticas breves de canto, exploración instrumental, percusión corporal, escucha guiada y pequeños ensambles voluntarios.',
    tics: 'Las TIC pueden apoyar con pistas, karaoke, ambientaciones sonoras o recursos audiovisuales para enriquecer la experiencia.',
    aportes: 'Favorece creatividad y expresión, confianza para participar y sentido de pertenencia en la escuela.',
    criterioClave: 'Creatividad y expresión',
    evidencia: 'Explora formas musicales y participa de manera voluntaria en propuestas de escucha, canto o interpretación.',
    instrumento: 'Evidencia fotográfica o descripción pedagógica breve.',
    fuente: ''
  },
  d2: {
    zona: 'Martes',
    nombre: 'Martes — Juegos tradicionales',
    imagen: 'assets/martes-1.png',
    areas: 'Educación Física',
    resumen: 'El martes activa el cuerpo y la convivencia con juegos propios de la cultura infantil como trompo, canicas, salto de lazo y golosa.',
    contexto: 'El descanso se convierte en una oportunidad para recuperar memoria lúdica y fortalecer relaciones entre pares desde el movimiento y el juego.',
    enfoque: 'Promueve coordinación motriz, respeto por reglas, cooperación y convivencia durante la actividad compartida.',
    metodologia: 'Se organizan estaciones o pequeños grupos con juegos tradicionales, acuerdos simples y acompañamiento docente.',
    tics: 'Las TIC pueden registrar la experiencia, recuperar instrucciones o difundir memorias visuales del juego.',
    aportes: 'Fortalece convivencia, cooperación y disfrute del tiempo libre desde prácticas culturales significativas.',
    criterioClave: 'Convivencia',
    evidencia: 'Respeta normas, turnos, diferencias y acuerdos de uso del espacio durante el juego.',
    instrumento: 'Lista de chequeo breve.',
    fuente: ''
  },
  d3: {
    zona: 'Miércoles',
    nombre: 'Miércoles — Juegos de mesa y lógica',
    imagen: 'assets/miercoles-1.png',
    areas: 'Matemáticas',
    resumen: 'El miércoles propone ajedrez, parqués, dominó, tangram y retos de pensamiento lógico como experiencias de juego intelectual.',
    contexto: 'Este día favorece el pensamiento estratégico y la toma de decisiones en un ambiente tranquilo, retador y colaborativo.',
    enfoque: 'Estimula razonamiento, estrategia, paciencia, atención y resolución de problemas.',
    metodologia: 'Se proponen partidas guiadas, desafíos lógicos y rotación por juegos con reglas sencillas y observación del proceso.',
    tics: 'Las TIC pueden integrarse con retos digitales, tableros interactivos o apoyo visual para explicar reglas.',
    aportes: 'Aporta autonomía intelectual, gusto por pensar y valoración de la matemática como experiencia lúdica.',
    criterioClave: 'Autonomía',
    evidencia: 'Elige actividades, cuida materiales y sostiene la participación con atención y responsabilidad.',
    instrumento: 'Observación docente.',
    fuente: ''
  },
  d4: {
    zona: 'Jueves',
    nombre: 'Jueves — Cine pedagógico y karaoke',
    imagen: 'assets/jueves-1.png',
    areas: 'Ciencias Naturales, Lengua Castellana e Informática',
    resumen: 'El jueves abre espacios de cine pedagógico y karaoke para leer imágenes, expresar ideas y participar desde lenguajes audiovisuales.',
    contexto: 'El descanso se amplía hacia experiencias comunicativas, digitales y emocionales conectadas con la vida cotidiana de la infancia.',
    enfoque: 'Promueve lectura audiovisual, expresión oral, ciudadanía digital y participación respetuosa.',
    metodologia: 'Se organizan proyecciones breves, karaoke guiado y selección de contenidos adecuados para básica primaria.',
    tics: 'Las TIC son parte central de la jornada: proyección, navegación, recursos digitales y participación mediada por tecnología.',
    aportes: 'Favorece participación, expresión y disfrute comunicativo en un entorno cuidado y significativo.',
    criterioClave: 'Participación',
    evidencia: 'Asiste voluntariamente, se vincula a la actividad y respeta la dinámica propuesta.',
    instrumento: 'Registro semanal de asistencia y observación.',
    fuente: ''
  },
  d5: {
    zona: 'Viernes',
    nombre: 'Viernes — Rumba terapia y expresión corporal',
    imagen: 'assets/viernes-1.png',
    areas: 'Danzas y Ciencias Sociales',
    resumen: 'El viernes cierra la semana con movimiento, identidad cultural y bienestar colectivo mediante rumba terapia y expresión corporal.',
    contexto: 'Este cierre convierte el descanso en una experiencia de celebración, integración y construcción de comunidad escolar.',
    enfoque: 'Favorece bienestar físico, expresión corporal, identidad cultural e integración grupal.',
    metodologia: 'Se desarrollan secuencias corporales dirigidas, bailes guiados y dinámicas de participación colectiva.',
    tics: 'Las TIC pueden aportar música, apoyo visual de pasos y registro audiovisual de la experiencia.',
    aportes: 'Fortalece cuidado institucional, alegría compartida y cierre positivo de la semana.',
    criterioClave: 'Cuidado institucional',
    evidencia: 'Usa adecuadamente materiales y espacios, y ayuda a entregar el entorno en orden.',
    instrumento: 'Formato breve de cierre del espacio.',
    fuente: ''
  }
};

const ENDING = {
  tag: 'CIERRE',
  title: 'Conclusiones de la ruta ASE',
  paragraphs: [
    'Aula abierta muestra que el currículo no solo está en los documentos, sino también en los juegos, las conversaciones, la música, el movimiento y las decisiones que se viven en la escuela.',
    'Cuando el descanso se convierte en un espacio para jugar, cantar, pensar y crear, cada estudiante puede reconocerse como alguien que participa, se expresa y construye comunidad.',
    'La propuesta recuerda que no todos aprenden del mismo modo: algunos se conectan más desde el cuerpo, otros desde la música, el juego, la palabra o la imagen; por eso, ofrecer experiencias diversas hace la escuela más inclusiva.',
    'El valor de esta ruta no se mide solo por la cantidad de actividades, sino por la manera como los niños se vinculan, cuidan los espacios, respetan acuerdos y se sienten felices en el colegio.'
  ]
};