const estadoIcono = document.getElementById("organizador-estado");

// Participación de organizador en intercambio
const checkbox = document.getElementById("incluirOrganizador");
const organizadorItem = document.getElementById("organizador-item");
const organizadorInput = document.getElementById("organizador-nombre");
const organizador = document.getElementById("nombre-organizador");

// Guardar estado
checkbox.addEventListener("change", () => {
  incluirOrganizador = checkbox.checked;
  actualizarOrganizador();
});

organizador.addEventListener("input", () => {
  actualizarOrganizador();
});

function actualizarOrganizador() {
  const incluirOrganizador = checkbox.checked; 

  organizadorInput.value = organizador.value;
  if (incluirOrganizador) {
    organizadorItem.classList.remove("bg-gray-100");
    organizadorItem.classList.add("bg-gray-200");
    organizadorInput.disabled = false;
    organizadorInput.classList.remove("text-gray-400");

    estadoIcono.innerHTML = "✔";
    estadoIcono.className = "ml-2 text-green-600 font-bold text-lg";
  } else {
    organizadorItem.classList.remove("bg-gray-100");
    organizadorItem.classList.add("bg-gray-100");
    organizadorInput.disabled = true;
    organizadorInput.classList.add("text-gray-400");

    estadoIcono.innerHTML = "✖";
    estadoIcono.className = "ml-2 text-gray-400 font-bold text-lg";
  }
}

// Ejecutar al cargar
actualizarOrganizador();

// Registro de participantes

const btnAgregar = document.getElementById("btn-agregar");
const inputNuevo = document.getElementById("nuevo-participante");
const lista = document.getElementById("lista-participantes");

btnAgregar.addEventListener("click", () => {
  const nombre = inputNuevo.value.trim();
  if (nombre === "") return;

  agregarParticipante(nombre);
  inputNuevo.value = "";
});

function agregarParticipante(nombre) {
  const div = document.createElement("div");
  div.className = "flex items-center bg-gray-100 rounded-xl px-4 py-2";

  const input = document.createElement("input");
  input.type = "text";
  input.value = nombre;
  input.className = "w-full bg-transparent outline-none text-gray-600";

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "✕";
  btnEliminar.className = "ml-2 text-gray-400 hover:text-red-500";

  btnEliminar.addEventListener("click", () => {
    div.remove();
  });

  div.appendChild(input);
  div.appendChild(btnEliminar);

  lista.appendChild(div);
}

// Manejo de Exclusiones

const sorteo = {
  organizador: "",
  participantes: [],
  exclusiones: {}
};

sorteo.participantes = ["Ana", "Joel", "Mariel"];

sorteo.exclusiones = {
  "Ana": ["Joel"],
  "Joel": [],
  "Mariel": ["Ana"]
};

function renderizarPaso5() {
  const contenedor = document.getElementById("lista-exclusiones");
  contenedor.innerHTML = "";

  sorteo.participantes.forEach(nombre => {

    const item = document.createElement("div");
    item.className = "bg-white p-3 rounded-lg shadow flex justify-between items-center mb-2";

    item.innerHTML = `
      <span>${nombre}</span>
      <button 
        class="bg-pink-500 text-white px-3 py-1 rounded"
        onclick="mostrarOpciones('${nombre}')">
        Establecer exclusiones
      </button>
    `;

    contenedor.appendChild(item);
  });
}

function mostrarOpciones(nombreSeleccionado) {
  const participantesFiltrados = sorteo.participantes.filter(
    nombre => nombre !== nombreSeleccionado
  );
  mostrarModalExclusiones(nombreSeleccionado, participantesFiltrados);
}

function mostrarModalExclusiones(nombre) {
  const modal = document.getElementById("modal-exclusiones");
  const titulo = document.getElementById("titulo-modal");
  const zona = document.getElementById("zona-exclusion");

  titulo.textContent = `Excluir para ${nombre}`;
  zona.dataset.nombre = nombre;

  renderizarListaArrastrable(nombre);
  actualizarVistaExclusiones(nombre);

  modal.classList.remove("hidden");
}

function renderizarListaArrastrable(nombre) {
  const lista = document.getElementById("lista-arrastrable");
  lista.innerHTML = "";

  const exclusionesActuales = sorteo.exclusiones[nombre] || [];

  const disponibles = sorteo.participantes.filter(p =>
    p !== nombre && !exclusionesActuales.includes(p)
  );

  disponibles.forEach(participante => {

    const item = document.createElement("div");
    item.textContent = participante;
    item.draggable = true;
    item.className = "bg-pink-100 text-pink-700 px-3 py-2 rounded-lg cursor-move text-center";

    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", participante);
    });

    lista.appendChild(item);
  });
}

