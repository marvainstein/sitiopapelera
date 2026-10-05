# Papelera Paternal — sitio web

Sitio de [papelerapaternal.com.ar](https://papelerapaternal.com.ar/): embalaje, confitería y descartables en La Paternal, CABA.

Es un sitio estático (HTML, CSS y JavaScript, sin compilar nada), así que se puede publicar en cualquier hosting estático: GitHub Pages, Netlify, Cloudflare Pages, etc.

## Qué tiene

- **Portada con video** del local: “Especialistas en” + una palabra que gira hacia abajo (embalajes, confitería, descartables), contadores animados y un cartel que avisa si el local está **abierto o cerrado** según el horario.
- **Catálogo con buscador y filtros** por rubro (Plástico, Cartón, Papel). La búsqueda encuentra también medidas, por ejemplo “50x70” o “48mm”.
- **“Mi consulta”**: el cliente va agregando productos, elige la medida y la cantidad, y manda todo junto por WhatsApp en un solo mensaje. La lista queda guardada en el navegador aunque cierre la página.
- **Cómo comprar**: pasos, medios de pago, retiro y envíos.
- **Contacto** con mapa interactivo, botón “Cómo llegar” y teléfonos que se tocan para llamar.
- Botón flotante de WhatsApp y animaciones al bajar por la página. Respeta a quien tiene desactivadas las animaciones en el sistema.

## Cómo editar

| Qué | Dónde |
| --- | --- |
| Productos, medidas y fotos | `js/productos.js` (está explicado arriba de todo) |
| Fotos de productos | `img/productos/` (WebP, ~500 px) |
| Número de WhatsApp | `js/app.js`, constante `WHATSAPP_NUMERO` (y los enlaces `wa.me` de `index.html`) |
| Horario de atención | `js/app.js`, constante `HORARIO` (para el cartel abierto/cerrado) y los textos en `index.html` |
| Textos, teléfonos y dirección | `index.html` |
| Colores y tipografías | `css/estilos.css`, arriba de todo (`:root`) |

### WhatsApp

Todos los botones abren el chat con **11 4479-6939** con un mensaje ya escrito. La consulta armada en el catálogo llega con la lista de productos, medidas y cantidades.

### Horario

Lunes a viernes de 8 a 17 h y sábados de 8 a 13 h. El cartel “Abierto / Cerrado” usa la hora de Buenos Aires; no tiene en cuenta feriados.

### Agregar un producto

1. Guardar la foto en `img/productos/` como `.webp` (por ejemplo `bolsas-kraft.webp`).
2. Sumar una línea en `js/productos.js`:

```js
{ cat: "papel", nombre: "Bolsas kraft", medidas: ["Chica", "Mediana", "Grande"], fotos: ["bolsas-kraft"] },
```

### Después de cada cambio

En `index.html`, subir el número de versión de `estilos.css`, `productos.js` y `app.js` (por ejemplo de `?v=3` a `?v=4`). Así los navegadores bajan los archivos nuevos en lugar de usar los que tienen guardados.

## Probar en la compu

```sh
python3 -m http.server 8000
```

y abrir <http://localhost:8000>.

## Publicar

Con **GitHub Pages**: en el repo, *Settings → Pages → Deploy from a branch*, elegir la rama y la carpeta `/ (root)`. Después, en *Custom domain*, poner `papelerapaternal.com.ar` y apuntar el DNS del dominio a GitHub Pages ([instrucciones](https://docs.github.com/es/pages/configuring-a-custom-domain-for-your-github-pages-site)).
