// Catálogo de Papelera Paternal.
// Para agregar un producto, sumá un objeto a la lista con:
//   cat:     "plastico" | "carton" | "papel"
//   nombre:  cómo se llama
//   detalle: (opcional) una línea aclaratoria
//   medidas: (opcional) lista de medidas o presentaciones
//   fotos:   uno o más archivos dentro de img/productos/ (si hay dos, se alternan)

window.CATEGORIAS = {
  plastico: { nombre: "Plástico", emoji: "🛍️" },
  carton: { nombre: "Cartón", emoji: "📦" },
  papel: { nombre: "Papel", emoji: "🧻" },
};

window.PRODUCTOS = [
  // ——— Plástico ———
  { cat: "plastico", nombre: "Rollo de arranque", medidas: ["15x25", "20x25", "20x30", "25x35", "50x70"], fotos: ["rollo-arranque"] },
  { cat: "plastico", nombre: "Bolsas camiseta", medidas: ["Alta densidad", "Baja densidad"], fotos: ["bolsas-camiseta"] },
  { cat: "plastico", nombre: "Separadores", medidas: ["20x35", "25x35"], fotos: ["separadores"] },
  { cat: "plastico", nombre: "Bolsa de escombro", medidas: ["50x70"], fotos: ["bolsa-escombro"] },
  { cat: "plastico", nombre: "Bolsas de residuo", medidas: ["Baja densidad"], fotos: ["bolsas-residuo"] },
  { cat: "plastico", nombre: "Bolsas consorcio x 50 cm", medidas: ["70x1.00", "80x1.10", "90x1.10", "1.05x1.20"], fotos: ["bolsas-residuo"] },
  { cat: "plastico", nombre: "Bolsas de polipropileno", detalle: "Más de 30 medidas", fotos: ["bolsas-polipropileno"] },
  { cat: "plastico", nombre: "Rollo de pluribol", detalle: "También de burbuja grande", medidas: ["1m x 25m", "1m x 50m", "50cm x 50m"], fotos: ["pluribol"] },
  { cat: "plastico", nombre: "Film PVC gastronómico x 38 cm", medidas: ["80m", "120m", "200m", "300m"], fotos: ["film-pvc"] },
  { cat: "plastico", nombre: "Resinite x 1000 m", medidas: ["30cm", "38cm", "45cm"], fotos: ["film-pvc"] },
  { cat: "plastico", nombre: "Stretch negro / transparente", medidas: ["10cm"], fotos: ["stretch-10-transparente", "stretch-10-negro"] },
  { cat: "plastico", nombre: "Stretch con mango", detalle: "Negro o transparente", medidas: ["50cm"], fotos: ["stretch-mango-transparente", "stretch-mango-negro"] },
  { cat: "plastico", nombre: "Stretch sin mango", detalle: "Negro o transparente", medidas: ["50cm"], fotos: ["stretch-sin-mango-transparente", "stretch-sin-mango-negro"] },
  { cat: "plastico", nombre: "Bandeja plástica con tapa", detalle: "Apta microondas", medidas: ["102", "103", "105", "107"], fotos: ["bandeja-microondas"] },
  { cat: "plastico", nombre: "Cinta frágil", detalle: "Plástico", fotos: ["cinta-fragil"] },
  { cat: "plastico", nombre: "Cinta marrón x 100 m", medidas: ["48mm", "72mm"], fotos: ["cinta-marron"] },
  { cat: "plastico", nombre: "Cinta transparente", medidas: ["24mm x 50m", "48mm x 80m", "48mm x 100m", "72mm x 100m"], fotos: ["cinta-transparente"] },
  { cat: "plastico", nombre: "Cinta de enmascarar x 50 m", medidas: ["12mm", "18mm", "24mm", "36mm", "48mm"], fotos: ["cinta-enmascarar"] },
  { cat: "plastico", nombre: "Cinta de enmascarar azul x 30 m", medidas: ["18mm", "24mm", "48mm"], fotos: ["cinta-enmascarar-azul"] },
  { cat: "plastico", nombre: "Vasos térmicos", medidas: ["120cc", "165cc", "180cc", "240cc", "300cc"], fotos: ["vasos-termicos"] },
  { cat: "plastico", nombre: "Vasos plásticos", medidas: ["110cc", "180cc", "220cc", "300cc", "330cc", "500cc", "1L"], fotos: ["vasos-plasticos"] },

  // ——— Cartón ———
  { cat: "carton", nombre: "Rollo de cartón corrugado x 30 m", medidas: ["50cm", "70cm", "90cm", "1m", "1.20m", "1.40m"], fotos: ["rollo-carton-corrugado"] },
  { cat: "carton", nombre: "Cajas de cartón corrugado", detalle: "Más de 30 medidas", fotos: ["cajas-carton"] },
  { cat: "carton", nombre: "Platos dorados", fotos: ["platos-dorados"] },
  { cat: "carton", nombre: "Bandejas de cartón", fotos: ["bandejas-carton"] },
  { cat: "carton", nombre: "Caja de pizza", medidas: ["Chica", "Grande"], fotos: ["caja-pizza"] },

  // ——— Papel ———
  { cat: "papel", nombre: "Papel higiénico genérico x 80 m", medidas: ["30 rollos"], fotos: ["higienico-generico-80"] },
  { cat: "papel", nombre: "Papel higiénico genérico x 300 m", medidas: ["8 rollos"], fotos: ["higienico-generico-300"] },
  { cat: "papel", nombre: "Papel higiénico Elegante", medidas: ["Simple hoja"], fotos: ["higienico-elegante-simple-24", "higienico-elegante-simple-4"] },
  { cat: "papel", nombre: "Papel higiénico Elegante", medidas: ["Doble hoja"], fotos: ["higienico-elegante-doble-a", "higienico-elegante-doble-b"] },
  { cat: "papel", nombre: "Papel higiénico Elegante", medidas: ["Triple hoja"], fotos: ["higienico-elegante-triple"] },
  { cat: "papel", nombre: "Toalla en rollo", fotos: ["bobina-tissue-generica"] },
  { cat: "papel", nombre: "Bobina papel tissue genérica", medidas: ["24cm x 400m"], fotos: ["bobina-tissue-generica"] },
  { cat: "papel", nombre: "Bobina papel tissue Elegante", medidas: ["24cm x 400m"], fotos: ["bobina-tissue-elegante"] },
  { cat: "papel", nombre: "Papel tissue Elegante", medidas: ["Doble hoja"], fotos: ["tissue-elegante-doble"] },
  { cat: "papel", nombre: "Toallas intercaladas Elegante", fotos: ["toallas-intercaladas-elegante"] },
  { cat: "papel", nombre: "Toallas intercaladas genéricas", fotos: ["toallas-intercaladas-genericas"] },
  { cat: "papel", nombre: "Rollo de cocina genérico x 200 paños", medidas: ["8 rollos"], fotos: ["cocina-generico-200"] },
  { cat: "papel", nombre: "Rollo de cocina Elegante", medidas: ["3x100", "3x120"], fotos: ["cocina-elegante-3x100", "cocina-elegante-3x120"] },
  { cat: "papel", nombre: "Rollo de cocina Elegante 200 paños", medidas: ["Gigante"], fotos: ["cocina-elegante-gigante"] },
  { cat: "papel", nombre: "Rollo de cocina Elegante 200 paños", medidas: ["Súper gigante"], fotos: ["cocina-elegante-super-gigante"] },
  { cat: "papel", nombre: "Servilleta de papel", medidas: ["14x14", "18x18", "24x24", "33x33"], fotos: ["servilletas"] },
  { cat: "papel", nombre: "Papel sulfito en bobina", medidas: ["40cm", "60cm"], fotos: ["papel-sulfito"] },
  { cat: "papel", nombre: "Papel prensa", detalle: "En hojas o en bobina", medidas: ["40cm", "60cm"], fotos: ["papel-prensa"] },
  { cat: "papel", nombre: "Papel kraft", detalle: "En hojas o en bobina", medidas: ["20cm", "40cm", "60cm", "80cm", "1m", "1.20m", "1.60m"], fotos: ["papel-kraft-bobina", "papel-kraft-hojas"] },
  { cat: "papel", nombre: "Papel kraft misionero en bobina", medidas: ["1.20m x 210g"], fotos: ["kraft-misionero"] },
  { cat: "papel", nombre: "Resma papel seda", medidas: ["400 hojas 70x1m"], fotos: ["papel-seda"] },
];
