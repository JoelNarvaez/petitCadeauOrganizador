
// ── Referencias al DOM 
const cajaCerrada   = document.getElementById("caja");
const cajaAbierta   = document.getElementById("caja-abierta");
const ganadorInfo   = document.getElementById("ganador-info");
const sorteoContenedor = document.getElementById("participantes-container");

// ── Animación principal 
// Se llama desde main.js cuando el usuario da click en "Sortear"
function animarSorteo(resultado) {
  if (!resultado) return;

  const participantes = Object.keys(resultado);

  // ── Resetear estado visual 
  sorteoContenedor.innerHTML  = "";
  cajaCerrada.classList.remove("hidden", "sacudiendo");
  cajaAbierta.classList.add("hidden");
  ganadorInfo.textContent     = "¡Los nombres están entrando a la caja!";

  
  // Limpiar resultados previos si los hay
  const resultadosPrev = document.getElementById("resultados-sorteo");
  if (resultadosPrev) resultadosPrev.innerHTML = ""; 



  // ── Fase 1: Nombres cayendo hacia la caja
participantes.forEach((nombre, index) => {
  setTimeout(() => {
    const div = document.createElement("div");
    div.textContent = nombre;
    div.style.cssText = `
      position: absolute;
      top: -40px;
      left: ${20 + Math.random() * 60}%;
      transform: translateX(-50%);
      opacity: 1;
      z-index: 10;
      white-space: nowrap;
      font-weight: bold;
      font-size: 0.85rem;
      color: #ec4899;
      background: white;
      padding: 3px 10px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    `;

    sorteoContenedor.appendChild(div);

    // Forzar reflow para que el navegador pinte el estado inicial
    void div.offsetHeight;

    // Ahora sí aplicar la transición hacia abajo
    div.style.transition = "top 1.1s ease-in, opacity 0.4s ease 0.7s";
    div.style.top = "62%";
    div.style.opacity = "0";

  }, index * 350);
});

  const tiempoCaida = participantes.length * 300 + 1200;

  // ── Fase 2: Sacudir la caja 
  setTimeout(() => {
    cajaCerrada.classList.add("sacudiendo");
    ganadorInfo.textContent = "Mezclando...";
  }, tiempoCaida);

  // ── Fase 3: Abrir la caja y mostrar resultados 
  setTimeout(() => {
    cajaCerrada.classList.add("hidden");
    cajaAbierta.classList.remove("hidden");

    lanzarConfeti();
    mostrarResultados(resultado);
  }, tiempoCaida + 1200);
}



// ── Mostrar tabla de resultados 
/* AQUÍ ESTOY AGREGANDO COSAS NUEVAS*/
function mostrarResultados(resultado) {
  ganadorInfo.textContent = "¡El sorteo está listo!";

  // Limpiar contenedor de animación
  sorteoContenedor.innerHTML = "";

  // Buscar o crear el contenedor de resultados FUERA de la caja
  let tablaContenedor = document.getElementById("resultados-sorteo");
  if (!tablaContenedor) {
    tablaContenedor = document.createElement("div");
    tablaContenedor.id = "resultados-sorteo";
    // Insertar después del div #sorteo-container
    const cajaWrapper = document.getElementById("sorteo-container");
    cajaWrapper.insertAdjacentElement("afterend", tablaContenedor);
  }
  tablaContenedor.innerHTML = "";
  tablaContenedor.className = "w-full max-w-sm mx-auto mt-4";

  Object.entries(resultado).forEach(([dador, receptor]) => {
    const fila = document.createElement("div");
    fila.className = "flex items-center justify-between bg-white rounded-xl px-4 py-2 mb-2 shadow text-sm";
    fila.innerHTML = `
      <span class="font-semibold text-gray-700">${dador}</span>
      <span class="text-pink-400 text-lg">🎁</span>
      <span class="font-semibold text-pink-600">${receptor}</span>
    `;
    tablaContenedor.appendChild(fila);
  });
} 

// ── Confeti
function lanzarConfeti() {
  const colores = ["#FF0000", "#00FF00", "#0000FF", "#FFD700", "#FF69B4", "#00CED1"];

  for (let i = 0; i < 60; i++) {
    const confeti       = document.createElement("div");
    confeti.className   = "confeti-piece";
    confeti.style.setProperty("--color", colores[Math.floor(Math.random() * colores.length)]);
    confeti.style.setProperty("--x", (Math.random() * 200 - 100) + "px");
    confeti.style.left  = Math.random() * 100 + "%";
    sorteoContenedor.appendChild(confeti);

    setTimeout(() => confeti.remove(), 2500);
  }
}