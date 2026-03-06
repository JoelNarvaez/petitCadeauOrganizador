
// ── Estado local temporal ────────────────────────────────────
let tipoEventoSeleccionado  = "";
let fechaSeleccionada       = "";
let presupuestoSeleccionado = 0;

// ── Paso 6: Tipo de evento ───────────────────────────────────

const botonesEvento       = document.querySelectorAll(".evento-btn");
const inputEventoPersonal = document.getElementById("eventoPersonalizado");

// Marcar botón seleccionado visualmente
botonesEvento.forEach(btn => {
  btn.addEventListener("click", () => {

    // Quitar selección anterior
    botonesEvento.forEach(b => {
      b.classList.remove("ring-2", "ring-pink-500", "bg-pink-50");
    });

    // Marcar el seleccionado
    btn.classList.add("ring-2", "ring-pink-500", "bg-pink-50");

    // Guardar el valor
    tipoEventoSeleccionado = btn.dataset.evento;

    // Limpiar el input personalizado
    inputEventoPersonal.value = "";
  });
});

// Si escribe en el input personalizado, deseleccionar botones
inputEventoPersonal.addEventListener("input", () => {
  botonesEvento.forEach(b => {
    b.classList.remove("ring-2", "ring-pink-500", "bg-pink-50");
  });
  tipoEventoSeleccionado = inputEventoPersonal.value.trim();
});

// Guarda el tipo de evento en localStorage
function guardarEvento6() {
  const id    = leerEventoActivo();
  const valor = inputEventoPersonal.value.trim() || tipoEventoSeleccionado;

  if (!valor) {
    alert("Por favor selecciona o escribe un tipo de evento.");
    return false; // indica que no se puede continuar
  }

  actualizarCampo(id, "tipoEvento", valor);
  return true;
}

// ── Paso 7: Fecha

const inputFecha        = document.querySelector("#paso-7 input[type='date']");
const contenedorFechas  = document.getElementById("fechas-sugeridas"); // puede ser null si no existe en el HTML

// Generar 3 fechas sugeridas cercanas a hoy
function generarFechasSugeridas() {
  if (!contenedorFechas) return;

  contenedorFechas.innerHTML = "";
  const hoy = new Date();

  // Proponer el próximo viernes, sábado y domingo
  for (let i = 1; i <= 7; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    const dia = d.getDay();

    if (dia === 5 || dia === 6 || dia === 0) { // vie, sab, dom
      const label = d.toLocaleDateString("es-MX", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
      const valor = d.toISOString().split("T")[0];

      const btn = document.createElement("button");
      btn.textContent = label;
      btn.className   = "fecha-sugerida-btn w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-pink-100 transition text-sm mb-2";
      btn.dataset.fecha = valor;

      btn.addEventListener("click", () => {
        // Quitar selección anterior
        document.querySelectorAll(".fecha-sugerida-btn").forEach(b => {
          b.classList.remove("bg-pink-200", "font-semibold");
        });
        btn.classList.add("bg-pink-200", "font-semibold");
        fechaSeleccionada   = valor;
        inputFecha.value    = valor;
      });

      contenedorFechas.appendChild(btn);
    }
  }
}

// Escuchar cambio en el input de fecha manual
if (inputFecha) {
  inputFecha.addEventListener("change", () => {
    fechaSeleccionada = inputFecha.value;

    // Quitar selección de botones sugeridos
    document.querySelectorAll(".fecha-sugerida-btn").forEach(b => {
      b.classList.remove("bg-pink-200", "font-semibold");
    });
  });
}

// Guarda la fecha en localStorage
function guardarFecha() {
  const id    = leerEventoActivo();
  const valor = inputFecha ? inputFecha.value : fechaSeleccionada;

  if (!valor) {
    alert("Por favor selecciona una fecha.");
    return false;
  }

  actualizarCampo(id, "fecha", valor);
  return true;
}

// ── Paso 8: Presupuesto

const botonesPresupuesto       = document.querySelectorAll(".presupuesto-btn");
const inputPresupuestoPersonal = document.getElementById("presupuestoPersonalizado");

// Marcar botón seleccionado visualmente
botonesPresupuesto.forEach(btn => {
  btn.addEventListener("click", () => {

    // Quitar selección anterior
    botonesPresupuesto.forEach(b => {
      b.classList.remove("ring-2", "ring-pink-500", "bg-pink-50");
    });

    // Marcar el seleccionado
    btn.classList.add("ring-2", "ring-pink-500", "bg-pink-50");

    // Guardar valor
    presupuestoSeleccionado = Number(btn.dataset.presupuesto);

    // Limpiar input personalizado
    if (inputPresupuestoPersonal) inputPresupuestoPersonal.value = "";
  });
});

// Si escribe monto personalizado, deseleccionar botones
if (inputPresupuestoPersonal) {
  inputPresupuestoPersonal.addEventListener("input", () => {
    botonesPresupuesto.forEach(b => {
      b.classList.remove("ring-2", "ring-pink-500", "bg-pink-50");
    });
    presupuestoSeleccionado = Number(inputPresupuestoPersonal.value) || 0;
  });
}

// Guarda el presupuesto en localStorage
function guardarPresupuesto() {
  const id    = leerEventoActivo();
  const valor = inputPresupuestoPersonal && inputPresupuestoPersonal.value
    ? Number(inputPresupuestoPersonal.value)
    : presupuestoSeleccionado;

  if (!valor || valor <= 0) {
    alert("Por favor selecciona o escribe un presupuesto.");
    return false;
  }

  actualizarCampo(id, "presupuesto", valor);
  return true;
}