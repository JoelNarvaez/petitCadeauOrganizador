// ============================================================
//  main.js  —  Arranque, navegación entre pasos y control del flujo
//  Es el único archivo que conoce a todos los demás
// ============================================================

// ── Navegación entre pasos ───────────────────────────────────
// Oculta el paso actual y muestra el siguiente
function siguiente(actual, siguientePaso) {
  document.getElementById(actual).classList.add("hidden");
  document.getElementById(siguientePaso).classList.remove("hidden");

  // Acciones al entrar a ciertos pasos
  alEntrarPaso(siguientePaso);
}

// Acciones específicas al entrar a un paso
function alEntrarPaso(paso) {
  switch (paso) {

    case "paso-3":
      // Sincronizar nombre del organizador al entrar al paso 3
      guardarOrganizador();
      actualizarOrganizador();
      break;

    case "paso-5":
      // Renderizar lista de participantes con sus exclusiones
      guardarParticipantes();
      renderizarPaso5();
      break;

    case "paso-6":
      // Guardar exclusiones al salir del paso 5
      guardarExclusiones();
      break;

    case "paso-7":
      // Guardar tipo de evento y generar fechas sugeridas
      if (!guardarEvento6()) {
        // Si falta el tipo de evento, no avanzar
        siguiente("paso-7", "paso-6");
        return;
      }
      generarFechasSugeridas();
      break;

    case "paso-8":
      // Guardar fecha seleccionada
      if (!guardarFecha()) {
        siguiente("paso-8", "paso-7");
        return;
      }
      break;

    case "paso-9":
      // Guardar presupuesto
      if (!guardarPresupuesto()) {
        siguiente("paso-9", "paso-8");
        return;
      }
      break;

    case "paso-10":
      // Mostrar resumen leyendo SOLO de localStorage
      mostrarResumen();
      break;
  }
}

// ── Paso 9: Sortear ──────────────────────────────────────────
function mostrarSorteo() {
  const resultado = ejecutarSorteo();
  if (!resultado) return;

  siguiente("paso-9", "paso-11");
  animarSorteo(resultado);
}

// ── Paso 10: Mostrar resumen del evento ──────────────────────
// Lee TODO desde localStorage, no de variables en memoria
function mostrarResumen() {
  const id     = leerEventoActivo();
  const evento = leerEventoPorId(id);

  if (!evento) {
    document.getElementById("paso-10").innerHTML = "<p class='text-red-500'>No se encontró información del evento.</p>";
    return;
  }

  const exclusionesTexto = Object.entries(evento.exclusiones || {})
    .filter(([, excluidos]) => excluidos.length > 0)
    .map(([persona, excluidos]) => `${persona} → no sortea a: ${excluidos.join(", ")}`)
    .join("<br>");

  const resultadoTexto = evento.resultadoSorteo
    ? Object.entries(evento.resultadoSorteo)
        .map(([dador, receptor]) => `${dador} 🎁 ${receptor}`)
        .join("<br>")
    : "Aún no se ha realizado el sorteo.";

  document.getElementById("paso-10").innerHTML = `
    <h2 class="text-2xl font-bold mb-6 text-center">Información del intercambio</h2>

    <div class="space-y-4 text-left max-w-md mx-auto">

      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-xs text-gray-400 uppercase mb-1">Organizador</p>
        <p class="font-semibold">${evento.organizador || "—"}</p>
      </div>

      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-xs text-gray-400 uppercase mb-1">Celebración</p>
        <p class="font-semibold">${evento.tipoEvento || "—"}</p>
      </div>

      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-xs text-gray-400 uppercase mb-1">Fecha</p>
        <p class="font-semibold">${evento.fecha || "—"}</p>
      </div>

      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-xs text-gray-400 uppercase mb-1">Presupuesto</p>
        <p class="font-semibold">$${evento.presupuesto || "—"}</p>
      </div>

      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-xs text-gray-400 uppercase mb-1">Participantes</p>
        <p class="font-semibold">${(evento.participantes || []).join(", ") || "—"}</p>
      </div>

      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-xs text-gray-400 uppercase mb-1">Exclusiones</p>
        <p class="font-semibold">${exclusionesTexto || "Sin exclusiones"}</p>
      </div>

      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-xs text-gray-400 uppercase mb-1">Resultado del sorteo</p>
        <p class="font-semibold">${resultadoTexto}</p>
      </div>

    </div>
  `;
}

// ── Menú hamburguesa ─────────────────────────────────────────
const btnMenu   = document.getElementById("menu-btn");
const menuMovil = document.getElementById("mobile-menu");

btnMenu.addEventListener("click", () => {
  menuMovil.classList.toggle("hidden");
});

// ── Botón "+ Evento" ─────────────────────────────────────────
// Crea un nuevo evento en localStorage y arranca el flujo
function nuevoEvento() {
  const id = crearEvento();
  guardarEventoActivo(id);

  // Ir al paso 1
  const pasos = document.querySelectorAll("[id^='paso-']");
  pasos.forEach(p => p.classList.add("hidden"));
  document.getElementById("paso-1").classList.remove("hidden");
}

// ── Arranque inicial ─────────────────────────────────────────
// Si ya hay un evento activo en localStorage, retomar desde paso-0
// Si no, mostrar paso-0 limpio
(function init() {
  const idActivo = leerEventoActivo();

  if (!idActivo) {
    // Primera vez, crear evento al dar click en Comenzar
    document.querySelector("#paso-0 button").addEventListener("click", () => {
      const id = crearEvento();
      guardarEventoActivo(id);
      siguiente("paso-0", "paso-1");
    });
  } else {
    // Ya había un evento activo, mostrar paso-0 normalmente
    document.querySelector("#paso-0 button").addEventListener("click", () => {
      siguiente("paso-0", "paso-1");
    });
  }
})();