(() => {
  "use strict";

  // ——— Configuración ———
  // Número de WhatsApp con código de país y el 9 de celular, sin "+" ni espacios.
  const WHATSAPP_NUMERO = "5491144796939";
  // Horario de atención por día de la semana (0 = domingo), en hora de Buenos Aires.
  const HORARIO = { 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 17], 6: [8, 13] };
  const CLAVE_GUARDADO = "papelera-paternal:consulta";

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CATEGORIAS = window.CATEGORIAS;
  const PRODUCTOS = window.PRODUCTOS.map((p, i) => ({
    ...p,
    id: slug(`${p.nombre} ${(p.medidas || []).join(" ")}`) || `p${i}`,
    busqueda: normalizar([p.nombre, p.detalle, ...(p.medidas || []), CATEGORIAS[p.cat].nombre].join(" ")),
  }));
  const porId = new Map(PRODUCTOS.map((p) => [p.id, p]));

  function normalizar(texto) {
    return String(texto || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function slug(texto) {
    return normalizar(texto).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }
  function enlaceWhatsapp(texto) {
    return `https://wa.me/${WHATSAPP_NUMERO}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
  }
  function el(etiqueta, atributos = {}, ...hijos) {
    const nodo = document.createElement(etiqueta);
    for (const [k, v] of Object.entries(atributos)) {
      if (v == null || v === false) continue;
      if (k === "class") nodo.className = v;
      else if (k === "text") nodo.textContent = v;
      else if (k.startsWith("on")) nodo.addEventListener(k.slice(2), v);
      else nodo.setAttribute(k, v === true ? "" : v);
    }
    nodo.append(...hijos.filter(Boolean));
    return nodo;
  }

  // ——— Aviso flotante ———
  const aviso = $("#aviso");
  let avisoTimer;
  function avisar(texto) {
    aviso.textContent = texto;
    aviso.classList.add("visible");
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => aviso.classList.remove("visible"), 2600);
  }

  // ——— Cabecera y menú ———
  const cabecera = $("#cabecera");
  const menuBtn = $("#menu-btn");
  const nav = $("#nav");
  const alScroll = () => {
    cabecera.classList.toggle("compacta", window.scrollY > 40);
    const total = document.documentElement.scrollHeight - innerHeight;
    cabecera.style.setProperty("--progreso", total > 0 ? Math.min(1, scrollY / total).toFixed(4) : 0);
  };
  window.addEventListener("scroll", alScroll, { passive: true });
  alScroll();

  function cerrarMenu() {
    nav.classList.remove("abierto");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
  }
  menuBtn.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    menuBtn.setAttribute("aria-expanded", String(abierto));
    menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", cerrarMenu));

  // Resalta la sección visible en el menú
  const enlacesNav = new Map($$("a", nav).map((a) => [a.getAttribute("href").slice(1), a]));
  const observadorSecciones = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        enlacesNav.forEach((a, id) => a.classList.toggle("activo", id === e.target.id));
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  ["inicio", ...enlacesNav.keys()].forEach((id) => {
    const s = document.getElementById(id);
    if (s) observadorSecciones.observe(s);
  });

  // ——— Aparición al hacer scroll ———
  const observadorRevelar = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add("visto");
          observadorRevelar.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  const revelar = (nodos) => nodos.forEach((n) => observadorRevelar.observe(n));
  revelar($$(".revelar"));

  // ——— Portada: palabras que rotan, contadores y video ———
  const palabras = $$(".rotador__palabra");
  if (palabras.length > 1 && !sinMovimiento) {
    let actual = 0;
    setInterval(() => {
      palabras[actual].classList.remove("activa");
      palabras[actual].classList.add("sale");
      const anterior = palabras[actual];
      setTimeout(() => anterior.classList.remove("sale"), 600);
      actual = (actual + 1) % palabras.length;
      palabras[actual].classList.add("activa");
    }, 2600);
  }

  const observadorCifras = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      observadorCifras.unobserve(e.target);
      const hasta = Number(e.target.dataset.hasta);
      if (sinMovimiento) { e.target.textContent = hasta; continue; }
      const inicio = performance.now();
      const duracion = 1400;
      const paso = (t) => {
        const avance = Math.min(1, (t - inicio) / duracion);
        e.target.textContent = Math.round(hasta * (1 - Math.pow(1 - avance, 3)));
        if (avance < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }
  });
  $$(".js-contar").forEach((n) => observadorCifras.observe(n));

  const video = $("#hero-video");
  if (video) {
    if (sinMovimiento) {
      video.removeAttribute("autoplay");
      video.pause();
    } else {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }).observe(video);
    }
  }

  // ——— Cinta de rubros ———
  const pista = $("#cinta-pista");
  if (pista) {
    const nombres = [...new Set(PRODUCTOS.map((p) => p.nombre.replace(/ x .*$/i, "")))];
    const grupo = () => el("div", { class: "cinta__grupo" }, ...nombres.map((n) => el("span", { text: n })));
    pista.append(grupo(), grupo());
  }

  // ——— Catálogo ———
  const grilla = $("#grilla");
  const filtros = $("#filtros");
  const buscar = $("#buscar");
  const resultado = $("#resultado");
  const vacio = $("#vacio");
  let categoria = "todo";
  let termino = "";

  const conteo = PRODUCTOS.reduce((acc, p) => ((acc[p.cat] = (acc[p.cat] || 0) + 1), acc), {});
  const opciones = [["todo", "Todo", PRODUCTOS.length], ...Object.entries(CATEGORIAS).map(([k, c]) => [k, `${c.emoji} ${c.nombre}`, conteo[k] || 0])];
  for (const [clave, nombre, cantidad] of opciones) {
    filtros.append(
      el("button", {
        type: "button",
        role: "tab",
        class: "filtro" + (clave === categoria ? " activo" : ""),
        "aria-selected": String(clave === categoria),
        "data-cat": clave,
        onclick: () => {
          categoria = clave;
          $$(".filtro", filtros).forEach((b) => {
            const sel = b.dataset.cat === clave;
            b.classList.toggle("activo", sel);
            b.setAttribute("aria-selected", String(sel));
          });
          pintarGrilla();
        },
      }, nombre, el("span", { class: "filtro__num", text: cantidad }))
    );
  }

  let buscarTimer;
  buscar.addEventListener("input", () => {
    clearTimeout(buscarTimer);
    buscarTimer = setTimeout(() => {
      termino = buscar.value.trim();
      pintarGrilla();
    }, 120);
  });

  // Alterna las fotos de los productos que tienen más de una
  const observadorFotos = new IntersectionObserver((entradas) => {
    for (const e of entradas) e.target.dataset.visible = e.isIntersecting ? "1" : "";
  });
  if (!sinMovimiento) {
    setInterval(() => {
      $$(".tarjeta__fotos[data-varias][data-visible='1']", grilla).forEach((caja) => {
        const fotos = $$("img", caja);
        const i = fotos.findIndex((f) => f.classList.contains("activa"));
        fotos[i].classList.remove("activa");
        fotos[(i + 1) % fotos.length].classList.add("activa");
      });
    }, 2400);
  }

  function tarjeta(p, orden) {
    const enLista = consulta.has(p.id);
    const fotos = el(
      "div",
      { class: "tarjeta__fotos", "data-varias": p.fotos.length > 1 ? "1" : null },
      ...p.fotos.map((f, i) =>
        el("img", {
          src: `img/productos/${f}.webp`,
          alt: i === 0 ? p.nombre : "",
          loading: "lazy",
          decoding: "async",
          width: "260",
          height: "260",
          class: i === 0 ? "activa" : null,
        })
      )
    );
    observadorFotos.observe(fotos);
    const boton = el("button", {
      type: "button",
      class: "agregar" + (enLista ? " agregado" : ""),
      "aria-pressed": String(enLista),
      "data-id": p.id,
      onclick: () => alternarConsulta(p.id),
    }, el("span", { class: "agregar__txt", text: enLista ? "Agregado" : "Agregar" }));
    return el(
      "li",
      { class: `tarjeta tarjeta--${p.cat}`, style: `--orden:${Math.min(orden, 12)}` },
      fotos,
      el("div", { class: "tarjeta__cuerpo" },
        el("span", { class: `etiqueta etiqueta--${p.cat}`, text: CATEGORIAS[p.cat].nombre }),
        el("h3", { class: "tarjeta__nombre", text: p.nombre }),
        p.detalle && el("p", { class: "tarjeta__detalle", text: p.detalle }),
        p.medidas && el("ul", { class: "medidas", "aria-label": "Medidas" }, ...p.medidas.map((m) => el("li", { text: m })))
      ),
      boton
    );
  }

  function pintarGrilla() {
    const t = normalizar(termino);
    const palabrasBusqueda = t.split(/\s+/).filter(Boolean);
    const lista = PRODUCTOS.filter(
      (p) => (categoria === "todo" || p.cat === categoria) && palabrasBusqueda.every((w) => p.busqueda.includes(w))
    );
    grilla.replaceChildren(...lista.map(tarjeta));
    grilla.classList.remove("animar");
    void grilla.offsetWidth; // reinicia la animación de entrada
    grilla.classList.add("animar");

    vacio.hidden = lista.length > 0;
    if (!lista.length) {
      $("#vacio-termino").textContent = termino ? `“${termino}”` : "eso";
      const link = $(".js-wsp-busqueda");
      link.href = enlaceWhatsapp(`Hola! ¿Tienen ${termino}?`);
    }
    const total = lista.length;
    resultado.textContent = termino
      ? `${total} ${total === 1 ? "resultado" : "resultados"} para “${termino}”`
      : `${total} productos${categoria !== "todo" ? ` de ${CATEGORIAS[categoria].nombre.toLowerCase()}` : ""}`;
  }

  // ——— Mi consulta ———
  // Se guarda como Map de id → { medida, cantidad }
  const consulta = new Map();
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_GUARDADO) || "[]");
    for (const item of guardado) if (porId.has(item.id)) consulta.set(item.id, { medida: item.medida || "", cantidad: item.cantidad || "" });
  } catch (_) { /* sin almacenamiento disponible */ }

  function guardar() {
    try {
      localStorage.setItem(CLAVE_GUARDADO, JSON.stringify([...consulta].map(([id, v]) => ({ id, ...v }))));
    } catch (_) { /* sin almacenamiento disponible */ }
  }

  const panel = $("#consulta");
  const velo = $("#velo");
  const contador = $("#contador");
  const abrirBtn = $("#abrir-consulta");
  const listaConsulta = $("#consulta-lista");
  const nota = $("#consulta-nota");
  let ultimoFoco = null;

  function alternarConsulta(id) {
    const p = porId.get(id);
    if (consulta.has(id)) {
      consulta.delete(id);
      if (!panel.classList.contains("abierta")) avisar(`Quitaste ${p.nombre} de tu consulta`);
    } else {
      consulta.set(id, { medida: p.medidas && p.medidas.length === 1 ? p.medidas[0] : "", cantidad: "" });
      avisar(`✓ Agregaste ${p.nombre} a tu consulta`);
      if (!sinMovimiento) {
        abrirBtn.classList.remove("rebote");
        void abrirBtn.offsetWidth;
        abrirBtn.classList.add("rebote");
      }
    }
    guardar();
    actualizarConsulta();
  }

  function actualizarConsulta() {
    const n = consulta.size;
    contador.hidden = n === 0;
    contador.textContent = n;
    abrirBtn.setAttribute("aria-label", n ? `Mi consulta, ${n} ${n === 1 ? "producto" : "productos"}` : "Mi consulta");

    $$(".agregar", grilla).forEach((b) => {
      const dentro = consulta.has(b.dataset.id);
      b.classList.toggle("agregado", dentro);
      b.setAttribute("aria-pressed", String(dentro));
      $(".agregar__txt", b).textContent = dentro ? "Agregado" : "Agregar";
    });

    $("#consulta-vacia").hidden = n > 0;
    $("#consulta-nota-wrap").hidden = n === 0;
    $("#consulta-pie").hidden = n === 0;
    listaConsulta.replaceChildren(
      ...[...consulta].map(([id, datos]) => {
        const p = porId.get(id);
        const campos = el("div", { class: "item__campos" });
        if (p.medidas && p.medidas.length > 1) {
          const select = el("select", {
            "aria-label": `Medida de ${p.nombre}`,
            onchange: (ev) => { datos.medida = ev.target.value; guardar(); },
          }, el("option", { value: "", text: "Medida: a definir" }), ...p.medidas.map((m) => el("option", { value: m, text: m, selected: m === datos.medida })));
          campos.append(select);
        } else if (p.medidas && p.medidas.length === 1) {
          campos.append(el("span", { class: "item__medida", text: p.medidas[0] }));
        }
        campos.append(
          el("input", {
            type: "text",
            inputmode: "numeric",
            placeholder: "Cantidad",
            value: datos.cantidad,
            "aria-label": `Cantidad de ${p.nombre}`,
            oninput: (ev) => { datos.cantidad = ev.target.value; guardar(); },
          })
        );
        return el("li", { class: "item" },
          el("img", { src: `img/productos/${p.fotos[0]}.webp`, alt: "", width: "56", height: "56" }),
          el("div", { class: "item__info" }, el("p", { class: "item__nombre", text: p.nombre }), campos),
          el("button", { type: "button", class: "item__quitar", "aria-label": `Quitar ${p.nombre}`, text: "×", onclick: () => alternarConsulta(id) })
        );
      })
    );
  }

  function abrirConsulta() {
    ultimoFoco = document.activeElement;
    panel.classList.add("abierta");
    panel.setAttribute("aria-hidden", "false");
    velo.hidden = false;
    requestAnimationFrame(() => velo.classList.add("visible"));
    document.body.classList.add("sin-scroll");
    $("#cerrar-consulta").focus();
  }
  function cerrarConsulta() {
    panel.classList.remove("abierta");
    panel.setAttribute("aria-hidden", "true");
    velo.classList.remove("visible");
    setTimeout(() => (velo.hidden = true), 250);
    document.body.classList.remove("sin-scroll");
    if (ultimoFoco) ultimoFoco.focus();
  }
  abrirBtn.addEventListener("click", abrirConsulta);
  $("#cerrar-consulta").addEventListener("click", cerrarConsulta);
  velo.addEventListener("click", cerrarConsulta);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("abierta")) cerrarConsulta();
  });

  $("#vaciar-consulta").addEventListener("click", () => {
    consulta.clear();
    nota.value = "";
    guardar();
    actualizarConsulta();
  });

  function mensajeConsulta() {
    const lineas = [...consulta].map(([id, d]) => {
      const p = porId.get(id);
      return `• ${p.nombre}${d.medida ? ` — ${d.medida}` : ""}${d.cantidad ? ` — cantidad: ${d.cantidad}` : ""}`;
    });
    const extra = nota.value.trim();
    return [
      "¡Hola Papelera Paternal! Quería consultar precio y disponibilidad de:",
      "",
      ...lineas,
      ...(extra ? ["", extra] : []),
      "",
      "¡Gracias!",
    ].join("\n");
  }

  $("#enviar-consulta").addEventListener("click", () => {
    window.open(enlaceWhatsapp(mensajeConsulta()), "_blank", "noopener");
  });

  // Los botones generales abren el chat con un saludo ya escrito
  $$(".js-wsp").forEach((a) => (a.href = enlaceWhatsapp("¡Hola Papelera Paternal! Quería hacer una consulta.")));

  // ——— Abierto / cerrado según el horario ———
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const formatoHora = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  });
  function ahoraEnBuenosAires() {
    const partes = Object.fromEntries(formatoHora.formatToParts(new Date()).map((p) => [p.type, p.value]));
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(partes.weekday);
    return { dia, hora: Number(partes.hour) + Number(partes.minute) / 60 };
  }
  function estadoDelLocal() {
    const { dia, hora } = ahoraEnBuenosAires();
    const hoy = HORARIO[dia];
    if (hoy && hora >= hoy[0] && hora < hoy[1]) {
      const falta = hoy[1] - hora;
      return { abierto: true, texto: falta <= 1 ? `Abierto · cierra en ${Math.max(1, Math.round(falta * 60))} min` : `Abierto ahora · hasta las ${hoy[1]} h` };
    }
    if (hoy && hora < hoy[0]) return { abierto: false, texto: `Cerrado · abre hoy a las ${hoy[0]} h` };
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (HORARIO[d]) return { abierto: false, texto: `Cerrado · abre ${i === 1 ? "mañana" : `el ${DIAS[d]}`} a las ${HORARIO[d][0]} h` };
    }
    return { abierto: false, texto: "Cerrado" };
  }
  function pintarEstado() {
    const { abierto, texto } = estadoDelLocal();
    $$("[data-estado]").forEach((n) => {
      n.hidden = false;
      n.classList.toggle("abierto", abierto);
      n.textContent = texto;
    });
  }
  pintarEstado();
  setInterval(pintarEstado, 60 * 1000);

  // ——— Mapa: se carga cuando está por aparecer ———
  const mapa = $("#mapa");
  function cargarMapa() {
    if (mapa.dataset.cargado) return;
    mapa.dataset.cargado = "1";
    mapa.replaceChildren(
      el("iframe", {
        title: "Mapa: Nicasio Oroño 2237, Paternal, CABA",
        src: "https://www.google.com/maps?q=Nicasio+Oro%C3%B1o+2237,+CABA,+Argentina&z=16&output=embed",
        loading: "lazy",
        referrerpolicy: "no-referrer-when-downgrade",
        allowfullscreen: true,
      })
    );
  }
  $("#mapa-cargar").addEventListener("click", cargarMapa);
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { cargarMapa(); obs.disconnect(); }
  }, { rootMargin: "300px" }).observe(mapa);

  // ——— Pie ———
  $("#anio").textContent = new Date().getFullYear();
  const gigante = $(".pie__gigante");
  if (gigante && !sinMovimiento) {
    const mover = () => {
      const r = gigante.getBoundingClientRect();
      if (r.top > innerHeight || r.bottom < 0) return;
      const avance = 1 - r.top / innerHeight; // 0 al entrar, ~1 arriba
      gigante.style.setProperty("--desplazo", `${(avance - 0.5) * -8}%`);
    };
    window.addEventListener("scroll", mover, { passive: true });
    mover();
  }

  pintarGrilla();
  actualizarConsulta();
})();