const zona = document.getElementById("zona-exclusion");

zona.addEventListener("dragover", (e) => {
  e.preventDefault();
  zona.classList.add("bg-pink-100");
});

zona.addEventListener("dragleave", () => {
  zona.classList.remove("bg-pink-100");
});

zona.addEventListener("drop", (e) => {
  e.preventDefault();
  zona.classList.remove("bg-pink-100");

  const participante = e.dataTransfer.getData("text/plain");
  const nombre = zona.dataset.nombre;

  if (!sorteo.exclusiones[nombre]) {
    sorteo.exclusiones[nombre] = [];
  }

  if (!sorteo.exclusiones[nombre].includes(participante)) {
    sorteo.exclusiones[nombre].push(participante);
  }

  actualizarVistaExclusiones(nombre);
  renderizarListaArrastrable(nombre); // 👈 ESTA LÍNEA ES LA CLAVE
});

function actualizarVistaExclusiones(nombre) {

  const contenedor = document.getElementById("exclusiones-actuales");
  contenedor.innerHTML = "";

  const lista = sorteo.exclusiones[nombre] || [];

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No hay exclusiones.</p>";
    return;
  }

  lista.forEach(p => {
    const tag = document.createElement("div");
    tag.className = "bg-gray-200 px-2 py-1 rounded mb-1 text-xs";
    tag.textContent = `Excluido: ${p}`;
    contenedor.appendChild(tag);
  });
}

function toggleExclusion(nombre, excluido) {

  if (!sorteo.exclusiones[nombre]) {
    sorteo.exclusiones[nombre] = [];
  }

  const lista = sorteo.exclusiones[nombre];

  if (lista.includes(excluido)) {
    sorteo.exclusiones[nombre] = lista.filter(n => n !== excluido);
  } else {
    lista.push(excluido);
  }

  console.log(sorteo.exclusiones);
}

function cerrarModal() {
  document.getElementById("modal-exclusiones").classList.add("hidden");
}

//*************************************************************************************************************************************************************************************************************************************************************/
// Lista de participantes
const participantes = ["Mariel", "Ana", "Carlos", "Luis", "Sofía", "Juan"];

// Función principal del sorteo
function iniciarSorteo() {
  const contenedor = document.getElementById("participantes-container");
  const caja = document.getElementById("caja");
  const cajaAbierta = document.getElementById("caja-abierta");
  const info = document.getElementById("ganador-info");

  // Resetear contenedor y caja
  contenedor.innerHTML = "";
  caja.classList.remove("hidden", "sacudiendo");
  cajaAbierta.classList.add("hidden");
  info.textContent = "¡Los nombres están entrando a la caja!";

  // Animar participantes entrando
  participantes.forEach((nombre, index) => {
    const div = document.createElement("div");
    div.className = "participante";
    div.textContent = nombre;
    div.style.top = "-50px";
    div.style.left = `${50 + (Math.random() * 30 - 15)}%`;
    contenedor.appendChild(div);

    setTimeout(() => {
      div.style.transition = "top 1.5s ease, opacity 1.5s ease";
      div.style.top = "calc(100% - 50px)";
      div.style.opacity = "0";
    }, index * 300);
  });

  const tiempoCaida = participantes.length * 300 + 1500;

  // Sacudir la caja
  setTimeout(() => {
    caja.classList.add("sacudiendo");
  }, tiempoCaida);

  // Abrir la caja y mostrar ganador
  setTimeout(() => {
    caja.classList.add("hidden");
    cajaAbierta.classList.remove("hidden");
    const ganador = participantes[Math.floor(Math.random() * participantes.length)];
    info.textContent = `🎊 ¡El ganador es ${ganador}! 🎊`;

    // Lanzar confeti
    lanzarConfeti();
  }, tiempoCaida + 1200);
}

// Confeti simple
function lanzarConfeti() {
  const contenedor = document.getElementById("participantes-container");
  const colores = ["#FF0000","#00FF00","#0000FF","#FFD700","#FF69B4"];

  for(let i = 0; i < 50; i++) {
    const confeti = document.createElement("div");
    confeti.className = "confeti-piece";
    confeti.style.setProperty("--color", colores[Math.floor(Math.random() * colores.length)]);
    confeti.style.setProperty("--x", (Math.random() * 200 - 100) + "px");
    confeti.style.left = Math.random() * 100 + "%";
    contenedor.appendChild(confeti);
    setTimeout(() => { confeti.remove(); }, 2000);
  }
}

// Función llamada desde botón "Sortear"
function mostrarSorteo() {
  // Mostrar sección paso-11
  siguiente('paso-9', 'paso-11');

  // Iniciar animación del sorteo
  iniciarSorteo();
}